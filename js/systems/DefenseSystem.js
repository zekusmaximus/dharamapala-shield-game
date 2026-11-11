import { towerEntry } from '../core/rules/reports.js';
import { createProjectile } from '../entities/createProjectile.js';
import { getAuraMultiplier, getTowerStats } from '../core/rules/towers.js';
import { rollDamage } from '../core/rules/combat.js';
import { PHASES } from '../core/commands.js';

export class DefenseSystem {
  update(session, deltaMs) {
    const defenses = [...session.state.defenses.values()];
    const nowMs = session.state.gameTimeMs;

    for (const defense of defenses) {
      if (session.state.phase !== PHASES.WAVE) {
        return;
      }
      if (defense.type === 'distributor' || defense.disabledUntilMs > nowMs) {
        continue;
      }
      defense.cooldownMs -= deltaMs;
      if (defense.cooldownMs > 0) {
        continue;
      }

      const stats = getTowerStats(session.balance, defense.type, defense.level);
      const target = this.findTarget(session, defense, stats.range);
      if (!target) {
        defense.cooldownMs = Math.max(0, defense.cooldownMs);
        continue;
      }

      const rolled = rollDamage(stats, session.random.next());
      const projectile = createProjectile({
        id: session.ids.next('projectile'),
        source: defense,
        targetId: target.id,
        stats,
        damage: rolled.amount,
        critical: rolled.critical,
        nowMs
      });
      session.state.projectiles.set(projectile.id, projectile);
      const auraMultiplier = getAuraMultiplier(
        session.balance,
        defense,
        defenses,
        nowMs
      );
      towerEntry(session, defense).shots += 1;
      if (auraMultiplier > 1) {
        for (const support of defenses) {
          if (support.type === 'distributor' && support.disabledUntilMs <= nowMs &&
            Math.hypot(support.x - defense.x, support.y - defense.y) <= getTowerStats(session.balance, support.type, support.level).range) {
            towerEntry(session, support).auraShots += 1;
          }
        }
      }
      defense.cooldownMs += stats.cooldownMs / auraMultiplier;
      session.events.emit('projectile-fired', {
        defenseId: defense.id,
        targetId: target.id
      });
    }
  }

  findTarget(session, defense, range) {
    let selected = null;
    for (const enemy of session.state.enemies.values()) {
      if (enemy.resolution) {
        continue;
      }
      if (Math.hypot(enemy.x - defense.x, enemy.y - defense.y) > range) {
        continue;
      }
      if (!selected || enemy.pathDistance > selected.pathDistance) {
        selected = enemy;
      }
    }
    return selected;
  }
}
