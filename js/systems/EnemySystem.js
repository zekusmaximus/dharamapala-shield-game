import { PATH_METRICS, pointAtPathDistance } from '../core/world.js';

export class EnemySystem {
  update(session, deltaMs) {
    const nowMs = session.state.gameTimeMs;
    for (const enemy of [...session.state.enemies.values()]) {
      if (enemy.resolution) {
        continue;
      }
      if (enemy.slowUntilMs <= nowMs) {
        enemy.slowPct = 0;
      }
      if (enemy.vulnerabilityUntilMs <= nowMs) {
        enemy.vulnerabilityPct = 0;
      }
      if (
        enemy.type === 'megaCorpTitan' &&
        enemy.shield < enemy.shieldMax &&
        nowMs >= enemy.shieldCooldownUntilMs
      ) {
        enemy.shield = Math.min(
          enemy.shieldMax,
          enemy.shield + enemy.shieldRegenPerSec * (deltaMs / 1000)
        );
      }

      const speedMultiplier = 1 - Math.max(0, Math.min(0.8, enemy.slowPct));
      enemy.pathDistance += enemy.speed * speedMultiplier * (deltaMs / 1000);
      const position = pointAtPathDistance(enemy.pathDistance);
      enemy.x = position.x;
      enemy.y = position.y;

      if (enemy.pathDistance >= PATH_METRICS.totalLength) {
        session.resolveEnemy(enemy.id, 'LEAKED');
      }
    }
  }

  updateBosses(session) {
    const nowMs = session.state.gameTimeMs;
    for (const enemy of session.state.enemies.values()) {
      if (enemy.kind !== 'boss' || enemy.resolution) {
        continue;
      }
      if (enemy.type === 'raidTeam') {
        const ratio = enemy.health / enemy.maxHealth;
        const thresholds = [0.66, 0.33];
        thresholds.forEach((threshold, index) => {
          const phase = index + 1;
          if (ratio <= threshold && !enemy.firedPhases.includes(phase)) {
            enemy.firedPhases.push(phase);
            enemy.phase = phase;
            session.registerBossMinions(enemy, phase);
            for (const defense of session.state.defenses.values()) {
              if (Math.hypot(defense.x - enemy.x, defense.y - enemy.y) <= 260) {
                defense.disabledUntilMs = Math.max(
                  defense.disabledUntilMs,
                  nowMs + 1500
                );
              }
            }
            session.events.emit('boss-phase', {
              enemyId: enemy.id,
              phase,
              ability: 'EMP and reinforcements'
            });
          }
        });
      }
    }
  }
}
