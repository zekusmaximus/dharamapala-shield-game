import test from 'node:test';
import assert from 'node:assert/strict';
import { enemyCombatFeedback, disabledFeedback } from '../../js/core/rules/combatFeedback.js';
import { GameSession } from '../../js/core/GameSession.js';
import { loadBalance } from '../helpers/loadBalance.js';
const balance = await loadBalance();

test('status text obeys expiry and actual speed cap without mutating combat state', () => {
  const enemy = { type: 'scriptKiddie', slowPct: 0.9, slowUntilMs: 2000,
    vulnerabilityPct: 0.12, vulnerabilityUntilMs: 2000 };
  const before = structuredClone(enemy);
  assert.deepEqual(enemyCombatFeedback(balance, enemy, 1999).statuses.map(s => s.text),
    ['Slow: 80% less speed', 'Vulnerable: +12% damage before resistance/armor']);
  assert.deepEqual(enemyCombatFeedback(balance, enemy, 2000).statuses, []);
  assert.deepEqual(enemy, before);
  assert.match(disabledFeedback({type:'distributor',disabledUntilMs:2000},1000), /aura paused, passive income retained/);
  assert.equal(disabledFeedback({disabledUntilMs:2000},2000), null);
});

test('single warned EMP fires once at threshold, including an over-threshold hit', () => {
  const s = new GameSession(balance, { tutorialCompleted: true });
  s.newGame(); s.state.waveNumber = 5; s.startWave(); s.step(1000/60);
  const boss = [...s.state.enemies.values()].find(e => e.type === 'raidTeam');
  assert.equal(enemyCombatFeedback(balance, boss, s.state.gameTimeMs).nextEmp, 0.66);
  boss.health = boss.maxHealth * 0.66001;
  s.systems.enemy.updateBosses(s);
  assert.deepEqual(boss.firedPhases, []);
  boss.health = boss.maxHealth * 0.66;
  s.systems.enemy.updateBosses(s);
  assert.equal(enemyCombatFeedback(balance, boss, s.state.gameTimeMs).nextEmp, null);
  assert.equal(enemyCombatFeedback(balance, boss, s.state.gameTimeMs).phase, 'Disruption boss');
  boss.health = boss.maxHealth * 0.33;
  s.systems.enemy.updateBosses(s);
  assert.equal(enemyCombatFeedback(balance, boss, s.state.gameTimeMs).nextEmp, null);
  assert.equal(enemyCombatFeedback(balance, boss, s.state.gameTimeMs).phase, 'Disruption boss');
  assert.deepEqual(boss.firedPhases, [1]);
  assert.equal(s.scheduler.events.filter(event => event.dynamic).length, 4);
  const skipped = new GameSession(balance,{tutorialCompleted:true});
  skipped.newGame();skipped.state.waveNumber=5;skipped.startWave();skipped.step(1000/60);
  const other=[...skipped.state.enemies.values()].find(e=>e.type==='raidTeam');
  other.health=other.maxHealth*0.2;skipped.systems.enemy.updateBosses(skipped);
  assert.deepEqual(other.firedPhases,[1]);
  assert.equal(skipped.scheduler.events.filter(event => event.dynamic).length,4);
});

test('Titan reports shield behavior rather than unused phase metadata', () => {
  assert.equal(enemyCombatFeedback(balance, { type:'megaCorpTitan' },0).phase,
    'Shield boss · no health-triggered phases');
  const titan = {type:'megaCorpTitan',shield:10,shieldMax:100,shieldCooldownUntilMs:3000};
  assert.match(enemyCombatFeedback(balance,titan,1000).shieldRecovery,/in 2.0 s without hits/);
  assert.match(enemyCombatFeedback(balance,titan,3000).shieldRecovery,/regenerating at 4%/);
  titan.shield=100;
  assert.equal(enemyCombatFeedback(balance,titan,3000).shieldRecovery,null);
});

test('canvas draws distinct static markers, shield fill, and pending EMP range from live state', async () => {
  const { CanvasRenderer } = await import('../../js/render/CanvasRenderer.js');
  const calls = [];
  const ctx = new Proxy({}, { get: (_, key) => (...args) => {
    calls.push([key, ...args]);
    if (key === 'measureText') return {width: 100};
  }, set: () => true });
  const renderer = new CanvasRenderer({getContext:()=>ctx},{resize(){}},balance);
  const s = new GameSession(balance,{tutorialCompleted:true});
  s.newGame(); s.state.waveNumber=15; s.startWave(); s.step(1000/60);
  const boss = [...s.state.enemies.values()].find(e=>e.kind==='boss');
  boss.shield = boss.shieldMax/2;
  boss.slowPct=0.2; boss.slowUntilMs=10000;
  boss.vulnerabilityPct=0.12; boss.vulnerabilityUntilMs=10000;
  renderer.drawEnemies(ctx,s);
  assert.ok(calls.some(c=>c[0]==='fillText' && c[1].includes('↓ SLOW ◇ VULN')));
  assert.ok(calls.some(c=>c[0]==='fillText' && c[1].includes('Shield')));
  const shieldOutline=calls.find(c=>c[0]==='strokeRect' && c[4]===6);
  assert.ok(calls.some(c=>c[0]==='fillRect' && c[4]===6 && Math.abs(c[3]-shieldOutline[3]/2)<1e-8));
  boss.type='raidTeam'; boss.shieldMax=0; boss.shield=0;
  calls.length=0; renderer.drawEnemies(ctx,s);
  assert.ok(calls.some(c=>c[0]==='arc' && c[3]===260));
  boss.firedPhases=[1]; boss.phase=1;
  calls.length=0; renderer.drawEnemies(ctx,s);
  assert.ok(!calls.some(c=>c[0]==='arc' && c[3]===260));
  assert.ok(calls.some(c=>c[0]==='fillText' && c[1].includes('EMP spent')));
});
