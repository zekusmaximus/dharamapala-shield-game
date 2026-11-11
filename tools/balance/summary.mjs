// Derive a reviewable table from the machine-readable report, without rerunning combat.
import { readFile, writeFile } from 'node:fs/promises';
const [input,output] = process.argv.slice(2);
if (!input || !output) throw new Error('Usage: summary.mjs results.json summary.md');
const report = JSON.parse(await readFile(input,'utf8'));
const sum = (run,fn) => run.waves.reduce((n,w)=>n+fn(w),0);
const money = r => ['dharma','bandwidth','anonymity'].map(k=>r[k]).join('/');
const totalMoney = (run,key) => money(Object.fromEntries(['dharma','bandwidth','anonymity'].map(k=>[k,sum(run,w=>w.accounting[key][k])])));
let md = '# M2.4 scripted results\n\nGenerated from results.json by tools/balance/summary.mjs. Resources are Dharma/Bandwidth/Anonymity. Time is simulated wave time, excluding preparation and report CPU time. These are fixed-policy observations, not human difficulty or win rates.\n\n';
md += '| Scenario | Policy | Outcome (last played wave) | Lives / leaks | Boss killed/leaked/unresolved | Seconds | End resources | Spent | Bounty | Clear (includes passive) | Passive Dharma |\n|---|---|---|---|---|---|---|---|---|---|---|\n';
for (const r of report.runs) {
 const bosses=r.waves.flatMap(w=>w.pressure.bosses);
 md += `| ${r.scenario} | ${r.policy} | ${r.phase} (${r.waves.at(-1).wave}) | ${r.lives} / ${r.statistics.leaks} | ${['killed','leaked','unresolved'].map(o=>bosses.filter(b=>b.outcome===o).length).join('/')} | ${(sum(r,w=>w.durationMs)/1000).toFixed(3)} | ${money(r.resources)} | ${totalMoney(r,'spent')} | ${totalMoney(r,'bounty')} | ${totalMoney(r,'clear')} | ${sum(r,w=>w.accounting.passiveDharma)} |\n`;
}
md += '\n## Observed tower activity\n\nAggregated by type; detailed per-wave tower IDs, levels, positions and typed leak coverage are in results.json. Health/shield removal and final hits do not allocate causal benefit from status or support. Aura-present shots may overlap.\n\n| Scenario | Policy | Type | Health removed | Shield removed | Final hits | Shots | Slow applications | Vulnerability applications | Aura-present shots |\n|---|---|---|---|---|---|---|---|---|---|\n';
for(const r of report.runs) {
 const groups={};
 for(const w of r.waves) for(const t of Object.values(w.accounting.towers)) {
  const g=groups[t.type] ||= Object.fromEntries(['health','shield','kills','shots','slowHits','vulnerabilityHits','auraShots'].map(k=>[k,0]));
  for(const k of Object.keys(g)) g[k]+=t[k];
 }
 for(const [type,g] of Object.entries(groups)) md+=`| ${r.scenario} | ${r.policy} | ${type} | ${Object.values(g).map(n=>Number.isInteger(n)?n:n.toFixed(3)).join(' | ')} |\n`;
}
md += '\n## Wave pressure and outcomes\n\nAuthored count/due time excludes dynamic Raid reinforcements. Spawn HP and initial shield sum actual production spawns (including reinforcements); neither is a damage requirement or a scalar difficulty score. Peak live count is observed on each spawn. Defeat can leave authored spawns unreleased and live enemies unresolved.\n\n| Scenario | Policy | Wave | Authored count / last due ms | Actual spawns | Spawn HP / initial shield | Peak alive | Kills / leaks | Lives after | Seconds |\n|---|---|---|---|---|---|---|---|---|---|\n';
for(const r of report.runs) for(const w of r.waves) md+=`| ${r.scenario} | ${r.policy} | ${w.wave} | ${w.pressure.authoredCount} / ${w.pressure.lastAuthoredSpawnMs} | ${Object.values(w.pressure.spawnedByType).reduce((a,b)=>a+b,0)} | ${w.pressure.spawnedHealth.toFixed(1)} / ${w.pressure.initialShield} | ${w.pressure.peakAlive} | ${w.accounting.killed} / ${w.accounting.leaked} | ${w.livesAfter} | ${(w.durationMs/1000).toFixed(3)} |\n`;
await writeFile(output,md);
