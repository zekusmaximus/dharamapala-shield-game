import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadBalance} from '../helpers/loadBalance.js';
import {validateBalance} from '../../js/core/rules/validation.js';
import {activeResourceKeys,createStartingResources,getWaveReward,getUpgradeCost,getTotalInvested,getSellValue,canAfford,resourceShortfall} from '../../js/core/rules/economy.js';
const b=await loadBalance();
test('retired currency retains ledger shape; current supply, costs and earned rewards are zero',()=>{
  assert.deepEqual(activeResourceKeys(b),['dharma','bandwidth']);
  assert.equal(createStartingResources(b).anonymity,0);
  for(const t of Object.keys(b.towers))for(let l=1;l<=5;l++) {
    assert.equal(getUpgradeCost(b,t,l).anonymity,0);assert.equal(getTotalInvested(b,t,l).anonymity,0);assert.equal(getSellValue(b,t,l).anonymity,0);
  }
  for(const wave of b.waves)assert.equal(getWaveReward(b,wave,wave.wave,1).anonymity,0);
  assert.equal(canAfford({dharma:50,bandwidth:34,anonymity:999},b.towers.encryption.cost),false);
  assert.deepEqual(resourceShortfall({dharma:110,bandwidth:56,anonymity:0},getUpgradeCost(b,'encryption',1)),{dharma:0,bandwidth:12,anonymity:0});
});
test('active-resource contract rejects ambiguous currencies, retired supply/cost, and missing specialization',()=>{
  for(const mutate of [x=>delete x.economy.activeResources,x=>x.economy.activeResources=['bandwidth','dharma'],x=>x.economy.activeResources.push('anonymity'),x=>x.economy.startAnonymity=1,x=>x.towers.encryption.cost.anonymity=1,x=>x.bosses.raidTeam.bounty.anonymity=1,x=>delete x.towers.firewall.specializations]) {const x=structuredClone(b);mutate(x);assert.throws(()=>validateBalance(x));}
});
test('matching historical content retains its original three-resource rewards',async()=>{
  const old=JSON.parse(await readFile(new URL('../../design/reviews/2026-11-12-m3.3/baseline-1.2.0.json',import.meta.url)));
  assert.doesNotThrow(()=>validateBalance(old));assert.deepEqual(activeResourceKeys(old),['dharma','bandwidth','anonymity']);
  assert.equal(getWaveReward(old,old.waves[0],1,0).anonymity,10);
  assert.deepEqual(getUpgradeCost(old,'encryption',1),{dharma:98,bandwidth:39,anonymity:20});
});
