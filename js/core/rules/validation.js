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
export function validateBalance(b) {
  assert(b && typeof b.version === 'string' && b.version.length > 0, 'Balance version required');
  for (const type of ACTIVE_TOWER_TYPES) {
    const t = b.towers?.[type];
    assert(t, `Missing active tower: ${type}`);
    resources(t.cost);
    fields(t, ['baseDamage', 'ratePerSec', 'projectileSpeed', 'aoeRadius']);
    assert(number(t.range, Number.MIN_VALUE) && number(t.critChance, 0, 1) && number(t.critMult, 1), 'Invalid tower stats');
    assert(type === 'distributor' || (t.ratePerSec > 0 && t.projectileSpeed > 0 && ['physical', 'fire', 'shock'].includes(t.damageType)), 'Invalid attacking tower');
    for (const [key, value] of Object.entries(t.status || {})) assert(number(value, 0, key.endsWith('Pct') ? 1 : Infinity), 'Invalid tower status');
    if (t.support) assert(number(t.support.fireRatePct, 0, 1), 'Invalid support');
  }
  assert(b.enemies && b.bosses && !Object.keys(b.enemies).some(k => k in b.bosses), 'Invalid enemy IDs');
  for (const e of Object.values({ ...b.enemies, ...b.bosses })) {
    assert(number(e.baseHP, Number.MIN_VALUE) && number(e.moveSpeed, Number.MIN_VALUE) && number(e.size, Number.MIN_VALUE), 'Invalid enemy stats');
    fields(e, ['armor']); fields(e.resists, ['physical', 'fire', 'shock']); resources(e.bounty);
  }
  for (const name of ['Easy', 'Normal', 'Hard']) fields(b.difficulty?.[name], ['hpMult', 'speedMult', 'bountyMult', 'damageToPlayerMult'], Number.MIN_VALUE);
  fields(b.economy, ['startCash', 'startBandwidth', 'startAnonymity', 'killIncomeMult', 'waveClearBonus', 'waveClearBonusPerWave', 'distributorWaveBonus', 'distributorWaveBonusCap']);
  assert(integer(b.economy.initialLives, 1) && number(b.economy.sellRefundPct, 0, 1) && number(b.economy.distributorAuraCap, 0, 1), 'Invalid economy');
  fields(b.upgrades, ['costMultiplierPerLevel', 'damagePerLevel', 'rangePerLevel', 'fireRatePerLevel']);
  assert(b.upgrades.costMultiplierPerLevel > 0 && integer(b.upgrades.maxLevel, 1, 100), 'Invalid upgrades');
  for (const type of ACTIVE_TOWER_TYPES) for (let level=1; level<=b.upgrades.maxLevel; level++) {
    const derived = getTowerStats(b,type,level);
    for (const [key,value] of Object.entries(derived)) if (typeof value === 'number' && key !== 'cooldownMs') assert(number(value), 'Nonfinite derived tower stats');
    resources(getUpgradeCost(b,type,level));
  }
  assert(Array.isArray(b.waves) && b.waves.length > 0, 'Waves required');
  b.waves.forEach((w, i) => {
    assert(w.wave === i + 1 && Array.isArray(w.enemies) && w.enemies.length > 0 && number(w.rewardBonus), 'Invalid wave');
    for (const g of w.enemies) assert((b.enemies[g.id] || b.bosses[g.id]) && integer(g.count, 1) && number(g.interval) && number(g.hpMult, Number.MIN_VALUE), 'Invalid spawn group');
  });
  for (const refund of Object.values(b.migration?.deferredTowerRefunds || {})) resources(refund);
  return b;
}

export function validateSnapshot(snapshot, balance) {
  validateBalance(balance);
  assert(snapshot?.schemaVersion === 2 && snapshot.balanceVersion === balance.version, 'Unsupported save schema or balance version');
  const s = snapshot.state, r = snapshot.runtime;
  assert(s && r && s.schemaVersion === 2 && s.balanceVersion === balance.version, 'Invalid state version');
  assert(Object.values(PHASES).includes(s.phase) && ![PHASES.LOADING, PHASES.MENU].includes(s.phase), 'Invalid saved phase');
  const waveActive = s.phase === PHASES.WAVE || (s.phase === PHASES.PAUSED && s.resumePhase === PHASES.WAVE);
  const terminal = TERMINAL_PHASES.has(s.phase);
  assert(s.phase === PHASES.PAUSED ? [PHASES.BUILDING, PHASES.WAVE].includes(s.resumePhase) : s.resumePhase === null, 'Invalid resume phase');
  assert(integer(s.seed, 0, 0xffffffff) && s.sessionId === `session-${s.seed}` && ['Easy','Normal','Hard'].includes(s.difficulty), 'Invalid session identity');
  assert(integer(s.waveNumber, 1, balance.waves.length) && s.maxWaves === balance.waves.length, 'Invalid wave number');
  assert(integer(s.lives, 0, balance.economy.initialLives) && (terminal || s.lives > 0), 'Invalid lives');
  fields(s, ['gameTimeMs', 'score']); resources(s.resources); stats(s.statistics);
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
    const snapped = snapToBuildGrid(d);
    assert(isInsideWorld(d) && !isNearPath(d) && d.x === snapped.x && d.y === snapped.y && !s.defenses.some(other => other !== d && Math.hypot(other.x-d.x, other.y-d.y) < 45), 'Invalid build position');
    fields(d, ['cooldownMs', 'disabledUntilMs', 'totalDamage', 'kills']);
  }
  assert(s.selectedDefenseId === null || s.defenses.some(d => d.id === s.selectedDefenseId), 'Invalid selection reference');
  for (const e of s.enemies) {
    const definition = balance.enemies[e.type] || balance.bosses[e.type];
    assert(definition && e.kind === (balance.bosses[e.type] ? 'boss' : 'regular') && e.resolution === null, 'Invalid enemy');
    fields(e, ['health', 'maxHealth', 'speed', 'spawnedAtMs', 'slowUntilMs', 'vulnerabilityUntilMs', 'empUntilMs', 'shield', 'shieldMax', 'shieldCooldownUntilMs', 'shieldRegenPerSec']);
    assert(e.health > 0 && e.health <= e.maxHealth && e.shield <= e.shieldMax && number(e.slowPct, 0, 0.8) && number(e.vulnerabilityPct, 0, 1) && number(e.pathDistance, 0, PATH_METRICS.totalLength), 'Invalid enemy runtime');
    const multipliers = balance.waves[s.waveNumber-1].enemies.filter(g => g.id === e.type).map(g => g.hpMult);
    if (['scriptKiddie','federalAgent'].includes(e.type)) multipliers.push(1+s.waveNumber*0.02);
    assert(multipliers.some(hpMultiplier => {
      const expected = createEnemy({ id:e.type, kind:e.kind, ...definition }, {id:e.id, hpMultiplier, difficulty:balance.difficulty[s.difficulty]});
      return ['maxHealth','speed','radius','shieldMax','shieldRegenPerSec'].every(k => e[k] === expected[k]);
    }) && e.spawnedAtMs <= s.gameTimeMs, 'Enemy disagrees with balance');
    const p = pointAtPathDistance(e.pathDistance);
    assert(Math.abs(p.x-e.x) < 1e-6 && Math.abs(p.y-e.y) < 1e-6, 'Enemy position disagrees with path');
    assert(Array.isArray(e.firedPhases) && (e.type === 'raidTeam' ? [[0, []], [1, [1]], [2, [1,2]]].some(([phase, fired]) => e.phase === phase && JSON.stringify(e.firedPhases) === JSON.stringify(fired)) : e.phase === 0 && e.firedPhases.length === 0), 'Invalid boss phases');
  }
  for (const p of s.projectiles) {
    // Targets/hit IDs may have died earlier in the same tick. They must still be allocated IDs.
    assert(reference(p.sourceId, 'defense') && s.defenses.some(d => d.id === p.sourceId && d.type === p.sourceType) && reference(p.targetId, 'enemy'), 'Invalid projectile references');
    assert(Array.isArray(p.hitIds) && new Set(p.hitIds).size === p.hitIds.length && p.hitIds.every(id => reference(id, 'enemy')), 'Invalid hit references');
    fields(p, ['speed', 'damage', 'aoeRadius', 'slowDurationMs', 'vulnerabilityDurationMs', 'createdAtMs', 'expiresAtMs']);
    assert(number(p.slowPct, 0, 0.8) && number(p.vulnerabilityPct, 0, 1) && integer(p.chainTargets) && typeof p.critical === 'boolean' && typeof p.piercing === 'boolean' && ['physical','fire','shock'].includes(p.damageType) && p.expiresAtMs >= p.createdAtMs, 'Invalid projectile');
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
    if (e.dynamic) assert(reference(e.sourceId, 'enemy') && ['scriptKiddie','federalAgent'].includes(e.enemyType) && e.hpMultiplier === 1+s.waveNumber*0.02 && e.order >= compileSpawnSchedule(balance,s.waveNumber).length, 'Invalid reinforcement');
    if (i < schedule.cursor) assert(e.dueAtMs <= schedule.elapsedMs+1e-6, 'Premature spawn cursor');
    if (i > schedule.cursor) assert(e.dueAtMs >= schedule.events[i-1].dueAtMs, 'Unsorted pending schedule');
  });
  const dynamic = schedule.events.filter(e => e.dynamic);
  const raidCount = balance.waves[s.waveNumber-1].enemies.filter(g => g.id==='raidTeam').reduce((n,g)=>n+g.count,0);
  assert(dynamic.length <= raidCount*4, 'Excess reinforcements');
  for (const source of new Set(dynamic.map(e=>e.sourceId))) {
    const events=dynamic.filter(e=>e.sourceId===source), boss=s.enemies.find(e=>e.id===source);
    assert(events.length<=4 && events.filter(e=>e.enemyType==='federalAgent').length<=1 && (!boss || boss.type==='raidTeam'), 'Invalid reinforcement source/content');
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
