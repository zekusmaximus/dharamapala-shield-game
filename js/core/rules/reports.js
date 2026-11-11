import { getTowerStats } from './towers.js';
import { PATH_METRICS } from '../world.js';

const zero = () => ({ dharma: 0, bandwidth: 0, anonymity: 0 });
export function createReports(partial = false) {
  return { pending: [], active: { partial, passiveDharma: 0, spent: zero(), refunds: zero(), bounty: zero(), clear: zero(), towers: {}, leaks: [], coverage: {} } };
}
export function resourceEntry(session, category, values) {
  const target = session.state.reports.active[category];
  for (const key of Object.keys(target)) target[key] += values[key] || 0;
}
export function towerEntry(session, tower) {
  const entries = session.state.reports.active.towers;
  return entries[tower.id] ||= { type: tower.type, x: tower.x, y: tower.y, level: tower.level, health: 0, shield: 0, kills: 0, shots: 0, slowHits: 0, vulnerabilityHits: 0, auraShots: 0 };
}
// Geometry is sampled before movement, independently of targeting, cooldown and EMP.
export function sampleCoverage(session, enemy) {
  const covered = [...session.state.defenses.values()].some(t => t.type !== 'distributor' &&
    Math.hypot(t.x - enemy.x, t.y - enemy.y) <= getTowerStats(session.balance, t.type, t.level).range);
  if (covered) session.state.reports.active.coverage[enemy.id] = Math.min(PATH_METRICS.totalLength, enemy.pathDistance);
}
export function finishReport(session, outcome) {
  const reports = session.state.reports;
  reports.pending.push({ ...reports.active, coverage: {}, waveNumber: session.state.waveNumber,
    killed: session.state.wave.killed, leaked: session.state.wave.leaked, outcome });
  reports.active = createReports().active;
}

// Optional v2 extension: old saves remain valid; restored legacy combat is labelled partial.
export function validateReports(reports, balance) {
  if (reports === undefined) return;
  const number = v => typeof v === 'number' && Number.isFinite(v) && v >= 0;
  const count = v => Number.isSafeInteger(v) && v >= 0;
  const fail = () => { throw new Error('Invalid wave reports'); };
  const ledger = r => {
    if (!r || typeof r.partial !== 'boolean' || !number(r.passiveDharma)) fail();
    for (const key of ['spent', 'refunds', 'bounty', 'clear']) {
      if (!r[key] || !['dharma', 'bandwidth', 'anonymity'].every(k => number(r[key][k]))) fail();
    }
    if (!r.towers || Array.isArray(r.towers) || typeof r.towers !== 'object' || !r.coverage || Array.isArray(r.coverage) || typeof r.coverage !== 'object' || !Array.isArray(r.leaks)) fail();
    for (const t of Object.values(r.towers)) {
      if (!balance.towers[t.type] || !number(t.x) || !number(t.y) || !count(t.level) || t.level < 1 || t.level > balance.upgrades.maxLevel || !['health','shield'].every(k => number(t[k])) || !['kills','shots','slowHits','vulnerabilityHits','auraShots'].every(k => count(t[k]))) fail();
    }
    for (const d of Object.values(r.coverage)) if (!number(d) || d > PATH_METRICS.totalLength) fail();
    for (const l of r.leaks) {
      if (!(balance.enemies[l.type] || balance.bosses[l.type]) || !number(l.damage) ||
        !(l.lastCovered === null || (number(l.lastCovered) && l.lastCovered <= PATH_METRICS.totalLength))) fail();
    }
  };
  if (!reports || !Array.isArray(reports.pending) || reports.pending.length > balance.waves.length) fail();
  ledger(reports.active);
  const seen = new Set();
  for (const r of reports.pending) {
    ledger(r);
    if (!Number.isInteger(r.waveNumber) || r.waveNumber < 1 || r.waveNumber > balance.waves.length ||
      !['cleared','defeat'].includes(r.outcome) || !count(r.killed) || !count(r.leaked) || seen.has(r.waveNumber) || (r.partial ? r.leaks.length > r.leaked : r.leaks.length !== r.leaked)) fail();
    seen.add(r.waveNumber);
  }
}
