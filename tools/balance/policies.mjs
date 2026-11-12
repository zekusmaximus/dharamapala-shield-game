import { DeterministicPlayerPolicy, buildPositions, policySpecialization } from '../sim/run.mjs';
import { getEffectiveDamage } from '../../js/core/rules/combat.js';
import { getTowerStats } from '../../js/core/rules/towers.js';

export const POLICY_DEFINITIONS = {
  existing: 'Unmodified DeterministicPlayerPolicy: ensure Encryption; grow attackers to min(14,2+ceil(wave/2)); add one Distributor from wave 4; upgrade lowest-level attackers, ties by localeCompare ID.',
  'firewall-only': 'Existing policy, rejecting every non-Firewall purchase.',
  'no-support': 'Existing policy, rejecting Distributor purchases.',
  'expansion-heavy': 'Buy Firewalls until no affordable legal slot remains; never upgrade or buy other types.',
  'upgrade-heavy': 'Ensure one Encryption and one Firewall; upgrade lowest-level attackers until blocked; then buy at most one Firewall per preparation. No support.',
  'weak-placement': 'Existing policy with ascending coverage positions (ties x then y), including zero-coverage cells.',
  'counter-aware': 'Existing growth/support/upgrade order, but each Firewall request chooses the higher upcoming HP-weighted base effective DPS per Dharma of Firewall/Encryption; ties Firewall. Ensure Encryption as usual. No future knowledge beyond the incoming authored roster; ignores status/aura/projectile/targeting benefits in this heuristic.'
};
const strong = buildPositions();
const weak = [...strong].sort((a,b) => a.coverage-b.coverage || a.x-b.x || a.y-b.y);
export function counterChoice(session) {
  const groups = session.balance.waves.find(w => w.wave === session.state.waveNumber).enemies;
  const score = type => {
    const stats = getTowerStats(session.balance, type);
    return groups.reduce((sum,g) => {
      const d = session.balance.enemies[g.id] || session.balance.bosses[g.id];
      return sum + g.count * d.baseHP * (g.hpMult || 1) *
        getEffectiveDamage(stats.damage,d,stats.damageType) * stats.ratePerSec;
    },0) / session.balance.towers[type].cost.dharma;
  };
  return score('encryption') > score('firewall') ? 'encryption' : 'firewall';
}
function upgradeAll(session) {
  while (true) {
    const candidates = [...session.state.defenses.values()].filter(t=>t.type!=='distributor')
      .sort((a,b)=>a.level-b.level || a.id.localeCompare(b.id));
    if (!candidates.some(t=>session.upgradeDefense(t.id, policySpecialization(session, t)).ok)) break;
  }
}
export function createPolicy(name) {
  if (!(name in POLICY_DEFINITIONS)) throw new Error(`Unknown policy: ${name}`);
  const policy = new DeterministicPlayerPolicy();
  const buy = policy.buy.bind(policy);
  if (name === 'firewall-only' || name === 'no-support') {
    policy.buy = (s,t) => (name === 'firewall-only' ? t === 'firewall' : t !== 'distributor') && buy(s,t);
  }
  if (name === 'weak-placement') policy.buy = (s,t) => {
    const position = weak.find(p=>![...s.state.defenses.values()].some(d=>Math.hypot(d.x-p.x,d.y-p.y)<45));
    return Boolean(position && s.placeDefense(t,position).ok);
  };
  if (name === 'counter-aware') policy.buy = (s,t) => buy(s,t==='firewall' ? counterChoice(s) : t);
  if (name === 'expansion-heavy') policy.build = s => { while (buy(s,'firewall')) { /* finite legal slots/resources */ } };
  if (name === 'upgrade-heavy') policy.build = s => {
    for (const t of ['encryption','firewall']) if (![...s.state.defenses.values()].some(d=>d.type===t)) buy(s,t);
    upgradeAll(s);
    buy(s,'firewall');
  };
  return policy;
}
