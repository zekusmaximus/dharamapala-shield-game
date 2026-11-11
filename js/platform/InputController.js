import { PHASES } from '../core/commands.js';
import { TUTORIAL_BUILD_POSITION, WORLD } from '../core/world.js';

export class InputController {
  constructor({ canvas, camera, renderer, getSession, announce, inspectEnemy }) {
    this.canvas = canvas;
    this.camera = camera;
    this.renderer = renderer;
    this.getSession = getSession;
    this.announce = announce;
    this.inspectEnemy = inspectEnemy;
    this.keyboardCursor = { ...TUTORIAL_BUILD_POSITION };
    this.bind();
  }

  bind() {
    this.canvas.addEventListener('focus', () => {
      if (this.getSession().state.phase === PHASES.WAVE) {
        this.renderer.inspectionPosition = { ...this.keyboardCursor };
      }
    });
    this.canvas.addEventListener('blur', () => {
      this.renderer.inspectionPosition = null;
    });
    this.canvas.addEventListener('pointermove', (event) => {
      this.renderer.placementPosition = this.camera.screenToWorld(
        event.clientX,
        event.clientY
      );
    });
    this.canvas.addEventListener('pointerleave', () => {
      this.renderer.placementPosition = null;
    });
    this.canvas.addEventListener('click', (event) => {
      this.renderer.inspectionPosition = null;
      this.activate(
        this.camera.screenToWorld(event.clientX, event.clientY)
      );
    });
    this.canvas.addEventListener('keydown', (event) => {
      const movement = {
        ArrowLeft: [-WORLD.gridSize, 0],
        ArrowRight: [WORLD.gridSize, 0],
        ArrowUp: [0, -WORLD.gridSize],
        ArrowDown: [0, WORLD.gridSize]
      }[event.key];
      if (movement) {
        event.preventDefault();
        this.keyboardCursor.x = Math.max(
          0,
          Math.min(WORLD.width, this.keyboardCursor.x + movement[0])
        );
        this.keyboardCursor.y = Math.max(
          0,
          Math.min(WORLD.height, this.keyboardCursor.y + movement[1])
        );
        this.renderer.placementPosition = { ...this.keyboardCursor };
        if (this.getSession().state.phase === PHASES.WAVE) {
          this.renderer.inspectionPosition = { ...this.keyboardCursor };
        }
        const label = this.getSession().state.phase === PHASES.WAVE
          ? 'Inspection cursor'
          : 'Build cursor';
        this.announce(`${label} column ${Math.round(this.keyboardCursor.x / WORLD.gridSize)}, row ${Math.round(this.keyboardCursor.y / WORLD.gridSize)}.`);
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.activate(this.keyboardCursor);
      }
      if (event.key === 'Escape') {
        this.getSession().selectDefense(null);
        this.inspectEnemy(null);
      }
    });
  }

  activate(position) {
    const session = this.getSession();
    if (![PHASES.BUILDING, PHASES.WAVE].includes(session.state.phase)) {
      return;
    }
    const selected = [...session.state.defenses.values()].find(
      (defense) => Math.hypot(defense.x - position.x, defense.y - position.y) <= 28
    );
    if (session.state.phase === PHASES.WAVE) {
      const enemy = [...session.state.enemies.values()].find(
        (candidate) => !candidate.resolution &&
          Math.hypot(candidate.x - position.x, candidate.y - position.y) <= candidate.radius + 14
      );
      if (enemy) {
        this.inspectEnemy(enemy.type);
        return;
      }
      if (selected) session.selectDefense(selected.id);
      return;
    }
    const result = selected
      ? session.selectDefense(selected.id)
      : session.placeDefense(session.state.selectedTowerType, position);
    if (!result.ok) {
      const messages = {
        INVALID_BUILD_TILE: 'Choose a clear build tile away from the path.',
        TILE_OCCUPIED: 'That build tile is occupied.',
        CANNOT_AFFORD: 'You do not have enough resources for that tower.'
      };
      this.announce(messages[result.code] || 'That action is not available.');
    }
  }
}
