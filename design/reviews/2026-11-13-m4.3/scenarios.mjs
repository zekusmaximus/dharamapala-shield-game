// Earned M4.3 preparation and recovery probes. Every purchase and fight is production.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GameSession } from '../../../js/core/GameSession.js';
import { responseForks } from '../../../tools/balance/counterplay.mjs';
import { createPolicy } from '../../../tools/balance/policies.mjs';
import { buildPositions, loadBalance } from '../../../tools/sim/run.mjs';

const positions = buildPositions();
const resources = s => ({ ...s.state.resources });
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const leakTypes = report => report.leaks.map(({ type, damage }) => ({ type, damage }));
function fight(session) {
  assert.equal(session.startWave().ok, true);
  let steps = 0;
  while (session.state.phase === 'WAVE' && steps < 120000) {
    session.step(1000 / 60);
    steps++;
  }
  assert.notEqual(session.state.phase, 'WAVE', 'production combat must resolve');
  return steps;
}
function activity(report) {
  const row = { health: 0, shield: 0, shots: 0, slowHits: 0,
    vulnerabilityHits: 0, auraShots: 0, passiveDharma: report.passiveDharma };
  for (const tower of Object.values(report.towers)) for (const key of
    ['health', 'shield', 'shots', 'slowHits', 'vulnerabilityHits', 'auraShots']) row[key] += tower[key];
  return row;
}

function earnedRecovery(balance, difficulty, response) {
  const session = new GameSession(balance);
  assert.equal(session.newGame({ difficulty, seed: 1337, tutorialCompleted: true }).ok, true);
  assert.equal(session.state.lives, balance.economy.initialLives);
  const firstFunds = resources(session);
  const commands = [], bosses = [], bossById = new Map();
  session.events.on('enemy-spawned', ({ enemyId }) => {
    const enemy = session.state.enemies.get(enemyId);
    if (enemy.kind !== 'boss') return;
    const row = { wave: session.state.waveNumber, type: enemy.type, outcome: 'unresolved', phases: [] };
    bosses.push(row); bossById.set(enemyId, row);
  });
  session.events.on('boss-phase', ({ enemyId, phase }) => bossById.get(enemyId)?.phases.push(phase));
  for (const [event, outcome] of [['enemy-killed', 'killed'], ['enemy-leaked', 'leaked']])
    session.events.on(event, ({ enemyId }) => {
      const row = bossById.get(enemyId);
      if (row) row.outcome = outcome;
    });
  for (const name of ['placeDefense', 'upgradeDefense', 'sellDefense']) {
    const original = session[name].bind(session);
    session[name] = (...args) => {
      const result = original(...args);
      if (result.ok) commands.push({ wave: session.state.waveNumber, name, args });
      return result;
    };
  }
  const policy = createPolicy('existing');
  const waves = [];
  while (session.state.phase === 'BUILDING') {
    const wave = session.state.waveNumber;
    const before = resources(session), livesBefore = session.state.lives;
    if (wave === 1) {
      for (const type of ['firewall', 'firewall', 'encryption']) {
        const position = positions.find(p => ![...session.state.defenses.values()]
          .some(t => Math.hypot(t.x - p.x, t.y - p.y) < 45));
        assert.ok(position && session.placeDefense(type, position).ok);
      }
    } else if (wave === 3 && response === 'central-expansion') {
      for (let i = 0; i < 3; i++) {
        const position = positions.find(p => ![...session.state.defenses.values()]
          .some(t => Math.hypot(t.x - p.x, t.y - p.y) < 45));
        assert.ok(position && session.placeDefense('firewall', position).ok);
      }
    } else if (wave >= 4) policy.build(session);
    const atStart = resources(session), start = session.state.gameTimeMs;
    const steps = fight(session);
    const report = structuredClone(session.state.reports.pending.at(-1));
    assert.equal(report.waveNumber, wave);
    waves.push({ wave, steps, durationMs: session.state.gameTimeMs - start,
      livesBefore, livesAfter: session.state.lives, before, atStart,
      after: resources(session), leaks: leakTypes(report),
      spent: report.spent, bounty: report.bounty, clear: report.clear,
      activity: activity(report) });
  }
  return { difficulty, response, firstFunds, commands, phase: session.state.phase,
    finishingWave: session.state.waveNumber, lives: session.state.lives,
    resources: resources(session), bosses, waves };
}

async function build(balance) {
  const wave3 = [], recovery = [], repeats = [];
  for (const difficulty of ['Easy', 'Normal', 'Hard']) {
    const first = responseForks(balance, difficulty);
    const repeat = responseForks(balance, difficulty);
    assert.deepEqual(first, repeat);
    repeats.push({ kind: 'wave3', difficulty, first: hash(first), second: hash(repeat) });
    for (const response of ['save', 'central-expansion', 'firewall2', 'focus3',
      'coverage3', 'encryption2']) {
      const row = first.find(item => item.response === response);
      assert.ok(row?.available);
      wave3.push({ difficulty, response, before: row.before, cost: row.cost,
        start: row.start, livesAfter: row.lives, leaks: leakTypes(row.report),
        after: row.after, durationMs: row.durationMs,
        agents: row.agents.map(e => ({ outcome: e.outcome, phaseAtResolution: e.phaseAtResolution })),
        activity: activity(row.report) });
    }
    for (const response of ['save', 'central-expansion']) {
      const run = earnedRecovery(balance, difficulty, response);
      const again = earnedRecovery(balance, difficulty, response);
      assert.deepEqual(run, again);
      repeats.push({ kind: 'recovery', difficulty, response,
        first: hash(run), second: hash(again) });
      recovery.push(run);
    }
  }
  return { balanceVersion: balance.version,
    setup: 'Wave 3: common default-funds opening and legal wave 1-2 combat, then legal wave-3 responses. Recovery: same opening, save or spend 90 Dharma on three central Firewalls at wave 3, then the existing legal purchase policy from wave 4 through natural terminal. All authored waves start deliberately and fight to resolution; no grants, skips, direct damage, synthetic clears or entity edits. Exact repeats are reproducibility checks, not independent players.',
    wave3, recovery, repeats };
}

const args = process.argv.slice(2);
assert.ok(args.length === 2 && ['--old', '--current'].includes(args[0]),
  'Usage: scenarios.mjs --old|--current output.json');
const balance = args[0] === '--old'
  ? JSON.parse(await readFile(new URL('baseline-1.6.0.json', import.meta.url)))
  : await loadBalance();
const result = await build(balance);
assert.ok(result.repeats.every(row => row.first === row.second));
await writeFile(resolve(args[1]), JSON.stringify(result, null, 2) + '\n');
if (resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  console.log(`Recorded ${result.wave3.length} earned forks and ${result.recovery.length} full recoveries for ${balance.version}.`);
