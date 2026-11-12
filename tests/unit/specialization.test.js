import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBalance } from '../helpers/loadBalance.js';
import { getTowerStats } from '../../js/core/rules/towers.js';
import { getTowerInspection } from '../../js/core/rules/inspection.js';
import { getEffectiveDamage } from '../../js/core/rules/combat.js';
import { validateBalance } from '../../js/core/rules/validation.js';
import { GameSession } from '../../js/core/GameSession.js';
const balance=await loadBalance();
const fresh=()=>{const s=new GameSession(balance);s.newGame({tutorialCompleted:true});return s;};

test('focus and coverage trade hit size, cadence and range under production armor rules',()=>{
  const linear=getTowerStats(balance,'firewall',3), focus=getTowerStats(balance,'firewall',3,'focus'), coverage=getTowerStats(balance,'firewall',3,'coverage');
  assert.ok(focus.damage>coverage.damage && focus.range<coverage.range && focus.ratePerSec<coverage.ratePerSec);
  const agent=balance.enemies.federalAgent;
  const retained=stats=>getEffectiveDamage(stats.damage,agent,stats.damageType)/stats.damage;
  assert.ok(retained(focus)>retained(coverage));
  assert.equal(focus.damage,linear.damage*1.8);
  assert.equal(coverage.range,linear.range*1.25);
  assert.throws(()=>getTowerStats(balance,'firewall',2,'focus'));
  assert.throws(()=>getTowerStats(balance,'encryption',3,'focus'));
});
test('control branches override late chain; caps and branch multipliers persist through level 5',()=>{
  for(let level=3;level<=5;level++) {
    const sustained=getTowerStats(balance,'encryption',level,'sustain'), reach=getTowerStats(balance,'encryption',level,'reach');
    assert.equal(sustained.chainTargets,0);assert.equal(reach.chainTargets,2);
    assert.ok(sustained.slowPct>reach.slowPct && sustained.slowDurationMs>reach.slowDurationMs);
    assert.ok(sustained.vulnerabilityPct>reach.vulnerabilityPct && sustained.vulnerabilityDurationMs>reach.vulnerabilityDurationMs);
    assert.ok(sustained.slowPct<=balance.combat.status.slowTowerCap);
  }
});
test('level-3 choice is explicit, atomic, affordable and irrevocable through later upgrades',()=>{
  const s=fresh(); const {defenseId:id}=s.placeDefense('firewall',{x:210,y:210});
  assert.equal(s.upgradeDefense(id,'focus').code,'SPECIALIZATION_LOCKED');
  assert.equal(s.upgradeDefense(id).ok,true);
  const before=s.toSnapshot();
  for(const branch of [null,'bogus','sustain']) { assert.equal(s.upgradeDefense(id,branch).code,'SPECIALIZATION_REQUIRED'); assert.deepEqual(s.toSnapshot().state,before.state); }
  assert.equal(s.upgradeDefense(id,'focus').code,'CANNOT_AFFORD');
  assert.deepEqual(s.toSnapshot().state,before.state);
  s.state.resources={dharma:2000,bandwidth:2000,anonymity:2000}; // command fixture only
  const info=getTowerInspection(balance,s.state.defenses.get(id),s.state.defenses.values(),0,1);
  assert.equal(info.next,null); assert.deepEqual(info.specializations.map(c=>c.id),['focus','coverage']);
  assert.equal(s.upgradeDefense(id,'coverage').ok,true);
  assert.equal(s.upgradeDefense(id,'focus').code,'SPECIALIZATION_LOCKED');
  assert.equal(s.upgradeDefense(id).ok,true);assert.equal(s.upgradeDefense(id).ok,true);
  const chosen=getTowerInspection(balance,s.state.defenses.get(id),s.state.defenses.values(),0,1);
  assert.equal(chosen.current.damage,getTowerStats(balance,'firewall',5,'coverage').damage);
  assert.equal(chosen.chosenSpecialization.name,'Coverage');
  s.startWave();assert.equal(s.upgradeDefense(id,'focus').code,'INVALID_PHASE');
});
for(const mutate of [
 b=>b.towers.firewall.specializations.focus.rateMultiplier=0,
 b=>b.towers.firewall.specializations.focus.rangeMultiplier=Infinity,
 b=>b.towers.firewall.specializations.coverage.extraEffect=1,
 b=>delete b.towers.firewall.specializations.focus,
 b=>b.towers.encryption.specializations.reach.chainTargets=1.5,
 b=>b.towers.distributor.specializations=b.towers.firewall.specializations,
 b=>b.towers.encryption.specializations.sustain.description=''
]) test(`reject malformed specialization ${mutate.toString()}`,()=>{
  const b=structuredClone(balance);mutate(b);assert.throws(()=>validateBalance(b));
});
test('specialization inspection includes the actual capped aura rate for each alternative',()=>{
  const s=fresh();const {defenseId:id}=s.placeDefense('firewall',{x:210,y:210});s.upgradeDefense(id);
  s.state.resources={dharma:1000,bandwidth:1000,anonymity:1000}; // inspection fixture
  s.placeDefense('distributor',{x:270,y:210});
  const info=getTowerInspection(balance,s.state.defenses.get(id),s.state.defenses.values(),0,1);
  for(const c of info.specializations)assert.equal(c.stats.effectiveRatePerSec,c.stats.ratePerSec*1.12);
});
