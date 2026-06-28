import {
  applyVulnerability,
  circlesIntersect,
  getEffectiveDamage
} from '../core/rules/combat.js';
import { getEnemyDefinition } from '../entities/createEnemy.js';

export class CombatSystem {
  constructor(cellSize = 96) {
    this.cellSize = cellSize;
  }

  update(session, deltaMs) {
    const grid = this.buildGrid(session.state.enemies);
    for (const projectile of [...session.state.projectiles.values()]) {
      if (projectile.expiresAtMs <= session.state.gameTimeMs) {
        session.state.projectiles.delete(projectile.id);
        continue;
      }
      const target = session.state.enemies.get(projectile.targetId);
      if (!target || target.resolution) {
        session.state.projectiles.delete(projectile.id);
        continue;
      }

      const dx = target.x - projectile.x;
      const dy = target.y - projectile.y;
      const distance = Math.hypot(dx, dy);
      const travel = projectile.speed * (deltaMs / 1000) * 10;
      if (distance > 0) {
        const scale = Math.min(1, travel / distance);
        projectile.x += dx * scale;
        projectile.y += dy * scale;
      }

      const candidates = this.nearby(grid, projectile);
      const hit = candidates.find(
        (enemy) =>
          !enemy.resolution &&
          !projectile.hitIds.includes(enemy.id) &&
          circlesIntersect(projectile, enemy)
      );
      if (!hit) {
        continue;
      }

      this.resolveImpact(session, projectile, hit);
      if (!projectile.piercing) {
        session.state.projectiles.delete(projectile.id);
      }
    }
  }

  buildGrid(enemies) {
    const grid = new Map();
    for (const enemy of enemies.values()) {
      if (enemy.resolution) {
        continue;
      }
      const key = this.key(enemy.x, enemy.y);
      const bucket = grid.get(key) || [];
      bucket.push(enemy);
      grid.set(key, bucket);
    }
    return grid;
  }

  nearby(grid, projectile) {
    const cellX = Math.floor(projectile.x / this.cellSize);
    const cellY = Math.floor(projectile.y / this.cellSize);
    const results = [];
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        results.push(
          ...(grid.get(`${cellX + offsetX}:${cellY + offsetY}`) || [])
        );
      }
    }
    return results;
  }

  key(x, y) {
    return `${Math.floor(x / this.cellSize)}:${Math.floor(y / this.cellSize)}`;
  }

  resolveImpact(session, projectile, primaryTarget) {
    const targets =
      projectile.aoeRadius > 0
        ? [...session.state.enemies.values()].filter(
            (enemy) =>
              !enemy.resolution &&
              Math.hypot(enemy.x - primaryTarget.x, enemy.y - primaryTarget.y) <=
                projectile.aoeRadius
          )
        : [primaryTarget];

    for (const enemy of targets) {
      if (projectile.hitIds.includes(enemy.id)) {
        continue;
      }
      this.applyHit(session, projectile, enemy, enemy.id === primaryTarget.id ? 1 : 0.7);
      projectile.hitIds.push(enemy.id);
    }

    if (projectile.chainTargets > 0) {
      const chained = [...session.state.enemies.values()]
        .filter(
          (enemy) =>
            !enemy.resolution &&
            enemy.id !== primaryTarget.id &&
            Math.hypot(enemy.x - primaryTarget.x, enemy.y - primaryTarget.y) <= 120
        )
        .sort((a, b) => b.pathDistance - a.pathDistance)
        .slice(0, projectile.chainTargets);
      for (const enemy of chained) {
        if (projectile.hitIds.includes(enemy.id)) {
          continue;
        }
        this.applyHit(session, projectile, enemy, 0.6);
        projectile.hitIds.push(enemy.id);
      }
    }
  }

  applyHit(session, projectile, enemy, damageMultiplier) {
    if (enemy.resolution) {
      return;
    }
    const definition = getEnemyDefinition(session.balance, enemy.type);
    const vulnerableDamage = applyVulnerability(
      projectile.damage * damageMultiplier,
      enemy.vulnerabilityPct
    );
    let damage = getEffectiveDamage(
      vulnerableDamage,
      definition,
      projectile.damageType
    );
    if (enemy.shield > 0) {
      const absorbed = Math.min(enemy.shield, damage);
      enemy.shield -= absorbed;
      damage -= absorbed;
      enemy.shieldCooldownUntilMs = session.state.gameTimeMs + 3000;
    }
    enemy.health -= damage;
    const source = session.state.defenses.get(projectile.sourceId);
    if (source) {
      source.totalDamage += damage;
    }

    if (projectile.slowDurationMs > 0) {
      enemy.slowPct = Math.max(enemy.slowPct, projectile.slowPct);
      enemy.slowUntilMs = Math.max(
        enemy.slowUntilMs,
        session.state.gameTimeMs + projectile.slowDurationMs
      );
    }
    if (projectile.vulnerabilityDurationMs > 0) {
      enemy.vulnerabilityPct = Math.max(
        enemy.vulnerabilityPct,
        projectile.vulnerabilityPct
      );
      enemy.vulnerabilityUntilMs = Math.max(
        enemy.vulnerabilityUntilMs,
        session.state.gameTimeMs + projectile.vulnerabilityDurationMs
      );
    }
    session.events.emit('enemy-hit', {
      enemyId: enemy.id,
      damage,
      critical: projectile.critical
    });
    if (enemy.health <= 0) {
      if (source) {
        source.kills += 1;
      }
      session.resolveEnemy(enemy.id, 'KILLED');
    }
  }
}
