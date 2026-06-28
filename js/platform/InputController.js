import { PHASES } from '../core/commands.js';
import { TUTORIAL_BUILD_POSITION, WORLD } from '../core/world.js';

export class InputController {
  constructor({ canvas, camera, renderer, getSession, announce }) {
    this.canvas = canvas;
    this.camera = camera;
    this.renderer = renderer;
    this.getSession = getSession;
    this.announce = announce;
    this.keyboardCursor = { ...TUTORIAL_BUILD_POSITION };
    this.bind();
  }

  bind() {
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
        this.announce(
          `Build cursor column ${Math.round(this.keyboardCursor.x / WORLD.gridSize)}, row ${Math.round(this.keyboardCursor.y / WORLD.gridSize)}.`
        );
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.activate(this.keyboardCursor);
      }
      if (event.key === 'Escape') {
        this.getSession().selectDefense(null);
      }
    });
  }

  activate(position) {
    const session = this.getSession();
    if (session.state.phase !== PHASES.BUILDING) {
      return;
    }
    const selected = [...session.state.defenses.values()].find(
      (defense) => Math.hypot(defense.x - position.x, defense.y - position.y) <= 28
    );
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
