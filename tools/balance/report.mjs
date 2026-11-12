// Read-only reporter. No parameter search, gameplay mutations or synthetic kills.
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GameSession } from '../../js/core/GameSession.js';
import { compileSpawnSchedule } from '../../js/core/rules/waves.js';
import { createPolicy, POLICY_DEFINITIONS } from './policies.mjs';
import { loadBalance } from '../sim/run.mjs';

export const SCENARIOS = ['Easy','Normal','Hard'].map(difficulty => ({
  id: `${difficulty.toLowerCase()}-campaign`, difficulty, seed: 1337, firstWave: 1, finalWave: 20,
  setup: 'Fresh production newGame, default resources/lives, fixed world, authored waves in order; stop at defeat or victory. No grants, sells, imports or wave skips.'
}));
export async function runScenario(scenario, policyName, balance = null) {
  balance ||= await loadBalance();
  const session = new GameSession(balance);
  session.newGame({difficulty:scenario.difficulty,seed:scenario.seed,tutorialCompleted:true});
  const initialResources = {...session.state.resources};
  const policy = createPolicy(policyName);
  const waves = [];
  let observation;
  const bosses = new Map();
  session.events.on('enemy-spawned', ({enemyId}) => {
    const e = session.state.enemies.get(enemyId);
    observation.spawnedByType[e.type] = (observation.spawnedByType[e.type] || 0) + 1;
    observation.spawnedHealth += e.maxHealth;
    observation.initialShield += e.shieldMax;
    observation.peakAlive = Math.max(observation.peakAlive,session.state.enemies.size);
    if (e.kind === 'boss') {
      const row = {id:e.id,type:e.type,spawnedAtMs:e.spawnedAtMs,outcome:'unresolved',phases:[]};
      bosses.set(e.id,row); observation.bosses.push(row);
    }
  });
  session.events.on('boss-phase', e => bosses.get(e.enemyId)?.phases.push(e.phase));
  for (const [event,outcome] of [['enemy-killed','killed'],['enemy-leaked','leaked']]) {
    session.events.on(event,e=>{
      const boss = bosses.get(e.enemyId);
      if (boss) Object.assign(boss,{outcome,resolvedAtMs:session.state.gameTimeMs});
    });
  }
  while (session.state.phase === 'BUILDING' && session.state.waveNumber <= scenario.finalWave) {
    const wave = session.state.waveNumber;
    const schedule = compileSpawnSchedule(balance,wave);
    observation = {spawnedByType:{},spawnedHealth:0,initialShield:0,peakAlive:0,bosses:[]};
    const resourcesBefore = {...session.state.resources};
    const livesBefore = session.state.lives;
    policy.build(session);
    const resourcesAtStart = {...session.state.resources};
    const start = session.state.gameTimeMs;
    if (!session.startWave().ok) throw new Error('Start rejected');
    let steps = 0;
    while (session.state.phase === 'WAVE' && steps < 120000) { session.step(1000/60); steps++; }
    if (session.state.phase === 'WAVE') throw new Error(`Timeout: ${scenario.id}/${policyName}/${wave}`);
    const accounting = structuredClone(session.state.reports.pending.at(-1));
    if (accounting?.waveNumber !== wave) throw new Error('Missing production report');
    waves.push({wave,steps,durationMs:session.state.gameTimeMs-start,livesBefore,livesAfter:session.state.lives,
      resourcesBefore,resourcesAtStart,resourcesAfter:{...session.state.resources},
      pressure:{authoredSchedule:schedule,authoredCount:schedule.length,lastAuthoredSpawnMs:schedule.at(-1).dueAtMs,...observation},
      accounting});
  }
  return {scenario:scenario.id,policy:policyName,initialResources,phase:session.state.phase,
    waveNumber:session.state.waveNumber,lives:session.state.lives,statistics:{...session.state.statistics},
    resources:{...session.state.resources},waves};
}
export async function buildReport() {
  const balance = await loadBalance();
  const runs = [];
  const repeats = [];
  for (const scenario of SCENARIOS) for (const name of Object.keys(POLICY_DEFINITIONS)) {
    const run = await runScenario(scenario,name,balance);
    const repeat = await runScenario(scenario,name,balance);
    const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
    const first = digest(run), second = digest(repeat);
    if (first !== second) throw new Error('Deterministic repeat mismatch');
    runs.push(run); repeats.push({scenario:scenario.id,policy:name,first,second,equal:true});
  }
  return {schemaVersion:1,balanceVersion:balance.version,
    balanceSha256:createHash('sha256').update(await readFile(new URL('../../design/balance.json',import.meta.url))).digest('hex'),
    specializationChoices: balance.towers.firewall.specializations ? 'Explicit fixed policy: Focus for Firewall, Sustained control for Encryption at level 3; no human or adaptation claim.' : 'Linear baseline; no specialization.',
    timestepMs:1000/60,policies:POLICY_DEFINITIONS,scenarios:SCENARIOS,
    evidence:'21 policy/configuration comparisons, each repeated exactly once. Three difficulty configurations share map and roster; neither repeats nor seeds are independent trials. No human win rates.',
    runs,repeats};
}
export async function main() {
  const args = process.argv.slice(2);
  if (args.some(a=>!a.startsWith('--output='))) throw new Error('Usage: report.mjs [--output=path]');
  const report = await buildReport();
  // One wave per line keeps the checked-in evidence reviewable without discarding fields.
  const runs = report.runs.map(run => JSON.stringify({...run,waves:[]},null,2).replace('"waves": []', '"waves": [\n' + run.waves.map(w=>JSON.stringify(w)).join(',\n') + '\n]'));
  const json = JSON.stringify({...report,runs:[]},null,2).replace('"runs": []', '"runs": [\n' + runs.join(',\n') + '\n]')+'\n';
  const output = args.find(a=>a.startsWith('--output='))?.slice(9);
  if (output) await writeFile(resolve(output),json); else process.stdout.write(json);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
