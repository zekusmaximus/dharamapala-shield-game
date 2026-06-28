import { GameSession, PHASES } from './core/GameSession.js';
import { validateBalance } from './core/rules/validation.js';
import { BrowserSaveRepository } from './platform/BrowserSaveRepository.js';
import { InputController } from './platform/InputController.js';
import { Camera } from './render/Camera.js';
import { CanvasRenderer } from './render/CanvasRenderer.js';
import { GameUI } from './ui/GameUI.js';

class GameApplication {
  constructor(balance) {
    this.balance = balance;
    this.repository = new BrowserSaveRepository();
    this.session = new GameSession(balance, {
      tutorialCompleted: false,
      phase: PHASES.LOADING
    });
    const canvas = document.getElementById('game-canvas');
    this.camera = new Camera(canvas);
    this.renderer = new CanvasRenderer(canvas, this.camera, balance);
    this.lastFrameAt = performance.now();
    this.lastWaveSaveAtMs = 0;
    this.unsubscribe = null;

    const commands = {
      session: () => this.session,
      newGame: (difficulty) => this.newGame(difficulty),
      continueGame: () => this.continueGame(),
      save: () => this.save(),
      returnToMenu: () => this.returnToMenu()
    };
    this.ui = new GameUI({
      commands,
      renderer: this.renderer,
      repository: this.repository
    });
    this.input = new InputController({
      canvas,
      camera: this.camera,
      renderer: this.renderer,
      getSession: () => this.session,
      announce: (message) => this.ui.announce(message)
    });
    this.bindSession();
    this.bindPlatform();
  }

  start() {
    this.session.contentLoaded();
    this.ui.show();
    this.ui.update(this.session);
    this.camera.resize();
    requestAnimationFrame((time) => this.frame(time));
  }

  frame(time) {
    const deltaMs = Math.max(0, time - this.lastFrameAt);
    this.lastFrameAt = time;
    this.session.tick(deltaMs);
    if (
      this.session.state.phase === PHASES.WAVE &&
      this.session.state.gameTimeMs - this.lastWaveSaveAtMs >= 10_000
    ) {
      this.save('Wave progress saved.');
      this.lastWaveSaveAtMs = this.session.state.gameTimeMs;
    }
    this.renderer.render(this.session);
    requestAnimationFrame((nextTime) => this.frame(nextTime));
  }

  newGame(difficulty) {
    for (const dialog of document.querySelectorAll('dialog[open]')) {
      dialog.close();
    }
    this.session.newGame({
      difficulty,
      tutorialCompleted:
        this.session.state.settings.tutorialCompleted ||
        this.repository.getTutorialCompleted(),
      seed: 1337
    });
    this.camera.resize();
    this.lastWaveSaveAtMs = 0;
  }

  continueGame() {
    const result = this.repository.load(this.balance);
    if (!result.ok) {
      this.ui.announce(
        `${result.error} The original payload was preserved for recovery.`,
        true
      );
      this.ui.toast('The saved game could not be loaded.');
      return;
    }
    for (const dialog of document.querySelectorAll('dialog[open]')) {
      dialog.close();
    }
    this.swapSession(result.session);
    this.ui.toast(result.migrated ? 'Legacy save migrated.' : 'Saved game restored.');
  }

  swapSession(session) {
    this.unsubscribe?.();
    this.session = session;
    this.bindSession();
    this.lastWaveSaveAtMs = session.state.gameTimeMs;
    this.ui.update(session);
    this.camera.resize();
  }

  bindSession() {
    this.unsubscribe = this.session.events.on('*', (event) => {
      this.ui.onSessionEvent(event, this.session);
      this.ui.update(this.session);
      const saveEvents = new Set([
        'tutorial-completed',
        'defense-placed',
        'defense-upgraded',
        'defense-sold',
        'paused',
        'wave-completed'
      ]);
      if (saveEvents.has(event.type)) {
        this.save();
      }
    });
  }

  bindPlatform() {
    window.addEventListener('resize', () => this.camera.resize());
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.lastFrameAt = performance.now();
        return;
      }
      if ([PHASES.BUILDING, PHASES.WAVE].includes(this.session.state.phase)) {
        this.session.pause();
      }
      this.save('Saved when the game lost visibility.');
    });
  }

  save(message = 'Saved locally.') {
    if ([PHASES.MENU, PHASES.TUTORIAL].includes(this.session.state.phase)) {
      return { ok: false };
    }
    const result = this.repository.save(this.session);
    if (result.ok) {
      this.ui.markSaved(message);
    } else {
      this.ui.announce(`Save failed: ${result.error}`, true);
    }
    return result;
  }

  returnToMenu() {
    if (this.session.state.phase !== PHASES.MENU) {
      this.save();
    }
    for (const dialog of document.querySelectorAll('dialog[open]')) {
      dialog.close();
    }
    this.session.returnToMenu();
  }
}

async function bootstrap() {
  const response = await fetch('design/balance.json');
  if (!response.ok) {
    throw new Error(`Balance data failed to load (${response.status}).`);
  }
  const balance = validateBalance(await response.json());
  const app = new GameApplication(balance);
  globalThis.gameApplication = app;
  app.start();
}

bootstrap().catch((error) => {
  console.error(error);
  const loading = document.getElementById('loading-screen');
  loading.textContent = `Dharmapala Shield could not start: ${error.message}`;
  loading.setAttribute('role', 'alert');
});
