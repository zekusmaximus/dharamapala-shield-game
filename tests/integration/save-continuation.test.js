import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession } from '../../js/core/GameSession.js';
import { loadBalance } from '../helpers/loadBalance.js';
const balance=await loadBalance();
for (const wave of [1,5,15]) test(`continued combat parity through wave ${wave}, including nested isolation`, () => {
  const live=new GameSession(balance,{tutorialCompleted:true}); live.newGame();
  // Fixed combat scenario; production prices/stats and enemy schedules are unchanged.
  live.state.resources={dharma:3000,bandwidth:3000,anonymity:3000};
  for (const p of [{x:210,y:210},{x:270,y:210},{x:450,y:270},{x:510,y:270},{x:750,y:270}]) live.placeDefense('firewall',p);
  live.placeDefense('encryption',{x:450,y:150});
  live.state.waveNumber=wave; live.startWave();
  let steps=0;
  while (steps++<1800) {
    live.tick(1000/60);
    const boss=[...live.state.enemies.values()].find(e=>e.kind==='boss');
    if (wave===1 ? steps===120 : boss && (wave===5 ? boss.firedPhases.length===1 : boss.shield < boss.shieldMax)) break;
  }
  assert.ok(steps<1800,'reached actual mid-combat checkpoint');
  assert.ok(live.state.projectiles.size || live.state.enemies.size);
  const snapshot=live.toSnapshot(), original=structuredClone(snapshot);
  const restored=GameSession.fromSnapshot(balance,snapshot);
  if (wave===5) assert.deepEqual([...restored.state.enemies.values()].find(e=>e.kind==='boss').firedPhases,[1]);
  for (let tick=0;tick<15000 && live.state.phase==='WAVE';tick++) {
    const delta=[17,31,8,19][tick%4]; live.tick(delta); restored.tick(delta);
    if (tick%60===0 || live.state.phase!=='WAVE') {
      assert.deepEqual(restored.toSnapshot().state,live.toSnapshot().state);
      assert.deepEqual(restored.toSnapshot().runtime,live.toSnapshot().runtime);
    }
  }
  assert.notEqual(live.state.phase,'WAVE','combat finished');
  assert.ok(live.state.wave.resolved>original.state.wave.resolved);
  assert.deepEqual(snapshot,original,'continued boss phases/hit IDs/results cannot mutate source');
  const saved=restored.toSnapshot(); saved.state.resources.dharma=-100;
  assert.ok(restored.state.resources.dharma>=0,'export is isolated too');
});
