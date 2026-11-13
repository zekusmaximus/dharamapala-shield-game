// Read-only production observation. Runs fresh, earned campaigns through legal
// policy commands and the ordinary 60 Hz combat step; wrappers only observe.
import { writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { GameSession } from '../../../js/core/GameSession.js';
import { createPolicy, POLICY_DEFINITIONS } from '../../../tools/balance/policies.mjs';
import { loadBalance } from '../../../tools/sim/run.mjs';

const balance = process.argv[3] === '--old'
  ? JSON.parse(execFileSync('git', ['show','601c1ea:design/balance.json'], {encoding:'utf8'}))
  : await loadBalance();
const rows = [];
for (const difficulty of ['Easy', 'Normal', 'Hard']) {
  for (const policyName of Object.keys(POLICY_DEFINITIONS)) {
    const session = new GameSession(balance);
    session.newGame({ difficulty, seed: 1337, tutorialCompleted: true });
    const policy = createPolicy(policyName);
    const bosses = new Map();
    let wave;
    const spawn = session.spawnEnemy.bind(session);
    session.spawnEnemy = event => {
      const enemy = spawn(event);
      if (enemy?.kind === 'boss') {
        const row = { difficulty, policy: policyName, wave, type: enemy.type,
          id: enemy.id, spawnedAtMs: enemy.spawnedAtMs, health: enemy.maxHealth,
          initialShield: enemy.shield, phases: [], reinforcements: [],
          regenAmount: 0, regenTicks: 0, firstRegenAtMs: null,
          lastRegenAtMs: null, outcome: null, resolvedAtMs: null };
        bosses.set(enemy.id, row); rows.push(row);
      }
      if (enemy && event.dynamic) {
        bosses.get(event.sourceId)?.reinforcements.push({type: enemy.type,
          spawnedAtMs: enemy.spawnedAtMs});
      }
      return enemy;
    };
    const update = session.systems.enemy.update.bind(session.systems.enemy);
    session.systems.enemy.update = (s, deltaMs) => {
      const before = new Map([...s.state.enemies.values()]
        .filter(enemy => enemy.type === 'megaCorpTitan')
        .map(enemy => [enemy.id, enemy.shield]));
      const result = update(s, deltaMs);
      for (const [id, shield] of before) {
        const enemy = s.state.enemies.get(id);
        const amount = enemy ? Math.max(0, enemy.shield - shield) : 0;
        if (amount > 0) {
          const row = bosses.get(id);
          row.regenAmount += amount; row.regenTicks++;
          row.firstRegenAtMs ??= s.state.gameTimeMs;
          row.lastRegenAtMs = s.state.gameTimeMs;
        }
      }
      return result;
    };
    session.events.on('boss-phase', event => {
      const boss = session.state.enemies.get(event.enemyId);
      const emp = balance.bosses.raidTeam.abilities.emp;
      const affected = [...session.state.defenses.values()].filter(defense =>
        Math.hypot(defense.x-boss.x, defense.y-boss.y) <= emp.radius);
      bosses.get(event.enemyId).phases.push({phase: event.phase,
        atMs: session.state.gameTimeMs,
        bossHealthRatio: boss.health/boss.maxHealth,
        bossPathDistance: boss.pathDistance,
        affectedTowers: affected.length,
        affectedAttackers: affected.filter(defense => defense.type !== 'distributor').length,
        aliveEnemies: session.state.enemies.size});
    });
    for (const [event, outcome] of [['enemy-killed', 'killed'], ['enemy-leaked', 'leaked']]) {
      session.events.on(event, ({enemyId}) => {
        const row = bosses.get(enemyId);
        if (row) { row.outcome = outcome; row.resolvedAtMs = session.state.gameTimeMs; }
      });
    }
    while (session.state.phase === 'BUILDING') {
      wave = session.state.waveNumber;
      policy.build(session);
      if (!session.startWave().ok) throw new Error('Start rejected');
      let steps = 0;
      while (session.state.phase === 'WAVE' && steps++ < 120000) session.step(1000/60);
      if (session.state.phase === 'WAVE') throw new Error(`Timeout ${difficulty}/${policyName}/${wave}`);
    }
  }
}
const output = process.argv[2];
if (!output) throw new Error('Usage: node trace-bosses.mjs output.json [--old]');
await writeFile(resolve(output), JSON.stringify({balanceVersion: balance.version,
  source: 'Fresh production GameSession; default funds/lives; policy legal commands; authored waves; actual 60 Hz combat; read-only observers.',
  rows}, null, 2)+'\n');
