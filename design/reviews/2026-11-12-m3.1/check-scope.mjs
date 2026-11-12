import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../../../',import.meta.url);
const old=JSON.parse(execFileSync('git',['show','20d33bb:design/balance.json'],{cwd:root,encoding:'utf8'}));
const balance=JSON.parse(await readFile(new URL('design/balance.json',root),'utf8'));
for(const key of Object.keys(old).filter(k=>!['version','waves'].includes(k))) assert.deepEqual(balance[key],old[key]);
assert.deepEqual(balance.waves.slice(5),old.waves.slice(5));
const composition=w=>w.enemies.reduce((counts,g)=>{
  const key=`${g.id}/${g.hpMult}`; counts[key]=(counts[key]||0)+g.count; return counts;
},{});
for(let i=0;i<5;i++) {
  assert.deepEqual(composition(balance.waves[i]),composition(old.waves[i]));
  assert.equal(balance.waves[i].rewardBonus,old.waves[i].rewardBonus);
}
const result='$ node design/reviews/2026-11-12-m3.1/check-scope.mjs\nCompared current JSON with latest main at task start (20d33bb):\nPASS: only version and first-five-wave scheduling fields differ.\nPASS: typed counts/HP multipliers, rewards, waves 6–20 and every other definition match.\n';
await writeFile(new URL('content-scope.txt',import.meta.url),result);
process.stdout.write(result);
