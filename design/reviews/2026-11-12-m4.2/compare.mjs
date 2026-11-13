// Reconcile M4.2 production reports against immutable M4.1 campaigns.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = new URL('.', import.meta.url);
const read = path => JSON.parse(readFileSync(new URL(path, dir), 'utf8'));
const oldBalance = JSON.parse(execFileSync('git',
  ['show', '601c1ea:design/balance.json'], { encoding: 'utf8' }));
const balance = JSON.parse(readFileSync(new URL('../../../design/balance.json', dir)));
const old = read('../2026-11-12-m4.1/results.json');
const current = read('results.json');
assert.equal(oldBalance.version, '1.5.0');
assert.equal(balance.version, '1.6.0');
assert.equal(current.balanceVersion, balance.version);
assert.equal(old.balanceVersion, oldBalance.version);
const scoped = structuredClone(oldBalance);
scoped.version = balance.version;
scoped.bosses.raidTeam.description = balance.bosses.raidTeam.description;
scoped.bosses.raidTeam.abilities.emp.thresholds = [0.66];
scoped.bosses.raidTeam.abilities.reinforcements.byPhase =
  [['scriptKiddie', 'scriptKiddie', 'federalAgent', 'scriptKiddie']];
assert.deepEqual(scoped, balance,
  'scope: only balance version, Raid description, phase count and reinforcement timing may differ');
assert.deepEqual(oldBalance.waves, balance.waves,
  'all M4.1 authored groups and rewards must remain exact');
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
  assert.equal(run.waves.length, prior.waves.length);
  assert.deepEqual(run.waves.slice(0, 4), prior.waves.slice(0, 4),
    `${id}: pre-Raid production outcomes must remain exact`);
  assert.deepEqual({phase:run.phase,waveNumber:run.waveNumber,lives:run.lives,
    resources:run.resources,typedLeaks:totalLeaks(run),bosses:totalBosses(run)},
  {phase:prior.phase,waveNumber:prior.waveNumber,lives:prior.lives,
    resources:prior.resources,typedLeaks:totalLeaks(prior),bosses:totalBosses(prior)},
  `${id}: final outcomes must remain stable`);
  for (let index=0; index<run.waves.length; index++) {
    const a=prior.waves[index],b=run.waves[index];
    assert.deepEqual({livesBefore:b.livesBefore,livesAfter:b.livesAfter,
      resourcesBefore:b.resourcesBefore,resourcesAtStart:b.resourcesAtStart,
      resourcesAfter:b.resourcesAfter,spawnedByType:b.pressure.spawnedByType,
      authoredCount:b.pressure.authoredCount,typedLeaks:typedLeaks(b)},
    {livesBefore:a.livesBefore,livesAfter:a.livesAfter,
      resourcesBefore:a.resourcesBefore,resourcesAtStart:a.resourcesAtStart,
      resourcesAfter:a.resourcesAfter,spawnedByType:a.pressure.spawnedByType,
      authoredCount:a.pressure.authoredCount,typedLeaks:typedLeaks(a)},
    `${id} wave ${b.wave}: resources, lives, spawns and leaks must remain stable`);
  }
  return { id, old: end(prior), current: end(run), waves: run.waves.map((wave, index) => ({
    wave: wave.wave, old: measures(prior.waves[index]), current: measures(wave)
  })) };
});
const payload = {
  setup: '21 fresh production policy/difficulty runs, each repeated identically. M4.1 1.5.0 is the immutable comparison. Same policies, scenarios, all authored wave groups/rewards, non-Raid balance and first-four production outcomes.',
  oldBalanceVersion: old.balanceVersion, balanceVersion: current.balanceVersion,
  oldBalanceSha256: old.balanceSha256, balanceSha256: current.balanceSha256,
  comparisons
};
const comparisonJson = JSON.stringify(payload, null, 2) + '\n';
writeFileSync(new URL('comparison.json', dir), comparisonJson);

const fmt = n => (n / 1000).toFixed(1);
const leakBrief = run => entries(run.typedLeaks).map(([type, value]) =>
  `${type}×${value.count}`).join(', ') || '—';
const bossBrief = run => entries(run.bosses).map(([key, count]) => `${key}×${count}`).join(', ') || '—';
let md = '# M4.2 versus M4.1 production comparison\n\n';
md += 'The 1.6.0 report compares with immutable M4.1 1.5.0 using the same seven policies, three difficulty configurations and seed. Each run repeats exactly. All authored wave groups/rewards, non-Raid combat values and the first four production waves match. The old and new reports contain full event schedules and individual tower ledgers; `comparison.json` pairs every reached wave for all 21 runs.\n\n';
md += '## Exact boss content edit\n\n';
md += 'Raid retains the 66% immediate 260-unit, 1.5 s EMP. Its second 33% EMP is removed; the same four reinforcements now all follow the first trigger at 0/250/500/750 ms. Titan numbers and recovery rule, Agent brace, all waves and every price are unchanged. Balance 1.5.0 → 1.6.0; schema remains v4.\n\n';
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
