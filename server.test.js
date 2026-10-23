import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('HTTP server rejects invalid ranges and serves the dashboard', async () => {
  const port = 13000 + Math.floor(Math.random() * 10000);
  const child = spawn(process.execPath, ['server.js'], { env: {...process.env, PORT:String(port)}, stdio:['ignore','pipe','pipe'] });
  try {
    await Promise.race([once(child.stdout,'data'), once(child,'exit').then(() => {throw new Error('Server exited before startup');}), new Promise((_, reject) => {const timer=setTimeout(() => reject(new Error('Startup timeout')),5000);timer.unref();})]);
    const base=`http://127.0.0.1:${port}`;
    for (const range of ['constructor','toString','__proto__','2Y']) {
      const response=await fetch(`${base}/api/market?range=${range}`);
      assert.equal(response.status,400,range);
      assert.deepEqual(await response.json(),{error:'Invalid symbol or range'});
    }
    const response=await fetch(base);
    assert.equal(response.status,200);
    assert.match(await response.text(),/id="chart-history-note"/);
  } finally {
    const stopped=once(child,'exit');
    child.kill();
    await stopped;
  }
});
