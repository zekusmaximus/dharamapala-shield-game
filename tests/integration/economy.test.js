import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadBalance} from '../helpers/loadBalance.js';
import {GameSession} from '../../js/core/GameSession.js';
import {BrowserSaveRepository,SAVE_KEY,PREFERENCES_KEY} from '../../js/platform/BrowserSaveRepository.js';
import {runEconomy,ECONOMY_PLANS,earnedMarginals} from '../../tools/balance/economy.mjs';
const balance=await loadBalance();
for(const speed of [1,2])test(`earned five-wave economies at ${speed}× reconcile ledgers and paused JSON continuation`,()=>{
  for(const plan of Object.keys(ECONOMY_PLANS)) {
    const run=runEconomy(balance,plan,'Normal',{speed});
    assert.deepEqual(run,runEconomy(balance,plan,'Normal',{speed,restore:true}));
    assert.equal(run.waves.length,5);
    assert.equal(run.lives,plan==='saving'?18:20);
    for(const w of run.waves)for(const k of Object.keys(w.before)) {
      assert.equal(w.start[k],w.before[k]-w.report.spent[k]+w.report.refunds[k]);
      assert.equal(w.after[k],w.start[k]+w.report.bounty[k]+w.report.clear[k]);
      if(k==='anonymity')assert.equal(w.after[k]+w.report.spent[k]+w.report.bounty[k]+w.report.clear[k],0);
    }
    if(plan==='saving') {assert.equal(run.waves[1].actions.length,0);assert.equal(run.waves[2].actions.length,0);}
  }
});
test('earned wave-2 choices expose a Bandwidth constraint independently of Dharma; failure is atomic',()=>{
  const run=runEconomy(balance,'support');const w=run.waves[1];
  assert.deepEqual(w.before,{dharma:110,bandwidth:56,anonymity:0});
  assert.deepEqual(w.availableBefore.find(x=>x.action==='build:distributor').blockedBy,['bandwidth']);
  assert.deepEqual(w.availableBefore.find(x=>x.type==='encryption').blockedBy,['bandwidth']);
  const s=new GameSession(balance);s.newGame({tutorialCompleted:true});s.state.resources={...w.before};
  const before=s.toSnapshot();assert.equal(s.placeDefense('distributor',{x:210,y:210}).ok,false);assert.deepEqual(s.toSnapshot().state,before.state);
  assert.equal(s.placeDefense('encryption',{x:210,y:210}).ok,true);
});
test('earned-checkpoint marginal comparisons retain production status, aura activity and passive accounting',()=>{
  const rows=earnedMarginals(balance);
  const supports=rows.filter(r=>r.option==='support1'&&r.available);
  assert.ok(supports.length);assert.ok(supports.some(r=>Object.values(r.report.towers).some(t=>t.auraShots>0)));
  for(const r of supports)assert.equal(r.report.passiveDharma,6);
  assert.ok(rows.some(r=>r.option==='support2'&&!r.available&&r.blockedBy.includes('bandwidth')));
  assert.ok(rows.some(r=>r.option==='encryption2'&&r.available&&Object.values(r.report.towers).some(t=>t.slowHits>0&&t.vulnerabilityHits>0)));
});
test('M3.2 v3 and pre-v2 runs use retained-byte recovery, never a silent economy conversion',async()=>{
  const raw=await readFile(new URL('../../design/reviews/2026-11-12-m3.3/old-1.2.0-v3-save.json',import.meta.url),'utf8');
  const prefs=JSON.stringify({tutorialCompleted:true,showRanges:false,reducedMotion:true});
  for(const [key,payload] of [[SAVE_KEY,raw],['dharmapala_shield_save_0',JSON.stringify({resources:{dharma:10,bandwidth:10,anonymity:10},defenses:[]})]]) {
    const values=new Map([[key,payload],[PREFERENCES_KEY,prefs]]),repo=new BrowserSaveRepository({getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)});
    assert.equal(repo.load(balance).ok,false);assert.equal(repo.exportCorrupt(),payload);
    const fresh=new GameSession(balance);fresh.newGame({tutorialCompleted:true});assert.equal(repo.save(fresh).ok,false);assert.equal(values.get(key),payload);
    assert.equal(repo.clear().ok,true);assert.equal(repo.exportCorrupt(),payload);assert.equal(values.get(PREFERENCES_KEY),prefs);assert.equal(repo.save(fresh).ok,true);assert.equal(repo.load(balance).ok,true);
  }
});
