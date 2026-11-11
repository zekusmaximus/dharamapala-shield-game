// Read-only review diagnostics. These observations are not pass/fail tests or
// balance targets. Fixes should change the observations, not preserve defects.
import { GameSession } from '../../js/core/GameSession.js';
import { PATH_METRICS } from '../../js/core/world.js';
import { getAuraMultiplier } from '../../js/core/rules/towers.js';
import { canAfford } from '../../js/core/rules/economy.js';
import {
  DeterministicPlayerPolicy,
  loadBalance,
  runWave
} from '../sim/run.mjs';

const balance = await loadBalance();
const seed = 1337;

function newSession(difficulty = 'Normal', waveNumber = 1) {
  const session = new GameSession(balance, { difficulty, seed, tutorialCompleted: true });
  session.newGame({ difficulty, seed, tutorialCompleted: true });
  session.state.waveNumber = waveNumber;
  return session;
}

function campaign(difficulty, strategy) {
  const session = newSession(difficulty);
  const policy = new DeterministicPlayerPolicy();
  const buy = policy.buy.bind(policy);
  if (strategy === 'no-support') {
    policy.buy = (active, type) => type !== 'distributor' && buy(active, type);
  } else if (strategy === 'firewall-only') {
    policy.buy = (active, type) => type === 'firewall' && buy(active, type);
  }
  let steps = 0;
  while (session.state.phase === 'BUILDING') {
    if (strategy === 'opening-only') {
      if (session.state.waveNumber === 1) {
        while (canAfford(session.state.resources, balance.towers.firewall.cost)) {
          if (!buy(session, 'firewall')) break;
        }
      }
    } else {
      policy.build(session);
    }
    steps += runWave(session);
  }
  return {
    difficulty,
    strategy,
    phase: session.state.phase,
    wave: session.state.waveNumber,
    lives: session.state.lives,
    statistics: { ...session.state.statistics },
    resources: { ...session.state.resources },
    towers: session.state.defenses.size,
    simulatedSeconds: Number((steps / 60).toFixed(3))
  };
}

function invalidSave(name, mutate) {
  const session = newSession();
  session.placeDefense('firewall', { x: 210, y: 210 });
  session.startWave();
  const snapshot = JSON.parse(JSON.stringify(session.toSnapshot()));
  mutate(snapshot);
  try {
    const restored = GameSession.fromSnapshot(balance, snapshot);
    let nextTickError = null;
    try {
      restored.tick(20);
    } catch (error) {
      nextTickError = error.message;
    }
    return { name, accepted: true, nextTickError };
  } catch (error) {
    return { name, accepted: false, error: error.message };
  }
}

function mechanics() {
  const terminal = newSession();
  terminal.state.lives = 1;
  terminal.startWave();
  for (let index = 0; index < 2; index += 1) {
    const enemy = terminal.spawnEnemy({ enemyType: 'scriptKiddie', hpMultiplier: 1 });
    enemy.pathDistance = PATH_METRICS.totalLength - 0.01;
  }
  terminal.step(1000 / 60);

  const shield = newSession('Normal', 15);
  shield.startWave();
  const titan = shield.spawnEnemy({ enemyType: 'megaCorpTitan', hpMultiplier: 1 });
  titan.shield = 0;
  titan.shieldCooldownUntilMs = 1000;
  shield.state.gameTimeMs = 2000;
  shield.systems.combat.applyHit(shield, {
    sourceId: 'review-source', damage: 40, damageType: 'physical',
    slowDurationMs: 0, vulnerabilityDurationMs: 0
  }, titan, 1);
  shield.systems.enemy.update(shield, 1000);

  const support = newSession();
  support.state.resources = { dharma: 1000, bandwidth: 1000, anonymity: 1000 };
  support.placeDefense('firewall', { x: 210, y: 210 });
  support.placeDefense('distributor', { x: 270, y: 210 });
  const towers = [...support.state.defenses.values()];
  towers[1].disabledUntilMs = 10_000;

  const saved = newSession('Normal', 5);
  saved.startWave();
  saved.spawnEnemy({ enemyType: 'raidTeam', hpMultiplier: 1 });
  const snapshot = saved.toSnapshot();
  const restored = GameSession.fromSnapshot(balance, snapshot);
  const restoredBoss = [...restored.state.enemies.values()][0];
  restoredBoss.health = restoredBoss.maxHealth * 0.3;
  restored.systems.enemy.updateBosses(restored);

  return {
    terminalTick: {
      phase: terminal.state.phase,
      liveLeaks: terminal.state.statistics.leaks,
      finalLeaks: terminal.state.finalStatistics?.leaks
    },
    shieldAfterRecentHealthHit: {
      nowMs: shield.state.gameTimeMs,
      cooldownUntilMs: titan.shieldCooldownUntilMs,
      shield: titan.shield
    },
    disabledSupportMultiplier: getAuraMultiplier(balance, towers[0], towers),
    inputSnapshotBossPhasesAfterRestoredSessionAdvances: snapshot.state.enemies[0].firedPhases
  };
}

const campaigns = [];
for (const difficulty of ['Easy', 'Normal', 'Hard']) {
  for (const strategy of ['reference', 'no-support', 'firewall-only', 'opening-only']) {
    campaigns.push(campaign(difficulty, strategy));
  }
}

console.log(JSON.stringify({
  balanceVersion: balance.version,
  seed,
  note: 'Scripted policies use coverage-ranked positions. Results are not human win rates.',
  campaigns,
  invalidSaves: [
    invalidSave('missing-bandwidth', (snapshot) => { delete snapshot.state.resources.bandwidth; }),
    invalidSave('negative-lives', (snapshot) => { snapshot.state.lives = -4; }),
    invalidSave('invalid-wave', (snapshot) => { snapshot.state.waveNumber = 999; }),
    invalidSave('zero-tower-level', (snapshot) => { snapshot.state.defenses[0].level = 0; }),
    invalidSave('unknown-scheduled-enemy', (snapshot) => {
      snapshot.runtime.scheduler.events[0].enemyType = 'bogus';
    })
  ],
  mechanics: mechanics()
}, null, 2));
