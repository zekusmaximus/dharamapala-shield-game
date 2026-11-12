import { createReports, resourceEntry, finishReport, towerEntry } from './rules/reports.js';
import {
  ACTIVE_TOWER_TYPES,
  ENEMY_OUTCOMES,
  PHASES,
  TERMINAL_PHASES,
  commandResult
} from './commands.js';
import { GameClock } from './GameClock.js';
import { IdSequence, createSessionId } from './ids.js';
import { SeededRandom } from './SeededRandom.js';
import { SessionEvents } from './SessionEvents.js';
import { SpawnScheduler } from './SpawnScheduler.js';
import {
  addResources,
  canAfford,
  createStartingResources,
  getKillReward,
  getSellValue,
  getUpgradeCost,
  getWaveReward,
  subtractCost
} from './rules/economy.js';
import { getLeakDamage } from './rules/combat.js';
import { describeTower, getTowerStats } from './rules/towers.js';
import {
  compileSpawnSchedule,
  getWaveDefinition,
  getWavePreview
} from './rules/waves.js';
import { validateBalance, validateSnapshot } from './rules/validation.js';
import {
  isInsideWorld,
  isNearPath,
  snapToBuildGrid
} from './world.js';
import { createDefense } from '../entities/createDefense.js';
import { createEnemy, getEnemyDefinition } from '../entities/createEnemy.js';
import { AchievementSystem } from '../systems/AchievementSystem.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { DefenseSystem } from '../systems/DefenseSystem.js';
import { EnemySystem } from '../systems/EnemySystem.js';
import { WaveSystem } from '../systems/WaveSystem.js';

const SCHEMA_VERSION = 3;

function emptyWaveState() {
  return {
    scheduled: 0,
    spawned: 0,
    resolved: 0,
    killed: 0,
    leaked: 0,
    spawnCursor: 0,
    startedAtMs: null
  };
}

function createStatistics() {
  return {
    kills: 0,
    leaks: 0,
    bossesKilled: 0,
    wavesCompleted: 0
  };
}

function mapFrom(items) {
  return new Map(items.map((item) => [item.id, structuredClone(item)]));
}

function repairLegacyTerminalLeaks(snapshot) {
  const state = snapshot?.state;
  const final = state?.finalStatistics;
  const live = state?.statistics;
  if (
    snapshot?.schemaVersion !== 2 || snapshot.balanceVersion !== '1.0.0' ||
    state?.schemaVersion !== 2 || state.balanceVersion !== '1.0.0' ||
    state.phase !== PHASES.GAME_OVER || state.lives !== 0 ||
    !Number.isSafeInteger(final?.leaks) || !Number.isSafeInteger(live?.leaks) ||
    !Number.isSafeInteger(state.wave?.leaked) ||
    final.leaks < 0 || final.leaks >= live.leaks ||
    final.leaks <= live.leaks - state.wave.leaked ||
    !['kills', 'bossesKilled', 'wavesCompleted'].every(
      (key) => final[key] === live[key]
    ) ||
    !['score', 'lives', 'waveNumber'].every((key) => final[key] === state[key])
  ) {
    return;
  }
  // Older builds could resolve more exits after game over had captured results.
  // Reconcile only that known same-wave leak discrepancy, then validate the
  // entire snapshot before allowing the run to load.
  final.leaks = live.leaks;
}

export class GameSession {
  constructor(balance, options = {}) {
    this.balance = validateBalance(balance);
    this.events = new SessionEvents();
    this.scheduler = new SpawnScheduler();
    this.clock = new GameClock(options.clock);
    this.random = new SeededRandom(options.seed ?? 1337);
    this.ids = new IdSequence('entity');
    this.generation = 1;
    this.systems = {
      defense: new DefenseSystem(),
      combat: new CombatSystem(),
      enemy: new EnemySystem(),
      wave: new WaveSystem(),
      achievement: new AchievementSystem()
    };
    this.state = this.createState({
      seed: options.seed ?? 1337,
      difficulty: options.difficulty || 'Normal',
      tutorialCompleted: options.tutorialCompleted ?? false,
      phase: options.phase || PHASES.MENU
    });
  }

  createState({ seed, difficulty, tutorialCompleted, phase }) {
    if (!this.balance.difficulty[difficulty]) {
      throw new Error(`Unknown difficulty: ${difficulty}`);
    }
    return {
      schemaVersion: SCHEMA_VERSION,
      balanceVersion: this.balance.version,
      sessionId: createSessionId(seed),
      seed,
      difficulty,
      phase,
      resumePhase: null,
      gameTimeMs: 0,
      waveSpeed: 1,
      waveNumber: 1,
      maxWaves: this.balance.waves.length,
      lives: this.balance.economy.initialLives,
      resources: createStartingResources(this.balance),
      score: 0,
      statistics: createStatistics(),
      wave: emptyWaveState(),
      defenses: new Map(),
      enemies: new Map(),
      projectiles: new Map(),
      effects: new Map(),
      selectedDefenseId: null,
      selectedTowerType: 'firewall',
      settings: {
        tutorialCompleted,
        reducedMotion: false,
        showRanges: true
      },
      reports: createReports(),
      lastWaveResult: null,
      finalStatistics: null
    };
  }

  contentLoaded() {
    if (this.state.phase !== PHASES.LOADING) {
      return this.fail('INVALID_PHASE');
    }
    this.state.phase = PHASES.MENU;
    this.emitState('content-loaded');
    return commandResult(true, 'CONTENT_LOADED');
  }

  newGame(options = {}) {
    if (this.state.phase !== PHASES.MENU) {
      return this.fail('INVALID_PHASE');
    }
    const seed = options.seed ?? this.state.seed ?? 1337;
    const difficulty = options.difficulty || this.state.difficulty || 'Normal';
    const tutorialCompleted =
      options.tutorialCompleted ?? this.state.settings.tutorialCompleted;
    const preferences = { ...this.state.settings };
    this.disposeRuntime();
    this.random = new SeededRandom(seed);
    this.ids = new IdSequence('entity');
    this.state = this.createState({
      seed,
      difficulty,
      tutorialCompleted,
      phase: tutorialCompleted ? PHASES.BUILDING : PHASES.TUTORIAL
    });
    Object.assign(this.state.settings, preferences, { tutorialCompleted });
    this.emitState('new-game');
    return commandResult(true, 'NEW_GAME');
  }

  completeTutorial() {
    if (this.state.phase !== PHASES.TUTORIAL) {
      return this.fail('INVALID_PHASE');
    }
    this.state.settings.tutorialCompleted = true;
    this.state.phase = PHASES.BUILDING;
    this.emitState('tutorial-completed');
    return commandResult(true, 'TUTORIAL_COMPLETED');
  }

  replayTutorial() {
    if (this.state.phase !== PHASES.BUILDING) {
      return this.fail('INVALID_PHASE');
    }
    this.state.phase = PHASES.TUTORIAL;
    this.emitState('tutorial-replay');
    return commandResult(true, 'TUTORIAL_REPLAY');
  }

  updateSetting(name, value) {
    if (!['reducedMotion', 'showRanges'].includes(name)) {
      return this.fail('UNKNOWN_SETTING');
    }
    if (this.state.phase === PHASES.LOADING) {
      return this.fail('INVALID_PHASE');
    }
    this.state.settings[name] = Boolean(value);
    this.emitState('settings-updated');
    return commandResult(true, 'SETTING_UPDATED', { name });
  }

  setWaveSpeed(speed) {
    if (speed !== 1 && speed !== 2) {
      return this.fail('INVALID_WAVE_SPEED');
    }
    if (![PHASES.BUILDING, PHASES.WAVE, PHASES.PAUSED].includes(this.state.phase)) {
      return this.fail('INVALID_PHASE');
    }
    if (this.state.waveSpeed === speed) return commandResult(true, 'WAVE_SPEED_UNCHANGED');
    this.state.waveSpeed = speed;
    this.emitState('wave-speed-updated');
    return commandResult(true, 'WAVE_SPEED_UPDATED', { speed });
  }

  startWave() {
    if (this.state.phase !== PHASES.BUILDING) {
      return this.fail('INVALID_PHASE');
    }
    if (this.state.enemies.size || this.state.projectiles.size) {
      return this.fail('UNRESOLVED_ENTITIES');
    }
    const events = compileSpawnSchedule(this.balance, this.state.waveNumber);
    this.generation += 1;
    this.scheduler.load(events, this.generation);
    this.state.wave = {
      ...emptyWaveState(),
      scheduled: events.length,
      startedAtMs: this.state.gameTimeMs
    };
    for (const tower of this.state.defenses.values()) towerEntry(this, tower);
    this.state.phase = PHASES.WAVE;
    this.clock.reset();
    this.emitState('wave-started');
    return commandResult(true, 'WAVE_STARTED', {
      waveNumber: this.state.waveNumber
    });
  }

  pause() {
    if (![PHASES.BUILDING, PHASES.WAVE].includes(this.state.phase)) {
      return this.fail('INVALID_PHASE');
    }
    this.state.resumePhase = this.state.phase;
    this.state.phase = PHASES.PAUSED;
    this.emitState('paused');
    return commandResult(true, 'PAUSED');
  }

  resume() {
    if (
      this.state.phase !== PHASES.PAUSED ||
      ![PHASES.BUILDING, PHASES.WAVE].includes(this.state.resumePhase)
    ) {
      return this.fail('INVALID_PHASE');
    }
    this.state.phase = this.state.resumePhase;
    this.state.resumePhase = null;
    this.emitState('resumed');
    return commandResult(true, 'RESUMED');
  }

  restart() {
    if ([PHASES.LOADING, PHASES.MENU].includes(this.state.phase)) {
      return this.fail('INVALID_PHASE');
    }
    const { seed, difficulty, settings } = this.state;
    this.disposeRuntime();
    this.random = new SeededRandom(seed);
    this.ids = new IdSequence('entity');
    this.state = this.createState({
      seed,
      difficulty,
      tutorialCompleted: settings.tutorialCompleted,
      phase: PHASES.BUILDING
    });
    Object.assign(this.state.settings, settings);
    this.emitState('restarted');
    return commandResult(true, 'RESTARTED');
  }

  returnToMenu() {
    if (this.state.phase === PHASES.LOADING) {
      return this.fail('INVALID_PHASE');
    }
    const { seed, difficulty, settings } = this.state;
    this.disposeRuntime();
    this.state = this.createState({
      seed,
      difficulty,
      tutorialCompleted: settings.tutorialCompleted,
      phase: PHASES.MENU
    });
    Object.assign(this.state.settings, settings);
    this.emitState('returned-to-menu');
    return commandResult(true, 'RETURNED_TO_MENU');
  }

  selectTowerType(type) {
    if (!ACTIVE_TOWER_TYPES.includes(type)) {
      return this.fail('UNKNOWN_TOWER');
    }
    if (![PHASES.BUILDING, PHASES.TUTORIAL].includes(this.state.phase)) {
      return this.fail('INVALID_PHASE');
    }
    this.state.selectedTowerType = type;
    this.state.selectedDefenseId = null;
    this.emitState('tower-type-selected');
    return commandResult(true, 'TOWER_TYPE_SELECTED');
  }

  placeDefense(type, worldPosition) {
    if (this.state.phase !== PHASES.BUILDING) {
      return this.fail('INVALID_PHASE');
    }
    if (!ACTIVE_TOWER_TYPES.includes(type) || !this.balance.towers[type]) {
      return this.fail('UNKNOWN_TOWER');
    }
    const position = snapToBuildGrid(worldPosition);
    if (!isInsideWorld(position) || isNearPath(position)) {
      return this.fail('INVALID_BUILD_TILE', { position });
    }
    if (
      [...this.state.defenses.values()].some(
        (defense) => Math.hypot(defense.x - position.x, defense.y - position.y) < 45
      )
    ) {
      return this.fail('TILE_OCCUPIED', { position });
    }
    const cost = this.balance.towers[type].cost;
    if (!canAfford(this.state.resources, cost)) {
      return this.fail('CANNOT_AFFORD');
    }
    this.state.resources = subtractCost(this.state.resources, cost);
    resourceEntry(this, 'spent', cost);
    const defense = createDefense(type, position, this.ids.next('defense'));
    this.state.defenses.set(defense.id, defense);
    this.state.selectedDefenseId = defense.id;
    this.emitState('defense-placed');
    return commandResult(true, 'DEFENSE_PLACED', {
      defenseId: defense.id,
      position
    });
  }

  selectDefense(id) {
    if (![PHASES.BUILDING, PHASES.WAVE, PHASES.PAUSED].includes(this.state.phase)) {
      return this.fail('INVALID_PHASE');
    }
    if (id !== null && !this.state.defenses.has(id)) {
      return this.fail('UNKNOWN_DEFENSE');
    }
    this.state.selectedDefenseId = id;
    this.emitState('defense-selected');
    return commandResult(true, 'DEFENSE_SELECTED');
  }

  upgradeDefense(id, specialization = null) {
    if (this.state.phase !== PHASES.BUILDING) {
      return this.fail('INVALID_PHASE');
    }
    const defense = this.state.defenses.get(id);
    if (!defense) {
      return this.fail('UNKNOWN_DEFENSE');
    }
    if (defense.level >= this.balance.upgrades.maxLevel) {
      return this.fail('MAX_LEVEL');
    }
    const branches = this.balance.towers[defense.type].specializations;
    const choosing = branches && defense.level === 2;
    if (choosing && (typeof specialization !== 'string' || !Object.hasOwn(branches, specialization))) return this.fail('SPECIALIZATION_REQUIRED');
    if (!choosing && specialization !== null) return this.fail('SPECIALIZATION_LOCKED');
    const cost = getUpgradeCost(this.balance, defense.type, defense.level);
    if (!canAfford(this.state.resources, cost)) {
      return this.fail('CANNOT_AFFORD', { cost });
    }
    this.state.resources = subtractCost(this.state.resources, cost);
    resourceEntry(this, 'spent', cost);
    if (choosing) defense.specialization = specialization;
    defense.level += 1;
    this.emitState('defense-upgraded');
    return commandResult(true, 'DEFENSE_UPGRADED', {
      defenseId: id,
      level: defense.level
    });
  }

  sellDefense(id) {
    if (this.state.phase !== PHASES.BUILDING) {
      return this.fail('INVALID_PHASE');
    }
    const defense = this.state.defenses.get(id);
    if (!defense) {
      return this.fail('UNKNOWN_DEFENSE');
    }
    const refund = getSellValue(
      this.balance,
      defense.type,
      defense.level
    );
    this.state.resources = addResources(this.state.resources, refund);
    resourceEntry(this, 'refunds', refund);
    this.state.defenses.delete(id);
    if (this.state.selectedDefenseId === id) {
      this.state.selectedDefenseId = null;
    }
    this.emitState('defense-sold');
    return commandResult(true, 'DEFENSE_SOLD', { defenseId: id, refund });
  }

  tick(realDeltaMs) {
    if (this.state.phase !== PHASES.WAVE) {
      return { steps: 0, alpha: 0 };
    }
    return this.clock.advance(realDeltaMs, (deltaMs) => this.step(deltaMs), this.state.waveSpeed);
  }

  step(deltaMs) {
    if (this.state.phase !== PHASES.WAVE) {
      return false;
    }
    this.state.gameTimeMs += deltaMs;
    this.scheduler.advance(deltaMs, this.generation, (event) =>
      this.spawnEnemy(event)
    );
    if (this.state.phase !== PHASES.WAVE) return false;
    this.state.wave.spawnCursor = this.scheduler.cursor;
    this.systems.defense.update(this, deltaMs);
    if (this.state.phase !== PHASES.WAVE) return false;
    this.systems.combat.update(this, deltaMs);
    if (this.state.phase !== PHASES.WAVE) return false;
    this.systems.enemy.updateBosses(this);
    if (this.state.phase !== PHASES.WAVE) return false;
    this.systems.enemy.update(this, deltaMs);
    if (this.state.phase !== PHASES.WAVE) return false;
    this.systems.wave.update(this);
    return this.state.phase === PHASES.WAVE;
  }

  spawnEnemy(event) {
    if (this.state.phase !== PHASES.WAVE) {
      return null;
    }
    const definition = getEnemyDefinition(this.balance, event.enemyType);
    const enemy = createEnemy(definition, {
      id: this.ids.next('enemy'),
      hpMultiplier: event.hpMultiplier,
      difficulty: this.balance.difficulty[this.state.difficulty],
      spawnedAtMs: this.state.gameTimeMs
    });
    this.state.enemies.set(enemy.id, enemy);
    this.state.wave.spawned += 1;
    this.events.emit('enemy-spawned', { enemyId: enemy.id, type: enemy.type });
    return enemy;
  }

  registerBossMinions(boss, phase) {
    const reinforcement = this.balance.bosses.raidTeam.abilities.reinforcements;
    const minionTypes = reinforcement.byPhase[phase - 1];
    minionTypes.forEach((enemyType, index) => {
      this.scheduler.register(
        {
          dueAtMs: this.scheduler.elapsedMs + index * reinforcement.intervalMs,
          enemyType,
          hpMultiplier: 1 + this.state.waveNumber * reinforcement.hpMultiplierPerWave,
          dynamic: true,
          sourceId: boss.id
        },
        this.generation
      );
      this.state.wave.scheduled += 1;
    });
  }

  resolveEnemy(enemyId, outcome) {
    if (this.state.phase !== PHASES.WAVE) {
      return this.fail('INVALID_PHASE');
    }
    const enemy = this.state.enemies.get(enemyId);
    if (!enemy || enemy.resolution) {
      return this.fail('ALREADY_RESOLVED');
    }
    if (!Object.values(ENEMY_OUTCOMES).includes(outcome)) {
      return this.fail('INVALID_OUTCOME');
    }
    enemy.resolution = outcome;
    this.state.wave.resolved += 1;
    let resolutionEvent;

    if (outcome === ENEMY_OUTCOMES.KILLED) {
      const definition = getEnemyDefinition(this.balance, enemy.type);
      const reward = getKillReward(
        this.balance,
        definition,
        this.state.difficulty
      );
      this.state.resources = addResources(this.state.resources, reward);
      resourceEntry(this, 'bounty', reward);
      this.state.score += enemy.kind === 'boss' ? 1000 : 100;
      this.state.statistics.kills += 1;
      this.state.wave.killed += 1;
      if (enemy.kind === 'boss') {
        this.state.statistics.bossesKilled += 1;
      }
      resolutionEvent = { type: 'enemy-killed', payload: { enemyId, reward } };
    } else {
      const definition = getEnemyDefinition(this.balance, enemy.type);
      const damage = getLeakDamage(
        this.balance,
        definition,
        this.state.difficulty
      );
      this.state.reports.active.leaks.push({ type: enemy.type, damage,
        lastCovered: this.state.reports.active.coverage[enemy.id] ?? null });
      this.state.lives = Math.max(0, this.state.lives - damage);
      this.state.statistics.leaks += 1;
      this.state.wave.leaked += 1;
      resolutionEvent = { type: 'enemy-leaked', payload: { enemyId, damage } };
    }
    delete this.state.reports.active.coverage[enemyId];
    this.state.enemies.delete(enemyId);

    // Publish a complete resolution. A synchronous listener may enter a terminal
    // phase and snapshot the session before this command returns.
    if (outcome === ENEMY_OUTCOMES.KILLED) {
      this.systems.achievement.onEnemyKilled(this, enemy);
      if (this.state.phase !== PHASES.WAVE) return commandResult(true, outcome);
    }
    this.events.emit(resolutionEvent.type, resolutionEvent.payload);

    if (this.state.lives <= 0 && this.state.phase === PHASES.WAVE) {
      this.enterTerminal(PHASES.GAME_OVER);
    }
    return commandResult(true, outcome);
  }

  completeWave() {
    if (this.state.phase !== PHASES.WAVE) {
      return this.fail('INVALID_PHASE');
    }
    const completedWave = this.state.waveNumber;
    this.state.statistics.wavesCompleted += 1;
    const distributors = [...this.state.defenses.values()].filter(
      (defense) => defense.type === 'distributor'
    ).length;
    const reward = getWaveReward(
      this.balance,
      getWaveDefinition(this.balance, completedWave),
      completedWave,
      distributors
    );
    this.state.resources = addResources(this.state.resources, reward);
    this.state.reports.active.passiveDharma = reward.dharma - getWaveReward(
      this.balance, getWaveDefinition(this.balance, completedWave), completedWave, 0
    ).dharma;
    resourceEntry(this, 'clear', reward);
    finishReport(this, 'cleared');
    this.state.lastWaveResult = {
      waveNumber: completedWave,
      killed: this.state.wave.killed,
      leaked: this.state.wave.leaked,
      reward
    };
    if (completedWave >= this.state.maxWaves) {
      this.enterTerminal(PHASES.VICTORY);
      return commandResult(true, 'VICTORY');
    }
    this.scheduler.clear();
    this.generation = this.scheduler.generation;
    this.state.waveNumber += 1;
    this.state.phase = PHASES.BUILDING;
    this.state.resumePhase = null;
    this.state.projectiles.clear();
    this.emitState('wave-completed');
    return commandResult(true, 'WAVE_COMPLETED', {
      waveNumber: completedWave,
      reward
    });
  }

  enterTerminal(phase) {
    if (!TERMINAL_PHASES.has(phase) || TERMINAL_PHASES.has(this.state.phase)) {
      return false;
    }
    if (phase === PHASES.GAME_OVER) finishReport(this, 'defeat');
    this.scheduler.clear();
    this.generation = this.scheduler.generation;
    this.clock.reset();
    this.state.phase = phase;
    this.state.resumePhase = null;
    this.state.finalStatistics = {
      ...this.state.statistics,
      score: this.state.score,
      lives: this.state.lives,
      waveNumber: this.state.waveNumber
    };
    this.emitState(phase === PHASES.VICTORY ? 'victory' : 'game-over');
    return true;
  }

  dismissReport(waveNumber) {
    this.state.reports.pending = this.state.reports.pending.filter(r => r.waveNumber !== waveNumber);
    this.emitState('report-dismissed');
  }

  getReadModel() {
    const selected = this.state.defenses.get(this.state.selectedDefenseId);
    const selectedTower = selected
      ? {
          ...selected,
          current: describeTower(
            this.balance,
            selected.type,
            selected.level,
            selected.specialization
          ),
          next:
            selected.level < this.balance.upgrades.maxLevel && !(selected.level === 2 && this.balance.towers[selected.type].specializations)
              ? describeTower(
                  this.balance,
                  selected.type,
                  selected.level + 1,
                  selected.specialization
                )
              : null,
          upgradeCost:
            selected.level < this.balance.upgrades.maxLevel
              ? getUpgradeCost(this.balance, selected.type, selected.level)
              : null,
          sellValue: getSellValue(
            this.balance,
            selected.type,
            selected.level
          )
        }
      : null;
    return {
      phase: this.state.phase,
      resumePhase: this.state.resumePhase,
      waveNumber: this.state.waveNumber,
      waveSpeed: this.state.waveSpeed,
      maxWaves: this.state.maxWaves,
      lives: this.state.lives,
      score: this.state.score,
      resources: { ...this.state.resources },
      wave: { ...this.state.wave },
      selectedTowerType: this.state.selectedTowerType,
      selectedDefenseId: this.state.selectedDefenseId,
      selectedTower,
      towers: ACTIVE_TOWER_TYPES.map((type) => ({
        ...describeTower(this.balance, type),
        cost: { ...this.balance.towers[type].cost },
        affordable: canAfford(
          this.state.resources,
          this.balance.towers[type].cost
        )
      })),
      preview: getWavePreview(this.balance, this.state.waveNumber),
      lastWaveResult: this.state.lastWaveResult,
      statistics: { ...this.state.statistics },
      settings: { ...this.state.settings }
    };
  }

  save() {
    return this.toSnapshot();
  }

  toSnapshot() {
    return structuredClone({
      schemaVersion: this.state.schemaVersion,
      balanceVersion: this.balance.version,
      savedAt: new Date().toISOString(),
      state: {
        ...this.state,
        resources: { ...this.state.resources },
        statistics: { ...this.state.statistics },
        wave: { ...this.state.wave },
        settings: { ...this.state.settings },
        defenses: [...this.state.defenses.values()].map((value) => ({ ...value })),
        enemies: [...this.state.enemies.values()].map((value) => ({
          ...value,
          firedPhases: [...value.firedPhases]
        })),
        projectiles: [...this.state.projectiles.values()].map((value) => ({
          ...value,
          hitIds: [...value.hitIds]
        })),
        effects: [...this.state.effects.values()].map((value) => ({ ...value }))
      },
      runtime: {
        scheduler: this.scheduler.snapshot(),
        clock: this.clock.snapshot(),
        randomState: this.random.snapshot(),
        ids: this.ids.snapshot(),
        generation: this.generation
      }
    });
  }

  static fromSnapshot(balance, snapshot) {
    snapshot = structuredClone(snapshot);
    repairLegacyTerminalLeaks(snapshot);
    validateSnapshot(snapshot, balance);
    const session = new GameSession(balance, {
      seed: snapshot.state.seed,
      difficulty: snapshot.state.difficulty,
      tutorialCompleted: snapshot.state.settings?.tutorialCompleted
    });
    session.state = {
      ...snapshot.state,
      waveSpeed: snapshot.state.waveSpeed ?? 1,
      reports: snapshot.state.reports ?? createReports(true),
      resources: { ...snapshot.state.resources },
      statistics: { ...snapshot.state.statistics },
      wave: { ...snapshot.state.wave },
      settings: { ...snapshot.state.settings },
      defenses: mapFrom(snapshot.state.defenses),
      enemies: mapFrom(snapshot.state.enemies),
      projectiles: mapFrom(snapshot.state.projectiles),
      effects: mapFrom(snapshot.state.effects || [])
    };
    session.scheduler.restore(snapshot.runtime.scheduler);
    session.clock.restore(snapshot.runtime.clock);
    session.random.restore(snapshot.runtime.randomState);
    session.ids = IdSequence.fromSnapshot(snapshot.runtime.ids);
    session.generation = snapshot.runtime.generation;
    return session;
  }

  disposeRuntime() {
    this.scheduler.clear();
    this.clock.reset();
    this.generation = this.scheduler.generation;
  }

  emitState(reason) {
    this.events.emit(reason, {
      phase: this.state.phase
    });
    this.events.emit('state-changed', {
      reason,
      phase: this.state.phase
    });
  }

  fail(code, details = {}) {
    return commandResult(false, code, details);
  }
}

export { PHASES, SCHEMA_VERSION };
