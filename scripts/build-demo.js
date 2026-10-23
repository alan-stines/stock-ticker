import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
const snapshot=JSON.parse(await readFile('demo/snapshot.json','utf8'));
if(!snapshot.capturedAt || Object.keys(snapshot.quotes).length!==11)throw new Error('Demo snapshot incomplete');
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
await writeFile('dist/config.js','export const demoMode = true;\n');
await cp('demo/snapshot.json','dist/snapshot.json');
await writeFile('dist/.nojekyll','');
console.log(`Built static demo from ${snapshot.capturedAt}`);
