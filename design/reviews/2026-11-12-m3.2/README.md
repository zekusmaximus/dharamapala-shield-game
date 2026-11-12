# M3.2 tower-tradeoff prototype verification

Started from fetched latest main `a3ca828` (PR #25) on dedicated branch
`m3.2-tower-tradeoffs`. No applicable AGENTS.md was found in the repository,
workspace parents or filesystem inventory. Read ROADMAP.md, CONTENT_SCHEMA.md,
the historical code review and all M1/M2/M3.1 verification READMEs. Main had
unchecked M3.2 and no specialization implementation. `gh pr list --repo
zekusmaximus/dharamapala-shield-game --state all --search 'M3.2' --json
number,title,state,headRefName` returned only merged M3.1 PR #25 (its body mentions
next work), not an M3.2 PR. Historical evidence is preserved unchanged.

**This is a provisional prototype.** No actual player observations were available.
The roadmap requires players making different defensible choices before retaining
specializations. That acceptance decision remains provisional; M3.2 is unchecked
and M3 remains partial. No M3.3–M3.5, M4 or M6 implementation is included.

## Design and scope

At level 2 → 3, each attacking tower requires an explicit permanent choice.
Later upgrades keep the branch; selling/rebuilding uses the existing 70% refund.
Level-3 prices remain identical across branches, so changing a choice cannot
create a hidden price/refund rule. Costs remain part of measured opportunity cost:
Firewall level 3 costs 203 Dharma total (30+59+114), Encryption 338/135/68
(Dharma/Bandwidth/Anonymity), Distributor level 1 costs 100/60/30. No base costs
were changed: these experiments do not justify a general economy retune.

Multipliers apply once to each level's existing linear stats, at levels 3–5:

| Choice | Gains | Sacrifice |
|---|---|---|
| Firewall Focus | ×1.8 hit size, less proportional armor loss | ×0.8 range, ×0.7 cadence |
| Firewall Coverage | ×1.25 range, ×1.45 cadence | ×0.85 hit size, greater proportional armor loss |
| Encryption Sustained control | ×1.4 slow, ×1.5 status duration/vulnerability, subject to existing caps | Single target; never unlocks chain |
| Encryption Chain reach | ×1.15 range; two extra chain targets from level 3 | ×0.85 damage; ×0.75 slow, duration and vulnerability |

Chain retains the existing 120-unit radius / 60% secondary damage, with full
branch status application. There are no new combat/enemy mechanics. Only version
and specialization definitions change in balance.json. `linear-1.1.0.json` is
an exact copy of `git show a3ca828:design/balance.json`, checked against the M3.1
report hash. compare.mjs strips only version/new branch fields and verifies deep
equality of every other field, including all twenty waves and schedules. Existing
armor, resistance, targeting, income, currencies, aura values/caps, status stacking,
EMP/passive support semantics, deliberate starts and fixed-clock 1×/2× remain.

Shared stats feed production firing, projectiles, renderer, sampled leak coverage,
inspectors and simulator. HTML fieldsets group the mutually exclusive buttons;
each has a descriptive name, associated consequence text, rule-derived comparisons
(including current support rate), price and disabled state. Successful purchase
announces the branch and moves focus to a useful upgrade/sale control. Blueprints
explain future options. Both prototype and pending human acceptance are explicit.

## Save compatibility

Balance `1.2.0`, wrapper/state schema **v3**, and explicit tower `specialization`
(null below level 3 / on support, otherwise an own branch ID) prevent silent
reinterpretation. The storage slot stays `/save/v2` to discover and protect old
bytes; preference keys/shape are unchanged. There is no v2 migration, even for
building/terminal runs: candidate rejection, original retention, blocked writes,
export, then explicit Reset saved run. Reset keeps preferences and the single
most recent recovery archive; export first for durable retention.

`old-1.1.0-v2-save.json` was captured before editing using main's GameSession:
new tutorial-completed game, Firewall (210,210), Start Wave, 120 fixed steps,
pause. It is a recovery fixture, not completed-combat evidence. Lower-level
pre-v2 refund imports remain; legacy level-3 attackers are rejected rather than
assigned a branch. Historical 1.0.0 terminal repair remains a matching-version
fixture with linear content and v2; it does not bypass current recovery.

## Evidence and interpretation

`tradeoffs.json` records 112 controlled wave/layout/plan/content combinations,
each repeated identically. `tools/balance/tradeoffs.mjs` selects existing waves
2/3/4/5 and grants the same 420/180/90 preparation budget. These are **setup
fixtures**, not fresh campaigns or earned economies. Purchases/upgrades use
production commands. After Start Wave all targeting, firing, impacts, statuses,
movement, EMP/reinforcements, kills/leaks, clearance, income and reports are real
production combat; no enemy edits, direct hits, synthetic kills or direct clears.
Central/spread placements and seven plans are defined in the artifact, including
remaining funds, actual spend, tower coordinates, reports and boss observations.
The linear focus/coverage and sustain/reach plans deliberately duplicate identical
linear builds as paired controls.

Observed scenario dependence is narrow but useful: Coverage beats Focus on
central wave 3 time (15.317 vs 16.583 s), Focus wins spread wave 3 (16.017 vs
17.533 s). Chain reach is faster on spread runners (9.650 vs 11.450 s), while
Sustained control clears central Raid with zero leaks against Chain reach's one.
On central Raid, expansion clears in 33.900 s, support in 37.683 s, and
control-support in 32.133 s; support's 186 aura-present shots and control-support's
16 status applications describe activity, not causal damage or prevented leaks.
Support's passive +6 Dharma still applies. Placement can leave a Distributor with
no recipients: the central control-support wave-2 fixture records zero aura shots.
No raw-DPS ranking or universal necessity claim follows. Early coverage can be
worth more than upgrades; bigger hits can reduce armor loss; chain can spread
control while losing sustained boss pressure. These are observed mechanics and
designed hypotheses for players to test, not human choices.

`results.json` / `summary.md` retain the seven-policy, three-difficulty fresh-run
campaign reporter. Current policies choose Focus/Sustained control explicitly at
level 3; other buying order/scenarios remain identical. All 21 exact repeats match.
`baseline.json` retains all twelve legacy policy outcomes. `comparison.md`, rebuilt
by compare.mjs, compares these against M3.1 and corrected M1.4/M2.4, keeping
hash provenance separate from outcomes. All historical mechanic/rejected-save
probes match. First-five strong policies still clear without leaks. All 21 final
victory/defeat and finishing waves remain unchanged; Hard existing/counter-aware
improve 19 → 20 lives, Firewall-only 9 → 20, no-support 19 → 20. Expansion/weak
placement outcomes are unchanged. The prototype makes some scripted campaigns
easier; it does not establish human challenge. Full reports preserve per-wave
timing, resources, typed leaks/coverage, boss outcomes and contribution accounting.
M2.3 attribution limits apply: capped health/shield removal, final hits, status
applications and aura-present shots do not allocate causal assistance.

Focused checks add branch arithmetic/armor/caps/validation, explicit atomic and
irrevocable commands, inspector/aura values, production Raid continuation for all
four branches at 1×/2×, malformed branch saves, exact v2 recovery/preferences and
legacy rejection. Continued combat checks compare uninterrupted/restored state
and runtime to the final production report. Existing fresh five-wave 1×/2×
schedule/gap/overlap/continuation tests remain. New browser checks use funded
inspector fixtures for choices at five viewport sizes, actual Tab/Enter on both
other branches, reload/Continue, unaffordable/wave-locked choices and old-save
export/reset. These interactions are not fresh campaign evidence.

All browser/axe evidence is automated headless Chromium (pointer, keyboard and
existing emulated touch/rotation checks), excluding canvas pixels from axe.
It is **not** physical-device, screen-reader, Safari/Firefox, manual accessibility,
performance or human readability/engagement/difficulty/build-diversity evidence.

## Reproduction

From a clean checkout, Node >=22:

```bash
npm ci
npx playwright install chromium
npm run build
npm run test:unit
npm run test:integration
npm run test:sim
CI=1 npm run test:e2e
CI=1 npm run test:a11y
node tools/review/baseline.mjs > /tmp/m32-baseline.json
cmp /tmp/m32-baseline.json design/reviews/2026-11-12-m3.2/baseline.json
npm run balance:report -- --output=/tmp/m32-results.json
cmp /tmp/m32-results.json design/reviews/2026-11-12-m3.2/results.json
node tools/balance/summary.mjs /tmp/m32-results.json /tmp/m32-summary.md
cmp /tmp/m32-summary.md design/reviews/2026-11-12-m3.2/summary.md
node tools/balance/tradeoffs.mjs /tmp/m32-tradeoffs.json
cmp /tmp/m32-tradeoffs.json design/reviews/2026-11-12-m3.2/tradeoffs.json
node design/reviews/2026-11-12-m3.2/compare.mjs
git diff --check
```

Local npm uses `--cache /tmp/dharamapala-m32-npm-cache`; Chromium uses
`PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers`. System libraries are
already present locally; hosted CI installs them with `--with-deps`.

The initial working browser run started before Chromium installation had finished
and failed launch (initial-browser-setup.txt). The next run passed 90/91, exposing
one old M3.1 assertion hardcoded to 1.1.0; it now compares to active content while
preserving its scheduler/speed/preference assertions (initial-browser-validation.txt).
A preliminary accessibility invocation collided with the still-running e2e server;
the final pipeline runs browser suites sequentially. A malformed-save test
initially included another valid Firewall branch in its foreign-ID cases; the test
now uses an actually foreign ID. No combat rule was changed for these fixes.

The [control portrait](control-portrait.png) and [damage desktop](damage-desktop.png)
captures use funded inspector fixtures, scrolled to the first choice button.
They are presentation evidence only. Both alternatives and their full tables
require scrolling, particularly in portrait; Start Wave retains its separate
reserved area. Reproduce after build with `PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers
node design/reviews/2026-11-12-m3.2/capture.mjs`.
