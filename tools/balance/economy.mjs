// M3.3 earned-resource experiments. Every purchase, reward and combat tick is production.
import { GameSession } from '../../js/core/GameSession.js';
import { canAfford, getUpgradeCost, getSellValue, RESOURCE_KEYS } from '../../js/core/rules/economy.js';
import { getTowerInspection } from '../../js/core/rules/inspection.js';
import { getTowerStats } from '../../js/core/rules/towers.js';
import { PATH_METRICS, pointAtPathDistance } from '../../js/core/world.js';
import { buildPositions, loadBalance, policySpecialization } from '../sim/run.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const ECONOMY_PLANS = {
  expansion: 'Opening: two Firewalls and one Encryption if affordable. Then spend all affordable Dharma on Firewalls; no upgrades.',
  upgrades: 'Same opening. Upgrade lowest-level attackers, ID ties, explicit Focus/Sustained control. Expand only if no upgrade affordable.',
  control: 'Same opening. Prioritize Encryption upgrades (Sustained control), then one extra Encryption, then affordable Firewall expansion.',
  support: 'Same opening. Buy one Distributor before other spending, then upgrade it once, then affordable Firewall expansion. Never buy more than one Distributor.',
  saving: 'Same opening. No purchases on waves 2–3. From wave 4 buy one Distributor then use upgrades plan. No interest or advance rewards.'
};
const positions = buildPositions();
const snapshot = s => ({state:s.toSnapshot().state,runtime:s.toSnapshot().runtime});
function position(s) { return positions.find(p=>![...s.state.defenses.values()].some(t=>Math.hypot(t.x-p.x,t.y-p.y)<45)); }
export function opportunities(s) {
  const row=(action,cost,extra={})=>({action,cost,...extra,blockedBy:RESOURCE_KEYS.filter(k=>s.state.resources[k]<(cost[k]||0))});
  const p=position(s);
  return [ ...Object.keys(s.balance.towers).map(type=>row(`build:${type}`,s.balance.towers[type].cost,{legalSlot:Boolean(p)})),
    ...[...s.state.defenses.values()].filter(t=>t.level<s.balance.upgrades.maxLevel).map(t=>row(`upgrade:${t.id}`,getUpgradeCost(s.balance,t.type,t.level),{type:t.type,level:t.level,choices:t.level===2?Object.keys(s.balance.towers[t.type].specializations||{}):[]})) ];
}
export function prepareEconomyWave(s, plan) {
  const actions=[];
  const buy=type=>{const p=position(s);if(!p)return false;const r=s.placeDefense(type,p);if(r.ok)actions.push({action:'build',type,id:r.defenseId,position:p,cost:s.balance.towers[type].cost});return r.ok;};
  const upgrade=t=>{const cost=getUpgradeCost(s.balance,t.type,t.level),branch=policySpecialization(s,t);const r=s.upgradeDefense(t.id,branch);if(r.ok)actions.push({action:'upgrade',id:t.id,type:t.type,fromLevel:t.level-1,branch,cost});return r.ok;};
  const expand=()=>{while(buy('firewall')){};};
  if(s.state.waveNumber===1) {buy('firewall');buy('firewall');buy('encryption');return actions;}
  if(plan==='saving' && s.state.waveNumber<=3)return actions;
  if(plan==='support' || plan==='saving') {
    if(![...s.state.defenses.values()].some(t=>t.type==='distributor'))buy('distributor');
    if(plan==='support') {const d=[...s.state.defenses.values()].find(t=>t.type==='distributor');if(d?.level===1)upgrade(d);expand();return actions;}
  }
  if(plan==='control') {
    const e=[...s.state.defenses.values()].filter(t=>t.type==='encryption').sort((a,b)=>a.level-b.level||a.id.localeCompare(b.id));
    for(const t of e)while(t.level<s.balance.upgrades.maxLevel && upgrade(t)){}
    if(e.length<2)buy('encryption');
  }
  if(plan==='upgrades' || plan==='saving') {
    while(true) {const ts=[...s.state.defenses.values()].filter(t=>t.type!=='distributor'&&t.level<s.balance.upgrades.maxLevel).sort((a,b)=>a.level-b.level||a.id.localeCompare(b.id));if(!ts.some(upgrade))break;}
  }
  expand();return actions;
}
export function capacity(s) {
  return [...s.state.defenses.values()].map(t=>{
    const stats=getTowerStats(s.balance,t.type,t.level,t.specialization);
    let samples=0;for(let d=0;d<=PATH_METRICS.totalLength;d+=10){const p=pointAtPathDistance(d);if(Math.hypot(p.x-t.x,p.y-t.y)<=stats.range)samples++;}
    const i=getTowerInspection(s.balance,t,s.state.defenses.values(),s.state.gameTimeMs,s.state.waveNumber);
    return {id:t.id,type:t.type,level:t.level,specialization:t.specialization,x:t.x,y:t.y,stats,sampledRouteUnits:t.type==='distributor'?0:samples*10,support:i.support,investment:i.totalInvested,refund:getSellValue(s.balance,t.type,t.level)};
  });
}
export function runEconomy(balance, plan, difficulty='Normal', {restore=false,speed=1}={}) {
  let s=new GameSession(balance);s.newGame({difficulty,seed:1337,tutorialCompleted:true});s.setWaveSpeed(speed);
  const initialResources={...s.state.resources},waves=[];
  while(s.state.phase==='BUILDING' && s.state.waveNumber<=5) {
    const before={...s.state.resources},availableBefore=opportunities(s),actions=prepareEconomyWave(s,plan),availableAfter=opportunities(s),towers=capacity(s),start={...s.state.resources},time=s.state.gameTimeMs;
    if(!s.startWave().ok)throw new Error('Start rejected');
    let steps=0;
    while(s.state.phase==='WAVE' && steps++<120000) {
      s.tick(1000/60/speed);
      if(restore && steps===180) {s.pause();const raw=JSON.parse(JSON.stringify(s.toSnapshot()));const resumed=GameSession.fromSnapshot(balance,raw);if(JSON.stringify(snapshot(s))!==JSON.stringify(snapshot(resumed)))throw new Error('Restore mismatch');s=resumed;s.resume();}
    }
    if(s.state.phase==='WAVE')throw new Error('Timeout');
    waves.push({wave:s.state.reports.pending.at(-1).waveNumber,before,availableBefore,actions,start,availableAfter,towers,durationMs:s.state.gameTimeMs-time,after:{...s.state.resources},lives:s.state.lives,report:structuredClone(s.state.reports.pending.at(-1))});
  }
  return {plan,difficulty,initialResources,phase:s.state.phase,lives:s.state.lives,waveNumber:s.state.waveNumber,resources:{...s.state.resources},waves};
}
export function earnedMarginals(balance) {
  const baseline=new GameSession(balance);baseline.newGame({tutorialCompleted:true,seed:1337});
  prepareEconomyWave(baseline,'saving');
  const rows=[];
  const fight=s=>{s.startWave();let steps=0;while(s.state.phase==='WAVE' && steps++<120000)s.step(1000/60);if(s.state.phase==='WAVE')throw new Error('Timeout');};
  for(let wave=1;wave<=5;wave++) {
    if(wave>=2)for(const option of ['save','expand','firewall2','focus3','coverage3','encryption2','sustain3','reach3','support1','support2']) {
      const s=GameSession.fromSnapshot(balance,JSON.parse(JSON.stringify(baseline.toSnapshot())));
      const type=option.startsWith('support')?'distributor':option==='encryption2'||option==='sustain3'||option==='reach3'?'encryption':'firewall';
      const target=[...s.state.defenses.values()].find(t=>t.type===type);
      const level=Number(option.at(-1))||1;
      const cost={dharma:0,bandwidth:0,anonymity:0};
      const add=c=>{for(const k of RESOURCE_KEYS)cost[k]+=c[k]||0;};
      if(option==='expand')for(let i=0;i<3;i++)add(balance.towers.firewall.cost);
      else if(option!=='save') {
        if(type==='distributor')add(balance.towers.distributor.cost);
        for(let l=1;l<level;l++)add(getUpgradeCost(balance,type,l));
      }
      const available=canAfford(s.state.resources,cost),before={...s.state.resources};
      if(!available){rows.push({wave,option,before,cost,available,blockedBy:RESOURCE_KEYS.filter(k=>before[k]<cost[k])});continue;}
      const buy=t=>{const r=s.placeDefense(t,position(s));if(!r.ok)throw new Error(r.code);return s.state.defenses.get(r.defenseId);};
      if(option==='expand')for(let i=0;i<3;i++)buy('firewall');
      else if(option!=='save') {
        const t=type==='distributor'?buy(type):target;
        while(t.level<level){const branch=t.level===2?(option==='coverage3'?'coverage':option==='reach3'?'reach':policySpecialization(s,t)):null;if(!s.upgradeDefense(t.id,branch).ok)throw new Error('Upgrade rejected');}
      }
      const towers=capacity(s),start={...s.state.resources},time=s.state.gameTimeMs;fight(s);
      rows.push({wave,option,before,cost,available,start,towers,durationMs:s.state.gameTimeMs-time,lives:s.state.lives,after:{...s.state.resources},report:structuredClone(s.state.reports.pending.at(-1))});
    }
    // Common checkpoint path buys only the opening. No grants/skips, reset cooldowns,
    // synthetic hits or clears. Its live combat and earned balances carry forward.
    fight(baseline);
    if(baseline.state.phase!=='BUILDING')break;
  }
  return rows;
}
export async function buildEconomyReport() {
  const old=JSON.parse(await readFile(new URL('../../design/reviews/2026-11-12-m3.3/baseline-1.2.0.json',import.meta.url))),current=await loadBalance(),runs=[];
  for(const [variant,balance] of [['m3.2',old],['m3.3',current]])for(const difficulty of ['Easy','Normal','Hard'])for(const plan of Object.keys(ECONOMY_PLANS)) {
    const run=runEconomy(balance,plan,difficulty);if(JSON.stringify(run)!==JSON.stringify(runEconomy(balance,plan,difficulty)))throw new Error('Repeat mismatch');runs.push({variant,...run});
  }
  const marginals=[{variant:'m3.2',rows:earnedMarginals(old)},{variant:'m3.3',rows:earnedMarginals(current)}];
  if(JSON.stringify(marginals)!==JSON.stringify([{variant:'m3.2',rows:earnedMarginals(old)},{variant:'m3.3',rows:earnedMarginals(current)}]))throw new Error('Marginal repeat mismatch');
  return {schemaVersion:1,plans:ECONOMY_PLANS,setup:'Fresh default funds/lives, waves 1–5 in order (campaign regressions are recorded separately in results.json), seed 1337, coverage-ranked positions, no grants/skips/sells or synthetic combat. Each run repeats identically. Opportunities list currency blockers separately from legal slots. Sampled route units are 10-unit geometry samples, not combat activity. Support capacity is measured before the wave; auraShots/status applications/health/shield removal and passiveDharma in reports are realized observations, not causal assistance. No human evidence.',runs,marginals};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const report=await buildEconomyReport();
  // Match the campaign reporter: one full wave/fork per line, preserving every field.
  const runs=report.runs.map(run=>JSON.stringify({...run,waves:[]},null,2).replace('"waves": []','"waves": [\n'+run.waves.map(w=>JSON.stringify(w)).join(',\n')+'\n]'));
  const marginals=report.marginals.map(v=>JSON.stringify({...v,rows:[]},null,2).replace('"rows": []','"rows": [\n'+v.rows.map(r=>JSON.stringify(r)).join(',\n')+'\n]'));
  const json=JSON.stringify({...report,runs:[],marginals:[]},null,2).replace('"runs": []','"runs": [\n'+runs.join(',\n')+'\n]').replace('"marginals": []','"marginals": [\n'+marginals.join(',\n')+'\n]')+'\n';
  await writeFile(process.argv[2]||'/tmp/m33-economy.json',json);
}
