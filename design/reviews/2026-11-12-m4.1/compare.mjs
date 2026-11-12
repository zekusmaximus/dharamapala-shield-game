// Reconcile new production reports against immutable M3.4 / M4.4-equivalent runs.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = new URL('.', import.meta.url);
const read = path => JSON.parse(readFileSync(new URL(path, dir), 'utf8'));
const oldBalance = JSON.parse(execFileSync('git',
  ['show', 'c39b6fe:design/balance.json'], { encoding: 'utf8' }));
const balance = JSON.parse(readFileSync(new URL('../../../design/balance.json', dir)));
const old = read('../2026-11-12-m3.4/results.json');
const current = read('results.json');
assert.equal(oldBalance.version, '1.4.0');
assert.equal(balance.version, '1.5.0');
assert.equal(current.balanceVersion, balance.version);
assert.equal(old.balanceVersion, oldBalance.version);
assert.deepEqual({ ...oldBalance, version: balance.version, waves: balance.waves }, balance,
  'scope: only balance version and authored waves may differ');
assert.deepEqual(oldBalance.waves.slice(0, 5), balance.waves.slice(0, 5),
  'the established first act must remain identical');
for (let index = 5; index < 20; index++) {
  assert.equal(balance.waves[index].rewardBonus, oldBalance.waves[index].rewardBonus);
  assert.ok(balance.waves[index].enemies.every(group => Number.isFinite(group.offsetMs)));
}
assert.deepEqual(current.policies, old.policies);
assert.deepEqual(current.scenarios, old.scenarios);
assert.equal(current.runs.length, 21);
assert.equal(current.repeats.length, 21);
assert.ok(current.repeats.every(r => r.equal && r.first === r.second));

const entries = map => Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
function activity(wave) {
  const total = { health: 0, shield: 0, shots: 0, slowHits: 0,
    vulnerabilityHits: 0, auraShots: 0, passiveDharma: wave.accounting.passiveDharma };
  for (const tower of Object.values(wave.accounting.towers)) for (const key of
    ['health', 'shield', 'shots', 'slowHits', 'vulnerabilityHits', 'auraShots'])
    total[key] += tower[key];
  return total;
}
function typedLeaks(wave) {
  const byType = {};
  for (const leak of wave.accounting.leaks) {
    byType[leak.type] ||= { count: 0, damage: 0 };
    byType[leak.type].count++;
    byType[leak.type].damage += leak.damage;
  }
  return Object.fromEntries(entries(byType));
}
function bosses(wave) {
  return wave.pressure.bosses.map(b => ({ type: b.type, outcome: b.outcome,
    phases: b.phases, spawnedAtMs: b.spawnedAtMs,
    resolvedAtMs: b.resolvedAtMs ?? null }));
}
function measures(wave) {
  return { authoredCount: wave.pressure.authoredCount,
    lastAuthoredSpawnMs: wave.pressure.lastAuthoredSpawnMs,
    spawnedByType: Object.fromEntries(entries(wave.pressure.spawnedByType)),
    spawnedHealth: wave.pressure.spawnedHealth,
    initialShield: wave.pressure.initialShield,
    peakAlive: wave.pressure.peakAlive,
    durationMs: wave.durationMs,
    livesBefore: wave.livesBefore, livesAfter: wave.livesAfter,
    resourcesBefore: wave.resourcesBefore, resourcesAtStart: wave.resourcesAtStart,
    resourcesAfter: wave.resourcesAfter,
    spent: wave.accounting.spent, bounty: wave.accounting.bounty,
    clear: wave.accounting.clear, refunds: wave.accounting.refunds,
    killed: wave.accounting.killed, leaked: wave.accounting.leaked,
    typedLeaks: typedLeaks(wave), bosses: bosses(wave), activity: activity(wave) };
}
function totalLeaks(run) {
  const result = {};
  for (const wave of run.waves) for (const [type, value] of Object.entries(typedLeaks(wave))) {
    result[type] ||= { count: 0, damage: 0 };
    result[type].count += value.count;
    result[type].damage += value.damage;
  }
  return Object.fromEntries(entries(result));
}
function totalBosses(run) {
  const result = {};
  for (const wave of run.waves) for (const boss of wave.pressure.bosses) {
    const key = `${boss.type}:${boss.outcome}`;
    result[key] = (result[key] || 0) + 1;
  }
  return Object.fromEntries(entries(result));
}
function totalActivity(run) {
  const result = { health: 0, shield: 0, shots: 0, slowHits: 0,
    vulnerabilityHits: 0, auraShots: 0, passiveDharma: 0 };
  for (const wave of run.waves) for (const [key, value] of Object.entries(activity(wave)))
    result[key] += value;
  return result;
}
function end(run) {
  return { phase: run.phase, waveNumber: run.waveNumber, lives: run.lives,
    resources: run.resources, statistics: run.statistics,
    typedLeaks: totalLeaks(run), bosses: totalBosses(run),
    durationMs: run.waves.reduce((sum, wave) => sum + wave.durationMs, 0),
    activity: totalActivity(run) };
}

const before = new Map(old.runs.map(run => [`${run.scenario}/${run.policy}`, run]));
const comparisons = current.runs.map(run => {
  const id = `${run.scenario}/${run.policy}`;
  const prior = before.get(id);
  assert.ok(prior, id);
  const firstAct = Math.min(5, prior.waves.length, run.waves.length);
  assert.deepEqual(run.waves.slice(0, firstAct), prior.waves.slice(0, firstAct),
    `${id}: first-act production outcomes must remain exact`);
  return { id, old: end(prior), current: end(run), waves: run.waves.map((wave, index) => ({
    wave: wave.wave, old: measures(prior.waves[index]), current: measures(wave)
  })) };
});
const payload = {
  setup: '21 fresh production policy/difficulty runs, each repeated identically. M4.4 regenerated M3.4 report bytes, so that report is the common historical comparison. Policy, scenarios, first-five content/outcomes, non-wave balance and rewards are checked unchanged.',
  oldBalanceVersion: old.balanceVersion, balanceVersion: current.balanceVersion,
  oldBalanceSha256: old.balanceSha256, balanceSha256: current.balanceSha256,
  comparisons
};
const comparisonJson = JSON.stringify(payload, null, 2) + '\n';
writeFileSync(new URL('comparison.json', dir), comparisonJson);

const brief = wave => wave.enemies.map(group => {
  const start = group.offsetMs ?? 'seq';
  return `${group.id}×${group.count}@${start}/${group.interval}`;
}).join('; ');
const fmt = n => (n / 1000).toFixed(1);
const leakBrief = run => entries(run.typedLeaks).map(([type, value]) =>
  `${type}×${value.count}`).join(', ') || '—';
const bossBrief = run => entries(run.bosses).map(([key, count]) => `${key}×${count}`).join(', ') || '—';
let md = '# M4.1 versus M3.4 / M4.4 production comparison\n\n';
md += 'M4.4 regenerated the M3.4 1.4.0 report byte for byte. The new 1.5.0 report and this comparison use the same seven policies, three difficulty configurations and seed. Each run repeats exactly. First-five wave objects match exactly for every reached run. The new and old reports contain full event schedules and individual tower ledgers; `comparison.json` pairs the important per-wave observations for all 21 runs.\n\n';
md += '## Exact authored edits\n\n';
md += 'Notation: `type×count@offset/interval`, simulated milliseconds; `seq` means the old implicit sequential start. Wave 1–5 definitions, reward bonuses, all other balance fields and boss rules are identical.\n\n';
md += '| Wave | 1.4.0 groups | 1.5.0 groups |\n| ---: | --- | --- |\n';
for (let i = 5; i < 20; i++)
  md += `| ${i + 1} | ${brief(oldBalance.waves[i])} | ${brief(balance.waves[i])} |\n`;
md += '\n## All policy and difficulty outcomes\n\n';
md += '| Run | Phase / finishing wave | Lives old → new | Typed leaks old → new | Dharma / Bandwidth old → new | Boss outcomes old → new | Combat s old → new |\n| --- | --- | ---: | --- | --- | --- | ---: |\n';
for (const row of comparisons) {
  const a = row.old, b = row.current;
  md += `| ${row.id} | ${a.phase} ${a.waveNumber} → ${b.phase} ${b.waveNumber} | ${a.lives} → ${b.lives} | ${leakBrief(a)} → ${leakBrief(b)} | ${a.resources.dharma}/${a.resources.bandwidth} → ${b.resources.dharma}/${b.resources.bandwidth} | ${bossBrief(a)} → ${bossBrief(b)} | ${fmt(a.durationMs)} → ${fmt(b.durationMs)} |\n`;
}
md += '\n## Per-wave pressure: existing policy\n\n';
md += 'All old/new banks, lives, typed leaks, boss phases and support/control measures for **every** policy/wave are paired in `comparison.json`. The table below shows the two most demanding configurations of the fixed existing policy; Easy and the other policies are in the JSON. `Peak` counts live enemies, including dynamic reinforcements.\n\n';
md += '| Difficulty / wave | Authored count old → new | Last authored s old → new | Peak old → new | Combat s old → new | Lives old → new | Dharma / Bandwidth after old → new | Shield removed old → new | Slow hits old → new | Aura shots old → new |\n| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: |\n';
for (const difficulty of ['normal', 'hard']) {
  const row = comparisons.find(c => c.id === `${difficulty}-campaign/existing`);
  for (const { wave, old: a, current: b } of row.waves) {
    md += `| ${difficulty} ${wave} | ${a.authoredCount} → ${b.authoredCount} | ${fmt(a.lastAuthoredSpawnMs)} → ${fmt(b.lastAuthoredSpawnMs)} | ${a.peakAlive} → ${b.peakAlive} | ${fmt(a.durationMs)} → ${fmt(b.durationMs)} | ${a.livesAfter} → ${b.livesAfter} | ${a.resourcesAfter.dharma}/${a.resourcesAfter.bandwidth} → ${b.resourcesAfter.dharma}/${b.resourcesAfter.bandwidth} | ${a.activity.shield.toFixed(1)} → ${b.activity.shield.toFixed(1)} | ${a.activity.slowHits} → ${b.activity.slowHits} | ${a.activity.auraShots} → ${b.activity.auraShots} |\n`;
  }
}
md += '\nShield is capped absorbed damage (and can include Titan regeneration), slow hits include applications and refreshes, and aura shots mean support was present. None is causal credit for damage prevented, lives saved or player understanding. Timing is simulated combat only; no build or player time is included.\n';
writeFileSync(new URL('comparison.md', dir), md);
console.log(`Compared ${comparisons.length} policy/difficulty runs and ${comparisons.reduce((sum, c) => sum + c.waves.length, 0)} reached waves.`);
