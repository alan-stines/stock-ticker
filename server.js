import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';
import { normalize } from './market.js';

const root = fileURLToPath(new URL('./public/', import.meta.url));
const cache = new Map();
const pending = new Map();
const ranges = { '1D': ['1d','5m'], '1W': ['5d','30m'], '1M': ['1mo','1d'], '3M': ['3mo','1d'], '1Y': ['1y','1wk'] };
async function market(symbol, range) {
  const key = `${symbol}:${range}`;
  const old = cache.get(key);
  if (old && Date.now()-old.fetchedAt < 120000) return old;
  if (pending.has(key)) return pending.get(key);
  const request = (async () => {
    try {
      const [period, interval] = ranges[range];
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${period}&interval=${interval}`, {headers:{'User-Agent':'MarketSignal/1.0'},signal:AbortSignal.timeout(12000)});
      if (!response.ok) throw new Error(`Market provider returned ${response.status}`);
      const json = await response.json();
      const result = json.chart?.result?.[0];
      if (!result) throw new Error('Symbol not found or data unavailable');
      const data = {...normalize(result), fetchedAt:Date.now(), stale:false};
      cache.set(key,data);
      if (cache.size > 300) cache.delete(cache.keys().next().value);
      return data;
    } catch (error) {
      if (old) return {...old, stale:true, warning:error.message};
      throw error;
    } finally { pending.delete(key); }
  })();
  pending.set(key,request);
  return request;
}
const server = http.createServer(async (req,res) => {
  const url = new URL(req.url,'http://localhost');
  res.setHeader('X-Content-Type-Options','nosniff');
  if (url.pathname === '/api/market') {
    res.setHeader('Content-Type','application/json');
    const symbol = (url.searchParams.get('symbol')||'AAPL').toUpperCase();
    const range = url.searchParams.get('range')||'1D';
    if (!/^[A-Z^][A-Z0-9.^=-]{0,14}$/.test(symbol) || !ranges[range]) {res.writeHead(400);res.end(JSON.stringify({error:'Invalid symbol or range'}));return;}
    try {res.end(JSON.stringify(await market(symbol,range)));}
    catch(error) {res.writeHead(502);res.end(JSON.stringify({error:error.message}));}
    return;
  }
  try {
    const path = resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    if (!path.startsWith(root)) {res.writeHead(403);res.end();return;}
    const body = await readFile(path);
    res.setHeader('Content-Type', {'.html':'text/html','.css':'text/css','.js':'text/javascript'}[extname(path)]||'application/octet-stream');
    res.end(body);
  } catch {res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.PORT)||3000,'127.0.0.1',()=>console.log('Market Signal → http://localhost:'+(process.env.PORT||3000)));
