import { mkdir, writeFile } from 'node:fs/promises';
const symbols=['AAPL','MSFT','NVDA','GOOGL','AMZN','META','TSLA','AMD','^GSPC','^IXIC','^DJI'];
const base=process.env.SNAPSHOT_API || 'http://127.0.0.1:3000';
const quotes={};
for(const symbol of symbols){
  const response=await fetch(`${base}/api/market?symbol=${encodeURIComponent(symbol)}&range=1D`,{signal:AbortSignal.timeout(25000)});
  if(!response.ok)throw new Error(`${symbol}: HTTP ${response.status}`);
  const data=await response.json();
  if(data.stale || !data.bars?.length)throw new Error(`${symbol}: fresh history required`);
  quotes[symbol]=data;
}
await mkdir('demo',{recursive:true});
await writeFile('demo/snapshot.json',JSON.stringify({capturedAt:new Date().toISOString(),range:'1D',quotes},null,2)+'\n');
console.log(`Captured ${symbols.length} real market snapshots`);
