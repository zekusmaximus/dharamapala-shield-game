import { PATH_METRICS, pointAtPathDistance } from '../core/world.js';
import { enemyCombatFeedback, disabledFeedback, EMP_WARNING } from '../core/rules/combatFeedback.js';
import { PHASES } from '../core/commands.js';
import { canAfford } from '../core/rules/economy.js';
import { getEnemyInspection, getTowerBlueprint, getTowerInspection } from '../core/rules/inspection.js';

const byId = (id) => document.getElementById(id);

function resourceText(resources) {
  return `${resources.dharma} Dharma, ${resources.bandwidth} Bandwidth, ${resources.anonymity} Anonymity`;
}

function costText(cost) {
  return `${cost.dharma || 0} D · ${cost.bandwidth || 0} B · ${cost.anonymity || 0} A`;
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function rateText(rate) {
  return `${rate.toFixed(2)} shots/s`;
}

function statusText(percent, durationMs) {
  return durationMs > 0
    ? `${Math.round(percent * 100)}% for ${(durationMs / 1000).toFixed(2)} s`
    : 'None';
}

function comparisonTable(rows, currentLevel, nextLevel) {
  const table = document.createElement('table');
  table.className = 'comparison-table';
  table.append(element('caption', 'Tower level comparison', 'sr-only'));
  const head = document.createElement('thead');
  const headings = document.createElement('tr');
  for (const title of ['Stat', `Current · Level ${currentLevel}`, nextLevel ? `Next · Level ${nextLevel}` : 'Next · maximum']) {
    const th = element('th', title);
    th.scope = 'col';
    headings.append(th);
  }
  head.append(headings);
  const body = document.createElement('tbody');
  for (const [label, current, next] of rows) {
    const row = document.createElement('tr');
    const th = element('th', label);
    th.scope = 'row';
    row.append(th, element('td', current), element('td', next ?? '—'));
    body.append(row);
  }
  table.append(head, body);
  return table;
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
      paletteEyebrow: byId('palette-eyebrow'),
      blueprint: byId('tower-blueprint'),
      blueprintContent: byId('tower-blueprint-content'),
      preview: byId('wave-preview-section'),
      previewEyebrow: byId('preview-eyebrow'),
      previewList: byId('wave-preview-list'),
      bossWarning: byId('boss-warning'),
      enemyInspector: byId('enemy-inspector'),
      enemyInspectorContent: byId('enemy-inspector-content'),
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
    // Prevent the browser's close-only default: every cancel follows a visible
    // action so dialog visibility and session state change together.
    for (const [dialog, cancel] of [
      [this.elements.tutorialDialog, () => this.skipTutorial()],
      [this.elements.settingsDialog, () => this.closeSettings()],
      [this.elements.pauseDialog, () => this.commands.session().resume()],
      [this.elements.sellDialog, () => this.closeDialog(this.elements.sellDialog)],
      [this.elements.terminalDialog, () => this.returnToMenu()]
    ]) {
      dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        cancel();
      });
    }
    for (const [button, panel] of [
      ['close-preview-button', this.elements.preview],
      ['close-blueprint-button', this.elements.blueprint],
      ['close-enemy-inspector-button', this.elements.enemyInspector],
      ['close-inspector-button', this.elements.inspector]
    ]) {
      byId(button).addEventListener('click', () => {
        panel.open = false;
        panel.querySelector('summary').focus();
      });
    }
    byId('new-game-button').addEventListener('click', () =>
      this.commands.newGame(byId('difficulty-select').value)
    );
    byId('export-save-button').addEventListener('click', () => {
      const raw = this.repository.exportCorrupt();
      if (!raw) return;
      const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url; link.download = 'dharmapala-recovery.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      this.announce('Recovery save exported.');
    });
    byId('reset-save-button').addEventListener('click', () => {
      const result = this.repository.clear();
      this.update(this.commands.session());
      this.announce(result.ok ? 'Saved run reset. Exported and archived recovery copies and preferences are kept.' : `Reset failed: ${result.error}`, !result.ok);
      this.focusUseful(byId('new-game-button'));
    });
    this.elements.continueButton.addEventListener('click', () =>
      this.commands.continueGame()
    );
    byId('brand-home').addEventListener('click', (event) => {
      event.preventDefault();
      this.returnToMenu();
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
      this.focusUseful(this.elements.start);
    });
    byId('menu-button').addEventListener('click', () => {
      this.closeDialog(this.elements.pauseDialog);
      this.returnToMenu();
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
      byId('game-canvas').focus();
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
      const session = this.commands.session();
      const buildPhase = session.state.phase === PHASES.BUILDING ||
        (session.state.phase === PHASES.PAUSED && session.state.resumePhase === PHASES.BUILDING);
      if (!buildPhase) {
        this.announce('Replay the tutorial during a build phase.', true);
        return;
      }
      this.closeSettings();
      if (session.state.phase === PHASES.PAUSED) session.resume();
      this.tutorialActive = false;
      session.replayTutorial();
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
      this.focusUseful(this.elements.start);
    });
    byId('terminal-menu-button').addEventListener('click', () => {
      this.closeDialog(this.elements.terminalDialog);
      this.returnToMenu();
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
    this.elements.paletteEyebrow.textContent = model.phase === PHASES.WAVE
      ? 'Build locked during wave'
      : 'Build';
    this.elements.previewEyebrow.textContent = model.phase === PHASES.WAVE
      ? 'Wave roster'
      : 'Incoming';

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

    this.renderReports(session);
    this.renderCombatFeedback(session, model);
    this.renderPalette(model);
    this.renderBlueprint(session);
    this.renderPreview(model);
    this.renderEnemyInspector(session);
    this.renderInspector(session, model);
    this.updateDescription(session, model);
    this.updateDialogs(session, model);
    byId('range-toggle').checked = model.settings.showRanges;
    byId('motion-toggle').checked = model.settings.reducedMotion;
    byId('replay-tutorial-button').disabled = !(model.phase === PHASES.BUILDING ||
      (model.phase === PHASES.PAUSED && session.state.resumePhase === PHASES.BUILDING));

    const hasSave = this.repository.hasSave();
    byId('save-recovery').hidden = !(this.repository.blocked || this.repository.error);
    byId('storage-status').textContent = this.repository.error
      ? `Local storage unavailable: ${this.repository.error}. Play can continue, but changes may be lost on reload.`
      : 'This save cannot be resumed. Its original payload is preserved.';
    byId('export-save-button').disabled = !this.repository.exportCorrupt();
    this.elements.continueButton.disabled = !hasSave;
    this.elements.continueHelp.textContent = hasSave
      ? 'Continue from the latest local snapshot.'
      : 'No local save found.';
  }

  onSessionEvent(event, session) {
    if (['new-game', 'restarted', 'returned-to-menu', 'wave-completed'].includes(event.type)) {
      this.selectedEnemyType = null;
    }
    if (['new-game', 'restarted', 'returned-to-menu'].includes(event.type)) {
      this.selectedBlueprintType = null;
    }
    if (['defense-placed', 'defense-selected'].includes(event.type)) {
      this.elements.inspector.open = true;
    }
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
        `Wave ${result.waveNumber} held: ${result.killed} defeated, ${result.leaked} leaked. Wave report available until dismissed.`
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

  renderReports(session) {
    const reports = session.state.reports.pending;
    const signature = JSON.stringify(reports);
    if (this.reportSignature === signature) return;
    this.reportSignature = signature;
    for (const id of ['wave-reports', 'terminal-reports']) {
      const host = byId(id);
      const openWaves = new Set([...host.querySelectorAll('details[open]')].map(d => d.dataset.wave));
      host.replaceChildren();
      for (const report of reports) {
        const details = document.createElement('details');
        details.dataset.wave = String(report.waveNumber);
        details.open = openWaves.has(String(report.waveNumber));
        details.append(element('summary', `Wave ${report.waveNumber} report · ${report.outcome} · ${report.leaked} leaked`));
        details.append(element('p', `${report.killed} defeated, ${report.leaked} leaked. Build spending covers preparation since the previous result; income covers this wave.${report.partial ? ' Partial accounting: this run was restored from a save without report tracking.' : ''}`));
        for (const [key, label] of [['spent','Build/upgrade spent'],['refunds','Sale refunds'],['bounty','Kill income'],['clear','Wave-clear income (includes capped Distributor bonus)']]) {
          details.append(element('p', `${label}: ${resourceText(report[key])}`));
        }
        details.append(element('p', `Distributor passive income included in clear reward: ${report.passiveDharma} Dharma, shared under the income cap; installed support earns it even during EMP.`));
        details.append(element('h3', 'Leaks and coverage'));
        if (!report.leaks.length) details.append(element('p', 'No leaks recorded.'));
        const types = [...new Set(report.leaks.map(l => l.type))];
        for (const type of types) {
          const leaks = report.leaks.filter(l => l.type === type);
          const name = (session.balance.enemies[type] || session.balance.bosses[type]).name;
          details.append(element('p', `${name}: ${leaks.length} escaped; ${leaks.reduce((sum,l) => sum+l.damage,0)} configured life damage (remaining lives clamp at zero).`));
          for (const leak of leaks) {
            const d = leak.lastCovered;
            const point = d === null ? null : pointAtPathDistance(d);
            details.append(element('p', d === null ? 'No attacking tower range observed along this escape route.' : `Last observed attacking range: (${Math.round(point.x)}, ${Math.round(point.y)}), ${Math.round(d / PATH_METRICS.totalLength * 100)}% along route; ${Math.round(PATH_METRICS.totalLength - d)} route units remained to endpoint (980, 190).`));
          }
        }
        details.append(element('p', 'Coverage samples geometry before movement, including disabled towers. It does not prove a tower could fire or explain why an enemy survived.'));
        details.append(element('h3', 'Tower contributions'));
        for (const [towerId, t] of Object.entries(report.towers)) {
          details.append(element('p', `${session.balance.towers[t.type].name} ${towerId} at (${t.x}, ${t.y}), level ${t.level}: ${t.health.toFixed(1)} health removed; ${t.shield.toFixed(1)} shield removed; ${t.kills} final hits; ${t.shots} shots; ${t.slowHits} slow applications; ${t.vulnerabilityHits} vulnerability applications; aura present for ${t.auraShots} attacker shots.`));
        }
        details.append(element('p', 'Health excludes overkill; damage includes active vulnerability after resistance/armor. Shield may recover and be removed again. Status counts are hit applications, including refreshes and lethal hits, not unique targets or extra damage credited to the applier. Aura counts overlap between Distributors and include capped auras; they are not extra shots or damage caused. Passive income is shared under the cap. No prevented leaks or causal damage shares are estimated.'));
        const dismiss = element('button', `Dismiss wave ${report.waveNumber} report`);
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => {
          session.dismissReport(report.waveNumber);
          const next = host.querySelector('summary');
          if (next) next.focus();
          else if (id === 'terminal-reports') byId('terminal-restart-button').focus();
          else this.focusUseful(this.elements.start);
        });
        details.append(dismiss);
        host.append(details);
      }
    }
  }

  renderPalette(model) {
    const signature = JSON.stringify({
      phase: model.phase,
      selected: model.selectedTowerType,
      inspected: this.selectedBlueprintType,
      towers: model.towers.map((tower) => [tower.type,
        model.phase === PHASES.BUILDING && tower.affordable])
    });
    if (this.lastSignatures.get('palette') === signature) {
      return;
    }
    this.lastSignatures.set('palette', signature);
    this.elements.palette.replaceChildren(
      ...model.towers.map((tower) => {
        const entry = document.createElement('div');
        entry.className = 'tower-palette-entry';
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
        const inspect = document.createElement('button');
        inspect.type = 'button';
        inspect.className = 'tower-info-button';
        inspect.dataset.inspectTowerType = tower.type;
        inspect.setAttribute('aria-label', `Inspect ${tower.name} blueprint`);
        inspect.setAttribute('aria-pressed', String(this.selectedBlueprintType === tower.type));
        inspect.textContent = 'Info';
        inspect.addEventListener('click', () => this.inspectBlueprintType(tower.type));
        entry.append(button, inspect);
        return entry;
      })
    );
  }

  inspectBlueprintType(type) {
    this.selectedBlueprintType = type;
    this.elements.blueprint.open = Boolean(type);
    this.update(this.commands.session());
    if (type) this.elements.blueprint.querySelector('summary').focus();
  }

  renderBlueprint(session) {
    const type = this.selectedBlueprintType;
    this.elements.blueprint.hidden = !type;
    if (!type || this.lastSignatures.get('blueprint') === type) return;
    this.lastSignatures.set('blueprint', type);
    const info = getTowerBlueprint(session.balance, type);
    const { current, next } = info;
    const rows = current.damage > 0 ? [
      ['Damage per hit', current.damage.toFixed(1), next?.damage.toFixed(1)],
      ['Fire rate', rateText(current.ratePerSec), next && rateText(next.ratePerSec)],
      ['Range', current.range.toFixed(1), next?.range.toFixed(1)]
    ] : [
      ['Fire-rate aura', `${Math.round(current.auraFireRatePct * 100)}%`, next && `${Math.round(next.auraFireRatePct * 100)}%`],
      ['Support range', current.range.toFixed(1), next?.range.toFixed(1)]
    ];
    if (current.slowDurationMs > 0 || next?.slowDurationMs > 0) {
      rows.push(['Slow', statusText(current.slowPct, current.slowDurationMs), next && statusText(next.slowPct, next.slowDurationMs)]);
    }
    if (current.vulnerabilityDurationMs > 0 || next?.vulnerabilityDurationMs > 0) {
      rows.push(['Vulnerability', statusText(current.vulnerabilityPct, current.vulnerabilityDurationMs), next && statusText(next.vulnerabilityPct, next.vulnerabilityDurationMs)]);
    }
    if (info.chainUnlockLevel) rows.push(['Chain', current.chainTargets ? `${current.chainTargets} extra target` : 'Locked', next && (next.chainTargets ? `${next.chainTargets} extra target` : 'Locked')]);
    const note = current.damage > 0
      ? `${current.role}. Direct damage (${current.damageType}). Effective fire rate depends on nearby active support.`
      : 'Support / economy. Does not attack. Available fire-rate gain depends on placement, nearby attackers, the aura cap and EMP.';
    const content = [
      element('h3', `${current.name} · Unplaced`),
      element('p', note, 'inspection-note'),
      comparisonTable(rows, 1, next?.level)
    ];
    if (info.chainUnlockLevel) content.push(element('p', `Chain unlocks at level ${info.chainUnlockLevel}.`, 'inspection-note'));
    if (type === 'distributor') content.push(element('p', `Passive wave-clear bonus: +${info.waveBonusDharma} Dharma per installed Distributor, capped at +${info.waveBonusCapDharma}. EMP pauses its aura, not this bonus.`, 'inspection-note'));
    content.push(element('p', `Build cost: ${resourceText(info.buildCost)}. If built, total investment: ${resourceText(info.totalInvested)}; refund (${Math.round(info.refundPct * 100)}%): ${resourceText(info.sellValue)}.`, 'inspection-note'));
    if (info.upgradeCost) content.push(element('p', `Next upgrade cost: ${resourceText(info.upgradeCost)}.`, 'inspection-note'));
    this.elements.blueprintContent.replaceChildren(...content);
  }

  renderPreview(model) {
    const signature = JSON.stringify([model.preview, this.selectedEnemyType, model.phase]);
    if (this.lastSignatures.get('preview') === signature) {
      return;
    }
    this.lastSignatures.set('preview', signature);
    this.elements.bossWarning.hidden = !model.preview?.isBossWave;
    this.elements.previewList.replaceChildren(
      ...(model.preview?.enemies || []).map((enemy) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'enemy-preview-button';
        button.dataset.enemyType = enemy.id;
        const timing = model.phase === PHASES.WAVE ? 'in this wave' : 'incoming';
        button.setAttribute('aria-label', `Inspect ${enemy.name}, ${enemy.count} ${timing}`);
        button.setAttribute('aria-pressed', String(this.selectedEnemyType === enemy.id));
        const icon = document.createElement('span');
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = enemy.icon;
        const name = document.createElement('strong');
        name.textContent = enemy.name;
        const count = document.createElement('span');
        count.textContent = `× ${enemy.count}`;
        button.append(icon, name, count);
        button.addEventListener('click', () => this.inspectEnemyType(enemy.id));
        item.append(button);
        return item;
      })
    );
  }

  inspectEnemyType(type) {
    this.selectedEnemyType = type;
    this.elements.enemyInspector.open = Boolean(type);
    this.update(this.commands.session());
    if (type) this.elements.enemyInspector.querySelector('summary').focus();
  }

  renderCombatFeedback(session, model = session.getReadModel()) {
    const now = session.state.gameTimeMs;
    const enemies = [...session.state.enemies.values()].filter((enemy) => !enemy.resolution);
    const raidIncoming = model.preview?.enemies.some((enemy) => enemy.id === 'raidTeam');
    const pending = enemies.some((enemy) => enemyCombatFeedback(enemy, now).nextEmp !== null);
    const warning = raidIncoming && (model.phase === PHASES.BUILDING ||
      [PHASES.WAVE, PHASES.PAUSED].includes(model.phase)) || pending;
    const warningNode = byId('emp-warning');
    const warningText = warning ? EMP_WARNING : '';
    if (warningNode.textContent !== warningText) warningNode.textContent = warningText;
    const lines = [];
    for (const enemy of enemies) {
      const info = enemyCombatFeedback(enemy, now);
      const status = info.statuses.map((item) => `${item.marker} ${item.text}`).join('; ');
      if (enemy.kind !== 'boss' && !status) continue;
      const parts = [`${enemy.name} (${enemy.id})`];
      if (enemy.kind === 'boss') {
        parts.push(`Health ${Math.ceil(Math.max(0, enemy.health))} / ${Math.ceil(enemy.maxHealth)}; ${info.phase}`);
        if (enemy.shieldMax > 0) parts.push(`Shield ${Math.ceil(enemy.shield)} / ${enemy.shieldMax}; recovers after 3 s without hits`);
        if (info.nextEmp !== null) parts.push(`⚠ Next EMP at ${Math.round(info.nextEmp * 100)}% health; dashed circle = 260-unit burst range`);
        else if (enemy.type === 'raidTeam') parts.push('Both EMP bursts spent');
      }
      if (status) parts.push(status);
      lines.push(parts.join('. '));
    }
    for (const defense of session.state.defenses.values()) {
      const disabled = disabledFeedback(defense, now);
      if (disabled) lines.push(`${session.balance.towers[defense.type].name} (${defense.id}): ${disabled}`);
    }
    const text = lines.join('\n') || 'No active status effects or bosses.';
    if (this.lastSignatures.get('combat') !== text) {
      this.lastSignatures.set('combat', text);
      byId('combat-state').replaceChildren(...text.split('\n').map((line) => element('p', line, 'inspection-note')));
    }
  }

  refreshLiveInspection(session) {
    this.renderCombatFeedback(session);
    const id = session.state.selectedDefenseId;
    if (!id || !session.state.defenses.has(id)) return;
    this.renderInspector(session, {
      selectedTower: { id },
      phase: session.state.phase,
      resources: session.state.resources
    });
  }

  renderEnemyInspector(session) {
    const type = this.selectedEnemyType;
    this.elements.enemyInspector.hidden = !type;
    if (!type || this.lastSignatures.get('enemy-inspector') === type) return;
    this.lastSignatures.set('enemy-inspector', type);
    const enemy = getEnemyInspection(session.balance, type);
    const content = this.elements.enemyInspectorContent;
    const heading = element('h3', enemy.name);
    const armor = element('p', `Armor: ${enemy.armor}`, 'inspection-note');
    const resistanceTitle = element('h4', 'Damage taken before armor');
    const resistanceList = document.createElement('ul');
    for (const [damageType, multiplier] of Object.entries(enemy.resistances)) {
      resistanceList.append(element('li', `${damageType[0].toUpperCase()}${damageType.slice(1)}: ×${multiplier.toFixed(2)}`));
    }
    const mitigation = element('p', 'A shot is multiplied by its damage type, then armor is subtracted (minimum 1 damage).', 'inspection-note subtle');
    const abilityTitle = element('h4', 'Implemented ability');
    const ability = element('p', enemy.ability || 'No active special ability.', 'inspection-note');
    const counterTitle = element('h4', 'Counter hint');
    const counter = element('p', enemy.counterHint, 'inspection-note');
    content.replaceChildren(heading, armor, resistanceTitle, resistanceList, mitigation, abilityTitle, ability, counterTitle, counter);
  }

  renderInspector(session, model) {
    const selected = model.selectedTower;
    this.elements.inspector.hidden = !selected;
    if (selected?.id !== this.lastInspectedTowerId) {
      this.elements.inspector.open = Boolean(selected);
      this.lastInspectedTowerId = selected?.id;
    }
    if (!selected) return;
    const tower = getTowerInspection(
      session.balance,
      session.state.defenses.get(selected.id),
      session.state.defenses.values(),
      session.state.gameTimeMs,
      session.state.waveNumber
    );
    const signature = JSON.stringify({ tower, resources: model.resources, phase: model.phase });
    if (this.lastSignatures.get('inspector') === signature) return;
    this.lastSignatures.set('inspector', signature);
    const { current, next } = tower;
    const content = this.elements.inspectorContent;
    const heading = element('h3', `${current.name} · Level ${selected.level}`);
    if (tower.support) {
      const support = tower.support;
      const note = element('p', 'Support / economy. Does not attack. Its fire-rate aura boosts nearby attacking towers while active. Rates assume a target is available. EMP pauses the aura; its passive wave-clear bonus still counts.', 'inspection-note');
      const rows = [
        ['Fire-rate aura', `${Math.round(current.auraFireRatePct * 100)}%`, next && `${Math.round(next.auraFireRatePct * 100)}%`],
        ['Support range', `${current.range.toFixed(1)}`, next && `${next.range.toFixed(1)}`],
        ['Attackers with rate boost', `${support.current.affectedCount} of ${support.current.coveredCount} in range`, support.next && `${support.next.affectedCount} of ${support.next.coveredCount} in range`],
        ['Rate gain while firing', rateText(support.current.addedRatePerSec), support.next && rateText(support.next.addedRatePerSec)]
      ];
      const table = comparisonTable(rows, selected.level, next?.level);
      const recipients = document.createElement('ul');
      for (const recipient of support.current.recipients.filter((item) => item.addedRatePerSec > 1e-9)) {
        const name = session.balance.towers[recipient.type].name;
        recipients.append(element('li', `${name}: ${rateText(recipient.withoutRatePerSec)} → ${rateText(recipient.withRatePerSec)} (+${rateText(recipient.addedRatePerSec)})`));
      }
      const recipientNote = element('p', support.current.affectedCount
        ? 'Towers with a faster firing cadence when a target is available:'
        : 'No attacking tower currently gains fire rate from this aura.', 'inspection-note');
      const wave = support.waveBonus;
      const waveBonus = element('p', `Passive wave-clear bonus: +${wave.perDistributorDharma} Dharma per installed Distributor, capped at +${wave.capDharma}. Current total +${wave.totalDharma}; this Distributor adds +${wave.marginalDharma} at the next clear.`, 'inspection-note');
      content.replaceChildren(heading, note, table, recipientNote, recipients, waveBonus);
      if (!support.current.active) content.append(element('p', 'Aura currently suppressed by EMP; passive wave-clear income remains.', 'inspection-note'));
    } else {
      const note = element('p', `${current.role}. Direct damage (${current.damageType}). Targets the enemy closest to the endpoint within range. Rates assume a target is available.`, 'inspection-note');
      const rows = [
        ['Damage per hit', current.damage.toFixed(1), next?.damage.toFixed(1)],
        ['Fire rate', rateText(current.ratePerSec), next && rateText(next.ratePerSec)],
        ['Rate with active support', rateText(current.effectiveRatePerSec), next && rateText(next.effectiveRatePerSec)],
        ['Range', current.range.toFixed(1), next?.range.toFixed(1)]
      ];
      if (current.slowDurationMs > 0 || next?.slowDurationMs > 0) {
        rows.push(['Slow', statusText(current.slowPct, current.slowDurationMs), next && statusText(next.slowPct, next.slowDurationMs)]);
      }
      if (current.vulnerabilityDurationMs > 0 || next?.vulnerabilityDurationMs > 0) {
        rows.push(['Vulnerability', statusText(current.vulnerabilityPct, current.vulnerabilityDurationMs), next && statusText(next.vulnerabilityPct, next.vulnerabilityDurationMs)]);
      }
      if (tower.chainUnlockLevel) {
        rows.push(['Chain', current.chainTargets ? `${current.chainTargets} extra target` : 'Locked', next && (next.chainTargets ? `${next.chainTargets} extra target` : 'Locked')]);
      }
      const table = comparisonTable(rows, selected.level, next?.level);
      const notes = [heading, note, table];
      if (tower.chainUnlockLevel) notes.push(element('p', `Chain unlocks at level ${tower.chainUnlockLevel}.`, 'inspection-note'));
      if (session.state.defenses.get(selected.id).disabledUntilMs > session.state.gameTimeMs) notes.push(element('p', 'EMP currently prevents this tower from firing.', 'inspection-note'));
      content.replaceChildren(...notes);
    }
    const economy = element('p', `Total investment: ${resourceText(tower.totalInvested)}. Refund (${Math.round(tower.refundPct * 100)}%): ${resourceText(tower.sellValue)}.`, 'inspection-note');
    content.append(economy);
    if (tower.upgradeCost) content.append(element('p', `Next upgrade cost: ${resourceText(tower.upgradeCost)}.`, 'inspection-note'));
    else content.append(element('p', 'Maximum level reached.', 'inspection-note'));
    const affordable = tower.upgradeCost && canAfford(model.resources, tower.upgradeCost);
    this.elements.upgrade.disabled = model.phase !== PHASES.BUILDING || !next || !affordable;
    this.elements.upgrade.textContent = next ? `Upgrade · ${costText(tower.upgradeCost)}` : 'Maximum level';
    this.elements.upgrade.title = model.phase !== PHASES.BUILDING
      ? 'Upgrades are available during the build phase.'
      : !next ? 'Maximum level reached.'
        : !affordable ? 'Not enough resources.' : '';
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
    this.elements.settingsDialog.dataset.resume = String(shouldResume);
    this.openDialog(this.elements.settingsDialog, this.elements.settings);
    if (shouldResume) session.pause();
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
    if (this.commands.session().state.phase === PHASES.PAUSED) {
      this.openDialog(this.elements.pauseDialog, this.elements.pause);
      this.focusUseful(byId('resume-button'));
    } else {
      this.focusUseful(this.elements.settings);
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
    this.focusUseful(dialog.returnTarget);
  }

  returnToMenu() {
    this.tutorialActive = false;
    this.renderer.tutorialBuildHighlight = false;
    this.commands.returnToMenu();
    this.focusUseful(byId('new-game-button'));
  }

  focusUseful(preferred) {
    const usable = (element) => element?.isConnected &&
      !element.disabled && element.checkVisibility() &&
      !element.closest('dialog:not([open]), details:not([open]) > :not(summary)');
    const modal = document.querySelector('dialog[open]');
    const candidates = modal
      ? [...modal.querySelectorAll('button, input')]
      : [preferred, this.elements.start, this.elements.pause,
        this.elements.settings, byId('new-game-button')];
    candidates.find(usable)?.focus();
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
