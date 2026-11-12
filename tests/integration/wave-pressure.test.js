import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GameSession } from '../../js/core/GameSession.js';
import { BrowserSaveRepository, SAVE_KEY, PREFERENCES_KEY } from '../../js/platform/BrowserSaveRepository.js';
import { compileSpawnSchedule } from '../../js/core/rules/waves.js';
import { createPolicy } from '../../tools/balance/policies.mjs';
import { loadBalance } from '../helpers/loadBalance.js';
const balance = await loadBalance(), step = 1000/60;
const gameplay = s => { const {state,runtime}=s.toSnapshot(); return {state,runtime}; };

for (const speed of [1,2]) test(`fresh five-wave production slice at ${speed}× preserves schedules, overlap, recovery, accounting and continuation`, () => {
  const s = new GameSession(balance); s.newGame({tutorialCompleted:true,seed:1337});
  s.setWaveSpeed(speed);
  const policy = createPolicy('existing');
  // No grants, wave skips, entity edits, direct hits or synthetic resolutions.
  for (let wave=1; wave<=5; wave++) {
    const idle = gameplay(s); s.tick(60000); assert.deepEqual(gameplay(s),idle);
    policy.build(s); assert.equal(s.startWave().ok,true);
    const authored=compileSpawnSchedule(balance,wave), seen=[];
    let overlap=false, bossOverlap=false, phases=0;
    const stopPhases=s.events.on('boss-phase',()=>phases++);
    const stopSpawns=s.events.on('enemy-spawned',({enemyId})=>{
      const e=s.state.enemies.get(enemyId);
      if (!s.scheduler.events[s.scheduler.cursor-1].dynamic) seen.push({type:e.type,time:s.scheduler.elapsedMs});
      const live=[...s.state.enemies.values()];
      overlap ||= live.some(e=>e.type==='federalAgent') && live.some(e=>e.type==='scriptKiddie');
      bossOverlap ||= live.some(e=>e.type==='raidTeam') && live.some(e=>e.type==='scriptKiddie');
    });
    // Stop in the authored arrival gap while pending spawns keep WAVE active.
    const gap = s.getReadModel().preview.gaps[0];
    while (s.scheduler.elapsedMs < gap.startMs+500) s.tick(step/speed);
    assert.equal(s.state.phase,'WAVE');
    assert.ok(!s.scheduler.complete);
    const beforeGap=seen.length;
    while (s.scheduler.elapsedMs < gap.endMs-100) s.tick(step/speed);
    assert.equal(seen.length,beforeGap,'arrival gap does not release authored spawns');
    assert.equal(s.state.phase,'WAVE','a gap never becomes a build phase');
    const spawned=s.state.wave.spawned;
    s.pause(); const frozen=gameplay(s); s.tick(60000); assert.deepEqual(gameplay(s),frozen);
    const save=JSON.parse(JSON.stringify(s.toSnapshot())), copy=structuredClone(save);
    const restored=GameSession.fromSnapshot(balance,save);
    for (const run of [s,restored]) run.resume();
    // Compare every tick through pending authored spawns and dynamic boss events.
    let frames=0;
    while (s.state.phase==='WAVE' && frames++<20000) {
      const delta=[17,31,8,19][frames%4]/speed;
      s.tick(delta); restored.tick(delta);
      assert.deepEqual(gameplay(restored),gameplay(s));
    }
    assert.ok(frames<20000); assert.equal(s.state.phase,'BUILDING');
    assert.equal(s.state.waveNumber,wave+1);
    assert.ok(s.state.wave.spawned>spawned);
    assert.deepEqual(save,copy);
    // Authored spawns can have a fixed-step rounding delay, never arrive early.
    // Dynamic reinforcements are verified separately in wave 5 below.
    assert.equal(seen.length,authored.length);
    for (let i=0;i<authored.length;i++) {
      assert.equal(seen[i].type,authored[i].enemyType);
      assert.ok(seen[i].time+1e-6>=authored[i].dueAtMs);
      assert.ok(seen[i].time-authored[i].dueAtMs<=step+1e-6);
    }
    if (wave===3 || wave===4) assert.ok(overlap,'actual Agents and runners overlap');
    if (wave===5) { assert.ok(bossOverlap); assert.ok(phases>0); assert.ok(s.state.wave.spawned>authored.length); }
    const report=s.state.reports.pending.at(-1);
    assert.equal(report.waveNumber,wave); assert.equal(report.outcome,'cleared');
    assert.equal(report.partial,false);
    assert.equal(Object.values(report.towers).reduce((n,t)=>n+t.kills,0),report.killed);
    assert.ok(Object.values(report.towers).some(t=>t.shots>0 && t.health>0));
    assert.deepEqual(restored.state.reports,s.state.reports);
    stopPhases(); stopSpawns();
  }
});

test('old production 1.0.0 v2 save is retained for export/reset; preferences remain compatible', async () => {
  const raw=await readFile(new URL('../../design/reviews/2026-11-12-m3.1/old-1.0.0-save.json',import.meta.url),'utf8');
  const values=new Map([[SAVE_KEY,raw],[PREFERENCES_KEY,JSON.stringify({tutorialCompleted:true,showRanges:false,reducedMotion:true})]]);
  const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
  const repo=new BrowserSaveRepository(storage), rejected=repo.load(balance);
  assert.equal(rejected.ok,false); assert.match(rejected.error,/balance version/);
  assert.equal(repo.exportCorrupt(),raw); assert.equal(values.get(SAVE_KEY),raw);
  const fresh=new GameSession(balance); fresh.newGame({tutorialCompleted:true});
  assert.equal(repo.save(fresh).ok,false); assert.equal(values.get(SAVE_KEY),raw);
  assert.equal(repo.clear().ok,true); assert.equal(values.get(`${SAVE_KEY}/corrupt`),raw);
  assert.deepEqual(repo.preferences(),{tutorialCompleted:true,showRanges:false,reducedMotion:true});
  Object.assign(fresh.state.settings,repo.preferences());
  assert.equal(repo.save(fresh).ok,true); assert.equal(repo.load(balance).ok,true);
});

test('modified overlapping base due times reject before restore', () => {
  const s=new GameSession(balance); s.newGame({tutorialCompleted:true});
  s.state.waveNumber=4; s.startWave(); s.step(step); // validation fixture, not campaign evidence
  const save=s.toSnapshot(); save.runtime.scheduler.events[2].dueAtMs+=1;
  assert.throws(()=>GameSession.fromSnapshot(balance,save),/Modified base schedule/);
});

test('reordered simultaneous escorts reject instead of changing deterministic tie order', () => {
  const s=new GameSession(balance); s.newGame({tutorialCompleted:true});
  s.state.waveNumber=4; s.startWave(); s.step(step);
  const save=s.toSnapshot(), events=save.runtime.scheduler.events;
  assert.equal(events[1].dueAtMs,events[2].dueAtMs);
  [events[1],events[2]]=[events[2],events[1]];
  assert.throws(()=>GameSession.fromSnapshot(balance,save),/unstable spawn tie/);
});
