import { validateReports } from './reports.js';
import { ACTIVE_TOWER_TYPES, PHASES, TERMINAL_PHASES } from '../commands.js';
import { isInsideWorld, isNearPath, snapToBuildGrid, pointAtPathDistance, PATH_METRICS } from '../world.js';
import { getTowerStats } from './towers.js';
import { getUpgradeCost } from './economy.js';
import { createEnemy } from '../../entities/createEnemy.js';
import { compileSpawnSchedule } from './waves.js';

function assert(ok, message) { if (!ok) throw new Error(message); }
const number = (v, min = 0, max = Infinity) => Number.isFinite(v) && v >= min && v <= max;
const integer = (v, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(v) && v >= min && v <= max;
function fields(object, keys, min = 0) {
  assert(object && keys.every(key => number(object[key], min)), `Invalid numeric fields: ${keys.join(', ')}`);
}
function resources(value) { fields(value, ['dharma', 'bandwidth', 'anonymity']); }
function stats(value) {
  assert(value && ['kills', 'leaks', 'bossesKilled', 'wavesCompleted'].every(k => integer(value[k])), 'Invalid statistics');
  assert(value.bossesKilled <= value.kills, 'Invalid boss kills');
}
function contentKeys(value, path, required, optional = []) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `Invalid ${path}`);
  for (const key of required) assert(Object.hasOwn(value, key), `Missing ${path}.${key}`);
  for (const key of Object.keys(value)) {
    assert(required.includes(key) || optional.includes(key), `Unused or unknown content field: ${path}.${key}`);
  }
}
function contentNumber(value, path, min = 0, max = Infinity) {
  assert(number(value, min, max), `Invalid ${path}`);
}
function contentInteger(value, path, min = 0) {
  assert(integer(value, min), `Invalid ${path}`);
}
function contentText(value, path) {
  assert(typeof value === 'string' && value.trim().length > 0, `Invalid ${path}`);
}
function contentResources(value, path) {
  contentKeys(value, path, ['dharma', 'bandwidth', 'anonymity']);
  for (const [key, amount] of Object.entries(value)) contentInteger(amount, `${path}.${key}`);
}
export function validateBalance(b) {
  contentKeys(b, 'balance', ['version', 'towers', 'enemies', 'bosses', 'waves', 'economy', 'difficulty', 'upgrades', 'combat', 'migration']);
  contentText(b.version, 'balance.version');
  contentKeys(b.towers, 'balance.towers', ACTIVE_TOWER_TYPES);
  for (const type of ACTIVE_TOWER_TYPES) {
    const t = b.towers[type], path = `balance.towers.${type}`;
    contentKeys(t, path, ['name', 'description', 'icon', 'cost', 'baseDamage', 'ratePerSec', 'projectileSpeed', 'range', 'aoeRadius', 'critChance', 'critMult', 'status', 'color', ...(type === 'distributor' ? ['support'] : ['damageType'])], ['specializations']);
    for (const key of ['name', 'description', 'icon']) contentText(t[key], `${path}.${key}`);
    assert(/^#[0-9a-fA-F]{6}$/.test(t.color), `Invalid ${path}.color`);
    contentResources(t.cost, `${path}.cost`);
    for (const key of ['baseDamage', 'ratePerSec', 'projectileSpeed', 'aoeRadius']) contentNumber(t[key], `${path}.${key}`);
    contentNumber(t.range, `${path}.range`, Number.MIN_VALUE);
    contentNumber(t.critChance, `${path}.critChance`, 0, 1);
    contentNumber(t.critMult, `${path}.critMult`, 1);
    if (type === 'distributor') {
      assert(t.baseDamage === 0 && t.ratePerSec === 0 && t.projectileSpeed === 0, 'Distributor must remain non-attacking support');
      contentKeys(t.support, `${path}.support`, ['fireRatePct', 'fireRatePctPerLevel']);
      contentNumber(t.support.fireRatePct, `${path}.support.fireRatePct`, 0, 1);
      contentNumber(t.support.fireRatePctPerLevel, `${path}.support.fireRatePctPerLevel`, 0, 1);
    } else {
      assert(t.ratePerSec > 0 && t.projectileSpeed > 0 && ['physical', 'fire', 'shock'].includes(t.damageType), `Invalid ${path}.damageType or attack rate`);
    }
    contentKeys(t.status, `${path}.status`, ['slowPct', 'slowDuration'], ['vulnerabilityPct', 'vulnerabilityDuration']);
    contentNumber(t.status.slowPct, `${path}.status.slowPct`, 0, 1);
    contentNumber(t.status.slowDuration, `${path}.status.slowDuration`);
    assert((t.status.vulnerabilityPct === undefined) === (t.status.vulnerabilityDuration === undefined), `Incomplete ${path}.status.vulnerability`);
    if (t.status.vulnerabilityPct !== undefined) {
      contentNumber(t.status.vulnerabilityPct, `${path}.status.vulnerabilityPct`, 0, 1);
      contentNumber(t.status.vulnerabilityDuration, `${path}.status.vulnerabilityDuration`);
    }
  }
  for (const type of ACTIVE_TOWER_TYPES) {
    const branches = b.towers[type].specializations;
    if (['1.2.0', '1.3.0'].includes(b.version) && type !== 'distributor') assert(branches, 'Missing tower specializations');
    if (!branches) continue; // Historical linear content remains usable for comparisons.
    assert(type !== 'distributor' && b.upgrades.maxLevel >= 3, 'Invalid specialization tower');
    contentKeys(branches, `${type}.specializations`, type === 'firewall' ? ['focus', 'coverage'] : ['sustain', 'reach']);
    for (const [id, branch] of Object.entries(branches)) {
      contentKeys(branch, `${type}.${id}`, ['name', 'description', 'damageMultiplier', 'rangeMultiplier', 'rateMultiplier', 'slowMultiplier', 'durationMultiplier', 'vulnerabilityMultiplier', 'chainTargets']);
      contentText(branch.name, `${id}.name`); contentText(branch.description, `${id}.description`);
      for (const key of ['damageMultiplier', 'rangeMultiplier', 'rateMultiplier', 'slowMultiplier', 'durationMultiplier', 'vulnerabilityMultiplier']) contentNumber(branch[key], `${id}.${key}`, Number.MIN_VALUE, 10);
      contentInteger(branch.chainTargets, `${id}.chainTargets`);
      assert(branch.chainTargets <= 10 && (type !== 'firewall' || branch.chainTargets === 0), 'Invalid specialization chain');
      for (let level = 3; level <= b.upgrades.maxLevel; level++) {
        for (const value of Object.values(getTowerStats(b, type, level, id))) if (typeof value === 'number') assert(number(value), 'Nonfinite specialization stats');
      }
    }
  }
  assert(b.enemies && typeof b.enemies === 'object' && !Array.isArray(b.enemies), 'Invalid balance.enemies');
  contentKeys(b.enemies, 'balance.enemies', Object.keys(b.enemies));
  assert(Object.keys(b.enemies).length > 0, 'Regular enemies required');
  assert(Object.keys(b.enemies).every((id) => /^[a-z][A-Za-z0-9]*$/.test(id)), 'Invalid regular enemy ID');
  contentKeys(b.bosses, 'balance.bosses', ['raidTeam', 'megaCorpTitan']);
  assert(!Object.keys(b.enemies).some((key) => Object.hasOwn(b.bosses, key)), 'Overlapping enemy IDs');
  for (const [id, e] of Object.entries({ ...b.enemies, ...b.bosses })) {
    const path = `${Object.hasOwn(b.bosses, id) ? 'balance.bosses' : 'balance.enemies'}.${id}`;
    contentKeys(e, path, ['name', 'description', 'icon', 'baseHP', 'armor', 'resists', 'moveSpeed', 'bounty', 'color', 'size', ...(Object.hasOwn(b.bosses, id) ? ['abilities'] : [])], ['leakDamage']);
    for (const key of ['name', 'description', 'icon']) contentText(e[key], `${path}.${key}`);
    assert(/^#[0-9a-fA-F]{6}$/.test(e.color), `Invalid ${path}.color`);
    for (const key of ['baseHP', 'moveSpeed', 'size']) contentNumber(e[key], `${path}.${key}`, Number.MIN_VALUE);
    contentNumber(e.armor, `${path}.armor`);
    if (e.leakDamage !== undefined) contentInteger(e.leakDamage, `${path}.leakDamage`, 1);
    contentKeys(e.resists, `${path}.resists`, ['physical', 'fire', 'shock']);
    for (const [key, value] of Object.entries(e.resists)) contentNumber(value, `${path}.resists.${key}`);
    contentResources(e.bounty, `${path}.bounty`);
  }
  const raid = b.bosses.raidTeam.abilities, titan = b.bosses.megaCorpTitan.abilities;
  contentKeys(raid, 'balance.bosses.raidTeam.abilities', ['emp', 'reinforcements']);
  contentKeys(raid.emp, 'balance.bosses.raidTeam.abilities.emp', ['thresholds', 'radius', 'durationMs']);
  assert(Array.isArray(raid.emp.thresholds) && raid.emp.thresholds.length === 2, 'Two EMP thresholds required');
  raid.emp.thresholds.forEach((threshold, index) => {
    contentNumber(threshold, `EMP threshold ${index}`, Number.MIN_VALUE, 1);
    assert(index === 0 || threshold < raid.emp.thresholds[index - 1], 'EMP thresholds must descend');
  });
  contentNumber(raid.emp.radius, 'EMP radius', Number.MIN_VALUE);
  contentNumber(raid.emp.durationMs, 'EMP durationMs', Number.MIN_VALUE);
  contentKeys(raid.reinforcements, 'balance.bosses.raidTeam.abilities.reinforcements', ['byPhase', 'intervalMs', 'hpMultiplierPerWave']);
  assert(Array.isArray(raid.reinforcements.byPhase) && raid.reinforcements.byPhase.length === raid.emp.thresholds.length && raid.reinforcements.byPhase.every((phase) => Array.isArray(phase) && phase.length > 0 && phase.every((id) => Object.hasOwn(b.enemies, id))), 'Invalid reinforcement phases');
  contentNumber(raid.reinforcements.intervalMs, 'Reinforcement intervalMs');
  contentNumber(raid.reinforcements.hpMultiplierPerWave, 'Reinforcement hpMultiplierPerWave');
  contentKeys(titan, 'balance.bosses.megaCorpTitan.abilities', ['shield']);
  contentKeys(titan.shield, 'balance.bosses.megaCorpTitan.abilities.shield', ['healthRatio', 'regenRatioPerSec', 'recoveryDelayMs']);
  contentNumber(titan.shield.healthRatio, 'Titan shield healthRatio', Number.MIN_VALUE);
  contentNumber(titan.shield.regenRatioPerSec, 'Titan shield regenRatioPerSec');
  contentNumber(titan.shield.recoveryDelayMs, 'Titan shield recoveryDelayMs', Number.MIN_VALUE);
  contentKeys(b.difficulty, 'balance.difficulty', ['Easy', 'Normal', 'Hard']);
  for (const name of ['Easy', 'Normal', 'Hard']) {
    const path = `balance.difficulty.${name}`;
    contentKeys(b.difficulty[name], path, ['hpMult', 'speedMult', 'bountyMult', 'damageToPlayerMult']);
    for (const key of ['hpMult', 'speedMult', 'bountyMult', 'damageToPlayerMult']) contentNumber(b.difficulty[name][key], `${path}.${key}`, Number.MIN_VALUE);
  }
  contentKeys(b.economy, 'balance.economy', ['startCash', 'startBandwidth', 'startAnonymity', 'killIncomeMult', 'waveClearBonus', 'waveClearBonusPerWave', 'initialLives', 'sellRefundPct', 'distributorWaveBonus', 'distributorWaveBonusCap', 'distributorAuraCap'], ['activeResources']);
  for (const key of ['startCash', 'startBandwidth', 'startAnonymity', 'waveClearBonus', 'waveClearBonusPerWave', 'distributorWaveBonus', 'distributorWaveBonusCap']) contentInteger(b.economy[key], `balance.economy.${key}`);
  if (b.version === '1.3.0' || b.economy.activeResources !== undefined) {
    assert(Array.isArray(b.economy.activeResources) && b.economy.activeResources.length === 2 &&
      b.economy.activeResources[0] === 'dharma' && b.economy.activeResources[1] === 'bandwidth', 'Invalid active resources');
    assert(b.economy.startAnonymity === 0 &&
      [...Object.values(b.towers).map(t => t.cost), ...Object.values(b.enemies).map(e => e.bounty), ...Object.values(b.bosses).map(e => e.bounty)].every(r => r.anonymity === 0),
      'Retired Anonymity must have zero supply and cost');
  }
  contentInteger(b.economy.initialLives, 'balance.economy.initialLives', 1);
  contentNumber(b.economy.killIncomeMult, 'balance.economy.killIncomeMult');
  contentNumber(b.economy.sellRefundPct, 'balance.economy.sellRefundPct', 0, 1);
  contentNumber(b.economy.distributorAuraCap, 'balance.economy.distributorAuraCap', 0, 1);
  assert(b.towers.distributor.support.fireRatePct <= b.economy.distributorAuraCap, 'Base Distributor aura exceeds cap');
  contentKeys(b.upgrades, 'balance.upgrades', ['costMultiplierPerLevel', 'damagePerLevel', 'rangePerLevel', 'fireRatePerLevel', 'maxLevel']);
  for (const key of ['costMultiplierPerLevel', 'damagePerLevel', 'rangePerLevel', 'fireRatePerLevel']) contentNumber(b.upgrades[key], `balance.upgrades.${key}`, key === 'costMultiplierPerLevel' ? Number.MIN_VALUE : 0);
  contentInteger(b.upgrades.maxLevel, 'balance.upgrades.maxLevel', 1);
  assert(b.upgrades.maxLevel <= 100, 'Invalid maxLevel');
  contentKeys(b.combat, 'balance.combat', ['status', 'chain']);
  contentKeys(b.combat.status, 'balance.combat.status', ['durationPerLevel', 'slowPctPerLevel', 'slowTowerCap', 'slowSpeedCap', 'vulnerabilityPctPerLevel', 'vulnerabilityTowerCap']);
  for (const [key, value] of Object.entries(b.combat.status)) contentNumber(value, `balance.combat.status.${key}`, key.endsWith('Cap') ? Number.MIN_VALUE : 0, key.endsWith('Cap') ? 1 : Infinity);
  assert(b.combat.status.slowTowerCap <= b.combat.status.slowSpeedCap, 'Tower slow cap exceeds runtime speed cap');
  for (const type of ACTIVE_TOWER_TYPES) {
    const status = b.towers[type].status;
    assert(status.slowPct <= b.combat.status.slowTowerCap && (status.slowPct > 0) === (status.slowDuration > 0), `Inactive or capped ${type} slow`);
    assert((status.vulnerabilityPct || 0) <= b.combat.status.vulnerabilityTowerCap && (Boolean(status.vulnerabilityPct) === Boolean(status.vulnerabilityDuration)), `Inactive or capped ${type} vulnerability`);
  }
  contentKeys(b.combat.chain, 'balance.combat.chain', ['unlockLevel', 'targets', 'radius', 'damageMultiplier']);
  contentInteger(b.combat.chain.unlockLevel, 'balance.combat.chain.unlockLevel', 1);
  assert(b.combat.chain.unlockLevel <= b.upgrades.maxLevel, 'Chain unlock exceeds maxLevel');
  contentInteger(b.combat.chain.targets, 'balance.combat.chain.targets', 1);
  contentNumber(b.combat.chain.radius, 'balance.combat.chain.radius', Number.MIN_VALUE);
  contentNumber(b.combat.chain.damageMultiplier, 'balance.combat.chain.damageMultiplier', Number.MIN_VALUE);
  for (const type of ACTIVE_TOWER_TYPES) for (let level=1; level<=b.upgrades.maxLevel; level++) {
    const derived = getTowerStats(b,type,level);
    for (const [key,value] of Object.entries(derived)) if (typeof value === 'number' && key !== 'cooldownMs') assert(number(value), 'Nonfinite derived tower stats');
    resources(getUpgradeCost(b,type,level));
  }
  assert(Array.isArray(b.waves) && b.waves.length > 0, 'Waves required');
  b.waves.forEach((w, i) => {
    contentKeys(w, `balance.waves[${i}]`, ['wave', 'enemies', 'rewardBonus']);
    assert(w.wave === i + 1 && Array.isArray(w.enemies) && w.enemies.length > 0, `Invalid wave ${i + 1}`);
    contentInteger(w.rewardBonus, `balance.waves[${i}].rewardBonus`);
    for (const [j, g] of w.enemies.entries()) {
      contentKeys(g, `balance.waves[${i}].enemies[${j}]`, ['id', 'count', 'interval', 'hpMult'], ['offsetMs']);
      assert(Object.hasOwn(b.enemies, g.id) || Object.hasOwn(b.bosses, g.id), 'Unknown wave enemy');
      contentInteger(g.count, 'Spawn count', 1);
      contentNumber(g.interval, 'Spawn interval');
      contentNumber(g.hpMult, 'Spawn hpMult', Number.MIN_VALUE);
      if (Object.hasOwn(g, 'offsetMs')) contentNumber(g.offsetMs, 'Spawn offsetMs');
    }
    assert(compileSpawnSchedule(b, w.wave).every(event => Number.isFinite(event.dueAtMs)), 'Invalid derived spawn time');
  });
  contentKeys(b.migration, 'balance.migration', ['deferredTowerRefunds']);
  assert(b.migration.deferredTowerRefunds && typeof b.migration.deferredTowerRefunds === 'object' && !Array.isArray(b.migration.deferredTowerRefunds), 'Invalid legacy refunds');
  contentKeys(b.migration.deferredTowerRefunds, 'balance.migration.deferredTowerRefunds', Object.keys(b.migration.deferredTowerRefunds));
  for (const [type, refund] of Object.entries(b.migration.deferredTowerRefunds)) contentResources(refund, `balance.migration.deferredTowerRefunds.${type}`);
  return b;
}

export function validateSnapshot(snapshot, balance) {
  validateBalance(balance);
  const raidReinforcements = balance.bosses.raidTeam.abilities.reinforcements;
  const reinforcementTypes = raidReinforcements.byPhase.flat();
  assert(snapshot?.schemaVersion === (balance.version === '1.0.0' && !balance.towers.firewall.specializations ? 2 : 3) && snapshot.balanceVersion === balance.version, 'Unsupported save schema or balance version');
  const s = snapshot.state, r = snapshot.runtime;
  const reinforcementMultiplier = 1 + s.waveNumber * raidReinforcements.hpMultiplierPerWave;
  assert(s && r && s.schemaVersion === snapshot.schemaVersion && s.balanceVersion === balance.version, 'Invalid state version');
  assert(Object.values(PHASES).includes(s.phase) && ![PHASES.LOADING, PHASES.MENU].includes(s.phase), 'Invalid saved phase');
  const waveActive = s.phase === PHASES.WAVE || (s.phase === PHASES.PAUSED && s.resumePhase === PHASES.WAVE);
  const terminal = TERMINAL_PHASES.has(s.phase);
  assert(s.phase === PHASES.PAUSED ? [PHASES.BUILDING, PHASES.WAVE].includes(s.resumePhase) : s.resumePhase === null, 'Invalid resume phase');
  assert(integer(s.seed, 0, 0xffffffff) && s.sessionId === `session-${s.seed}` && ['Easy','Normal','Hard'].includes(s.difficulty), 'Invalid session identity');
  assert(integer(s.waveNumber, 1, balance.waves.length) && s.maxWaves === balance.waves.length, 'Invalid wave number');
  assert(integer(s.lives, 0, balance.economy.initialLives) && (terminal || s.lives > 0), 'Invalid lives');
  fields(s, ['gameTimeMs', 'score']); resources(s.resources); stats(s.statistics);
  assert(s.waveSpeed === undefined || s.waveSpeed === 1 || s.waveSpeed === 2, 'Invalid wave speed');
  assert(s.phase !== PHASES.GAME_OVER || s.lives === 0, 'Game over with remaining lives');
  assert(s.phase !== PHASES.VICTORY || (s.lives > 0 && s.waveNumber === s.maxWaves && s.statistics.wavesCompleted === s.maxWaves), 'Incomplete victory');
  assert(s.settings && ['tutorialCompleted', 'showRanges', 'reducedMotion'].every(k => typeof s.settings[k] === 'boolean'), 'Invalid preferences');
  assert(ACTIVE_TOWER_TYPES.includes(s.selectedTowerType), 'Invalid selected tower');
  const ids = new Set();
  assert(integer(r.ids?.nextValue, 1) && r.ids.prefix === 'entity', 'Invalid ID sequence');
  const reference = (id, kind) => typeof id === 'string' && new RegExp(`^${kind}-[1-9][0-9]*$`).test(id) && integer(Number(id.split('-')[1]), 1, r.ids.nextValue - 1);
  for (const [collection, kind] of [['defenses', 'defense'], ['enemies', 'enemy'], ['projectiles', 'projectile'], ['effects', 'effect']]) {
    assert(Array.isArray(s[collection]), `Invalid ${collection}`);
    for (const e of s[collection]) {
      assert(e && reference(e.id, kind) && !ids.has(e.id), 'Invalid or duplicate entity ID'); ids.add(e.id);
      fields(e, ['radius']); assert(number(e.x, -100, 1060) && number(e.y, -100, 640), 'Invalid entity position');
    }
  }
  assert(s.effects.length === 0, 'Unsupported effects');
  for (const d of s.defenses) {
    assert(ACTIVE_TOWER_TYPES.includes(d.type) && integer(d.level, 1, balance.upgrades.maxLevel), 'Invalid tower type/level');
    const branches = balance.towers[d.type].specializations;
    assert(branches && d.level >= 3 ? typeof d.specialization === 'string' && Object.hasOwn(branches, d.specialization) : d.specialization === null || (snapshot.schemaVersion === 2 && d.specialization === undefined), 'Invalid tower specialization');
    const snapped = snapToBuildGrid(d);
    assert(isInsideWorld(d) && !isNearPath(d) && d.x === snapped.x && d.y === snapped.y && !s.defenses.some(other => other !== d && Math.hypot(other.x-d.x, other.y-d.y) < 45), 'Invalid build position');
    fields(d, ['cooldownMs', 'disabledUntilMs', 'totalDamage', 'kills']);
  }
  assert(s.selectedDefenseId === null || s.defenses.some(d => d.id === s.selectedDefenseId), 'Invalid selection reference');
  for (const e of s.enemies) {
    const definition = balance.enemies[e.type] || balance.bosses[e.type];
    assert(definition && e.kind === (balance.bosses[e.type] ? 'boss' : 'regular') && e.resolution === null, 'Invalid enemy');
    fields(e, ['health', 'maxHealth', 'speed', 'spawnedAtMs', 'slowUntilMs', 'vulnerabilityUntilMs', 'empUntilMs', 'shield', 'shieldMax', 'shieldCooldownUntilMs', 'shieldRegenPerSec']);
    assert(e.health > 0 && e.health <= e.maxHealth && e.shield <= e.shieldMax && number(e.slowPct, 0, balance.combat.status.slowSpeedCap) && number(e.vulnerabilityPct, 0, 1) && number(e.pathDistance, 0, PATH_METRICS.totalLength), 'Invalid enemy runtime');
    const multipliers = balance.waves[s.waveNumber-1].enemies.filter(g => g.id === e.type).map(g => g.hpMult);
    if (reinforcementTypes.includes(e.type)) multipliers.push(reinforcementMultiplier);
    assert(multipliers.some(hpMultiplier => {
      const expected = createEnemy({ id:e.type, kind:e.kind, ...definition }, {id:e.id, hpMultiplier, difficulty:balance.difficulty[s.difficulty]});
      return ['maxHealth','speed','radius','shieldMax','shieldRegenPerSec'].every(k => e[k] === expected[k]);
    }) && e.spawnedAtMs <= s.gameTimeMs, 'Enemy disagrees with balance');
    const p = pointAtPathDistance(e.pathDistance);
    assert(Math.abs(p.x-e.x) < 1e-6 && Math.abs(p.y-e.y) < 1e-6, 'Enemy position disagrees with path');
    assert(Array.isArray(e.firedPhases) && (e.type === 'raidTeam'
      ? integer(e.phase, 0, balance.bosses.raidTeam.abilities.emp.thresholds.length) &&
        e.firedPhases.length === e.phase && e.firedPhases.every((fired, index) => fired === index + 1)
      : e.phase === 0 && e.firedPhases.length === 0), 'Invalid boss phases');
  }
  for (const p of s.projectiles) {
    // Targets/hit IDs may have died earlier in the same tick. They must still be allocated IDs.
    assert(reference(p.sourceId, 'defense') && s.defenses.some(d => d.id === p.sourceId && d.type === p.sourceType) && reference(p.targetId, 'enemy'), 'Invalid projectile references');
    assert(Array.isArray(p.hitIds) && new Set(p.hitIds).size === p.hitIds.length && p.hitIds.every(id => reference(id, 'enemy')), 'Invalid hit references');
    fields(p, ['speed', 'damage', 'aoeRadius', 'slowDurationMs', 'vulnerabilityDurationMs', 'createdAtMs', 'expiresAtMs']);
    assert(number(p.slowPct, 0, balance.combat.status.slowSpeedCap) && number(p.vulnerabilityPct, 0, 1) && integer(p.chainTargets) && typeof p.critical === 'boolean' && typeof p.piercing === 'boolean' && ['physical','fire','shock'].includes(p.damageType) && p.expiresAtMs >= p.createdAtMs, 'Invalid projectile');
  }
  const w = s.wave, schedule = r.scheduler;
  assert(w && ['scheduled','spawned','resolved','killed','leaked','spawnCursor'].every(k => integer(w[k])) && w.resolved === w.killed+w.leaked && w.spawned === w.resolved+s.enemies.length && w.spawned <= w.scheduled, 'Invalid wave counters');
  assert(w.startedAtMs === null || number(w.startedAtMs, 0, s.gameTimeMs), 'Invalid wave start');
  assert(integer(r.generation) && schedule?.generation === r.generation && Array.isArray(schedule.events) && integer(schedule.cursor, 0, schedule.events.length) && number(schedule.elapsedMs), 'Invalid scheduler');
  if (waveActive) {
    assert(w.startedAtMs !== null && w.scheduled === schedule.events.length && w.spawned === schedule.cursor && w.spawnCursor === schedule.cursor && Math.abs(schedule.elapsedMs-(s.gameTimeMs-w.startedAtMs)) < 1e-5, 'Scheduler disagrees with wave');
    const expected = compileSpawnSchedule(balance, s.waveNumber);
    const base = schedule.events.filter(e => e.dynamic === false).sort((a,b) => a.order-b.order);
    assert(JSON.stringify(base) === JSON.stringify(expected), 'Modified base schedule');
  } else assert(schedule.events.length === 0 && schedule.cursor === 0 && schedule.elapsedMs === 0, 'Inactive scheduler');
  const orders = new Set();
  schedule.events.forEach((e, i) => {
    assert((balance.enemies[e.enemyType] || balance.bosses[e.enemyType]) && number(e.dueAtMs) && number(e.hpMultiplier, Number.MIN_VALUE) && integer(e.order) && !orders.has(e.order) && typeof e.dynamic === 'boolean', 'Invalid schedule event'); orders.add(e.order);
    if (e.dynamic) assert(reference(e.sourceId, 'enemy') && reinforcementTypes.includes(e.enemyType) && e.hpMultiplier === reinforcementMultiplier && e.order >= compileSpawnSchedule(balance,s.waveNumber).length, 'Invalid reinforcement');
    if (i < schedule.cursor) assert(e.dueAtMs <= schedule.elapsedMs+1e-6, 'Premature spawn cursor');
    if (i > 0) {
      const previous = schedule.events[i - 1];
      assert(e.dueAtMs > previous.dueAtMs || (e.dueAtMs === previous.dueAtMs && e.order > previous.order), 'Unsorted schedule or unstable spawn tie');
    }
  });
  const dynamic = schedule.events.filter(e => e.dynamic);
  const raidCount = balance.waves[s.waveNumber-1].enemies.filter(g => g.id==='raidTeam').reduce((n,g)=>n+g.count,0);
  assert(dynamic.length <= raidCount*reinforcementTypes.length, 'Excess reinforcements');
  for (const source of new Set(dynamic.map(e=>e.sourceId))) {
    const events=dynamic.filter(e=>e.sourceId===source), boss=s.enemies.find(e=>e.id===source);
    assert(events.length<=reinforcementTypes.length &&
      [...new Set(reinforcementTypes)].every(type => events.filter(e=>e.enemyType===type).length <= reinforcementTypes.filter(id=>id===type).length) &&
      (!boss || boss.type==='raidTeam'), 'Invalid reinforcement source/content');
  }
  assert([...orders].every(order => order < schedule.events.length), 'Noncontiguous schedule order');
  assert(number(r.clock?.accumulatorMs, -1e-8, 1000/60+1e-8) && integer(r.randomState, 1, 0xffffffff), 'Invalid runtime clock/random');
  if (!waveActive && !terminal) assert(s.enemies.length === 0 && s.projectiles.length === 0, 'Entities outside combat');
  validateReports(s.reports, balance);
  if (s.lastWaveResult !== null) { const result = s.lastWaveResult; assert(integer(result.waveNumber, 1, s.maxWaves) && integer(result.killed) && integer(result.leaked), 'Invalid wave result'); resources(result.reward); }
  if (terminal) {
    stats(s.finalStatistics); fields(s.finalStatistics, ['score', 'lives', 'waveNumber']);
    assert(['kills','leaks','bossesKilled','wavesCompleted'].every(k => s.finalStatistics[k] === s.statistics[k]) && ['score','lives','waveNumber'].every(k => s.finalStatistics[k] === s[k]), 'Results disagree with run');
  } else assert(s.finalStatistics === null, 'Unexpected final results');
  return snapshot;
}
