import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENARIOS, runScenario } from '../../tools/balance/report.mjs';
import { createPolicy, POLICY_DEFINITIONS, counterChoice } from '../../tools/balance/policies.mjs';
import { DeterministicPlayerPolicy, loadBalance, buildPositions } from '../../tools/sim/run.mjs';
import { GameSession } from '../../js/core/GameSession.js';

const balance = await loadBalance();
const fresh = () => { const s = new GameSession(balance); s.newGame({tutorialCompleted:true,seed:1337}); return s; };
test('scenarios use three distinct production difficulties and full authored campaigns', () => {
  assert.deepEqual(SCENARIOS.map(s=>s.difficulty),['Easy','Normal','Hard']);
  for (const s of SCENARIOS) {
    assert.equal(s.firstWave,1); assert.equal(s.finalWave,balance.waves.length); assert.equal(s.seed,1337);
    assert.ok(balance.difficulty[s.difficulty]);
  }
});
test('policy restrictions and ordering apply through production purchase commands', () => {
  assert.equal(Object.keys(POLICY_DEFINITIONS).length,7);
  assert.throws(()=>createPolicy('bogus'));
  for (const name of Object.keys(POLICY_DEFINITIONS)) {
    const s = fresh();
    s.state.waveNumber = 6;
    s.state.resources = {dharma:3000,bandwidth:3000,anonymity:3000}; // build constraint fixture, not combat evidence
    createPolicy(name).build(s);
    const towers = [...s.state.defenses.values()];
    assert.ok(towers.length);
    if (['firewall-only','expansion-heavy'].includes(name)) assert.ok(towers.every(t=>t.type==='firewall'));
    if (['no-support','upgrade-heavy'].includes(name)) assert.ok(towers.every(t=>t.type!=='distributor'));
    if (name==='expansion-heavy') assert.ok(towers.every(t=>t.level===1));
    if (name==='upgrade-heavy') { assert.equal(towers.length,3); assert.ok(towers.some(t=>t.level===5)); }
    if (name==='weak-placement') {
      const first = [...buildPositions()].sort((a,b)=>a.coverage-b.coverage||a.x-b.x||a.y-b.y)[0];
      assert.equal(towers[0].x,first.x); assert.equal(towers[0].y,first.y);
    }
  }
  const a = fresh(), b = fresh();
  createPolicy('existing').build(a); new DeterministicPlayerPolicy().build(b);
  assert.deepEqual(a.toSnapshot().state,b.toSnapshot().state);
});
test('counter heuristic responds to incoming armor/resistance rather than a fixed purchase sequence', () => {
  const s = fresh();
  // Heuristic-only fixture: not changed production content or combat evidence.
  s.balance = structuredClone(balance);
  const group = s.balance.waves[0].enemies[0];
  s.balance.enemies[group.id].resists = {physical:0.01,shock:10};
  assert.equal(counterChoice(s),'encryption');
  s.balance.enemies[group.id].resists = {physical:10,shock:0.01};
  assert.equal(counterChoice(s),'firewall');
});
test('actual full campaigns reconcile M2.3 ledgers, natural bosses/leaks and deterministic repeats', async () => {
  for (const name of Object.keys(POLICY_DEFINITIONS)) {
    const run = await runScenario(SCENARIOS[2],name);
    assert.deepEqual(run,await runScenario(SCENARIOS[2],name));
    let kills=0, leaks=0, bossKills=0;
    for (const w of run.waves) {
      const r = w.accounting;
      assert.equal(r.partial,false);
      assert.equal(r.leaks.length,r.leaked);
      assert.equal(Object.values(r.towers).reduce((n,t)=>n+t.kills,0),r.killed);
      for (const key of Object.keys(run.resources)) {
        assert.equal(w.resourcesAtStart[key],w.resourcesBefore[key]-r.spent[key]+r.refunds[key]);
        assert.equal(w.resourcesAfter[key],w.resourcesAtStart[key]+r.bounty[key]+r.clear[key]);
      }
      assert.equal(w.livesAfter,Math.max(0,w.livesBefore-r.leaks.reduce((n,l)=>n+l.damage,0)));
      assert.ok(w.steps>0); assert.ok(w.pressure.peakAlive>0);
      assert.ok(w.pressure.spawnedHealth>0);
      for (const b of w.pressure.bosses) { assert.ok(['killed','leaked','unresolved'].includes(b.outcome)); if(b.outcome==='killed') bossKills++; }
      kills+=r.killed; leaks+=r.leaked;
    }
    assert.equal(kills,run.statistics.kills); assert.equal(leaks,run.statistics.leaks);
    assert.equal(bossKills,run.statistics.bossesKilled);
    if (name==='existing') {
      assert.equal(run.phase,'VICTORY'); assert.equal(run.waves.length,20);
      assert.ok(bossKills>0);
      assert.ok(run.waves.some(w=>Object.values(w.accounting.towers).some(t=>t.shield>0)));
      assert.ok(run.waves.some(w=>Object.values(w.accounting.towers).some(t=>t.auraShots>0)));
    }
    if (name==='weak-placement') { assert.ok(leaks>0); }
  }
});

test('fresh production scenarios and repeat hashes match M2.4; content hash matches current bytes', async () => {
  const { buildReport } = await import('../../tools/balance/report.mjs');
  const { createHash } = await import('node:crypto');
  const { readFile } = await import('node:fs/promises');
  const recorded = JSON.parse(await readFile(new URL('../../design/reviews/2026-11-11-m2.4/results.json',import.meta.url)));
  const current = await buildReport();
  const bytes = await readFile(new URL('../../design/balance.json', import.meta.url));
  assert.equal(current.balanceSha256, createHash('sha256').update(bytes).digest('hex'));
  const { balanceSha256: historicalHash, ...historicalResults } = recorded;
  const { balanceSha256: currentHash, ...currentResults } = current;
  assert.ok(historicalHash && currentHash);
  assert.deepEqual(currentResults, historicalResults);
});
