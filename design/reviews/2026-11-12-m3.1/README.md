# M3.1 authored wave-pressure verification

Started from fetched latest main `20d33bb` (M2.6, PR #24) on dedicated branch
`feat/m3-1-wave-pressure`. No applicable AGENTS.md was found in the checkout,
workspace parents or filesystem inventory. Read ROADMAP.md, CONTENT_SCHEMA.md,
the historical 2026-11-11 code review, and every M1.1–M1.5 / M2.1–M2.6
verification README. The review describes its historical baseline, not open
current defects. Main still had sequential-only groups and unchecked M3.1;
`gh pr list --repo zekusmaximus/dharamapala-shield-game --state all --search
'M3.1' --json number,title,state,headRefName` returned `[]` before this PR.
Earlier evidence is preserved unchanged. This completes M3.1 only; the M3
engagement gate and M3.2–M3.5 remain open. No M4/M6 implementation is included.

## Authored intent and actual scope

Only version and waves 1–5 scheduling fields change in balance.json.
[Content scope check](content-scope.txt) compares parsed JSON with main:
typed counts, HP multipliers, rewards, all tower/enemy/boss/combat/economy values,
and every wave 6–20 definition are identical. No new enemy ability or escort
protection is implied: escorts are overlapping arrivals using existing movement,
armor, targeting and damage. The timing design is deliberate but still provisional
for human testing.

| Wave | Authored simulated seconds after Start Wave | Intended pressure / breathing room |
|---|---|---|
| 1 | 4 Kiddies at 0–3, every 1; 4 at 6.5–8.6, every 0.7 | Read the opening route, then a tighter repeat; 3.5 s without new authored arrivals |
| 2 | 4 Kiddies at 0–2.1, every 0.7; 6 at 5–6.75, every 0.35 | A distinct runner burst after a 2.9 s arrival gap |
| 3 | 3 Agents at 0–2.8, every 1.4; 4 Kiddies at 0.7–2.2, every 0.5; 4 at 6.5–7.7, every 0.4 | Armored arrivals lead faster runners into shared coverage; a 3.7 s gap precedes the tail |
| 4 | 3 Agents at 0–1.8, every 0.9, with 3 Kiddies at 0.9–1.5, every 0.3; 2 Agents at 6–6.9, every 0.9, with 3 Kiddies at 6.6–7.2, every 0.3 | Two mixed escort packets, including stable simultaneous arrivals; 4.2 s arrival gap |
| 5 | Raid Team at 0; 6 Kiddies at 0.6–2.6, every 0.4; 6 at 6.5–8, every 0.3 | Existing EMP/reinforcements plus two escort bursts form the slice climax; 3.9 s without new authored arrivals does not stop the boss |

These recovery windows are gaps **between scheduled arrivals**, not promised
empty battlefields, build opportunities or a suspension of health-triggered
reinforcements. Preview states that limitation explicitly. It aggregates enemy
counts, lists every packet's start/end/spacing, associates those descriptions with
the inspection button via aria-describedby, and explains simulated time and 2×.
Native details/summary disclosures and enemy inspection remain intact; timings
are text, do not animate and do not become a noisy live region.

The [content contract](../../CONTENT_SCHEMA.md#m31-authored-spawn-windows-balance-110)
defines optional absolute `offsetMs`, the legacy sequential fallback including
its trailing interval, stable ties, chronological serialized orders and exact
version recovery. Runtime, simulator, preview and snapshot validator share the
same rules. Pending schedules survive pause and JSON save/restore, including
boss-inserted events. Save validation now also rejects reordering simultaneous
events, preserving authored ties. Fixed 60 Hz steps, 1×/2× accumulation and
explicit Start Wave remain unchanged.

## Save policy

Balance is `1.1.0`; save schema v2 and preference keys are unchanged. Existing
`1.0.0` v2 runs, including building and terminal runs, are deliberately retired
through the existing exact-version rejection and export/reset recovery flow.
There is no automatic migration. Rejection happens before swapping the session;
original bytes are retained, writes are blocked, export is offered, and Reset
saved run is explicit. Preferences and the most-recent recovery archive survive
reset. Export before resetting for a durable copy. The pre-v2 refund import stays
an explicit import; it does not allow v2 combat through the version gate.

[old-1.0.0-save.json](old-1.0.0-save.json) was captured **before edits**, using
main's GameSession and content: fresh tutorial-completed run, Firewall at
(210,210), Start Wave, 120 production fixed steps, then pause. It is a recovery
fixture, not evidence of completed combat. Tests preserve/export its exact bytes,
block overwrites, reset explicitly, and retain independent preferences. Historical
M1 terminal repair coverage is pinned to 1.0.0 content version; it does not exempt
old saves from current recovery.

## Evidence and limits

- Thirteen schedule unit checks assert exact first-five due times, preview parity,
  stable ties, zero/fractional/omitted offsets, malformed/overflow rejection,
  serializable scheduler continuation, and exact legacy schedules for waves 6–20.
  These are definition/validation fixtures, not combat results.
- Two new fresh five-wave slices at 1× and 2× buy through the existing policy with
  default funds and lives. They use production firing, impacts, movement, boss
  thresholds, dynamic reinforcements, kills, clearance, resources and reports.
  They assert actual runner/Agent and runner/boss overlap, no authored arrivals
  during the gap, no automatic build transition, pause freezing, and every-tick
  JSON-restored parity through each wave's remaining combat. No grants, skips,
  entity edits, direct hits, synthetic kills or direct wave completion establish
  those outcomes. Existing M2.5 equal-time speed tests remain.
- Three other new integration checks exercise old-save recovery and malformed
  due times/tie order. These are recovery/validation fixtures. The two existing
  positioned EMP fixtures now wait for the first scheduled escort rather than
  assuming boss and escort share the first tick; their ability assertions remain.
- Eight new browser tests cover timing/inspection/dismissal/deliberate starts at
  360×640, 390×844, 640×360, 844×390 and 1280×720, actual Tab/Enter Raid access,
  pause/reload/Continue with pending arrivals and 2×, and exact old-save export/reset.
  Wave 4/5 preview setup only selects that authored wave. The save checkpoint
  disables RAF and advances actual production combat to wave 1's gap; it is not
  a browser campaign. Prior M1/M2 pointer, emulated touch, rotation, keyboard,
  dialog, preference, inspection, report and speed checks remain in the suite.
- One new axe test scans wave 4/5 previews with both reduced-motion preferences
  in portrait. The fixture selects the wave/preference; no combat claim comes
  from it. Canvas pixels are excluded; assertions check serious/critical findings.

[baseline.json](baseline.json), [results.json](results.json), [summary.md](summary.md)
and [comparison.md](comparison.md) preserve current observations separately from
corrected M1.4 and M2.4 evidence. The comparison script verifies all corrected
mechanic/rejected-save probes and policy/scenario definitions remain identical.
All 21 seven-policy/difficulty campaigns repeat exactly. Repeats establish
reproducibility; Easy/Normal/Hard share one map/roster and are not independent
random challenges. No human win rate is estimated.

Intended gameplay change is temporal concentration, recovery and escort overlap,
not increased HP or income changes. Existing-policy Normal peaks change from
5/5/3/3/7 to 4/6/6/6/9 across waves 1–5, with no leaks. Its five-wave simulated
time changes from 83.783 to 87.733 s (building/thinking excluded). Every strong
policy still clears the first five without leaks; this does not establish M3's
broader counterplay or difficulty gate. Existing/counter-aware still make the
same choices. Final victory/defeat and finishing wave remain unchanged for all
21 comparisons. Hard existing/counter-aware now finish with 19 lives instead of
20 (one Quantum Hacker leak on wave 20); Firewall-only finishes with 9 instead
of 10 (its wave-20 leak mix changes). Upgrade-heavy stays untouched; no-support
stays at 19; expansion-heavy still loses Hard on 20; weak placement still loses
on 3 everywhere. Earlier timing can propagate through persistent cooldowns,
combat state and subsequent spending; unchanged later content does not promise
identical later outcomes. We have not isolated a single causal path for those
late leaks. No later wave or economy was tuned to compensate.

The balance-file SHA-256 changes `77d0377e…` (M2.6 main) → `4fc722f1…`.
That is provenance. Actual spawn windows, peak-live counts, combat time, resource
ledgers and leaked enemies are separate gameplay evidence. M1.4 comparisons
include all twelve legacy policy outcomes; M2.4 comparisons include all twenty-one
seven-policy outcomes, waves, bosses and ledgers. Existing M2.3 limits on health /
shield damage, aura-present shots, control applications and sampled leak coverage
still apply; activity is not causal credit or prevented leaks.

All browser evidence is automated headless Chromium, keyboard and pointer /
emulated-touch checks plus axe. It is **not** physical-device, screen-reader,
Safari/Firefox, manual accessibility, performance, human readability, engagement
or difficulty validation. Human first-time and returning-player observations
remain M3.5, and M3 as a whole is not complete.

## Reproduction

From a clean checkout with Node >=22:

```bash
npm ci --cache /tmp/dharamapala-m31-npm-cache
npx playwright install chromium
npm run build
npm run test:unit
npm run test:integration
npm run test:sim
CI=1 npm run test:e2e
CI=1 npm run test:a11y
node tools/review/baseline.mjs > /tmp/m31-baseline.json
cmp /tmp/m31-baseline.json design/reviews/2026-11-12-m3.1/baseline.json
npm run balance:report -- --output=/tmp/m31-results.json
cmp /tmp/m31-results.json design/reviews/2026-11-12-m3.1/results.json
node tools/balance/summary.mjs /tmp/m31-results.json /tmp/m31-summary.md
cmp /tmp/m31-summary.md design/reviews/2026-11-12-m3.1/summary.md
node design/reviews/2026-11-12-m3.1/compare.mjs
git diff --check
```

Local Chromium uses `PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers`;
local system libraries were present. CI installs system dependencies separately.
The old evidence files are never regenerated by these commands.

Initial working-checkout failures were fixture/assertion issues: two EMP setups
expected the escort at time zero; new browser tests initially called a nonexistent
settings helper and asserted disabled state on a hidden, unselected Upgrade
button. They now use the production setting method and the visible wave-locked
palette. [Initial browser output](initial-browser-validation.txt) is retained;
no production combat rule or authored schedule was changed to satisfy those
assertions. All checks were then rerun against the corrected tests.

Clean-checkout and hosted PR results are recorded below after validation.
