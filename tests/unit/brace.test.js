import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBalance, clone } from '../helpers/loadBalance.js';
import { validateBalance } from '../../js/core/rules/validation.js';
import { createEnemy, getEnemyDefinition } from '../../js/entities/createEnemy.js';
import { bracePhase, updateBrace, braceDescription } from '../../js/core/rules/brace.js';
import { enemyCombatFeedback } from '../../js/core/rules/combatFeedback.js';
import { CanvasRenderer } from '../../js/render/CanvasRenderer.js';
const balance=await loadBalance();
const agent=()=>createEnemy(getEnemyDefinition(balance,'federalAgent'),{id:'enemy-1',difficulty:balance.difficulty.Normal,spawnedAtMs:100});

test('brace has exact one-use boundaries, finite capacity, no refill and large-step expiry',()=>{
  const e=agent();assert.equal(e.shield,0);assert.equal(e.shieldMax,Math.round(e.maxHealth*0.6));
  updateBrace(e,3099);assert.equal(bracePhase(e.brace,3099),'warning');assert.equal(e.shield,0);
  updateBrace(e,3100);assert.equal(e.shield,e.shieldMax);assert.equal(bracePhase(e.brace,3100),'active');
  e.shield=0;updateBrace(e,3101);assert.equal(e.shield,0,'broken shield cannot refill');
  e.shield=3;updateBrace(e,7099);assert.equal(e.shield,3);
  updateBrace(e,7100);assert.equal(e.shield,0);assert.equal(bracePhase(e.brace,7100),'spent');
  const skipped=agent();updateBrace(skipped,8000);assert.equal(skipped.shield,0);assert.equal(skipped.brace.activated,true);
  const dead=agent();dead.resolution='KILLED';updateBrace(dead,3100);assert.equal(dead.shield,0);
});
for(const mutate of [b=>delete b.enemies.federalAgent.brace,b=>b.enemies.federalAgent.brace.windupMs=0,b=>b.enemies.federalAgent.brace.durationMs=Infinity,b=>b.enemies.federalAgent.brace.healthRatio=1.1,b=>b.enemies.federalAgent.brace.radius=50,b=>b.enemies.scriptKiddie.brace=b.enemies.federalAgent.brace,b=>delete b.towers.firewall.specializations,b=>delete b.economy.activeResources])test(`brace content rejects ${mutate}`,()=>{
  const b=clone(balance);mutate(b);assert.throws(()=>validateBalance(b));
});
test('static cue labels and semantic equivalents follow warning, active, broken and spent with both motion preferences',()=>{
  assert.match(braceDescription(balance.enemies.federalAgent),/3 s.*60%.*4 s.*overflows.*slow and vulnerability/);
  const e=agent(),calls=[];
  const ctx=new Proxy({}, {get:(_,key)=>(...args)=>{calls.push([key,...args]);if(key==='measureText')return {width:90};},set:()=>true});
  const renderer=new CanvasRenderer({getContext:()=>ctx},{resize(){}},balance);
  for(const reducedMotion of [false,true])for(const [now,label,text] of [[3099,'!',/brace in/],[3100,'S',/expires in/],[7100,'✓',/no regeneration/]]) {
    updateBrace(e,now);if(now===3100)e.shield=e.shieldMax;
    calls.length=0;renderer.drawEnemies(ctx,{state:{gameTimeMs:now,settings:{reducedMotion},enemies:new Map([[e.id,e]])}});
    assert.ok(calls.some(c=>c[0]==='fillText'&&c[1]===label));assert.match(enemyCombatFeedback(balance,e,now).brace.text,text);
  }
});

test('broken brace glyph and text remain distinct from active capacity and never refill',()=>{
  const e=agent();updateBrace(e,3100);e.shield=0;updateBrace(e,3200);
  const info=enemyCombatFeedback(balance,e,3200).brace;
  assert.equal(info.glyph,'×');assert.equal(info.marker,'BROKEN');assert.match(info.text,/0 \/.*no refill/);
});
