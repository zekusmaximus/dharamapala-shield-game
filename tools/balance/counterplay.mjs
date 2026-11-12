// M3.4: fresh slices and earned wave-3 forks. No funding or synthetic resolutions.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GameSession } from '../../js/core/GameSession.js';
import { bracePhase } from '../../js/core/rules/brace.js';
import { canAfford, getUpgradeCost } from '../../js/core/rules/economy.js';
import { capacity, prepareEconomyWave, runEconomy, ECONOMY_PLANS } from './economy.mjs';
import { buildPositions, loadBalance } from '../sim/run.mjs';

export const RESPONSES = ['save','central-expansion','early-expansion','late-expansion','firewall2','focus3','coverage3','encryption2','sustain3','reach3'];
export function fight(s, {speed=1, restoreAt=[]}={}) {
  s.setWaveSpeed(speed);
  const agents=new Map();
  const observe=()=>{
    for(const e of s.state.enemies.values()) if(e.type==='federalAgent') {
      const row=agents.get(e.id)||{id:e.id,spawnedAtMs:e.spawnedAtMs,maxHealth:e.maxHealth,shieldMax:e.shieldMax,transitions:[],outcome:'unresolved'};
      const phase=bracePhase(e.brace,s.state.gameTimeMs)||'none';
      if(row.transitions.at(-1)?.phase!==phase) row.transitions.push({phase,ageMs:s.state.gameTimeMs-e.spawnedAtMs,health:e.health,shield:e.shield,pathDistance:e.pathDistance});
      agents.set(e.id,row);
    }
  };
  const bind=()=>{
    s.events.on('enemy-spawned',observe);
    for(const [event,outcome] of [['enemy-killed','killed'],['enemy-leaked','leaked']])s.events.on(event,({enemyId})=>{
      const row=agents.get(enemyId);if(row)Object.assign(row,{outcome,ageAtResolutionMs:s.state.gameTimeMs-row.spawnedAtMs,phaseAtResolution:bracePhase(s.balance.enemies.federalAgent.brace ? {activatesAtMs:row.spawnedAtMs+s.balance.enemies.federalAgent.brace.windupMs,expiresAtMs:row.spawnedAtMs+s.balance.enemies.federalAgent.brace.windupMs+s.balance.enemies.federalAgent.brace.durationMs}:null,s.state.gameTimeMs)||'none'});
    });
  };
  bind();const start=s.state.gameTimeMs;
  assert.ok(s.startWave().ok);
  let steps=0;
  while(s.state.phase==='WAVE' && steps++<120000) {
    s.tick(1000/60/speed);observe();
    if(restoreAt.includes(steps)) {
      s.pause();const snapshot=JSON.parse(JSON.stringify(s.toSnapshot()));
      s.tick(250);assert.deepEqual(s.toSnapshot().state,snapshot.state);
      s=GameSession.fromSnapshot(s.balance,snapshot);bind();s.resume();
    }
  }
  assert.notEqual(s.state.phase,'WAVE');
  return {session:s, result:{durationMs:s.state.gameTimeMs-start,lives:s.state.lives,after:{...s.state.resources},agents:[...agents.values()],report:structuredClone(s.state.reports.pending.at(-1))}};
}
export function responseForks(balance,difficulty='Normal',options={}) {
  let common=new GameSession(balance);common.newGame({tutorialCompleted:true,difficulty,seed:1337});prepareEconomyWave(common,'saving');
  for(let w=1;w<=2;w++)common=fight(common).session;
  const checkpoint=JSON.parse(JSON.stringify(common.toSnapshot())),rows=[];
  for(const response of RESPONSES) {
    let s=GameSession.fromSnapshot(balance,checkpoint);const before={...s.state.resources},cost={dharma:0,bandwidth:0,anonymity:0};
    const isExpansion=response.endsWith('expansion'),type=/encryption|sustain|reach/.test(response)?'encryption':'firewall';
    const level=Number(response.at(-1))||1;
    const add=c=>{for(const k of Object.keys(cost))cost[k]+=c[k]||0;};
    if(isExpansion)for(let i=0;i<3;i++)add(balance.towers.firewall.cost);
    else if(response!=='save')for(let l=1;l<level;l++)add(getUpgradeCost(balance,type,l));
    if(!canAfford(before,cost)){rows.push({response,before,cost,available:false});continue;}
    if(isExpansion) {
      const positions=response==='central-expansion'?buildPositions():response==='early-expansion'?[{x:90,y:210},{x:90,y:150},{x:210,y:150}]:[{x:450,y:330},{x:570,y:330},{x:690,y:330}];
      for(let i=0;i<3;i++) {
        const p=positions.find(p=>![...s.state.defenses.values()].some(t=>Math.hypot(t.x-p.x,t.y-p.y)<45));
        assert.ok(s.placeDefense('firewall',p).ok);
      }
    } else if(response!=='save') {
      const t=[...s.state.defenses.values()].find(t=>t.type===type);
      while(t.level<level)assert.ok(s.upgradeDefense(t.id,t.level===2?(response==='coverage3'?'coverage':response==='reach3'?'reach':type==='firewall'?'focus':'sustain'):null).ok);
    }
    const towers=capacity(s),start={...s.state.resources};
    const {result}=fight(s,options);
    rows.push({response,before,cost,available:true,start,towers,...result});
  }
  return rows;
}
export async function buildCounterplayReport() {
  const old=JSON.parse(await readFile(new URL('../../design/reviews/2026-11-12-m3.4/baseline-1.3.0.json',import.meta.url))),current=await loadBalance();
  const runs=[],forks=[];
  for(const [variant,b] of [['m3.3',old],['m3.4',current]])for(const difficulty of ['Easy','Normal','Hard']) {
    for(const plan of Object.keys(ECONOMY_PLANS)) {
      const r=runEconomy(b,plan,difficulty);assert.deepEqual(r,runEconomy(b,plan,difficulty));runs.push({variant,...r});
    }
    const rows=responseForks(b,difficulty);assert.deepEqual(rows,responseForks(b,difficulty));forks.push({variant,difficulty,rows});
  }
  return {setup:'30 fresh first-five policy slices and 60 earned wave-3 forks (blocked options retained), each repeated. Forks earn the common opening-only checkpoint through waves 1–2. No grants/skips/sells/direct hits/clears. Early/central/late expansion differs only in legal placement for the same 90 Dharma. Agent phase observations and shield/health accounting are descriptive, not status/support causal credit. Determinism is not human engagement/difficulty/build-diversity evidence.',runs,forks};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const r=await buildCounterplayReport();
  const compact=(x,key)=>JSON.stringify({...x,[key]:[]},null,2).replace(`"${key}": []`,`"${key}": [\n`+x[key].map(w=>JSON.stringify(w)).join(',\n')+'\n]');
  await writeFile(process.argv[2]||'/tmp/m34-counterplay.json',JSON.stringify({...r,runs:[],forks:[]},null,2).replace('"runs": []','"runs": [\n'+r.runs.map(x=>compact(x,'waves')).join(',\n')+'\n]').replace('"forks": []','"forks": [\n'+r.forks.map(x=>compact(x,'rows')).join(',\n')+'\n]')+'\n');
}
