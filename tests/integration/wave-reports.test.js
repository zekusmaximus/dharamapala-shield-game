import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession, PHASES } from '../../js/core/GameSession.js';
import { getKillReward, getWaveReward } from '../../js/core/rules/economy.js';
import { createProjectile } from '../../js/entities/createProjectile.js';
import { getTowerStats } from '../../js/core/rules/towers.js';
import { PATH_METRICS, pointAtPathDistance } from '../../js/core/world.js';
import { loadBalance } from '../helpers/loadBalance.js';
const balance = await loadBalance();
function session() {
  const s = new GameSession(balance, { tutorialCompleted: true }); s.newGame(); return s;
}
function finish(s) {
  for (let i=0; i<30000 && s.state.phase === PHASES.WAVE; i++) s.tick(1000/60);
  assert.notEqual(s.state.phase, PHASES.WAVE);
}

test('real wave combat accounts spending, refunds, bounties, clear income and tower work; reports survive starts and restore', () => {
  const s = session();
  const start = { ...s.state.resources };
  s.placeDefense('firewall', {x:210,y:210});
  const first = s.state.selectedDefenseId;
  s.sellDefense(first);
  s.placeDefense('firewall', {x:210,y:210});
  s.startWave(); finish(s);
  const r = s.state.reports.pending[0];
  assert.ok(r.killed > 0);
  assert.equal(r.spent.dharma, 2 * balance.towers.firewall.cost.dharma);
  assert.equal(r.refunds.dharma, Math.floor(balance.towers.firewall.cost.dharma * balance.economy.sellRefundPct));
  assert.deepEqual(r.clear, getWaveReward(balance,balance.waves[0],1,0));
  const bounty = getKillReward(balance,balance.enemies.scriptKiddie,'Normal');
  for (const key of Object.keys(start)) {
    assert.equal(r.bounty[key], bounty[key] * r.killed);
    assert.equal(s.state.resources[key],start[key]-r.spent[key]+r.refunds[key]+r.bounty[key]+r.clear[key]);
  }
  const t = Object.values(r.towers)[0];
  assert.ok(t.health>0 && t.shots>0); assert.equal(t.kills,r.killed);
  assert.equal(t.shield,0); assert.equal(t.slowHits,0);
  s.startWave();
  assert.deepEqual(s.state.reports.pending[0],r);
  const restored = GameSession.fromSnapshot(balance,s.toSnapshot());
  finish(s); finish(restored);
  assert.deepEqual(restored.state.reports,s.state.reports);
  restored.dismissReport(1);
  assert.equal(restored.state.reports.pending.length,1);
  assert.deepEqual(GameSession.fromSnapshot(balance,restored.toSnapshot()).state.reports,restored.state.reports);
});

test('natural leaks record enemy types, no coverage and sampled last coverage, including defeat', () => {
  const s = session(); s.state.waveNumber=3; s.startWave(); finish(s);
  const r=s.state.reports.pending[0];
  assert.equal(r.leaks.length,r.leaked);
  assert.ok(new Set(r.leaks.map(l=>l.type)).size>1);
  assert.ok(r.leaks.every(l=>l.lastCovered===null));
  const covered=session(); covered.placeDefense('firewall',{x:210,y:210}); covered.startWave(); covered.state.defenses.values().next().value.disabledUntilMs=1e9; finish(covered);
  assert.ok(covered.state.reports.pending[0].leaks.some(l=>l.lastCovered>0 && l.lastCovered<PATH_METRICS.totalLength));
  const defeat=session(); defeat.state.lives=1; defeat.startWave(); finish(defeat);
  assert.equal(defeat.state.reports.pending[0].outcome,'defeat');
  assert.equal(defeat.state.reports.pending[0].leaked,1);
  assert.equal(defeat.state.reports.pending[0].clear.dharma,0);
});

test('production impact path records shield absorption, capped health, and control applications without inventing assistance damage', () => {
  const s=session(); s.placeDefense('encryption',{x:210,y:210});
  const tower=s.state.defenses.get(s.state.selectedDefenseId);
  s.state.waveNumber=10; s.startWave();
  const titan=s.spawnEnemy({enemyType:'megaCorpTitan',hpMultiplier:1});
  const stats=getTowerStats(balance,tower.type,1);
  const hit=()=>s.systems.combat.applyHit(s,createProjectile({id:'test',source:tower,targetId:titan.id,stats,damage:100,critical:false,nowMs:0}),titan,1);
  const shield=titan.shield; hit();
  const entry=s.state.reports.active.towers[tower.id];
  assert.equal(entry.health,0); assert.equal(entry.shield,shield-titan.shield);
  assert.equal(entry.slowHits,1); assert.equal(entry.vulnerabilityHits,1);
  titan.shield=0; titan.health=1; hit();
  assert.equal(entry.health,1); assert.equal(entry.kills,1);
  assert.equal(entry.slowHits,2); assert.equal(entry.auraShots,0);
});

test('production firing records overlapping capped aura presence but excludes EMP-disabled support', () => {
  const s=session(); s.state.resources={dharma:10000,bandwidth:10000,anonymity:10000};
  for(const [type,x,y] of [['firewall',210,210],['distributor',270,210],['distributor',210,150],['distributor',270,150],['distributor',210,330]]) assert.ok(s.placeDefense(type,{x,y}).ok);
  s.startWave(); const enemy=s.spawnEnemy({enemyType:'scriptKiddie',hpMultiplier:1});
  Object.assign(enemy,pointAtPathDistance(100)); enemy.pathDistance=100;
  const towers=[...s.state.defenses.values()]; towers[1].disabledUntilMs=1000;
  s.systems.defense.update(s,1);
  const entries=s.state.reports.active.towers;
  assert.equal(entries[towers[0].id].shots,1);
  assert.equal(entries[towers[1].id].auraShots,0);
  for(const support of towers.slice(2)) assert.equal(entries[support.id].auraShots,1);
  assert.ok(towers[0].cooldownMs<1000/1.3);
});

test('legacy v2 reports are optional and explicitly partial; malformed tracking is rejected', () => {
  const s=session(); s.startWave(); s.tick(1000);
  const old=s.toSnapshot(); delete old.state.reports;
  const restored=GameSession.fromSnapshot(balance,old);
  assert.equal(restored.state.reports.active.partial,true); finish(restored);
  assert.equal(restored.state.reports.pending[0].partial,true);
  const bad=s.toSnapshot(); bad.state.reports.active.spent.dharma=-1;
  assert.throws(()=>GameSession.fromSnapshot(balance,bad),/Invalid wave reports/);
  const snapshot=s.toSnapshot(); const copy=GameSession.fromSnapshot(balance,snapshot);
  copy.state.reports.active.spent.dharma=25;
  assert.equal(snapshot.state.reports.active.spent.dharma,0);
});

test('a disabled Distributor reports passive clear income independently of active aura', () => {
  const s=session(); s.state.resources={dharma:1000,bandwidth:1000,anonymity:1000};
  s.placeDefense('distributor',{x:270,y:210}); s.startWave();
  const support=s.state.defenses.values().next().value; support.disabledUntilMs=1e9;
  finish(s); const r=s.state.reports.pending[0];
  assert.equal(r.passiveDharma,balance.economy.distributorWaveBonus);
  assert.equal(r.clear.dharma,getWaveReward(balance,balance.waves[0],1,0).dharma+r.passiveDharma);
  assert.equal(r.towers[support.id].auraShots,0);
  assert.equal(r.towers[support.id].health,0);
});

test('invalid report counts, types, coverage and resource payloads fail before restoration', () => {
  const s=session(); s.placeDefense('firewall',{x:210,y:210}); s.startWave(); finish(s);
  for(const mutate of [
    r=>r.pending[0].leaked++,
    r=>r.pending[0].leaks.push({type:'unknown',damage:1,lastCovered:null}),
    r=>r.active.coverage.bad=Infinity,
    r=>r.pending[0].towers[Object.keys(r.pending[0].towers)[0]].shots=0.5,
    r=>r.pending.push(structuredClone(r.pending[0])),
    r=>r.active.refunds=null
  ]) {
    const snapshot=s.toSnapshot(); mutate(snapshot.state.reports);
    assert.throws(()=>GameSession.fromSnapshot(balance,snapshot),/Invalid wave reports/);
  }
});
