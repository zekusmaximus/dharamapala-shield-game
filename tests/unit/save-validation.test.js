import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession } from '../../js/core/GameSession.js';
import { validateBalance } from '../../js/core/rules/validation.js';
import { loadBalance } from '../helpers/loadBalance.js';
import { BrowserSaveRepository, SAVE_KEY } from '../../js/platform/BrowserSaveRepository.js';
const balance = await loadBalance();
function fixture() {
  const s = new GameSession(balance, { tutorialCompleted: true });
  s.newGame(); s.placeDefense('firewall', {x:210,y:210}); s.startWave();
  for (let i=0;i<30;i++) s.tick(1000/60);
  return s;
}
const mutations = {
  resource: s => delete s.state.resources.bandwidth,
  lives: s => s.state.lives = -1,
  wave: s => s.state.waveNumber = 999,
  level: s => s.state.defenses[0].level = 0,
  position: s => s.state.defenses[0].x = 140,
  overlap: s => s.state.defenses.push({...s.state.defenses[0], id:'defense-2'}),
  enemyPosition: s => s.state.enemies[0].x = 999,
  health: s => s.state.enemies[0].health = Infinity,
  phases: s => s.state.enemies[0].firedPhases = [2],
  projectileId: s => s.state.projectiles[0].id = s.state.enemies[0].id,
  source: s => s.state.projectiles[0].sourceId = 'defense-999',
  target: s => s.state.projectiles[0].targetId = 'bogus',
  hitIds: s => s.state.projectiles[0].hitIds = [null],
  enemyType: s => s.runtime.scheduler.events[0].enemyType = 'bogus',
  schedule: s => s.runtime.scheduler.events[0].hpMultiplier = 123,
  cursor: s => s.runtime.scheduler.cursor = 999,
  waveCursor: s => s.state.wave.spawnCursor = 0,
  count: s => s.state.wave.scheduled++,
  gameOver: s => { s.state.phase='GAME_OVER'; s.state.finalStatistics={...s.state.statistics,score:s.state.score,lives:s.state.lives,waveNumber:1}; },
  victory: s => { s.state.phase='VICTORY'; s.state.finalStatistics={...s.state.statistics,score:s.state.score,lives:s.state.lives,waveNumber:1}; },
  phase: s => s.state.phase = 'BUILDING',
  resume: s => s.state.resumePhase = 'WAVE',
  clock: s => s.runtime.clock.accumulatorMs = 999,
  generation: s => s.runtime.generation++,
  random: s => s.runtime.randomState = -1,
  sequence: s => s.runtime.ids.nextValue = 1,
  settings: s => s.state.settings.showRanges = 'false',
  result: s => s.state.finalStatistics = {},
  balanceVersion: s => s.balanceVersion = 'future'
};
for (const [name, mutate] of Object.entries(mutations)) test(`reject malformed save: ${name}`, () => {
  const live = fixture(), before = live.toSnapshot();
  const bad = structuredClone(before); mutate(bad);
  assert.throws(() => GameSession.fromSnapshot(balance, bad));
  assert.deepEqual(live.toSnapshot().state, before.state);
});
for (const [name, mutate] of Object.entries({
  cost: b => b.towers.firewall.cost.bandwidth = -1,
  damage: b => b.towers.firewall.baseDamage = NaN,
  resistance: b => delete b.enemies.scriptKiddie.resists.shock,
  wave: b => b.waves[1].wave = 1,
  group: b => b.waves[0].enemies[0].hpMult = 0,
  difficulty: b => b.difficulty.Normal.hpMult = 0,
  economy: b => b.economy.initialLives = -1,
  upgrades: b => b.upgrades.maxLevel = 0
})) test(`reject malformed balance: ${name}`, () => { const b=structuredClone(balance); mutate(b); assert.throws(() => validateBalance(b)); });
test('denied storage never throws, including acquisition/read/write/reset', () => {
  const storage = { getItem(){throw Error('denied');}, setItem(){throw Error('quota');}, removeItem(){throw Error('denied');} };
  const repo = new BrowserSaveRepository(storage);
  assert.equal(repo.hasSave(), false); assert.equal(repo.load(balance).ok, false);
  assert.equal(repo.save(fixture()).ok, false); assert.equal(repo.clear().ok, false);
  assert.equal(repo.getTutorialCompleted(), false); assert.equal(repo.exportCorrupt(), null);
});
test('invalid payload cannot be overwritten before explicit reset', () => {
  const data=new Map([[SAVE_KEY,'broken']]);
  const repo=new BrowserSaveRepository({ getItem:k=>data.get(k), setItem:(k,v)=>data.set(k,v), removeItem:k=>data.delete(k) });
  assert.equal(repo.load(balance).ok,false); assert.equal(repo.save(fixture()).ok,false);
  assert.equal(data.get(SAVE_KEY),'broken'); assert.equal(repo.clear().ok,true);
  assert.equal(repo.exportCorrupt(),'broken'); assert.equal(repo.save(fixture()).ok,true);
});
