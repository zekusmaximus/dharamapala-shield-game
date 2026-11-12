import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadBalance} from '../helpers/loadBalance.js';
import {GameSession} from '../../js/core/GameSession.js';
import {BrowserSaveRepository,SAVE_KEY,PREFERENCES_KEY} from '../../js/platform/BrowserSaveRepository.js';
import {prepareTradeoff,runTradeoff} from '../../tools/balance/tradeoffs.mjs';
const balance=await loadBalance();
const historical=JSON.parse(await readFile(new URL('../../design/reviews/2026-11-12-m3.3/baseline-1.2.0.json',import.meta.url)));
const data=s=>{const {state,runtime}=s.toSnapshot();return {state,runtime};};
for(const plan of ['focus','coverage','sustain','reach']) for(const speed of [1,2]) test(`${plan} ${speed}× production Raid combat survives JSON pause/continue through clearance`,()=>{
  const s=prepareTradeoff(balance,5,'central',plan,{dharma:420,bandwidth:300,anonymity:0}); // documented budget/wave fixture
  s.setWaveSpeed(speed);s.startWave();
  for(let i=0;i<180;i++)s.tick(1000/60/speed);
  assert.ok(s.state.projectiles.size>0 || Object.values(s.state.reports.active.towers).some(t=>t.health>0));
  s.pause();const frozen=data(s);s.tick(10000);assert.deepEqual(data(s),frozen);
  const snapshot=JSON.parse(JSON.stringify(s.toSnapshot()));assert.equal(snapshot.schemaVersion,4);
  const restored=GameSession.fromSnapshot(balance,snapshot);
  s.resume();restored.resume();
  let frames=0;
  while(s.state.phase==='WAVE' && frames++<20000){const dt=[17,31,8,19][frames%4]/speed;s.tick(dt);restored.tick(dt);if(frames%60===0)assert.deepEqual(data(s),data(restored));}
  assert.ok(frames<20000);assert.deepEqual(data(s),data(restored));
  const report=s.state.reports.pending.at(-1);
  assert.ok(report.killed>0);assert.ok(Object.values(report.towers).some(t=>t.health>0 && t.shots>0));
  if(['sustain','reach'].includes(plan))assert.ok(Object.values(report.towers).some(t=>t.slowHits>0 && t.vulnerabilityHits>0));
  assert.equal(Object.values(report.towers).reduce((n,t)=>n+t.kills,0),report.killed);
});
test('controlled comparisons show scenario-dependent damage/control choices and aura activity',()=>{
  // Keep the M3.2 equal-budget combat comparison pinned to its original content.
  const run=(wave,layout,plan)=>runTradeoff(historical,wave,layout,plan);
  assert.ok(run(3,'central','coverage').timeMs<run(3,'central','focus').timeMs);
  assert.ok(run(3,'spread','focus').timeMs<run(3,'spread','coverage').timeMs);
  assert.ok(run(2,'spread','reach').timeMs<run(2,'spread','sustain').timeMs);
  assert.equal(run(5,'central','sustain').report.leaked,0);
  assert.ok(run(5,'central','reach').report.leaked>0);
  assert.ok(Object.values(run(5,'central','support').report.towers).some(t=>t.auraShots>0));
});
test('save validator rejects absent, foreign, early, support and malformed branches before restoration',()=>{
  for(const plan of ['focus','coverage','sustain','reach']) {
    const s=prepareTradeoff(balance,3,'central',plan,{dharma:420,bandwidth:300,anonymity:0}), snapshot=s.toSnapshot();
    assert.doesNotThrow(()=>GameSession.fromSnapshot(balance,snapshot));
    for(const branch of [undefined,null,'bogus',[],{},['focus','coverage'].includes(plan)?'reach':'focus']) {
      const bad=structuredClone(snapshot);bad.state.defenses[0].specialization=branch;
      assert.throws(()=>GameSession.fromSnapshot(balance,bad),/specialization/);
    }
  }
  for(const type of ['firewall','distributor']) {
    const s=new GameSession(balance);s.newGame({tutorialCompleted:true});s.placeDefense(type,{x:210,y:210});
    const bad=s.toSnapshot();bad.state.defenses[0].specialization='focus';assert.throws(()=>GameSession.fromSnapshot(balance,bad),/specialization/);
  }
});
test('M3.1 v2 exact bytes survive version rejection, export and reset; preferences stay compatible',async()=>{
  const raw=await readFile(new URL('../../design/reviews/2026-11-12-m3.2/old-1.1.0-v2-save.json',import.meta.url),'utf8');
  const prefs=JSON.stringify({tutorialCompleted:true,showRanges:false,reducedMotion:true});
  const values=new Map([[SAVE_KEY,raw],[PREFERENCES_KEY,prefs]]), storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
  const r=new BrowserSaveRepository(storage);assert.equal(r.load(balance).ok,false);assert.equal(r.exportCorrupt(),raw);
  assert.equal(r.save(prepareTradeoff(balance,2,'central','focus')).ok,false);assert.equal(values.get(SAVE_KEY),raw);
  assert.equal(r.clear().ok,true);assert.equal(r.exportCorrupt(),raw);assert.equal(values.get(PREFERENCES_KEY),prefs);
});
test('legacy level-3 attacker is rejected rather than assigned an invented branch',()=>{
  const raw=JSON.stringify({resources:{dharma:100,bandwidth:100,anonymity:100},defenses:[{type:'firewall',x:210,y:210,level:3}]});
  const values=new Map([['dharmapala_shield_save_0',raw]]);const r=new BrowserSaveRepository({getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)});
  assert.equal(r.load(balance).ok,false);assert.equal(r.exportCorrupt(),raw);
});
