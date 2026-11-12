# M4.1 four-act campaign pressure · automated evidence

Started from fetched latest main `c39b6fe` (merged M4.4 / PR #31) on dedicated
branch `m4.1-four-act-pressure-curve`. No applicable `AGENTS.md` exists in the
workspace. `gh pr list --state all --search 'M4.1'` returned `[]`; no existing
M4.1 implementation was found. Before editing, read the roadmap, content
contract, [human-validation deferral](../2026-11-12-human-validation-deferral/README.md),
M3.1–M3.4 evidence and [M4.4 evidence](../2026-11-12-m4.4/README.md).
The [pressure plan](PRESSURE_PLAN.md) was written **before** the wave edit; it
records all 20 existing wave profiles and the decision intended for each.

This implements **M4.1 authored campaign pressure and automated verification
only**. It does not establish human engagement, difficulty, readability, build
diversity or timing. M3.2 specialization retention, M3.5 collection, the broader
M3 human gate and M4 acceptance remain open. M4.2, M4.3, M4.5, M5 and M6 are not
started here. M4.4 remains complete only in its prior automated scope.

## Design and exact content scope

| Act | Waves | Authored job | Recovery and commitment |
| --- | --- | --- | --- |
| I | 1–5 | Keep the established fundamentals and Raid climax byte-identical. | Deliberate starts and the existing scheduled-arrival gaps remain. |
| II | 6–10 | Overlap brace Agents, runners, fire-resistant Saboteurs and armored Surveillance; end with Raid and two escort packets. | 6 spends or banks the first Raid reward while contrasting Agent/Saboteur; 8 introduces Surveillance at lower density before 9–10 combine counters. |
| III | 11–15 | Introduce fast resistant Hackers, then mix them with armor, finite Agent brace, heavy Monks and Titan shield. | 11 earns after Raid while teaching Hacker/armor overlap; 13 is the lower-density heavy/fast comparison before 14–15 commitment. |
| IV | 16–20 | Recombine fast, heavy, armored, resistant and brace threats; overlap a Titan screen, then stagger two Titans and Raid in the final wave. | 16 gives a lower-density post-Titan chance to rebuild or bank; 17 and 19 rise in mixed coverage; 18 adds a shielded boss; 20 tests the combined preparation. |

[The exact 1.4.0 → 1.5.0 group table](comparison.md#exact-authored-edits)
lists every count, interval and absolute offset for waves 6–20. Every one of
those waves now has cross-type overlap under the existing shared compiler. Some
types have two separate packets. Waves 1–5, all non-wave content, reward bonuses,
prices and enemy/boss/tower rules are unchanged. Most retained groups keep their
counts and HP multipliers. Intentional late type exchanges are:

- 14: add three Agents, replace two of eight Surveillance with six; total 14 → 15.
- 17: replace two of eight Surveillance with two Saboteurs; total stays 25.
- 18: replace two of ten Hackers with two Agents; total stays 17.
- 19: trade one Hacker, one Monk and two Surveillance for four Saboteurs; total stays 33.
- 20: trade four Hackers for four Agents; total stays 33.

The added reprise groups use explicit wave-tier HP multipliers shown in the
exact table. This changes earned bounty through composition, **not** economy
prices, income rules or difficulty tuning. Raid EMP/reinforcement rules, Titan
shield recovery and Agent's one-use 3 s warning / 4 s 60%-max-health shield
are unchanged. Agent shields do not refill. Anonymity remains zero in active
supply/prices but numeric in saves and ledgers. Explicit level-3 choices remain
provisional. No boss ability or tower role was redesigned.

The first candidate compressed wave 19 to a 13.2 s last authored arrival,
producing a Hard existing-policy peak of 22, higher than the adjoining waves.
Its final authored arrival is 18.7 s and Hard peak is 17. This spreads the
pre-climax mix while retaining overlap and a distinct wave-20 boss climax.
Recovery means relative authored density and the chance to prepare at the next
deliberate build phase; it does not promise a clear path during a wave. Preview
continues to explain packet windows and this limitation. Unit tests reconcile
all later wave preview windows with compiled events; browser and axe checks
cover later mixed previews in portrait. No preview/runtime rule change was needed.

## Fresh production results and comparison

[results.json](results.json) is the exact 21-run production report from
`tools/balance/report.mjs`: seven preexisting purchase policies × Easy, Normal
and Hard, seed 1337, default resources/lives, legal commands, deliberate starts,
waves in order, actual targeting, hits, movement, boss actions, shields and
natural exits. Every run was repeated exactly. There are 18 complete campaigns
and three naturally defeated weak-placement runs, or 369 reached waves per pass.
No grants, skips, direct hits, synthetic kills or direct clears establish those
outcomes. [summary.md](summary.md) retains all ledgers and tower activity.

M4.4 regenerated the immutable [M3.4 report](../2026-11-12-m3.4/results.json)
byte-identically, so it is the common 1.4.0 baseline. [comparison.json](comparison.json)
pairs **all 369 old/new reached-wave observations** by policy/difficulty:
authored/spawned pressure, peak, lives, resources before/after purchases,
spent/bounty/clear, typed leaks and damage, boss phases/outcomes/times, duration,
health/shield removal, shots, slow/vulnerability and aura activity. The readable
[comparison.md](comparison.md) lists all 21 final outcomes and the per-wave
Normal/Hard existing-policy pressure and support/control data. Its script
checks unchanged policy/scenario definitions, exact first-five production wave
objects, unchanged non-wave content and rewards, and equal repeat hashes.

| Existing fixed policy | Act II max live old → new | Act III max live old → new | Act IV max live old → new | Combat s old → new | Final lives old → new |
| --- | ---: | ---: | ---: | ---: | ---: |
| Easy | 10 → 11 | 4 → 8 | 9 → 17 | 389.7 → 347.5 | 20 → 20 |
| Normal | 9 → 11 | 4 → 9 | 10 → 18 | 412.9 → 381.0 | 20 → 20 |
| Hard | 10 → 13 | 4 → 10 | 16 → 20 | 458.5 → 411.3 | 20 → 20 |

Act I is exact in every reached run. The later shorter authored tails and
cross-type overlap raise peaks while shortening simulated combat overall. The
Normal existing-policy recovery/pressure sequence is 4, 11, 3, 9, 10 across
waves 6–10; 5, 9, 3, 7, 7 across 11–15; and 6, 15, 10, 14, 18 across 16–20.
The Hard sequence is 6, 13, 3, 10, 10; 5, 10, 3, 10, 7; and 7, 17, 11, 17, 20.
Boss waves make a peak count alone incomplete: wave 15 has Titan, 18 another
Titan, and 20 two Titans plus Raid.

All scripted final **phases and finishing waves** stay as before. Only one
final-life outcome changes: Easy expansion-heavy now kills rather than leaks
its wave-20 Titan and ends at 20 instead of 16 lives. Normal expansion-heavy
still leaks two Titans and ends at 10. Hard expansion-heavy still loses at wave
20 with four boss leaks; the new order leaks four Titans instead of three Titans
and Raid, and Raid is killed rather than leaked. Weak placement still naturally
loses on wave 3 with 20 Kiddie leaks in all difficulties. The reference,
firewall-only, no-support, upgrade-heavy and counter-aware policies still win
untouched at 20 lives on all three configurations. This is a **limited scripted
plan result**, not proof of an ideal challenge or a mandatory build order.

Resources change in later waves from the type exchanges and from policy
purchases that depend on earned banks; wave-clear formulas and prices do not.
For example, Normal existing ends at 2237/3832 Dharma/Bandwidth versus
1987/3942 old, and accepts 57 purchase/upgrade commands versus M4.4's 58.
Hard existing ends at 1946/3332 versus 2104/3434 and accepts 55 commands in
both. The [per-wave pairing](comparison.json) separates resource-before,
resource-at-start, bounties and clear income so these changes are auditable.
The separate read-only [diagnostic baseline](baseline.json) has unchanged
mechanic/rejected-save probes; its no-reinvestment `opening-only` plan now
naturally loses at Easy wave 14 (was 15), Normal wave 9 (was 10), and Hard wave
7 (was 9). That diagnostic is not one of the 21 full-run policy comparisons.

The [adapted M4.4 continuation test](../../../tests/sim/campaign-continuation.test.js)
still runs four lanes per case: production 1×, 2×, mixed speed, and paused JSON
restore at earned build, Raid, Titan and weak-defeat checkpoints. It compares
full state/runtime except wall timestamp and intentional speed, each production
report/step/life/ledger to the **new** 1.5.0 report, purchase logs, capped hit
accounting, deliberate starts and terminal freezing. No invariant was removed.
Focused `node --test tests/sim/campaign-continuation.test.js` passes 4/4:

| Case | Result | Credited / consumed simulated ms | Commands | Earned JSON checkpoints |
| --- | --- | ---: | ---: | --- |
| Easy existing | Victory, 20 lives | 349042 / 347533.333 | 59 | build 3, Raid 5 |
| Normal existing | Victory, 20 lives | 383012 / 381000.000 | 57 | Raid 10, Titan 15, build 16 |
| Hard existing | Victory, 20 lives | 412656 / 411316.667 | 55 | Titan 20 |
| Hard weak placement | Defeat, wave 3 | 67556 / 67466.667 | 5 | build 3, live wave 3 |

Credited time is clamped input offered to the clock. Consumed time stops at
the production terminal/clear tick; a frame can leave unused credit. Build,
pause and terminal calls advance no simulated time. A changed elapsed time is
expected from new authored arrivals, and changed purchases propagate into later
combat. The test remains a deterministic scripted comparison, not observed
player timing.

## Save compatibility and attribution limits

Balance **1.5.0** uses the same wrapper/state **schema v4** and
`dharmapala-shield/save/v2` discovery slot. The state shape, independent
preferences, pause/Continue and explicit recovery flow are unchanged.
[old-1.4.0-v4-save.json](old-1.4.0-v4-save.json) is a real 1.4.0 Normal
existing-policy snapshot: six old-content production waves earned in order,
then a paused wave 7 after 120 fixed steps. It was captured from fetched-main
content by [capture-old-save.mjs](capture-old-save.mjs); it is a recovery fixture,
not an outcome for the new campaign. Current construction and validation both
use v4 for 1.4.0/1.5.0, but require exact balance version. Unit and browser
checks reject old bytes, prevent overwrite, export the bytes exactly, and require
explicit Reset; preferences and the recovery archive remain. Falsely changing
the old version strings still fails pending-schedule validation. Old 1.4.0 runs
can continue only in a matching old build; the pinned M3.5 archive remains
untouched. Export before reset for durable preservation.

Health removal is capped per hit and can include vulnerability. Shield removal
is absorbed damage, including possible Titan regeneration, not granted capacity
or protection caused by a particular tower. Slow/vulnerability counts include
refreshes and lethal hits. Aura-present shots can overlap or cap. Sampled
coverage is geometry, not targeting or prevented leaks. None of these activity
measures proves damage prevented or player understanding. Repeats prove
determinism, not independent trials. The three difficulties share map, roster
and scripted plans. Automated headless Chromium/axe covers only its documented
UI checks; it does not establish physical-device or screen-reader usability.

## Reproduction and gates

From a detached clean checkout of the implementation commit with Node >=22:

```bash
bash design/reviews/2026-11-12-m4.1/verify.sh > /tmp/m41-validation.txt 2>&1
```

[verify.sh](verify.sh) performs locked npm install, Chromium install, fresh
build, all five suites, exact regeneration of the current diagnostics/21-run
report/summary/comparison and old-v4 fixture, historical M3.4 first-five
counterplay plus M3.3 economy/M3.2 tradeoff checks, prior-artifact byte
preservation and pinned M3.5 archive hash, then Git cleanliness. The evidence
comparison is regenerated from immutable old files; no old report is refreshed.
The full clean-checkout output is recorded in [validation.txt](validation.txt).

A detached clean checkout of implementation commit `de92f12` began with no
`node_modules` or `dist`. The [complete log](validation.txt) records Node
24.22.1, npm 11.9.0, Playwright 1.61.1 and Chromium 149.0.7827.55. Its
browser suites ran sequentially with their own server.

| Clean-checkout check | Result |
| --- | --- |
| Locked npm install, Chromium install, fresh build | Pass |
| Unit / integration / simulation | 140 / 66 / 13 passed |
| Browser / accessibility | 99 / 14 passed; no serious/critical axe findings in scanned semantic UI |
| Current baseline, 21 campaigns, summary, comparison, old-v4 fixture | Byte-identical regeneration |
| Historical M3.4 counterplay, M3.3 economy, M3.2 tradeoffs | Byte-identical regeneration |
| Prior evidence directories, pinned M3.5 archive SHA-256 | Unchanged / pass |
| Scope, Git diff/check and clean worktree | Pass |

Before the clean run, the first focused browser invocation found no installed
Chromium (`chromium_headless_shell-1228`); `npx playwright install chromium`
resolved it, and both focused browser checks passed. A concurrently launched
focused axe scan collided with the browser suite's port 3000; rerunning it
sequentially passed. Neither setup issue required a product change. Hosted CI
is a separate gate and is recorded after it completes.

M4.1 design remains provisional until human testing and later M4.3 calibration.
The M3.2 retention, M3.5 collection and M3 human gate remain open under the
user's deferral. M4.2 boss design, M4.3 difficulty calibration and M4.5 full
experience testing remain open; M4 as a whole is partial. No human engagement,
difficulty, readability, build-diversity or run-time claim follows from this
automation.
