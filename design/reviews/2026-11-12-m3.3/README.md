# M3.3 resource decisions verification

Started from fetched latest main `804fa67` (M3.2 / PR #26), on dedicated branch
`m3.3-resource-decisions`. No AGENTS.md was found in the checkout, workspace
parents or filesystem inventory. Read ROADMAP.md, CONTENT_SCHEMA.md, the historical
2026-11-11 code review and M1.1–M1.5 / M2.1–M2.6 / M3.1 / M3.2 verification
READMEs. Main had unchecked M3.3 and no resource-choice experiment; `gh pr list
--repo zekusmaximus/dharamapala-shield-game --state all --search M3.3 --json
number,title,state,headRefName` returned `[]`. Historical evidence is unchanged.

This addresses M3.3 only. M3.2 specialization retention remains **provisional**;
there were no actual player observations. Deterministic policies do not validate
human engagement, difficulty or build diversity. No waves, schedules, enemy
mechanics or M3.4–M3.5 / M4 / M6 features change.

## Decision and bounded changes

The M3.2 economy gives control and support the same 2:1 Bandwidth/Anonymity prices,
with a much larger initial Anonymity reserve. In the new before/after experiment,
none of the 1,301 observed M3.2 purchase opportunities is blocked by Anonymity
alone; three are blocked by Bandwidth alone. These are observations of specified
policies, not exhaustive optimization or human decisions. The old Normal existing
policy starts waves 1–5 with Anonymity 90/88/111/114/154 after purchases. There is
no observed separate purpose justifying a third player-facing price.

- Retire active Anonymity: zero starting supply, tower costs, enemy/boss bounties
  and wave rewards; remove it from HUD, price/refund/report text and tutorial.
  Keep the three numeric keys in saves and all M2 resource ledgers. No new sink,
  exchange or enemy mechanic is invented to justify it.
- Encryption is still 50 Dharma; Bandwidth changes 20 → **35**. Distributor
  Dharma changes 100 → **70**, retaining 60 Bandwidth. The existing upgrade
  multiplier, per-resource rounding, refunds, combat values, specialization
  definitions, aura growth/cap, passive income/cap and Dharma/Bandwidth supply
  remain unchanged. The scope checker compares parsed content, including every
  wave and reward, allowing only the explicit changed fields.
- Shared validated `economy.activeResources` selects the two active currencies;
  historical content without it retains three-resource wave rewards. Unrecognized
  fields, invalid active-resource lists and nonzero retired supply/prices fail
  validation. A native Resource choices disclosure explains saving without
  interest. Inspectors expose exact upgrade deficits and distinguish available
  aura capacity from realized activity and unchanged passive upgrade income.

After the common opening, Normal wave 2 has **110 Dharma / 56 Bandwidth**. Another
Encryption costs 50/35, three Firewalls 90/0, a Firewall upgrade 59/0, an Encryption
upgrade 98/68 and a Distributor 70/60. Bandwidth independently blocks the latter
two while Dharma permits them. Buying more control uses the same reserve one
might save for its upgrades or support; expansion spends only Dharma. The final
experiment observes 51 Bandwidth-only blocks among 1,388 options. Counts include
before/after states, not unique or human decisions.

An initial 40-Bandwidth draft was rejected during development because even an
opening-only Normal run could not afford Encryption level 3 before wave 5.
At 35, cumulative control investment is 338/236 (base 35 + upgrades 68 + 133).
The common opening-only checkpoint reaches wave 5 with 209 Bandwidth after
already buying its base Encryption; the 201 upgrade requirement leaves 8.
Thus explicit control branches remain attainable by saving before the Raid.
No income buff or wave change was used to recover that choice.

## Evidence and contribution limits

[economy.json](economy.json), produced by `tools/balance/economy.mjs`, compares five
specified plans: expansion, upgrades, control, support and saving. Each starts a
fresh default-funded Easy/Normal/Hard run, buys the same two Firewalls plus one
Encryption opening, and plays waves 1–5 in order. All 30 version/plan/difficulty
configurations repeat identically. Purchases use production commands; combat
uses the production clock, movement, targeting, projectiles, armor, statuses,
EMP/reinforcements, kills/leaks, clear rewards and M2 accounting. No grants,
wave skips, entity edits, direct hits, synthetic kills or direct clears produce
these results. Saving skips purchases on waves 2–3, not combat or waves.

Each wave records supply (bounty, clear and its included passive portion),
D/B/A before preparation, exact spending/actions, remaining funds at start/end,
available spending opportunities before/after, currency blockers, towers, route
coverage samples, status/armor-relevant stats, support capacity and realized
production reports. All five plans complete all five waves in each difficulty. Easy/Normal and four
Hard plans retain 20 lives; the saving plan leaks four runners and one Agent on
Hard wave 3 and finishes with 15 lives, under both M3.2 and M3.3. Saving is viable
for this opening but carries this measured Hard risk and longer wave-2/3 times;
this does not establish optimal saving or player difficulty.

The same artifact separately records **80 marginal purchase opportunities** (ten
options × waves 2–5 × two content versions): 58 affordable single-wave combat
forks and 22 blocked options, each repeated identically. Every
fork restores a valid common opening-only checkpoint earned through preceding
production waves. It carries cooldowns, lives and bank forward; it does not grant
funds, skip a wave or reset combat state. Entire purchase cost is checked first;
unaffordable options are recorded and not simulated with invented funding.
The table in [comparison.md](comparison.md) includes unavailable choices.

Marginal results show why raw DPS does not rank investments. On the sparse Raid
checkpoint, no purchase leaks once; three more base Firewalls and a level-2
Firewall still leak, whereas Focus/Coverage level-3 upgrades do not (33.450 /
39.383 seconds). Their ranges, armor-adjusted hit sizes and cadence differ.
Both level-3 control choices are affordable; Sustained control clears while
Chain reach records more status applications yet leaks. More applications are
not proof of stronger assistance. Production reports retain capped health/shield
removal, final hits, status refreshes, typed leaks and last sampled coverage.

A base Distributor has gross passive-only Dharma payback of **12 successful
clears**, down from 17, with +6 marginal cap headroom assumed. It never repays
Bandwidth. Five clears can pay at most 30 Dharma, so the aura must contribute
for an early purchase to be attractive; income alone is not a first-five-wave
investment case. Net-of-sale payback is a different comparison, explicitly
costing the lost refund currencies. At the passive cap there is no marginal
income. A support upgrade costs 137/117, adds range/aura but no income; it has
no passive-income-only payback. At the sparse Raid checkpoint its available
rate capacity rises, yet aura-present shots rise only 65 → 68 and the leak
remains. Upgrade costs were **not** discounted: other placements/attacker
investments may use that capacity better, and these observations do not justify
a blanket price cut. Full tables include route coverage and existing Agent
armor/resistance examples without claiming raw DPS is combat performance.

Available support rate is geometry/cap/EMP-dependent capacity at preparation,
not measured firing. Aura-present shots are shots taken with an aura present,
not extra shots caused by support; overlapping auras can count the same shot.
Status applications include refreshes/lethal hits, not time saved or causal
assistance. Health removal includes vulnerability without assigning it causal
credit. Sampled route geometry includes possible coverage, not target acquisition
or cooldown readiness. No prevented-leak or caused-damage attribution is inferred.

[results.json](results.json) / [summary.md](summary.md) preserve the seven-policy,
three-difficulty **fresh 20-wave campaign** reporter, separate from the five-wave
economy slices. All 21 exact repeats match. Outcome, finishing wave, final lives
and leak counts match M3.2 for all 21 configurations; times, spending and resources
can change. Existing/counter-aware remain the same heuristic result, not evidence
of adaptation. Expansion-heavy still loses Hard on wave 20; weak placement still
loses all difficulties on wave 3. Later Bandwidth/Dharma surpluses remain large,
especially when policies ignore control/support or exhaust placement slots.
This work establishes a bounded early constraint, not a redesigned campaign or
proof every late resource is useful. No later-wave sink was added to force spend.

[baseline.json](baseline.json) and compare.mjs compare all twelve legacy diagnostic
campaigns and all 21 current campaigns with M3.2 and the **corrected M1.4 / M2.4**
reports. Mechanic/rejection probes and seven-policy/scenario definitions match.
Content hashes are recorded separately from gameplay tables; structural/hash
changes alone are not outcomes. Historical files remain unchanged. The original
M3.2 funded/skipped-wave experiment is pinned to immutable 1.2.0 input and still
regenerates byte-for-byte; it is not fresh earned-resource evidence.

## Compatibility and focused checks

Balance **1.3.0**, save schema **v3**, storage slot `dharmapala-shield/save/v2`
and independent preference shape/keys are explicit. There is no automatic
1.2.0 → 1.3.0 migration. Building, paused, wave and terminal runs require an exact
version match; rejection precedes session replacement and retains original bytes,
blocks writes, offers export and requires explicit Reset saved run. Reset keeps
preferences and the latest recovery archive; export first for a durable copy.
Pre-v2 imports also use recovery under this economy rather than silently repricing
old investments or discarding/converting Anonymity. Matching historical-content
legacy refund behavior remains tested. Continue old runs in their matching build.

`old-1.2.0-v3-save.json` was captured before edits from main's content/runtime:
fresh game, Encryption at (210,210), Start Wave, 120 production steps, pause. It
is a recovery fixture, not completed-combat evidence. Exact bytes are verified
through browser export and repository reset; independent preferences survive.
No snapshot shape change is needed: the balance-version gate versions changed
meaning while the full M2 resource ledger schema stays intact.

Focused rules cover retired supply/prices, historic rewards, currency deficits,
malformed active-resource content and required specializations. Production checks
compare each fresh economy plan uninterrupted/restored at both 1×/2×, through
remaining combat after a paused JSON checkpoint in each wave, reconciling every
ledger. They verify independent Bandwidth rejection/atomicity, actual status/aura
activity and passive income. An atomicity check sets a resource-only command
fixture; it is not fresh-run evidence. Existing schedule/preview, terminal,
preferences, combat, speed, and M1/M2 regressions remain. Funded branch continuation
fixtures now explicitly supply 420/300/0; historical equal-budget tradeoff tests
stay pinned to 1.2.0. Neither fixture is presented as an earned economy.

Browser checks use actual Tab/Enter, ordinary pointer actions and existing touch
emulation/rotation at the established five sizes. New checks cover two-resource
HUD/costs/guidance, exact upgrade deficits, locked wave upgrades and v3 recovery.
Axe scans the resource guide, deficits and support-capacity caveat in portrait.
All browser/axe evidence is **automated headless Chromium**, with canvas pixels
excluded from axe. It is not physical-device, screen-reader, Safari/Firefox,
manual accessibility, performance or human playtest evidence. Human specialization
retention, engagement and difficulty gates remain open.

## Reproduction

From a clean checkout, Node >=22:

```bash
npm ci --cache /tmp/dharamapala-m33-npm-cache
npx playwright install chromium
npm run build
npm run test:unit
npm run test:integration
npm run test:sim
CI=1 npm run test:e2e
CI=1 npm run test:a11y
node tools/review/baseline.mjs > /tmp/m33-baseline.json
cmp /tmp/m33-baseline.json design/reviews/2026-11-12-m3.3/baseline.json
npm run balance:report -- --output=/tmp/m33-results.json
cmp /tmp/m33-results.json design/reviews/2026-11-12-m3.3/results.json
node tools/balance/summary.mjs /tmp/m33-results.json /tmp/m33-summary.md
cmp /tmp/m33-summary.md design/reviews/2026-11-12-m3.3/summary.md
node tools/balance/economy.mjs /tmp/m33-economy.json
cmp /tmp/m33-economy.json design/reviews/2026-11-12-m3.3/economy.json
node tools/balance/tradeoffs.mjs /tmp/m33-historical-tradeoffs.json
cmp /tmp/m33-historical-tradeoffs.json design/reviews/2026-11-12-m3.2/tradeoffs.json
node design/reviews/2026-11-12-m3.3/compare.mjs
git diff --check
```

Local Chromium uses `PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers`;
local system libraries were already present. Hosted CI installs them separately.
Initial browser invocation preceded completion of Chromium download and all
launches failed; [initial-browser-setup.txt](initial-browser-setup.txt) preserves
that setup failure. No gameplay was changed to address browser launch. Initial
unit/integration checks exposed historical fixtures funded below the new
Bandwidth costs and an old legacy-import expectation; fixtures were made explicit
or pinned to historical content as described above, with compatibility rejection
covered separately.

Clean-checkout and hosted CI results are recorded below after execution.
