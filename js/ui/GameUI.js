import { PHASES } from '../core/commands.js';
import { canAfford } from '../core/rules/economy.js';

const byId = (id) => document.getElementById(id);

function resourceText(resources) {
  return `${resources.dharma} Dharma, ${resources.bandwidth} Bandwidth, ${resources.anonymity} Anonymity`;
}

function costText(cost) {
  return `${cost.dharma || 0} D · ${cost.bandwidth || 0} B · ${cost.anonymity || 0} A`;
}

export class GameUI {
  constructor({ commands, renderer, repository }) {
    this.commands = commands;
    this.renderer = renderer;
    this.repository = repository;
    this.tutorialActive = false;
    this.tutorialStep = 1;
    this.lastSignatures = new Map();
    this.elements = {
      app: byId('app'),
      loading: byId('loading-screen'),
      menu: byId('menu-screen'),
      gameLayout: byId('game-layout'),
      hud: byId('hud'),
      dharma: byId('dharma-value'),
      bandwidth: byId('bandwidth-value'),
      anonymity: byId('anonymity-value'),
      lives: byId('lives-value'),
      wave: byId('wave-value'),
      phase: byId('phase-label'),
      progress: byId('wave-progress-bar'),
      progressLabel: byId('wave-progress-label'),
      palette: byId('tower-palette'),
      preview: byId('wave-preview-section'),
      previewList: byId('wave-preview-list'),
      bossWarning: byId('boss-warning'),
      inspector: byId('tower-inspector'),
      inspectorContent: byId('inspector-content'),
      upgrade: byId('upgrade-button'),
      sell: byId('sell-button'),
      start: byId('start-wave-button'),
      pause: byId('pause-button'),
      settings: byId('settings-button'),
      battlefieldDescription: byId('battlefield-description'),
      saveState: byId('save-state'),
      continueButton: byId('continue-button'),
      continueHelp: byId('continue-help'),
      tutorialDialog: byId('tutorial-dialog'),
      pauseDialog: byId('pause-dialog'),
      settingsDialog: byId('settings-dialog'),
      sellDialog: byId('sell-dialog'),
      terminalDialog: byId('terminal-dialog'),
      polite: byId('polite-status'),
      alert: byId('alert-status'),
      toast: byId('toast')
    };
    this.bind();
  }

  bind() {
    byId('new-game-button').addEventListener('click', () =>
      this.commands.newGame(byId('difficulty-select').value)
    );
    this.elements.continueButton.addEventListener('click', () =>
      this.commands.continueGame()
    );
    byId('brand-home').addEventListener('click', (event) => {
      event.preventDefault();
      this.commands.returnToMenu();
    });
    this.elements.start.addEventListener('click', () => {
      const result = this.commands.session().startWave();
      if (!result.ok) {
        this.announce('The wave cannot start yet.', true);
      } else if (this.tutorialActive) {
        this.tutorialActive = false;
      }
    });
    this.elements.pause.addEventListener('click', () =>
      this.commands.session().pause()
    );
    byId('resume-button').addEventListener('click', () =>
      this.commands.session().resume()
    );
    byId('save-button').addEventListener('click', () => this.commands.save());
    byId('restart-button').addEventListener('click', () => {
      this.closeDialog(this.elements.pauseDialog);
      this.commands.session().restart();
    });
    byId('menu-button').addEventListener('click', () => {
      this.closeDialog(this.elements.pauseDialog);
      this.commands.returnToMenu();
    });
    this.elements.upgrade.addEventListener('click', () => {
      const id = this.commands.session().state.selectedDefenseId;
      const result = this.commands.session().upgradeDefense(id);
      if (!result.ok) {
        this.announce(this.disabledReason(result.code), true);
      }
    });
    this.elements.sell.addEventListener('click', () => {
      const tower = this.commands.session().getReadModel().selectedTower;
      if (!tower) {
        return;
      }
      byId('sell-copy').textContent =
        `${tower.current.name} will be removed. You will receive ${resourceText(tower.sellValue)}.`;
      this.openDialog(this.elements.sellDialog, this.elements.sell);
    });
    byId('cancel-sell-button').addEventListener('click', () =>
      this.closeDialog(this.elements.sellDialog)
    );
    byId('confirm-sell-button').addEventListener('click', () => {
      const id = this.commands.session().state.selectedDefenseId;
      this.closeDialog(this.elements.sellDialog);
      this.commands.session().sellDefense(id);
    });
    this.elements.settings.addEventListener('click', () => this.openSettings());
    byId('close-settings-button').addEventListener('click', () =>
      this.closeSettings()
    );
    byId('range-toggle').addEventListener('change', (event) => {
      this.commands
        .session()
        .updateSetting('showRanges', event.target.checked);
      this.commands.save();
    });
    byId('motion-toggle').addEventListener('change', (event) => {
      this.commands
        .session()
        .updateSetting('reducedMotion', event.target.checked);
      document.documentElement.dataset.reducedMotion = String(event.target.checked);
      this.commands.save();
    });
    byId('replay-tutorial-button').addEventListener('click', () => {
      this.closeSettings(false);
      const session = this.commands.session();
      if (session.state.phase === PHASES.PAUSED) {
        session.resume();
      }
      const result = session.replayTutorial();
      if (result.ok) {
        this.beginTutorial();
      } else {
        this.announce('Replay the tutorial during a build phase.', true);
      }
    });
    byId('tutorial-next-button').addEventListener('click', () =>
      this.advanceTutorial()
    );
    byId('skip-tutorial-button').addEventListener('click', () =>
      this.skipTutorial()
    );
    byId('terminal-restart-button').addEventListener('click', () => {
      this.closeDialog(this.elements.terminalDialog);
      this.commands.session().restart();
    });
    byId('terminal-menu-button').addEventListener('click', () => {
      this.closeDialog(this.elements.terminalDialog);
      this.commands.returnToMenu();
    });
  }

  show() {
    this.elements.loading.hidden = true;
    this.elements.app.hidden = false;
  }

  update(session) {
    const model = session.getReadModel();
    const inMenu = model.phase === PHASES.MENU;
    this.elements.menu.hidden = !inMenu;
    this.elements.gameLayout.hidden = inMenu;
    this.elements.hud.hidden = inMenu;
    this.elements.pause.hidden = inMenu;

    this.elements.dharma.textContent = Math.round(model.resources.dharma);
    this.elements.bandwidth.textContent = Math.round(model.resources.bandwidth);
    this.elements.anonymity.textContent = Math.round(model.resources.anonymity);
    this.elements.lives.textContent = model.lives;
    this.elements.wave.textContent = `${model.waveNumber} / ${model.maxWaves}`;
    this.elements.phase.textContent = this.phaseLabel(model.phase);

    const scheduled = Math.max(1, model.wave.scheduled);
    this.elements.progress.max = scheduled;
    this.elements.progress.value = model.wave.resolved;
    this.elements.progressLabel.textContent =
      model.phase === PHASES.WAVE
        ? `${model.wave.resolved} / ${model.wave.scheduled} resolved · ${session.state.enemies.size} live`
        : 'Ready';

    this.elements.start.disabled = model.phase !== PHASES.BUILDING;
    this.elements.start.textContent =
      model.phase === PHASES.WAVE ? 'Wave active' : `Start wave ${model.waveNumber}`;
    this.elements.pause.disabled = ![PHASES.BUILDING, PHASES.WAVE].includes(
      model.phase
    );

    this.renderPalette(model);
    this.renderPreview(model);
    this.renderInspector(model);
    this.updateDescription(session, model);
    this.updateDialogs(session, model);
    byId('range-toggle').checked = model.settings.showRanges;
    byId('motion-toggle').checked = model.settings.reducedMotion;

    const hasSave = this.repository.hasSave();
    this.elements.continueButton.disabled = !hasSave;
    this.elements.continueHelp.textContent = hasSave
      ? 'Continue from the latest local snapshot.'
      : 'No local save found.';
  }

  onSessionEvent(event, session) {
    if (
      event.type === 'defense-placed' &&
      this.tutorialActive &&
      this.tutorialStep === 3
    ) {
      this.tutorialStep = 4;
      this.renderer.tutorialBuildHighlight = false;
      this.renderTutorial();
      this.openDialog(this.elements.tutorialDialog);
    }
    if (event.type === 'wave-completed') {
      const result = session.state.lastWaveResult;
      this.toast(
        `Wave ${result.waveNumber} held: ${result.killed} defeated, ${result.leaked} leaked.`
      );
    }
    if (event.type === 'enemy-leaked') {
      this.announce(`Endpoint hit. ${session.state.lives} lives remain.`, true);
    }
    if (event.type === 'boss-phase') {
      this.announce(`Boss phase ${event.phase}: ${event.ability}.`, true);
    }
    if (event.type === 'achievement') {
      this.toast(`Achievement: ${event.title}`);
    }
  }

  renderPalette(model) {
    const signature = JSON.stringify({
      phase: model.phase,
      selected: model.selectedTowerType,
      towers: model.towers.map((tower) => [tower.type, tower.affordable])
    });
    if (this.lastSignatures.get('palette') === signature) {
      return;
    }
    this.lastSignatures.set('palette', signature);
    this.elements.palette.replaceChildren(
      ...model.towers.map((tower) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'tower-card';
        button.dataset.towerType = tower.type;
        button.setAttribute(
          'aria-pressed',
          String(tower.type === model.selectedTowerType)
        );
        button.disabled =
          ![PHASES.BUILDING, PHASES.TUTORIAL].includes(model.phase) ||
          !tower.affordable;
        button.setAttribute(
          'aria-label',
          `${tower.name}, ${tower.role}, costs ${resourceText(tower.cost)}`
        );

        const icon = document.createElement('span');
        icon.className = 'tower-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = tower.icon;
        const details = document.createElement('span');
        const name = document.createElement('strong');
        name.className = 'tower-name';
        name.textContent = tower.name;
        const role = document.createElement('span');
        role.className = 'tower-role';
        role.textContent = tower.role;
        details.append(name, role);
        const cost = document.createElement('span');
        cost.className = 'tower-cost';
        cost.textContent = costText(tower.cost);
        button.append(icon, details, cost);
        button.addEventListener('click', () => {
          this.commands.session().selectTowerType(tower.type);
          byId('game-canvas').focus();
        });
        return button;
      })
    );
  }

  renderPreview(model) {
    const signature = JSON.stringify(model.preview);
    if (this.lastSignatures.get('preview') === signature) {
      return;
    }
    this.lastSignatures.set('preview', signature);
    this.elements.bossWarning.hidden = !model.preview?.isBossWave;
    this.elements.previewList.replaceChildren(
      ...(model.preview?.enemies || []).map((enemy) => {
        const item = document.createElement('li');
        const icon = document.createElement('span');
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = enemy.icon;
        const details = document.createElement('span');
        const name = document.createElement('strong');
        name.textContent = enemy.name;
        const ability = document.createElement('small');
        ability.textContent = enemy.ability;
        details.append(name, ability);
        const count = document.createElement('span');
        count.textContent = `× ${enemy.count}`;
        item.append(icon, details, count);
        return item;
      })
    );
  }

  renderInspector(model) {
    const tower = model.selectedTower;
    this.elements.inspector.hidden = !tower;
    const mobilePortrait = matchMedia(
      '(max-width: 1023px) and (orientation: portrait)'
    ).matches;
    this.elements.preview.hidden = Boolean(tower && mobilePortrait);
    if (!tower) {
      return;
    }
    const signature = JSON.stringify({
      tower,
      resources: model.resources,
      phase: model.phase
    });
    if (this.lastSignatures.get('inspector') === signature) {
      return;
    }
    this.lastSignatures.set('inspector', signature);
    const current = tower.current;
    const next = tower.next;
    this.elements.inspectorContent.innerHTML = `
      <p><strong>${current.name}</strong> · Level ${tower.level}</p>
      <p class="subtle">${current.role}. Targets the active threat closest to the endpoint.</p>
      <div class="stat-grid">
        <div><span>Damage</span>${current.damage.toFixed(1)}</div>
        <div><span>Range</span>${Math.round(current.range)}</div>
        <div><span>Rate</span>${current.ratePerSec.toFixed(2)}/s</div>
        <div><span>Status</span>${current.slowPct ? `${Math.round(current.slowPct * 100)}% slow` : current.auraFireRatePct ? `${Math.round(current.auraFireRatePct * 100)}% aura` : 'Direct'}</div>
      </div>
      <p class="subtle">${next ? `Next: ${next.damage.toFixed(1)} damage, ${Math.round(next.range)} range.` : 'Maximum level reached.'}</p>
    `;
    const affordable =
      tower.upgradeCost && canAfford(model.resources, tower.upgradeCost);
    this.elements.upgrade.disabled =
      model.phase !== PHASES.BUILDING || !tower.next || !affordable;
    this.elements.upgrade.textContent = tower.next
      ? `Upgrade · ${costText(tower.upgradeCost)}`
      : 'Maximum level';
    this.elements.upgrade.title =
      model.phase !== PHASES.BUILDING
        ? 'Upgrades are available during the build phase.'
        : !affordable
          ? 'Not enough resources.'
          : '';
    this.elements.sell.disabled = model.phase !== PHASES.BUILDING;
    this.elements.sell.textContent = `Sell · ${costText(tower.sellValue)}`;
  }

  updateDescription(session, model) {
    const enemies = [...session.state.enemies.values()];
    const nearest = enemies.sort((a, b) => b.pathDistance - a.pathDistance)[0];
    this.elements.battlefieldDescription.textContent = enemies.length
      ? `${enemies.length} enemies are active. ${nearest.name} is closest to the endpoint. The endpoint has ${model.lives} lives.`
      : `No enemies are active. The protected endpoint has ${model.lives} lives. Wave ${model.waveNumber} is ${model.phase === PHASES.BUILDING ? 'ready to start' : model.phase.toLowerCase()}.`;
  }

  updateDialogs(session, model) {
    if (model.phase === PHASES.TUTORIAL && !this.tutorialActive) {
      this.beginTutorial();
    }
    if (model.phase === PHASES.PAUSED && !this.elements.settingsDialog.open) {
      this.openDialog(this.elements.pauseDialog, this.elements.pause);
    } else if (
      model.phase !== PHASES.PAUSED &&
      this.elements.pauseDialog.open
    ) {
      this.closeDialog(this.elements.pauseDialog);
    }
    if ([PHASES.GAME_OVER, PHASES.VICTORY].includes(model.phase)) {
      this.showTerminal(session, model.phase);
    }
  }

  beginTutorial() {
    this.tutorialActive = true;
    this.tutorialStep = 1;
    this.renderer.tutorialBuildHighlight = false;
    this.renderTutorial();
    this.openDialog(this.elements.tutorialDialog);
  }

  advanceTutorial() {
    if (this.tutorialStep < 2) {
      this.tutorialStep += 1;
      this.renderTutorial();
      return;
    }
    if (this.tutorialStep === 2) {
      const session = this.commands.session();
      if (session.state.phase === PHASES.TUTORIAL) {
        session.completeTutorial();
      }
      session.selectTowerType('firewall');
      this.tutorialStep = 3;
      this.renderer.tutorialBuildHighlight = true;
      this.closeDialog(this.elements.tutorialDialog);
      this.announce(
        'Firewall selected. Place it on the highlighted clear tile using pointer or keyboard.'
      );
      byId('game-canvas').focus();
      return;
    }
    this.closeDialog(this.elements.tutorialDialog);
    this.elements.start.focus();
  }

  skipTutorial() {
    const session = this.commands.session();
    if (session.state.phase === PHASES.TUTORIAL) {
      session.completeTutorial();
    }
    this.tutorialActive = false;
    this.renderer.tutorialBuildHighlight = false;
    this.closeDialog(this.elements.tutorialDialog);
    this.elements.start.focus();
  }

  renderTutorial() {
    const steps = {
      1: {
        title: 'Protect the endpoint',
        copy:
          'Attackers follow the network path toward the blue endpoint. Each leak costs lives; reaching zero ends the run.',
        action: 'Next'
      },
      2: {
        title: 'Spend three resources',
        copy:
          'Dharma, Bandwidth, and Anonymity pay for towers and upgrades. Unaffordable actions are disabled and explain why.',
        action: 'Choose a Firewall'
      },
      3: {
        title: 'Place a Firewall Fortress',
        copy:
          'Place the selected Firewall on the highlighted legal tile. The canvas supports pointer, touch, or arrow keys plus Enter.',
        action: 'Place tower'
      },
      4: {
        title: 'Begin when ready',
        copy:
          'Review the incoming enemy composition and boss warning. Nothing spawns until you activate Start Wave.',
        action: 'Show Start Wave'
      }
    };
    const step = steps[this.tutorialStep];
    byId('tutorial-progress').textContent = `Tutorial ${this.tutorialStep} of 4`;
    byId('tutorial-title').textContent = step.title;
    byId('tutorial-copy').textContent = step.copy;
    byId('tutorial-next-button').textContent = step.action;
    byId('tutorial-next-button').disabled = this.tutorialStep === 3;
  }

  openSettings() {
    const session = this.commands.session();
    const shouldResume = [PHASES.BUILDING, PHASES.WAVE].includes(
      session.state.phase
    );
    if (shouldResume) {
      session.pause();
      this.closeDialog(this.elements.pauseDialog);
    }
    this.elements.settingsDialog.dataset.resume = String(shouldResume);
    this.openDialog(this.elements.settingsDialog, this.elements.settings);
  }

  closeSettings(resume = true) {
    const shouldResume =
      resume && this.elements.settingsDialog.dataset.resume === 'true';
    this.closeDialog(this.elements.settingsDialog);
    this.elements.settingsDialog.dataset.resume = 'false';
    if (
      shouldResume &&
      this.commands.session().state.phase === PHASES.PAUSED
    ) {
      this.commands.session().resume();
    }
  }

  showTerminal(session, phase) {
    const dialog = this.elements.terminalDialog;
    if (dialog.open) {
      return;
    }
    this.closeDialog(this.elements.pauseDialog);
    const stats = session.state.finalStatistics;
    const victory = phase === PHASES.VICTORY;
    byId('terminal-eyebrow').textContent = victory
      ? 'All twenty waves resolved'
      : 'The endpoint was breached';
    byId('terminal-title').textContent = victory ? 'Victory' : 'Game over';
    byId('terminal-summary').textContent =
      `${stats.kills} defeated, ${stats.leaks} leaked, ${stats.bossesKilled} bosses defeated. Score: ${stats.score}.`;
    this.openDialog(dialog);
  }

  markSaved(message = 'Saved locally.') {
    this.elements.saveState.textContent = message;
  }

  announce(message, assertive = false) {
    (assertive ? this.elements.alert : this.elements.polite).textContent = message;
  }

  toast(message) {
    this.elements.toast.textContent = message;
    this.elements.toast.hidden = false;
    globalThis.setTimeout(() => {
      this.elements.toast.hidden = true;
    }, 3200);
  }

  openDialog(dialog, returnTarget = document.activeElement) {
    if (dialog.open) {
      return;
    }
    dialog.returnTarget = returnTarget;
    try {
      dialog.showModal();
    } catch {
      dialog.show();
    }
  }

  closeDialog(dialog) {
    if (!dialog.open) {
      return;
    }
    dialog.close();
    dialog.returnTarget?.focus?.();
  }

  phaseLabel(phase) {
    return {
      [PHASES.TUTORIAL]: 'Tutorial',
      [PHASES.BUILDING]: 'Build phase',
      [PHASES.WAVE]: 'Wave active',
      [PHASES.PAUSED]: 'Paused',
      [PHASES.GAME_OVER]: 'Game over',
      [PHASES.VICTORY]: 'Victory'
    }[phase] || 'Menu';
  }

  disabledReason(code) {
    return {
      CANNOT_AFFORD: 'You do not have enough resources.',
      MAX_LEVEL: 'This tower is already at maximum level.',
      INVALID_PHASE: 'That action is available only during the build phase.'
    }[code] || 'That action is not available.';
  }
}
