import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBalance } from '../../js/core/rules/validation.js';
import { getEmpWarning, enemyCombatFeedback } from '../../js/core/rules/combatFeedback.js';
import { getTowerStats } from '../../js/core/rules/towers.js';
import { clone, loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();

test('shipped content satisfies the explicit runtime schema', () => {
  assert.equal(validateBalance(clone(balance)).version, '1.0.0');
});

const malformed = {
  'unused top-level balance metadata': (b) => { b.balance = { targetTTKEarly: 1.5 }; },
  'unused special label': (b) => { b.enemies.scriptKiddie.special = 'teleport'; },
  'unused boss phase count': (b) => { b.bosses.megaCorpTitan.phases = 4; },
  'unused burn damage': (b) => { b.towers.encryption.status.burnDps = 10; },
  'unused interest rate': (b) => { b.economy.interestPct = 0.1; },
  'missing display label': (b) => { delete b.towers.firewall.name; },
  'invalid icon': (b) => { b.enemies.scriptKiddie.icon = ''; },
  'invalid color': (b) => { b.bosses.raidTeam.color = 'not-a-color'; },
  'noninteger bounty': (b) => { b.enemies.scriptKiddie.bounty.dharma = 0.5; },
  'unknown status property': (b) => { b.towers.encryption.status.freezePct = 0.2; },
  'inactive slow metadata': (b) => { b.towers.firewall.status.slowPct = 0.1; },
  'incomplete vulnerability': (b) => { delete b.towers.encryption.status.vulnerabilityDuration; },
  'slow beyond tower cap': (b) => { b.towers.encryption.status.slowPct = 0.9; },
  'missing boss ability': (b) => { delete b.bosses.raidTeam.abilities.emp.durationMs; },
  'invalid EMP order': (b) => { b.bosses.raidTeam.abilities.emp.thresholds = [0.33, 0.66]; },
  'invalid EMP radius': (b) => { b.bosses.raidTeam.abilities.emp.radius = -1; },
  'unknown reinforcement type': (b) => { b.bosses.raidTeam.abilities.reinforcements.byPhase[0][0] = 'missing'; },
  'invalid shield ratio': (b) => { b.bosses.megaCorpTitan.abilities.shield.healthRatio = NaN; },
  'invalid chain radius': (b) => { b.combat.chain.radius = Infinity; },
  'unreachable chain level': (b) => { b.combat.chain.unlockLevel = b.upgrades.maxLevel + 1; },
  'unknown spawn property': (b) => { b.waves[0].enemies[0].delay = 100; },
  'noninteger wave reward': (b) => { b.waves[0].rewardBonus = 0.5; }
};

for (const [name, mutate] of Object.entries(malformed)) {
  test(`reject content fixture: ${name}`, () => {
    const candidate = clone(balance);
    mutate(candidate);
    assert.throws(() => validateBalance(candidate));
    assert.equal(validateBalance(balance), balance, 'validation did not mutate the shared input');
  });
}

test('presentation and derived tower stats read the same validated tunables', () => {
  const candidate = clone(balance);
  candidate.bosses.raidTeam.abilities.emp.thresholds = [0.7, 0.25];
  candidate.bosses.raidTeam.abilities.emp.radius = 190;
  candidate.bosses.raidTeam.abilities.emp.durationMs = 900;
  candidate.combat.status.durationPerLevel = 0.25;
  candidate.combat.status.slowPctPerLevel = 0.05;
  candidate.combat.chain.unlockLevel = 3;
  validateBalance(candidate);
  assert.match(getEmpWarning(candidate), /70% and 25% health.*190 units for 0.9 s/);
  const boss = { type: 'raidTeam', firedPhases: [], phase: 0 };
  assert.equal(enemyCombatFeedback(candidate, boss, 0).nextEmp, 0.7);
  const encryption = getTowerStats(candidate, 'encryption', 3);
  assert.equal(encryption.slowDurationMs, 2700);
  assert.ok(Math.abs(encryption.slowPct - 0.3) < 1e-12);
  assert.equal(encryption.chainTargets, 1);
});
