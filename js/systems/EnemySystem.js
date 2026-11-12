import { sampleCoverage } from '../core/rules/reports.js';
import { PATH_METRICS, pointAtPathDistance } from '../core/world.js';
import { PHASES } from '../core/commands.js';

export class EnemySystem {
  update(session, deltaMs) {
    if (session.state.phase !== PHASES.WAVE) return;
    const nowMs = session.state.gameTimeMs;
    for (const enemy of [...session.state.enemies.values()]) {
      if (session.state.phase !== PHASES.WAVE) return;
      if (enemy.resolution) {
        continue;
      }
      if (enemy.slowUntilMs <= nowMs) {
        enemy.slowPct = 0;
      }
      if (enemy.vulnerabilityUntilMs <= nowMs) {
        enemy.vulnerabilityPct = 0;
      }
      if (enemy.type === 'megaCorpTitan' && enemy.shield < enemy.shieldMax) {
        const recoveryMs = Math.max(
          0,
          Math.min(deltaMs, nowMs - enemy.shieldCooldownUntilMs)
        );
        enemy.shield = Math.min(
          enemy.shieldMax,
          enemy.shield + enemy.shieldRegenPerSec * (recoveryMs / 1000)
        );
      }

      sampleCoverage(session, enemy);
      const speedMultiplier = 1 - Math.max(0, Math.min(session.balance.combat.status.slowSpeedCap, enemy.slowPct));
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
    if (session.state.phase !== PHASES.WAVE) return;
    const nowMs = session.state.gameTimeMs;
    for (const enemy of session.state.enemies.values()) {
      if (session.state.phase !== PHASES.WAVE) return;
      if (enemy.kind !== 'boss' || enemy.resolution) {
        continue;
      }
      if (enemy.type === 'raidTeam') {
        const ratio = enemy.health / enemy.maxHealth;
        const { emp } = session.balance.bosses.raidTeam.abilities;
        const thresholds = emp.thresholds;
        thresholds.forEach((threshold, index) => {
          if (session.state.phase !== PHASES.WAVE) return;
          const phase = index + 1;
          if (ratio <= threshold && !enemy.firedPhases.includes(phase)) {
            enemy.firedPhases.push(phase);
            enemy.phase = phase;
            session.registerBossMinions(enemy, phase);
            for (const defense of session.state.defenses.values()) {
              if (Math.hypot(defense.x - enemy.x, defense.y - enemy.y) <= emp.radius) {
                defense.disabledUntilMs = Math.max(
                  defense.disabledUntilMs,
                  nowMs + emp.durationMs
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
