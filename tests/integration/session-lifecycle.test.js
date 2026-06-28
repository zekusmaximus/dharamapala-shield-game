import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession, PHASES } from '../../js/core/GameSession.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();

function createSession() {
  const session = new GameSession(balance, { tutorialCompleted: true });
  session.newGame({ tutorialCompleted: true });
  return session;
}

function releaseAndKillEverything(session) {
  session.scheduler.advance(1_000_000, session.generation, (event) =>
    session.spawnEnemy(event)
  );
  session.state.wave.spawnCursor = session.scheduler.cursor;
  for (const enemy of [...session.state.enemies.values()]) {
    session.resolveEnemy(enemy.id, 'KILLED');
  }
  session.state.projectiles.clear();
  session.systems.wave.update(session);
}

test('a new session remains in building until start wave is commanded', () => {
  const session = createSession();
  session.tick(1_000_000);
  assert.equal(session.state.phase, PHASES.BUILDING);
  assert.equal(session.state.enemies.size, 0);
});

test('raid team phases schedule deterministic minions and survive round-trip saves', () => {
  const session = createSession();
  session.state.waveNumber = 5;
  session.startWave();
  session.scheduler.advance(0, session.generation, (event) =>
    session.spawnEnemy(event)
  );
  const boss = [...session.state.enemies.values()].find(
    (enemy) => enemy.type === 'raidTeam'
  );
  boss.health = boss.maxHealth * 0.3;
  session.systems.enemy.updateBosses(session);
  assert.deepEqual(boss.firedPhases, [1, 2]);
  assert.equal(session.state.wave.scheduled, 17);

  const snapshot = session.toSnapshot();
  const restored = GameSession.fromSnapshot(balance, snapshot);
  assert.deepEqual(restored.toSnapshot().state, snapshot.state);
  assert.deepEqual(restored.toSnapshot().runtime, snapshot.runtime);
});

test('twenty waves reach victory exactly once and never schedule wave 21', () => {
  const session = createSession();
  for (let wave = 1; wave <= 20; wave += 1) {
    assert.equal(session.startWave().ok, true);
    releaseAndKillEverything(session);
    if (wave < 20) {
      assert.equal(session.state.phase, PHASES.BUILDING);
      assert.equal(session.state.waveNumber, wave + 1);
    }
  }
  assert.equal(session.state.phase, PHASES.VICTORY);
  assert.equal(session.state.waveNumber, 20);
  assert.equal(session.state.statistics.wavesCompleted, 20);
  const terminalSnapshot = session.toSnapshot();
  session.tick(1_000_000);
  assert.deepEqual(session.toSnapshot().state, terminalSnapshot.state);
  assert.equal(session.startWave().ok, false);
});

test('game over is immediate and subsequent ticks are inert', () => {
  const session = createSession();
  session.state.lives = 1;
  session.startWave();
  session.tick(20);
  const enemy = [...session.state.enemies.values()][0];
  session.resolveEnemy(enemy.id, 'LEAKED');
  assert.equal(session.state.phase, PHASES.GAME_OVER);
  assert.equal(session.state.lives, 0);
  const gameTime = session.state.gameTimeMs;
  session.tick(100_000);
  assert.equal(session.state.gameTimeMs, gameTime);
});
