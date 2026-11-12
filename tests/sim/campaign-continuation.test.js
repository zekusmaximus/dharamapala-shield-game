import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GameSession, PHASES } from '../../js/core/GameSession.js';
import { getLeakDamage } from '../../js/core/rules/combat.js';
import { createStartingResources } from '../../js/core/rules/economy.js';
import { createPolicy } from '../../tools/balance/policies.mjs';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();
const historical = JSON.parse(await readFile(new URL(
  '../../design/reviews/2026-11-12-m3.4/results.json', import.meta.url
)));
const resourceKeys = ['dharma', 'bandwidth', 'anonymity'];
const frameDeltas = [37, 91, 250, 19, 300, 54, 123];
const stepMs = 1000 / 60;

// Each lane starts from the real defaults. Only the fourth lane crosses JSON;
// the second stays at 2× and the third switches speeds without being restored.
const cases = [
  { difficulty: 'Easy', policy: 'existing', phase: PHASES.VICTORY,
    checkpoints: ['build-3', 'raid-5'] },
  { difficulty: 'Normal', policy: 'existing', phase: PHASES.VICTORY,
    checkpoints: ['raid-10', 'titan-15', 'build-16'] },
  { difficulty: 'Hard', policy: 'existing', phase: PHASES.VICTORY,
    checkpoints: ['titan-20'] },
  { difficulty: 'Hard', policy: 'weak-placement', phase: PHASES.GAME_OVER,
    checkpoints: ['build-3', 'weak-3'] }
];

function gameplay(session, { omitSpeed = false } = {}) {
  const { savedAt, ...snapshot } = session.toSnapshot();
  assert.match(savedAt, /^\d{4}-\d\d-\d\dT/);
  if (omitSpeed) snapshot.state.waveSpeed = 1;
  return snapshot;
}

function equalLanes(lanes) {
  assert.deepEqual(gameplay(lanes[2].session), gameplay(lanes[3].session),
    'JSON continuation must retain full state and runtime');
  assert.deepEqual(gameplay(lanes[0].session), gameplay(lanes[1].session, { omitSpeed: true }),
    'equal simulated credit must retain state and runtime at 1×/2×');
  assert.deepEqual(gameplay(lanes[0].session), gameplay(lanes[2].session, { omitSpeed: true }),
    'speed changes must retain state and runtime');
}

function makeLane(difficulty, policy, hitAudit = false) {
  const session = new GameSession(balance);
  assert.equal(session.newGame({ difficulty, seed: 1337, tutorialCompleted: true }).ok, true);
  assert.equal(session.state.phase, PHASES.BUILDING);
  assert.equal(session.state.lives, balance.economy.initialLives);
  assert.deepEqual(session.state.resources, createStartingResources(balance));
  const commands = [];
  const lane = { session, policy: createPolicy(policy), commands, hits: null };
  installObservers(lane, hitAudit);
  return lane;
}

function installObservers(lane, hitAudit) {
  const session = lane.session;
  for (const name of ['placeDefense', 'upgradeDefense', 'sellDefense']) {
    const original = session[name].bind(session);
    session[name] = (...args) => {
      const result = original(...args);
      if (result.ok) lane.commands.push({ name, args: structuredClone(args) });
      return result;
    };
  }
  if (!hitAudit) return;
  const original = session.systems.combat.applyHit.bind(session.systems.combat);
  session.systems.combat.applyHit = (current, projectile, enemy, multiplier) => {
    const health = enemy.health, shield = enemy.shield;
    original(current, projectile, enemy, multiplier);
    const row = lane.hits?.get(projectile.sourceId);
    if (!row) return;
    const removedHealth = Math.min(Math.max(0, health), Math.max(0, health - enemy.health));
    const removedShield = Math.max(0, shield - enemy.shield);
    assert.ok(removedHealth <= Math.max(0, health) + 1e-7);
    assert.ok(removedShield <= shield + 1e-7);
    row.health += removedHealth;
    row.shield += removedShield;
    row.slowHits += Number(projectile.slowDurationMs > 0 && projectile.slowPct > 0);
    row.vulnerabilityHits += Number(projectile.vulnerabilityDurationMs > 0 && projectile.vulnerabilityPct > 0);
  };
}

function checkpointReached(id, session) {
  const state = session.state;
  if (id === 'build-3') return state.phase === PHASES.BUILDING && state.waveNumber === 3;
  if (id === 'build-16') return state.phase === PHASES.BUILDING && state.waveNumber === 16;
  if (state.phase !== PHASES.WAVE) return false;
  if (id === 'weak-3') return state.waveNumber === 3 && state.wave.spawned >= 2 && state.enemies.size > 0;
  const [type, wave] = id.split('-');
  if (state.waveNumber !== Number(wave)) return false;
  return [...state.enemies.values()].some(enemy => type === 'raid'
    ? enemy.type === 'raidTeam' && enemy.firedPhases.length > 0
    : enemy.type === 'megaCorpTitan' && enemy.shield < enemy.shieldMax);
}

function pauseAndRestore(lanes, id, snapshots, checkpoints) {
  for (const lane of lanes) assert.equal(lane.session.pause().ok, true);
  equalLanes(lanes);
  for (const lane of lanes) {
    const frozen = gameplay(lane.session);
    assert.equal(lane.session.tick(60_000).steps, 0);
    assert.deepEqual(gameplay(lane.session), frozen, 'pause must freeze state and runtime');
  }
  if (id) {
    const source = lanes[3].session.toSnapshot();
    assert.equal(source.state.phase, PHASES.PAUSED);
    const bytes = JSON.stringify(source);
    const parsed = JSON.parse(bytes);
    const restored = GameSession.fromSnapshot(balance, parsed);
    assert.deepEqual(gameplay(restored), gameplay(lanes[2].session));
    snapshots.push({ source, bytes });
    const state = restored.state;
    checkpoints.push({ id, wave: state.waveNumber, resumePhase: state.resumePhase,
      gameTimeMs: state.gameTimeMs, lives: state.lives,
      resources: { ...state.resources }, reports: state.reports.pending.length,
      spawned: state.wave.spawned, resolved: state.wave.resolved,
      bosses: [...state.enemies.values()].filter(e => e.kind === 'boss').map(e => ({
        type: e.type, health: e.health, shield: e.shield, shieldMax: e.shieldMax,
        firedPhases: [...e.firedPhases]
      })) });
    lanes[3].session = restored;
    installObservers(lanes[3], false);
  }
  equalLanes(lanes);
  for (const lane of lanes) assert.equal(lane.session.resume().ok, true);
  equalLanes(lanes);
}

function checkWave(lanes, before, atStart, livesBefore, steps, expected, totals) {
  const session = lanes[0].session;
  const state = session.state;
  const report = state.reports.pending.at(-1);
  assert.equal(report.waveNumber, expected.wave);
  assert.equal(report.partial, false);
  assert.deepEqual(report, expected.accounting, 'tick campaign must match M3.4 production report');
  assert.deepEqual(before, expected.resourcesBefore);
  assert.deepEqual(atStart, expected.resourcesAtStart);
  assert.deepEqual(state.resources, expected.resourcesAfter);
  assert.equal(state.lives, expected.livesAfter);
  assert.equal(steps, expected.steps);
  assert.equal(state.gameTimeMs - state.wave.startedAtMs, expected.durationMs);
  assert.equal(report.leaks.length, report.leaked);
  assert.equal(Object.values(report.towers).reduce((n, t) => n + t.kills, 0), report.killed);
  assert.equal(state.lives, Math.max(0, livesBefore - report.leaks.reduce((n, leak) => n + leak.damage, 0)));
  for (const leak of report.leaks) {
    const definition = balance.enemies[leak.type] || balance.bosses[leak.type];
    assert.ok(definition);
    assert.equal(leak.damage, getLeakDamage(balance, definition, state.difficulty));
    if (leak.lastCovered !== null) assert.ok(leak.lastCovered >= 0);
  }
  for (const key of resourceKeys) {
    assert.equal(atStart[key], before[key] - report.spent[key] + report.refunds[key]);
    assert.equal(state.resources[key], atStart[key] + report.bounty[key] + report.clear[key]);
  }
  assert.equal(report.passiveDharma <= report.clear.dharma, true);
  assert.equal(report.outcome, state.phase === PHASES.GAME_OVER ? 'defeat' : 'cleared');
  for (const [id, tower] of Object.entries(report.towers)) {
    const measured = lanes[0].hits.get(id) || { health: 0, shield: 0, slowHits: 0, vulnerabilityHits: 0 };
    assert.ok(Math.abs(tower.health - measured.health) < 1e-6, `capped health accounting ${id}`);
    assert.ok(Math.abs(tower.shield - measured.shield) < 1e-6, `shield removal accounting ${id}`);
    assert.equal(tower.slowHits, measured.slowHits);
    assert.equal(tower.vulnerabilityHits, measured.vulnerabilityHits);
    totals.health += tower.health; totals.shield += tower.shield;
    totals.slowHits += tower.slowHits; totals.vulnerabilityHits += tower.vulnerabilityHits;
    totals.auraShots += tower.auraShots;
  }
  assert.ok(Object.values(report.towers).reduce((n, tower) => n + tower.health, 0)
    <= expected.pressure.spawnedHealth + 1e-6, 'health removal is capped by spawned health');
  totals.leaks += report.leaked;
  totals.kills += report.killed;
  totals.passiveDharma += report.passiveDharma;
  assert.deepEqual(state.reports.pending, expected.run.waves.slice(0, expected.wave).map(w => w.accounting),
    'all prior reports must persist unchanged');
  equalLanes(lanes);
}

function verifyCase(config) {
  const lanes = Array.from({ length: 4 }, (_, i) => makeLane(config.difficulty, config.policy, i === 0));
  const snapshots = [], checkpoints = [], reached = new Set();
  const reference = historical.runs.find(run => run.scenario === `${config.difficulty.toLowerCase()}-campaign` && run.policy === config.policy);
  assert.ok(reference);
  const totals = { kills: 0, leaks: 0, health: 0, shield: 0,
    slowHits: 0, vulnerabilityHits: 0, auraShots: 0, passiveDharma: 0,
    creditedMs: 0, consumedMs: 0, speedChanges: 0, pauses: 0 };
  while (lanes[0].session.state.phase === PHASES.BUILDING) {
    const wave = lanes[0].session.state.waveNumber;
    assert.ok(wave <= balance.waves.length);
    assert.equal(lanes[0].session.state.reports.pending.length, wave - 1);
    const buildId = config.checkpoints.find(id => !reached.has(id) && checkpointReached(id, lanes[0].session));
    if (buildId) {
      pauseAndRestore(lanes, buildId, snapshots, checkpoints);
      reached.add(buildId); totals.pauses++;
    }
    const before = { ...lanes[0].session.state.resources };
    const livesBefore = lanes[0].session.state.lives;
    for (const lane of lanes) lane.policy.build(lane.session);
    for (const lane of lanes.slice(1)) assert.deepEqual(lane.commands, lanes[0].commands);
    equalLanes(lanes);
    const atStart = { ...lanes[0].session.state.resources };
    for (const lane of lanes) {
      assert.equal(lane.session.startWave().ok, true);
      assert.equal(lane.session.state.waveNumber, wave);
    }
    if (lanes[2].session.state.waveSpeed !== 2) totals.speedChanges++;
    for (const lane of lanes.slice(1)) assert.equal(lane.session.setWaveSpeed(2).ok, true);
    lanes[0].hits = new Map([...lanes[0].session.state.defenses.keys()].map(id => [id,
      { health: 0, shield: 0, slowHits: 0, vulnerabilityHits: 0 }]));
    equalLanes(lanes);
    let frames = 0, steps = 0;
    const startMs = lanes[0].session.state.gameTimeMs;
    while (lanes[0].session.state.phase === PHASES.WAVE && frames < 5000) {
      if ([7, 13, 29, 31].includes(frames)) {
        const next = [7, 29].includes(frames) ? 1 : 2;
        for (const lane of lanes.slice(2)) assert.equal(lane.session.setWaveSpeed(next).ok, true);
        totals.speedChanges++;
        equalLanes(lanes);
      }
      if (wave === 1 && frames === 11) {
        pauseAndRestore(lanes, null, snapshots, checkpoints);
        totals.pauses++;
      }
      const delta = frameDeltas[frames % frameDeltas.length];
      const credit = Math.min(delta, 250);
      const responses = lanes.map((lane, index) => lane.session.tick(index === 0
        ? delta : credit / lane.session.state.waveSpeed));
      for (const response of responses.slice(1)) assert.equal(response.steps, responses[0].steps);
      steps += responses[0].steps;
      totals.creditedMs += credit;
      frames++;
      if (frames % 31 === 0 || lanes[0].session.state.phase !== PHASES.WAVE) equalLanes(lanes);
      const combatId = config.checkpoints.find(id => !reached.has(id) && checkpointReached(id, lanes[0].session));
      if (combatId) {
        equalLanes(lanes);
        pauseAndRestore(lanes, combatId, snapshots, checkpoints);
        reached.add(combatId); totals.pauses++;
      }
    }
    assert.ok(frames < 5000, `wave ${wave} should resolve naturally`);
    assert.ok(Math.abs(lanes[0].session.state.gameTimeMs - startMs - steps * stepMs) < 1e-6,
      'consumed simulated time equals production clock steps');
    totals.consumedMs += lanes[0].session.state.gameTimeMs - startMs;
    checkWave(lanes, before, atStart, livesBefore, steps,
      { ...reference.waves[wave - 1], run: reference }, totals);
    if (lanes[0].session.state.phase === PHASES.BUILDING) {
      for (const lane of lanes) {
        const frozen = gameplay(lane.session);
        assert.equal(lane.session.clock.accumulatorMs, 0);
        assert.equal(lane.session.tick(60_000).steps, 0);
        assert.deepEqual(gameplay(lane.session), frozen, 'build boundary needs deliberate Start Wave');
      }
    }
  }
  assert.deepEqual([...reached].sort(), [...config.checkpoints].sort(), 'all earned checkpoints reached');
  assert.equal(lanes[0].session.state.phase, config.phase);
  assert.equal(reference.phase, config.phase);
  assert.equal(lanes[0].session.state.reports.pending.length, reference.waves.length);
  assert.equal(totals.kills, reference.statistics.kills);
  assert.equal(totals.leaks, reference.statistics.leaks);
  assert.deepEqual(lanes[0].session.state.statistics, reference.statistics);
  assert.deepEqual(lanes[0].session.state.resources, reference.resources);
  for (const key of resourceKeys) {
    assert.equal(lanes[0].session.state.resources[key], createStartingResources(balance)[key] +
      reference.waves.reduce((n, wave) => n - wave.accounting.spent[key] +
        wave.accounting.refunds[key] + wave.accounting.bounty[key] + wave.accounting.clear[key], 0));
  }
  assert.deepEqual(lanes[0].session.state.finalStatistics,
    { ...reference.statistics, score: lanes[0].session.state.score,
      lives: reference.lives, waveNumber: reference.waveNumber });
  assert.ok(totals.creditedMs >= totals.consumedMs);
  for (const { source, bytes } of snapshots) assert.equal(JSON.stringify(source), bytes,
    'continuation must not mutate a source snapshot');
  for (const lane of lanes) {
    const frozen = gameplay(lane.session);
    assert.equal(lane.session.clock.accumulatorMs, 0);
    assert.equal(lane.session.tick(60_000).steps, 0);
    assert.equal(lane.session.startWave().ok, false);
    assert.equal(lane.session.setWaveSpeed(1).ok, false);
    assert.deepEqual(gameplay(lane.session), frozen, 'terminal state must freeze');
  }
  equalLanes(lanes);
  if (config.policy === 'existing') {
    assert.ok(totals.health > 0 && totals.shield > 0);
    assert.ok(totals.slowHits > 0 && totals.vulnerabilityHits > 0);
    assert.ok(totals.auraShots > 0 && totals.passiveDharma > 0);
  } else assert.ok(totals.leaks > 0);
  console.log(`M4.4 ${config.difficulty}/${config.policy}: ${config.phase}, waves=${reference.waves.length}, ` +
    `commands=${lanes[0].commands.length}, checkpoints=${checkpoints.map(c => c.id).join(',')}, ` +
    `speedChanges=${totals.speedChanges}, pauses=${totals.pauses}, ` +
    `creditedMs=${totals.creditedMs}, consumedMs=${totals.consumedMs}, ` +
    `kills=${totals.kills}, leaks=${totals.leaks}, shield=${totals.shield}, ` +
    `slowHits=${totals.slowHits}, auraShots=${totals.auraShots}`);
  console.log(`M4.4 checkpoints ${config.difficulty}/${config.policy}: ${JSON.stringify(checkpoints)}`);
  return checkpoints;
}

for (const config of cases) test(`M4.4 ${config.difficulty} ${config.policy}: full clock and JSON continuation`, () => {
  const checkpoints = verifyCase(config);
  for (const row of checkpoints) {
    if (row.id.startsWith('raid')) assert.ok(row.bosses.some(b => b.type === 'raidTeam' && b.firedPhases.length));
    if (row.id.startsWith('titan')) assert.ok(row.bosses.some(b => b.type === 'megaCorpTitan' && b.shield > 0));
    if (row.id.startsWith('build')) assert.equal(row.resumePhase, PHASES.BUILDING);
    if (row.id === 'weak-3') assert.equal(row.resumePhase, PHASES.WAVE);
  }
});
