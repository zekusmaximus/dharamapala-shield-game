import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadBalance } from '../helpers/loadBalance.js';
import { GameSession } from '../../js/core/GameSession.js';
import { BrowserSaveRepository, SAVE_KEY, PREFERENCES_KEY } from '../../js/platform/BrowserSaveRepository.js';
import { responseForks } from '../../tools/balance/counterplay.mjs';
import { bracePhase } from '../../js/core/rules/brace.js';
const balance=await loadBalance(),dt=1000/60;
const snapshot=s=>{const value=JSON.parse(JSON.stringify(s.toSnapshot()));delete value.savedAt;return value;};
const fixture=()=>{const s=new GameSession(balance);s.newGame({tutorialCompleted:true});s.state.waveNumber=3;s.startWave();s.step(dt);return s;};

for(const speed of [1,2])test(`${speed}× brace activation/expiry, paused JSON and production impact boundary (skipped-wave fixture)`,()=>{
  let s=fixture();s.setWaveSpeed(speed);const e=[...s.state.enemies.values()].find(e=>e.brace);assert.ok(e);
  const advanceTo=t=>{while(s.state.gameTimeMs+dt<t-1e-7)s.tick(dt/speed);};
  for(const deadline of [e.brace.activatesAtMs,e.brace.expiresAtMs]) {
    advanceTo(deadline);let live=s.state.enemies.get(e.id);
    assert.ok(s.state.gameTimeMs<deadline);
    const oldPhase=bracePhase(live.brace,s.state.gameTimeMs);
    s.pause();const snap=snapshot(s);for(let i=0;i<10;i++)s.tick(250);assert.deepEqual(snapshot(s),snap);
    const restored=GameSession.fromSnapshot(balance,snap);assert.equal(bracePhase(restored.state.enemies.get(e.id).brace,restored.state.gameTimeMs),oldPhase);
    s.resume();restored.resume();while(s.state.gameTimeMs<deadline){s.tick(dt/speed);restored.tick(dt/speed);assert.deepEqual(snapshot(s),snapshot(restored));}s=restored;
    live=s.state.enemies.get(e.id);
    assert.equal(bracePhase(live.brace,s.state.gameTimeMs),deadline===e.brace.activatesAtMs?'active':'spent');
    assert.equal(live.shield,deadline===e.brace.activatesAtMs?live.shieldMax:0);
  }
});
test('shield absorbs after armor, overflows, permits statuses and accounts capped shield/health without Titan cooldown',()=>{
  const s=fixture(),e=[...s.state.enemies.values()].find(e=>e.brace);
  // Controlled impact fixture: a real installed source and manually positioned boundary time.
  const source={id:'defense-999',type:'firewall',x:210,y:210,level:1,totalDamage:0,kills:0};s.state.defenses.set(source.id,source);
  s.state.gameTimeMs=e.brace.activatesAtMs;s.systems.enemy.updateBehaviors(s);const shield=e.shield,health=e.health;
  s.systems.combat.applyHit(s,{sourceId:source.id,damage:60,damageType:'physical',slowPct:0.2,slowDurationMs:1000,vulnerabilityPct:0.1,vulnerabilityDurationMs:1000},e,1);
  const r=s.state.reports.active.towers[source.id];assert.equal(r.shield,Math.min(shield,Math.max(1,60*balance.enemies.federalAgent.resists.physical-balance.enemies.federalAgent.armor)));
  assert.equal(r.health,health-e.health);assert.equal(e.slowPct,0.2);assert.equal(e.vulnerabilityPct,0.1);assert.equal(e.shieldCooldownUntilMs,0);
  s.systems.combat.applyHit(s,{sourceId:source.id,damage:10000,damageType:'physical',slowDurationMs:0,vulnerabilityDurationMs:0},e,1);
  assert.equal(r.health,health);assert.equal(r.shield,shield);assert.equal(r.kills,1);assert.ok(!s.state.enemies.has(e.id));
});
test('pending brace saves reject malformed deadlines, phases, capacities and foreign state before replacement',()=>{
  const s=fixture(),snap=snapshot(s);assert.equal(snap.schemaVersion,4);
  const mutations=[e=>delete e.brace,e=>e.brace.activated=true,e=>e.brace.activatesAtMs++,e=>e.brace.expiresAtMs=Infinity,e=>e.brace.extra=1,e=>e.shield=1,e=>e.shieldMax++,e=>e.shieldRegenPerSec=1];
  for(const mutate of mutations){const bad=structuredClone(snap);mutate(bad.state.enemies.find(e=>e.brace));assert.throws(()=>GameSession.fromSnapshot(balance,bad));assert.deepEqual(snapshot(s),snap);}
  const other=new GameSession(balance);other.newGame({tutorialCompleted:true});other.startWave();other.step(dt);const bad=snapshot(other);bad.state.enemies[0].brace={};assert.throws(()=>GameSession.fromSnapshot(balance,bad));
});
for(const speed of [1,2])test(`${speed}× earned wave-3 responses reconcile combat ledgers and continuation`,()=>{
  const rows=responseForks(balance,'Normal',{speed});
  assert.deepEqual(rows,responseForks(balance,'Normal',{speed,restoreAt:[120,180,181,420,421,700]}));
  const get=id=>rows.find(r=>r.response===id);
  assert.ok(get('early-expansion').agents.some(a=>a.phaseAtResolution==='warning'));
  assert.ok(get('early-expansion').agents.some(a=>a.phaseAtResolution==='active'));
  assert.ok(get('late-expansion').agents.every(a=>a.phaseAtResolution==='spent'));
  assert.ok(get('early-expansion').durationMs<get('late-expansion').durationMs);
  assert.ok(get('early-expansion').report.leaked===0&&get('late-expansion').report.leaked===0);
  assert.equal(get('sustain3').available,false);assert.equal(get('reach3').available,false);
  assert.ok(get('focus3').report.leaked===0&&get('coverage3').report.leaked===0);
  for(const r of rows.filter(r=>r.available))for(const k of Object.keys(r.before)) {
    assert.equal(r.start[k],r.before[k]-r.report.spent[k]);assert.equal(r.after[k],r.start[k]+r.report.bounty[k]+r.report.clear[k]);
    assert.ok(r.start[k]>=0);
  }
});
test('M3.3 v3 run bytes recover explicitly in all phases and preferences survive reset',async()=>{
  const old=JSON.parse(await readFile(new URL('../../design/reviews/2026-11-12-m3.4/baseline-1.3.0.json',import.meta.url)));
  for(const phase of ['BUILDING','WAVE','PAUSED','GAME_OVER']) {
    const s=new GameSession(old);s.newGame({tutorialCompleted:true});if(phase!=='BUILDING')s.startWave();if(phase==='PAUSED')s.pause();
    if(phase==='GAME_OVER'){s.state.lives=1;while(s.state.phase==='WAVE')s.step(dt);}
    const raw=JSON.stringify(s.toSnapshot()),prefs=JSON.stringify({tutorialCompleted:true,reducedMotion:true,showRanges:false}),map=new Map([[SAVE_KEY,raw],[PREFERENCES_KEY,prefs]]);
    const repo=new BrowserSaveRepository({getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)});
    assert.equal(repo.load(balance).ok,false);assert.equal(repo.exportCorrupt(),raw);assert.equal(map.get(SAVE_KEY),raw);assert.equal(repo.save(fixture()).ok,false);
    repo.clear();assert.equal(map.get(PREFERENCES_KEY),prefs);assert.equal(repo.exportCorrupt(),raw);assert.equal(repo.save(fixture()).ok,true);
  }
});
test('terminal freezes pending behavior, restart clears it, and expiry is not credited as shield damage',()=>{
  const s=fixture(),e=[...s.state.enemies.values()].find(e=>e.brace);
  s.enterTerminal('GAME_OVER');const before=snapshot(s);s.systems.enemy.updateBehaviors(s);s.tick(250);assert.deepEqual(snapshot(s),before);
  s.restart();assert.equal(s.state.enemies.size,0);assert.equal(s.state.phase,'BUILDING');
  const live=fixture(),a=[...live.state.enemies.values()].find(e=>e.brace);
  live.state.gameTimeMs=a.brace.activatesAtMs;live.systems.enemy.updateBehaviors(live);assert.ok(a.shield>0);
  live.state.gameTimeMs=a.brace.expiresAtMs;live.systems.enemy.updateBehaviors(live);assert.equal(a.shield,0);assert.deepEqual(live.state.reports.active.towers,{});
});
test('production projectile collision sees activation and expiry before impacts on the boundary tick',()=>{
  for(const boundary of ['activatesAtMs','expiresAtMs']) {
    const s=fixture(),e=[...s.state.enemies.values()].find(e=>e.brace);
    if(boundary==='expiresAtMs'){s.state.gameTimeMs=e.brace.activatesAtMs;s.systems.enemy.updateBehaviors(s);}
    const hp=e.health;s.state.gameTimeMs=e.brace[boundary]-dt;
    s.state.projectiles.set('projectile-999',{id:'projectile-999',sourceId:'untracked',targetId:e.id,x:e.x,y:e.y,radius:5,speed:0,damage:20,damageType:'physical',expiresAtMs:e.brace[boundary]+1000,hitIds:[],aoeRadius:0,chainTargets:0,piercing:false,slowDurationMs:0,vulnerabilityDurationMs:0});
    s.step(dt);
    if(boundary==='activatesAtMs'){assert.equal(e.health,hp);assert.ok(e.shield<e.shieldMax&&e.shield>0);}
    else {assert.equal(e.shield,0);assert.ok(e.health<hp);}
  }
});
