import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession } from '../../js/core/GameSession.js';
import { PHASES } from '../../js/core/commands.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();

test('a lethal hit is fully resolved before an enemy-hit listener can enter results', () => {
  const session = new GameSession(balance, { tutorialCompleted: true });
  session.newGame();
  session.startWave();
  session.step(1000 / 60); // The first enemy comes from the actual schedule.
  const enemy = [...session.state.enemies.values()][0];
  assert.ok(enemy);
  let captured;
  session.events.on('enemy-hit', ({ enemyId }) => {
    assert.equal(enemyId, enemy.id);
    assert.equal(session.state.enemies.has(enemy.id), false);
    assert.equal(session.state.statistics.kills, 1);
    session.state.lives = 0;
    assert.equal(session.enterTerminal(PHASES.GAME_OVER), true);
    captured = session.toSnapshot();
    const restored = GameSession.fromSnapshot(balance, captured);
    assert.deepEqual(restored.state.finalStatistics, session.state.finalStatistics);
  });

  session.systems.combat.applyHit(session, {
    damage: 1000,
    damageType: 'physical',
    sourceId: 'untracked',
    slowDurationMs: 0,
    vulnerabilityDurationMs: 0,
    critical: false
  }, enemy, 1);

  assert.ok(captured, 'listener observed the completed hit');
  assert.equal(session.state.phase, PHASES.GAME_OVER);
  assert.deepEqual(session.toSnapshot().state, captured.state);
  assert.equal(session.state.statistics.kills, 1);
});
