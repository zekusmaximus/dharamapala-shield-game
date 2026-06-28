import { getTowerStats } from '../core/rules/towers.js';
import {
  ENEMY_PATH,
  TUTORIAL_BUILD_POSITION,
  WORLD,
  isInsideWorld,
  isNearPath,
  snapToBuildGrid
} from '../core/world.js';

export class CanvasRenderer {
  constructor(canvas, camera, balance, spriteAssets = null) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.camera = camera;
    this.balance = balance;
    this.spriteAssets = spriteAssets;
    this.placementPosition = null;
    this.tutorialBuildHighlight = false;
    this.camera.resize();
  }

  render(session) {
    const context = this.context;
    this.camera.prepareScreen(context);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.clearRect(0, 0, this.camera.cssWidth, this.camera.cssHeight);
    context.fillStyle = '#070b18';
    context.fillRect(0, 0, this.camera.cssWidth, this.camera.cssHeight);

    this.camera.prepareWorld(context);
    context.fillStyle = '#11182b';
    context.fillRect(0, 0, WORLD.width, WORLD.height);
    this.drawGrid(context);
    this.drawPath(context);
    this.drawEndpoints(context);
    this.drawDefenses(context, session);
    this.drawEnemies(context, session);
    this.drawProjectiles(context, session);
    this.drawPlacement(context, session);
  }

  drawGrid(context) {
    context.strokeStyle = 'rgba(114, 219, 255, 0.08)';
    context.lineWidth = 1;
    for (let x = 0; x <= WORLD.width; x += WORLD.gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, WORLD.height);
      context.stroke();
    }
    for (let y = 0; y <= WORLD.height; y += WORLD.gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(WORLD.width, y);
      context.stroke();
    }
  }

  drawPath(context) {
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#24354d';
    context.lineWidth = 66;
    context.beginPath();
    context.moveTo(ENEMY_PATH[0].x, ENEMY_PATH[0].y);
    for (const point of ENEMY_PATH.slice(1)) {
      context.lineTo(point.x, point.y);
    }
    context.stroke();
    context.strokeStyle = 'rgba(83, 216, 251, 0.32)';
    context.lineWidth = 3;
    context.setLineDash([10, 14]);
    context.stroke();
    context.setLineDash([]);
  }

  drawEndpoints(context) {
    const start = ENEMY_PATH[0];
    const end = ENEMY_PATH.at(-1);
    context.fillStyle = '#e94560';
    context.beginPath();
    context.arc(start.x + 22, start.y, 18, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#53d8fb';
    context.beginPath();
    context.arc(end.x - 22, end.y, 22, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = '#f5f8ff';
    context.lineWidth = 3;
    context.stroke();
  }

  drawDefenses(context, session) {
    for (const defense of session.state.defenses.values()) {
      const definition = this.balance.towers[defense.type];
      const selected = session.state.selectedDefenseId === defense.id;
      if (
        selected ||
        (session.state.settings.showRanges && defense.type === 'distributor')
      ) {
        const stats = getTowerStats(this.balance, defense.type, defense.level);
        context.fillStyle =
          defense.type === 'distributor'
            ? 'rgba(16, 185, 129, 0.09)'
            : 'rgba(83, 216, 251, 0.06)';
        context.strokeStyle =
          defense.type === 'distributor'
            ? 'rgba(16, 185, 129, 0.55)'
            : 'rgba(83, 216, 251, 0.45)';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(defense.x, defense.y, stats.range, 0, Math.PI * 2);
        context.fill();
        context.stroke();
      }
      const sprite = this.spriteAssets?.get(defense.type);
      if (sprite) {
        const indicatorRadius = Math.max(
          defense.radius + 4,
          Math.min(sprite.definition.display.width, sprite.definition.display.height) /
            2 -
            2
        );
        context.strokeStyle = selected ? '#ffffff' : 'rgba(9, 13, 24, 0.9)';
        context.lineWidth = selected ? 4 : 2;
        context.beginPath();
        context.arc(defense.x, defense.y, indicatorRadius, 0, Math.PI * 2);
        context.stroke();
        const drawn = this.drawEntitySprite(context, sprite, defense.x, defense.y);
        if (!drawn) {
          this.drawDefenseFallback(context, defense, definition, selected);
        }
      } else {
        this.drawDefenseFallback(context, defense, definition, selected);
      }
      if (defense.disabledUntilMs > session.state.gameTimeMs) {
        context.strokeStyle = '#ffe66d';
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(defense.x - 20, defense.y - 20);
        context.lineTo(defense.x + 20, defense.y + 20);
        context.stroke();
      }
    }
  }

  drawEnemies(context, session) {
    for (const enemy of session.state.enemies.values()) {
      const definition =
        this.balance.enemies[enemy.type] || this.balance.bosses[enemy.type];
      if (enemy.shield > 0) {
        context.strokeStyle = 'rgba(83, 216, 251, 0.8)';
        context.lineWidth = 4;
        context.beginPath();
        context.arc(enemy.x, enemy.y, enemy.radius + 7, 0, Math.PI * 2);
        context.stroke();
      }
      const sprite = this.spriteAssets?.get(enemy.type);
      if (sprite) {
        const drawn = this.drawEntitySprite(context, sprite, enemy.x, enemy.y);
        if (!drawn) {
          this.drawEnemyFallback(context, enemy, definition);
        } else if (enemy.kind === 'boss') {
          context.strokeStyle = '#ffe66d';
          context.lineWidth = 4;
          context.beginPath();
          context.arc(
            enemy.x,
            enemy.y,
            Math.max(
              enemy.radius,
              Math.min(
                sprite.definition.display.width,
                sprite.definition.display.height
              ) /
                2 +
                2
            ),
            0,
            Math.PI * 2
          );
          context.stroke();
        }
      } else {
        this.drawEnemyFallback(context, enemy, definition);
      }

      const width = Math.max(26, enemy.radius * 2.2);
      const spriteTop = sprite
        ? enemy.y -
          sprite.definition.display.height * sprite.definition.anchor.y
        : Infinity;
      const barY = Math.min(
        enemy.y - enemy.radius - 11,
        spriteTop - 6
      );
      context.fillStyle = '#090d18';
      context.fillRect(enemy.x - width / 2, barY, width, 5);
      context.fillStyle = enemy.health / enemy.maxHealth > 0.35 ? '#53e6a8' : '#ff6b6b';
      context.fillRect(
        enemy.x - width / 2,
        barY,
        width * Math.max(0, enemy.health / enemy.maxHealth),
        5
      );
    }
  }

  drawProjectiles(context, session) {
    for (const projectile of session.state.projectiles.values()) {
      context.fillStyle =
        projectile.sourceType === 'encryption' ? '#53d8fb' : '#ff8b94';
      context.beginPath();
      context.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  drawPlacement(context, session) {
    if (this.tutorialBuildHighlight && session.state.defenses.size === 0) {
      context.strokeStyle = '#ffe66d';
      context.lineWidth = 5;
      context.setLineDash([8, 6]);
      context.strokeRect(
        TUTORIAL_BUILD_POSITION.x - 27,
        TUTORIAL_BUILD_POSITION.y - 27,
        54,
        54
      );
      context.setLineDash([]);
    }
    if (!this.placementPosition || session.state.phase !== 'BUILDING') {
      return;
    }
    const position = snapToBuildGrid(this.placementPosition);
    const occupied = [...session.state.defenses.values()].some(
      (defense) => Math.hypot(defense.x - position.x, defense.y - position.y) < 45
    );
    const valid = isInsideWorld(position) && !isNearPath(position) && !occupied;
    const stats = getTowerStats(
      this.balance,
      session.state.selectedTowerType,
      1
    );
    context.fillStyle = valid
      ? 'rgba(83, 216, 251, 0.22)'
      : 'rgba(255, 107, 107, 0.22)';
    context.strokeStyle = valid ? '#53d8fb' : '#ff6b6b';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(position.x, position.y, 22, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    const sprite = this.spriteAssets?.get(session.state.selectedTowerType);
    if (sprite) {
      this.drawEntitySprite(context, sprite, position.x, position.y, 0.62);
    }
    context.strokeStyle = valid
      ? 'rgba(83, 216, 251, 0.35)'
      : 'rgba(255, 107, 107, 0.25)';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(position.x, position.y, stats.range, 0, Math.PI * 2);
    context.stroke();
  }

  drawEntitySprite(context, sprite, x, y, alpha = 1) {
    if (!sprite?.image || !sprite.definition) {
      return false;
    }
    const { source, display, anchor } = sprite.definition;
    const left = x - display.width * anchor.x;
    const top = y - display.height * anchor.y;
    context.save();
    context.globalAlpha *= alpha;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    try {
      context.drawImage(
        sprite.image,
        source.x,
        source.y,
        source.width,
        source.height,
        left,
        top,
        display.width,
        display.height
      );
    } catch {
      context.restore();
      return false;
    }
    context.restore();
    return true;
  }

  drawDefenseFallback(context, defense, definition, selected) {
    context.fillStyle = definition?.color || '#53d8fb';
    context.strokeStyle = selected ? '#ffffff' : '#090d18';
    context.lineWidth = selected ? 4 : 2;
    context.beginPath();
    if (defense.type === 'firewall') {
      context.rect(defense.x - 18, defense.y - 18, 36, 36);
    } else if (defense.type === 'encryption') {
      this.polygon(context, defense.x, defense.y, 20, 6);
    } else {
      this.polygon(context, defense.x, defense.y, 21, 3);
    }
    context.fill();
    context.stroke();
  }

  drawEnemyFallback(context, enemy, definition) {
    context.fillStyle = definition?.color || '#ff6b6b';
    context.strokeStyle = enemy.kind === 'boss' ? '#ffe66d' : '#080b12';
    context.lineWidth = enemy.kind === 'boss' ? 4 : 2;
    context.beginPath();
    context.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  polygon(context, x, y, radius, sides) {
    context.moveTo(x, y - radius);
    for (let index = 1; index <= sides; index += 1) {
      const angle = -Math.PI / 2 + (index * Math.PI * 2) / sides;
      context.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    }
    context.closePath();
  }
}
