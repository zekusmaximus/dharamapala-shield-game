import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compileSpawnSchedule, getWavePreview } from '../../js/core/rules/waves.js';
import { validateBalance } from '../../js/core/rules/validation.js';
import { SpawnScheduler } from '../../js/core/SpawnScheduler.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();
const expected = [
  [0,1000,2000,3000,6500,7200,7900,8600],
  [0,700,1400,2100,5000,5350,5700,6050,6400,6750],
  [0,700,1200,1400,1700,2200,2800,6500,6900,7300,7700],
  [0,900,900,1200,1500,1800,6000,6600,6900,6900,7200],
  [0,600,1000,1400,1800,2200,2600,6500,6800,7100,7400,7700,8000]
];
for (let wave = 1; wave <= 5; wave++) test(`wave ${wave} has exact deterministic pressure, preview windows and serializable release order`, () => {
  const before = structuredClone(balance);
  const events = compileSpawnSchedule(balance, wave);
  assert.deepEqual(events.map(e => e.dueAtMs), expected[wave - 1]);
  assert.deepEqual(events.map(e => e.order), events.map((_, i) => i));
  assert.deepEqual(events, compileSpawnSchedule(balance, wave));
  assert.deepEqual(balance, before);
  const preview = getWavePreview(balance, wave);
  const fromPreview = preview.enemies.flatMap(e => e.windows.flatMap(w =>
    Array.from({ length: w.count }, (_, i) => ({ type: e.id, due: w.startMs + i * w.intervalMs }))
  )).sort((a,b) => a.due-b.due || a.type.localeCompare(b.type));
  assert.deepEqual(fromPreview, events.map(e => ({type:e.enemyType,due:e.dueAtMs}))
    .sort((a,b) => a.due-b.due || a.type.localeCompare(b.type)));
  assert.ok(preview.gaps.length > 0);
  const scheduler = new SpawnScheduler(); scheduler.load(events, 3);
  const released = [];
  scheduler.advance(2500, 3, e => released.push(e));
  const restored = new SpawnScheduler(); restored.restore(JSON.parse(JSON.stringify(scheduler.snapshot())));
  const a=[], b=[];
  scheduler.advance(10000, 3, e=>a.push(e)); restored.advance(10000, 3, e=>b.push(e));
  assert.deepEqual(a,b); assert.deepEqual([...released,...a],events);
});

test('overlapping, zero and fractional offsets use stable authored ties; omitted offsets retain trailing intervals', () => {
  const b = structuredClone(balance);
  b.waves[0].enemies = [
    { id:'federalAgent', count:2, interval:0, hpMult:1, offsetMs:20.5 },
    { id:'scriptKiddie', count:2, interval:10, hpMult:1, offsetMs:0 },
    { id:'federalAgent', count:1, interval:3, hpMult:1 }
  ];
  validateBalance(b);
  assert.deepEqual(compileSpawnSchedule(b,1).map(e=>[e.dueAtMs,e.enemyType]),[
    [0,'scriptKiddie'],[10,'scriptKiddie'],[20,'federalAgent'],[20.5,'federalAgent'],[20.5,'federalAgent']
  ]);
  assert.deepEqual(compileSpawnSchedule(balance,4).filter(e=>e.dueAtMs===900).map(e=>e.enemyType),['federalAgent','scriptKiddie']);
});

for (const offset of [-1, null, '100', NaN, Infinity]) test(`invalid spawn offset ${String(offset)} rejects`, () => {
  const b = structuredClone(balance); b.waves[0].enemies[0].offsetMs = offset;
  assert.throws(()=>validateBalance(b), /Spawn offsetMs/);
});
test('overflowing derived times reject before session construction', () => {
  const b=structuredClone(balance);
  b.waves[0].enemies[0].offsetMs=Number.MAX_VALUE;
  b.waves[0].enemies[0].interval=Number.MAX_VALUE;
  assert.throws(()=>validateBalance(b), /derived spawn time/);
});

test('waves 6–20 retain the legacy sequential contract exactly', async () => {
  const old = JSON.parse(await readFile(new URL('../../design/reviews/2026-11-11-m2.4/results.json',import.meta.url)));
  const run = old.runs.find(r=>r.policy==='existing' && r.scenario==='normal-campaign');
  for (const wave of run.waves.filter(w=>w.wave>=6)) {
    assert.deepEqual(compileSpawnSchedule(balance,wave.wave),wave.pressure.authoredSchedule);
  }
});
