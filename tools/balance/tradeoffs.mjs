// M3.2 controlled production-combat experiments, not player or campaign evidence.
import { GameSession } from '../../js/core/GameSession.js';
import { buildPositions, loadBalance } from '../sim/run.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PLANS = {
  expansion: 'Spend on level-1 Firewalls (14 maximum).',
  focus: 'Two level-3 Focus Firewalls.',
  coverage: 'Two level-3 Coverage Firewalls.',
  sustain: 'One level-3 Sustained control Encryption, then two level-1 Firewalls.',
  reach: 'One level-3 Chain reach Encryption, then two level-1 Firewalls.',
  support: 'One Distributor, then ten level-1 Firewalls.',
  'control-support': 'One level-1 Encryption, one Distributor, then nine level-1 Firewalls.'
};
export const FIXTURE = {
  resources: {dharma:420, bandwidth:180, anonymity:90},
  setup: 'Controlled preparation fixture: select existing wave 2/3/4/5, grant identical 420/180/90 funds, default Normal lives. No prior-wave income, damage or cooldown. Purchases/upgrades use production commands. No combat edits, direct hits, kills or clearance. Unspent currencies stay visible; these are opportunity-cost comparisons, not identical spend or fresh campaigns.',
  layouts: {
    central: 'Production buildPositions coverage ranking; take first legal unused position.',
    spread: 'Same legal cells ranked by distance to alternating anchors (210,210),(750,330), ties original coverage ranking.'
  }
};
export function prepareTradeoff(balance, wave, layout, plan) {
  const s = new GameSession(balance); s.newGame({tutorialCompleted:true,seed:1337,difficulty:'Normal'});
  s.state.waveNumber = wave; s.state.resources = {...FIXTURE.resources};
  const positions = buildPositions(); let count=0;
  function buy(type, level=1, branch=null) {
    const anchor = count % 2 ? {x:750,y:330} : {x:210,y:210};
    const ranked = layout === 'spread' ? [...positions].sort((a,b)=>Math.hypot(a.x-anchor.x,a.y-anchor.y)-Math.hypot(b.x-anchor.x,b.y-anchor.y)) : positions;
    const p = ranked.find(p=>![...s.state.defenses.values()].some(t=>Math.hypot(t.x-p.x,t.y-p.y)<45));
    const result = s.placeDefense(type,p); if (!result.ok) throw new Error(`Purchase rejected: ${plan}/${type}/${result.code}`);
    const t = s.state.defenses.get(result.defenseId); count++;
    while(t.level<level) {
      const choice = t.level===2 && balance.towers[type].specializations ? branch : null;
      const result=s.upgradeDefense(t.id,choice); if(!result.ok) throw new Error(`Upgrade rejected: ${result.code}`);
    }
  }
  if (plan==='expansion') for(let i=0;i<14;i++) buy('firewall');
  if (plan==='focus' || plan==='coverage') for(let i=0;i<2;i++) buy('firewall',3,plan);
  if (plan==='sustain' || plan==='reach') { buy('encryption',3,plan); buy('firewall'); buy('firewall'); }
  if (plan==='support' || plan==='control-support') {
    if(plan==='control-support') buy('encryption');
    buy('distributor'); for(let i=0;i<(plan==='support'?10:9);i++) buy('firewall');
  }
  return s;
}
export function runTradeoff(balance, wave, layout, plan) {
  const s=prepareTradeoff(balance,wave,layout,plan);
  const towers=[...s.state.defenses.values()].map(({id,type,x,y,level,specialization})=>({id,type,x,y,level,specialization}));
  const remaining={...s.state.resources}; const bosses=[];
  s.events.on('enemy-spawned',({enemyId})=>{if(s.state.enemies.get(enemyId).kind==='boss')bosses.push(enemyId);});
  let phases=0; s.events.on('boss-phase',()=>phases++);
  if(!s.startWave().ok) throw new Error('Start rejected');
  let steps=0;
  while(s.state.phase==='WAVE' && steps++<120000)s.step(1000/60);
  if(s.state.phase==='WAVE')throw new Error('Tradeoff timeout');
  return {wave,layout,plan,towers,remainingAtStart:remaining,steps,timeMs:s.state.gameTimeMs,lives:s.state.lives,
    phase:s.state.phase,bossesSpawned:bosses.length,bossPhases:phases,bossesKilled:s.state.statistics.bossesKilled,
    report:s.state.reports.pending.at(-1)};
}
export async function buildTradeoffs() {
  const current=await loadBalance();
  // Immutable M3.1 input copied from fetched main, with provenance in evidence README.
  const linear=JSON.parse(await readFile(new URL('../../design/reviews/2026-11-12-m3.2/linear-1.1.0.json',import.meta.url)));
  const rows=[];
  for(const [variant,balance] of [['linear',linear],['prototype',current]])
    for(const wave of [2,3,4,5]) for(const layout of Object.keys(FIXTURE.layouts)) for(const plan of Object.keys(PLANS)) {
      const result=runTradeoff(balance,wave,layout,plan);
      const repeat=runTradeoff(balance,wave,layout,plan);
      if(JSON.stringify(result)!==JSON.stringify(repeat))throw new Error('Repeat mismatch');
      rows.push({variant,...result});
    }
  return {schemaVersion:1,fixture:FIXTURE,plans:PLANS,evidence:'112 controlled wave/layout/plan/variant comparisons, repeated identically. Linear focus/coverage and sustain/reach pairs intentionally share the same linear builds. Activity counts are not causal attribution. Not player observations, difficulty or engagement validation.',rows};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const result=await buildTradeoffs();
  await writeFile(process.argv[2] || '/tmp/m32-tradeoffs.json',JSON.stringify(result,null,2)+'\n');
}
