# M4.4 complete-run automated verification

Based on fetched main `5228aeb` (PR #30, human-validation deferral), on
`m4.4-full-campaign-verification`. No applicable AGENTS.md was present. The
roadmap, content contract, historical code review, M1/M2/M3 verification records
and [deferral decision](../2026-11-12-human-validation-deferral/README.md) were
read. The code review describes its 2026-11-11 baseline; M3.4 is current
implementation evidence. `gh pr list --state all --search M4.4` found no prior
M4.4 implementation PR. Human collection was explicitly deferred and was not
repeated here.

This closes **M4.4 automated verification of the existing campaign**. It changes
only tests and evidence. Balance remains `1.4.0`; snapshot wrapper and state
remain schema v4 in `dharmapala-shield/save/v2`. Preferences and retained-byte
export/reset recovery are unchanged. No new mechanic, wave, boss, economy,
specialization or UI rule was introduced. M3.2 specialization retention, M3.5
collection, the human M3 gate and M4 as a whole remain open.

## Existing coverage and the added matrix

The M2.4/M3.4 reporter already runs seven purchase policies × three fresh
difficulty configurations, with an exact second run of each. It uses default
funds/lives, normal build commands and all authored waves in order, then steps
real combat to victory or defeat. Its full per-wave reports include resources,
typed leaks, bosses, shield/health removal, status and support activity. The
existing simulation suite reconciles the Hard ledgers and checks all 21 runs
against M3.4. M2.5 selected-wave speed tests and M3.4 earned boss continuation
tests were also present. The separate lifecycle fixture uses direct resolution;
it supplies no campaign-outcome evidence. No reporter or policy matrix was
duplicated for M4.4.

[The new simulation test](../../../tests/sim/campaign-continuation.test.js)
adds four four-lane scenarios. Each lane starts a fresh production game with
seed 1337, default resources/lives, the same legal policy purchases, and a
deliberate Start Wave for each reached wave. The lanes are uninterrupted 1×,
uninterrupted 2×, uninterrupted mixed 1×/2×, and mixed 1×/2× with paused JSON
save/restore at the listed earned checkpoints. No grants, skips, entity edits,
direct hits, synthetic kills or clears establish these outcomes.

| Difficulty / policy | Outcome | JSON checkpoints | Why included |
| --- | --- | --- | --- |
| Easy / existing | Victory, wave 20 | Build before wave 3; Raid Team after phase 1 in wave 5 | Early spending after restore and first boss |
| Normal / existing | Victory, wave 20 | Raid Team after phase 1 in wave 10; damaged Titan shield in wave 15; build before wave 16 | Later boss state and post-boss purchases |
| Hard / existing | Victory, wave 20 | Damaged Titan shield in wave 20 | Final boss and terminal continuation |
| Hard / weak placement | Natural defeat, wave 3 | Build before wave 3; live enemies during wave 3 | Poor-plan continuation through terminal loss |

The reporter already supplies Easy and Normal poor-placement defeats and Hard
expansion-heavy defeat at wave 20. Four clock/restore scenarios close distinct
gaps without a seven-policy × three-difficulty × checkpoint Cartesian product.
These are exact scripted sequences, not independent trials or a sampled player
population. The restored and uninterrupted mixed-speed lanes replay the same
accepted placement, upgrade and specialization commands; the command logs match
the 1× lane. No policy sells in this matrix.

For each wave, real-frame deltas cycle through 37, 91, 250, 19, 300, 54 and
123 ms. The 300 ms input exercises the production 250 ms clamp. The mixed lanes
start at 2× and switch to 1×/2× at frames 7/13/29/31. The 1× lane receives
the original delta; the 2× and mixed lanes receive `min(delta, 250) / speed`,
so each receives equal simulated credit. A pause freezes all lanes. At JSON checkpoints,
the paused candidate is serialized, parsed, restored, frozen again, then resumed.
Its source snapshot is checked after the campaign for mutation. Snapshot
state/runtime comparisons omit only `savedAt`; 1× versus 2× or mixed speed
comparisons also normalize the intentional `waveSpeed` difference. Clock accumulator, RNG,
IDs, scheduler, entities, reports and all other state remain compared.

Every wave compares exact production step count, consumed game time, report,
resources, lives and typed leaks to M3.4's real-combat report. Accepted purchase
logs, per-wave and total resource ledgers, kill/leak totals, final statistics,
all prior reports, and terminal freezing are checked. Build-phase ticks cannot
start the next wave. A read-only hit observer measures actual capped health and
shield removal plus status applications; those sums must match tower reports.
Total health removal is bounded by spawned health. Support aura-present shots
and passive income are present in successful runs. The test does not infer
caused damage, prevented leaks or saved time from activity counts.

## Focused results

`node --test tests/sim/campaign-continuation.test.js` passed 4/4. Exact per-wave
comparisons with M3.4 passed across 63 reached waves in each lane. Values below
are identical for uninterrupted 1×, uninterrupted 2× and both mixed-speed lanes.
“Credited” is frame budget offered to the clock; “consumed” is
production simulated time. At each clear/terminal boundary the clock discards
the unused part of the final frame; therefore offered credit exceeds consumed
time. Paused/build/terminal calls offer no credited time.

| Difficulty / policy | Reached waves | Lives / leaks | End Dharma / Bandwidth / Anonymity | Credited / consumed simulated ms | Accepted purchases/upgrades | Paused JSON checkpoints |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Easy / existing | 20 | 20 / 0 | 2634 / 4549 / 0 | 391329 / 389683.333 | 59 | 2 |
| Normal / existing | 20 | 20 / 0 | 1987 / 3942 / 0 | 414562 / 412883.333 | 58 | 3 |
| Hard / existing | 20 | 20 / 0 | 2104 / 3434 / 0 | 460412 / 458500.000 | 55 | 1 |
| Hard / weak placement | 3 | 0 / 20 | 46 / 60 / 0 | 67556 / 67466.667 | 5 | 2 |

The Easy wave-5 and Normal wave-10 checkpoints retain a living Raid Team with
phase 1 fired. Normal wave 15 retains a Titan at 279.975/333 shield; Hard wave
20 retains one at 574.975/628. Normal's post-wave-15 checkpoint carries 15
reports into subsequent purchases and five more clears. Hard weak placement
starts wave 3 with two lives, stores two live enemies in the checkpoint, then
reaches game over through leaks. It has no invented boss outcome.

The three successful runs record shield removal (1604.098 / 2397.45 / 3718
across Easy / Normal / Hard), slow applications (203 / 268 / 333), aura-present
shots (705 / 813 / 1140) and positive passive Dharma. These are production
activity/accounting observations. Shield removal is absorbed damage, including
repeated removal after Titan regeneration, not granted capacity. Health removal
is capped at each hit and includes vulnerability without allocating its causal
benefit. Status applications include refreshes and lethal hits. Aura-present
shots may overlap or cap; range samples are geometry, not targeting or hits.

## Comparison and validation

The new tick campaigns match M3.4's per-wave outcomes and accounts exactly.
`verify.sh` regenerates current diagnostics, all 21 campaign reports, summary
and counterplay evidence and compares bytes to M3.4. It also checks M3.3 economy,
M3.2 tradeoffs and M3.4's comparison against corrected M1.4/M2.4 reports.
Historical differences in [M3.4 comparison](../2026-11-12-m3.4/comparison.md)
remain historical; M4.4 makes no balance-attribution claim. The script checks
that production/content and all prior evidence directories match fetched main,
including the pinned M3.5 archive SHA-256. Its clean-checkout pipeline and
hosted PR results are recorded in [validation.txt](validation.txt).

Human engagement, difficulty, readability, build diversity, 4–7-minute slice
timing and replay intent remain unmeasured. The difficulty configurations share
one map and roster; exact repeats establish reproducibility only. Browser and
axe checks cover their documented automated UI scope, not physical-device,
screen-reader or participant observations. M4.1–M4.3, M4.5, M5 and M6 were not
started here.
