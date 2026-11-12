import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const read=async p=>JSON.parse(await readFile(new URL(p,import.meta.url)));
const current=await read('results.json'), legacy=await read('baseline.json');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
assert.equal(current.balanceSha256,hash(await readFile(new URL('../../balance.json',import.meta.url))));
const linear=await read('linear-1.1.0.json'), balance=await read('../../balance.json');
assert.equal(hash(await readFile(new URL('linear-1.1.0.json',import.meta.url))),(await read('../2026-11-12-m3.1/results.json')).balanceSha256);
// Compare all content, including all twenty exact schedules, after removing ONLY new fields/version.
const stripped=structuredClone(balance);stripped.version=linear.version;
for(const type of ['firewall','encryption'])delete stripped.towers[type].specializations;
assert.deepEqual(stripped,linear);
assert.ok(current.repeats.every(r=>r.equal&&r.first===r.second));
let md='# M3.2 comparisons\n\nGenerated with `node design/reviews/2026-11-12-m3.2/compare.mjs`. Historical evidence is read only. Automated policies are not human engagement, difficulty or build-diversity evidence.\n\n';
md+=`Content provenance: M3.1 SHA-256 ${hash(await readFile(new URL('linear-1.1.0.json',import.meta.url)))}; M3.2 ${current.balanceSha256}. Only version and four tower specialization definitions change. Base tower costs/stats, upgrades, armor/resists, all waves/schedules, income and every other content field are identical. File hashes identify bytes; the outcomes below measure gameplay. Current seven policies explicitly choose Focus/Sustained control when eligible; old reports used linear upgrades. Other purchase rules and scenarios are unchanged.\n\n`;
const money=r=>['dharma','bandwidth','anonymity'].map(k=>r[k]).join('/');
const time=r=>(r.waves.reduce((n,w)=>n+w.durationMs,0)/1000).toFixed(3);
const first=r=>r.waves.filter(w=>w.wave<=5);
const five=r=>`${first(r).reduce((n,w)=>n+w.accounting.leaked,0)} / ${(first(r).reduce((n,w)=>n+w.durationMs,0)/1000).toFixed(3)}`;
for(const [label,path,base] of [['M3.1','../2026-11-12-m3.1/results.json','../2026-11-12-m3.1/baseline.json'],['Corrected M2.4 / M1.4','../2026-11-11-m2.4/results.json','../2026-11-11-m1.4/baseline.json']]) {
 const old=await read(path),oldLegacy=await read(base);
 assert.deepEqual(legacy.mechanics,oldLegacy.mechanics);assert.deepEqual(legacy.invalidSaves,oldLegacy.invalidSaves);
 assert.deepEqual(current.policies,old.policies);assert.deepEqual(current.scenarios,old.scenarios);
 md+=`## Compared with ${label}\n\nMechanic/rejected-save probes match exactly (terminal 1/1, Titan cooldown 5000/shield 0, disabled aura 1, snapshot isolation).\n\n| Scenario/policy | Old → new result | Lives/leaks | Combat seconds | End D/B/A | First-five leaks / seconds |\n|---|---|---|---|---|---|\n`;
 for(const b of current.runs) {
  const a=old.runs.find(a=>a.scenario===b.scenario&&a.policy===b.policy);
  md+=`| ${b.scenario}/${b.policy} | ${a.phase} w${a.waveNumber} → ${b.phase} w${b.waveNumber} | ${a.lives}/${a.statistics.leaks} → ${b.lives}/${b.statistics.leaks} | ${time(a)} → ${time(b)} | ${money(a.resources)} → ${money(b.resources)} | ${five(a)} → ${five(b)} |\n`;
 }
 md+='\nLegacy diagnostic campaigns (12):\n\n| Difficulty/policy | Result | Lives/leaks | Seconds | End D/B/A |\n|---|---|---|---|---|\n';
 for(let i=0;i<legacy.campaigns.length;i++) {const a=oldLegacy.campaigns[i],b=legacy.campaigns[i];md+=`| ${b.difficulty}/${b.strategy} | ${a.phase} w${a.wave} → ${b.phase} w${b.wave} | ${a.lives}/${a.statistics.leaks} → ${b.lives}/${b.statistics.leaks} | ${a.simulatedSeconds} → ${b.simulatedSeconds} | ${money(a.resources)} → ${money(b.resources)} |\n`;}
}
md+='\n## Controlled wave comparisons against linear M3.1\n\nThe identical funded preparation fixture is defined in tools/balance/tradeoffs.mjs and tradeoffs.json. Costs are 420/0/0 expansion, 406/0/0 damage upgrades, 398/135/68 control upgrades plus attackers, 400/60/30 support, 420/80/40 control-support. Same budget, different spend and currency commitments. Layout and wave matter; elapsed time alone does not rank player enjoyment. Unused funds, full tower placements, typed leaks with coverage, capped health/shield removal, shots, status applications, aura-present shots, passive income, boss phases and kills remain in the raw reports. Aura/status activity is not caused damage or prevented leaks.\n\n| Wave/layout/plan | Linear → prototype leaks | Combat seconds | Prototype status applications | Aura-present shots |\n|---|---|---|---|---|\n';
const trade=await read('tradeoffs.json');
for(const b of trade.rows.filter(r=>r.variant==='prototype')) {
 const a=trade.rows.find(a=>a.variant==='linear'&&a.wave===b.wave&&a.layout===b.layout&&a.plan===b.plan);
 const sums=Object.values(b.report.towers).reduce((n,t)=>({slow:n.slow+t.slowHits,aura:n.aura+t.auraShots}),{slow:0,aura:0});
 md+=`| ${b.wave}/${b.layout}/${b.plan} | ${a.report.leaked} → ${b.report.leaked} | ${(a.timeMs/1000).toFixed(3)} → ${(b.timeMs/1000).toFixed(3)} | ${sums.slow} | ${sums.aura} |\n`;
}
await writeFile(new URL('comparison.md',import.meta.url),md);console.log('Scope, historical probes, policy/scenario definitions and 21 repeats pass; comparison written.');
