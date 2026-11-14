# M4.5 supporting automated campaign UI audit

Based on fetched latest main `f14b9d13c55aa475a0cf65a91b215734f9be45aa`,
which merged PR #34. `git fetch origin`, `git ls-remote --heads origin` and
`gh pr list --state all --limit 100 --json number,title,headRefName,state`
confirmed that the earlier M4.1–M4.4 work was merged and no M4.5 branch/PR
already existed. No applicable AGENTS.md was found in the checkout, workspace
or parents. The roadmap, content schema, human-validation deferral, M4.1
pressure/comparison evidence, M4.2 boss evidence, M4.3 diagnosis/results and
continuation audit, M4.4 matrix, browser tests, reporter and CI were inspected.
No participant-record search or M3.5 kit recreation was performed.

This is bounded **automated support for M4.5**, not completion of M4.5 or M4
acceptance. M3.2 specialization retention, M3.5 collection, the human M3 gate,
human M4.5 collection and M4 acceptance remain open under the existing
[deferral](../2026-11-12-human-validation-deferral/README.md).

## Coverage gap and bounded scenarios

| Existing evidence | What it establishes | Gap addressed here |
| --- | --- | --- |
| 21-run production reporter, retained at M4.3 | Real combat, default economy/lives, authored waves, legal policies, natural outcomes and deterministic repeats across three difficulties | Does not drive browser player controls |
| M4.4 full-campaign clock/JSON matrix, updated at M4.3 | Full state/runtime, clock, commands, reports, accounting and terminal parity at 1×/2×/mixed speed and earned restores | Calls session commands rather than player UI |
| 103 existing browser tests and 14 axe checks | Individual controls, inspection, layout, recovery and presentation | Some lifecycle tests call `resolveEnemy`; others skip waves, fund inspectors, freeze/step sessions or alter enemies for presentation. They cannot establish an earned browser campaign outcome |

The new [campaign tests](../../../tests/e2e/campaign.spec.js) add only two
Normal scenarios on desktop Chromium (1280×720), seed 1337. They reuse
M4.3's immutable purchase/outcome evidence rather than create another policy ×
difficulty matrix. Existing portrait/layout/axe tests remain separate.

1. **Earned mistake and recovery:** the M4.3 Normal `save` recovery. Buy two
   Firewalls and one Encryption at the established coverage cells with default
   funds; make no wave-2/3 purchases; leak two Script Kiddies on wave 3; resume
   the existing legal policy from wave 4 and complete all twenty waves. Replay
   the recorded commands through pointer clicks, including every explicit
   level-3 Focus / Sustained control choice. Reconcile resources, lives, typed
   leaks, all reached-wave combat durations, spending, bounty, clear income,
   tower activity and all seven boss outcomes with M4.3.
2. **Natural defeat and bounded retry:** replay the existing Normal weak-placement
   plan through natural wave-3 defeat at default lives. Read the report's typed
   leaks and absent early route coverage; restart through Play again. Repeat
   wave 1 with the **same roster, same spend and same funds**, moving the three
   towers to established coverage cells. Check zero leaks there. This is a
   successful wave-1 adjustment, not a second completed campaign or evidence
   that a player inferred the adjustment.

The first scenario checks every authored preview count and packet window,
boss badge, Raid warning, roster inspection before/during combat, live tower
inspection with locked purchases, and each report's spending/income/coverage/
contributions. Prior reports remain readable during subsequent waves. Starts
are deliberate: a second of virtual browser frames in every build phase must
leave the entire state/runtime unchanged. Each wave uses both speed controls;
1× → 2× → 1× → 2× changes use UI buttons.

Paused Save now → reload → Continue → Resume checkpoints preserve complete
snapshot state/runtime (only `savedAt` is excluded), selected branches, numeric
Anonymity, pending events/entities, reports, resources and speed: earned build
before waves 4 and 16, spent Raid EMP in wave 10, and damaged Titan shield in
wave 15. Paused frames must leave state/runtime unchanged. Subsequent purchases
and outcomes still reconcile. Both natural terminal states freeze under later
frames, survive reload/Continue, expose retained reports and allow Play again.
Restart clears the run, reports and defenses and restores default funds/lives.

All player actions use production UI. `page.evaluate` reads snapshots, camera
coordinates and event/entity observations, or installs subscribers that only
append to a separate observation object. It never writes session state,
wraps commands, grants resources, skips waves, changes entities, directly hits,
resolves enemies or clears waves. No direct `step`, `tick`, UI refresh or
renderer call establishes an outcome.

## Reproduced defects and narrow fixes

The [first focused log](initial-focused.txt) reproduces a wave-5 exception in
`GameUI.renderInspector` after real Raid disruption: periodic refresh supplied
only `{id}`, but the renderer dereferenced the selected tower's type to display
specializations. The exception occurred inside the production animation frame
before the next frame was scheduled, stopping that loop. Refresh now passes
the complete selected tower metadata. The separate
[unit regression](../../../tests/unit/live-inspection.test.js) checks that
boundary and the no-selection path.

The [second focused log](second-focused.txt) exposed a distinct defect at the
wave-7 upgrade: two same-stat level-2 Firewalls shared an inspector signature.
Switching selection reused a specialization handler closed over the previous
tower ID, upgrading that tower instead. The inspector cache now includes
selected identity. The separate [browser regression](../../../tests/e2e/inspector.spec.js)
uses a **funded synthetic inspector fixture**, not a campaign outcome. It
selects the first of two identical level-2 Firewalls and checks that the choice
upgrades only that tower. [Both focused regressions fail against original main](regression-before.txt).
That isolated pre-fix worktree used the existing dependencies and port 3001;
it is a red regression check, not the clean-checkout pipeline.

These two presentation/command-target fixes change no combat rule or content
value. The campaign did not need tuning. An initial launch also required
installing Chromium in this environment; the first defeat assertion used the
wrong dialog name (`Endpoint lost`, corrected to the actual `Game over`).
Those are setup/test corrections, not additional product defects.

## Observed automated results

[Recovery JSON](recovery.json) retains all 57 purchase/upgrade commands,
20 complete reports, all 320 spawn observations, boss outcomes and four
reload checkpoints. [Defeat/retry JSON](defeat-retry.json) retains the
five-command weak plan, its three reports and the bounded retry result.

| Browser scenario | Outcome / lives | Typed leaks | End Dharma / Bandwidth / Anonymity | Production combat s | Host automation wall s |
| --- | --- | --- | --- | ---: | ---: |
| Earned Normal save/recovery | Wave-20 victory / 18 | Two Script Kiddies, both wave 3 | 2227 / 3828 / 0 | 385.733 | 105.480 |
| Normal weak placement | Natural wave-3 defeat / 0 | 8 + 10 + 2 Script Kiddies on waves 1/2/3 | 46 / 60 / 0 | 72.867 | 19.378 including retry |
| Same-roster wave-1 retry after moving placements | Wave-1 clear / 20 | None | 110 / 56 / 0 | 15.600 | Included above |

All reached-wave lives, resources, leak types/damage and combat times match
M4.3's corresponding runs; weak-placement reports match in full. Recovery
spending, bounty, clear income and all summed tower activity match its M4.3
recovery. This is the `save` recovery's 385.733 s, **not** the 381.100 s of
M4.3's different Normal `existing` opening. No earlier report was refreshed.

The recovery kills all seven bosses: Raid on waves 5/10/20 (exactly one
phase each), Titan on waves 15/18 and two Titans on wave 20. Its wave-3
mistake reduces lives from 20 to 18; no later leak occurs. The wave-4 build
checkpoint retains three reports at 85/84/0 after purchases; wave 16 retains
15 reports at 71/1644/0 after purchases. Combat checkpoints retain a spent
Raid EMP and a live damaged Titan (1045 health, 359.92 shield). Every
checkpoint keeps 2× and its complete earned snapshot. The JSON files retain
all unrounded times and accounts.

[The focused run](focused.txt) passes both campaigns and the separate
synthetic inspector regression. The unit regression also passes. There are
no console/page errors in the twenty-wave recovery. All per-wave previews,
inspection controls, reports, deliberate starts, pause/Continue and terminal
restart assertions pass after the two narrow fixes.
[Victory capture](earned-victory.png) shows the retained wave-3 leak report;
[defeat capture](natural-defeat.png) shows scrollable retained reports in the
natural terminal dialog. Long reports require scrolling, and Play again
remains reachable through ordinary clicks. These captures were inspected;
this is automated UI evidence, not human readability acceptance.

## Timings and interpretation

`page.clock.install`/`pauseAt` pause browser time before play. `clock.runFor`
advances ordinary scheduled animation frames and timers; it does **not** jump
the clock while firing a single frame. Production `GameApplication.frame`
continues to calculate deltas, call `session.tick`, run `GameClock` fixed steps,
refresh inspection, render and autosave. No clock, tick, step or RAF function
is replaced. The initial post-start slice is 256 ms; later slices are 1024 ms,
or 256 ms while seeking a boss checkpoint. These are multiple ordinary browser
frames, not deltas passed directly into a session. A bounded loop fails if
combat has not naturally resolved. Paused/build/terminal slices are separate.

Combat time is the production `gameTimeMs` delta, including active combat only.
[Timing files](recovery-timing.json) record host elapsed automation wall time,
which includes automation/assertion/rendering work and accelerated browser
scheduling. It is machine-dependent and excluded from deterministic byte
comparisons. Neither value measures player deliberation, confusion, observed
play time or the roadmap's 8–15 minute full-run target. Exact repeats are
reproducibility checks, not independent trials or player win rates.

## Compatibility and remaining limits

Balance remains **1.7.0**, wrapper/state **schema v4**, discovery key
`dharmapala-shield/save/v2`. No meaning or saved shape changed, so no balance
or schema bump/migration is appropriate. Current earned snapshots continue
exactly; existing prior-version byte retention, blocked overwrite, export and
explicit reset regressions remain in the full browser suite. No rejected old
payload is relabeled. Independent preferences and recovery archives retain
their existing behavior.

All historical artifacts and the pinned M3.5 1.4.0 archive are preserved. The
content contract, every authored act/wave/reward, prices, difficulty values,
tower roster/branches, Agent one-use 3 s warning / 4 s 60%-health shield,
Raid single warned 66% EMP and four reinforcements, Titan recovery, shared
scheduler, deliberate starts and production fixed clock remain unchanged.
Retired Anonymity remains numeric and zero in current supply/ledgers.

This audit establishes automated control access and production outcomes for
two specified scripts on Chromium. It establishes no player understanding,
difficulty, build diversity, confusion, replay intent, physical-device or
screen-reader usability. No M5/M6 work or human collection is included.

## Reproduction and validation

```bash
npm ci
npx playwright install chromium
npm run build
CAMPAIGN_AUDIT_OUTPUT=/tmp/m45-ui npx playwright test tests/e2e/campaign.spec.js tests/e2e/inspector.spec.js --project=e2e --workers=1
node --test tests/unit/live-inspection.test.js
# From a detached clean checkout, initially without node_modules or dist:
bash design/reviews/2026-11-14-m4.5-ui-audit/verify.sh > /tmp/m45-validation.txt 2>&1
```

[verify.sh](verify.sh) runs the clean-checkout CI pipeline, regenerates the
browser evidence and compares deterministic bytes, retains the M4.4 clock/JSON
matrix, regenerates the 21-run reporter and M4.3 targeted/compatibility files
byte-identically, checks historical economy/tradeoffs, verifies all prior
evidence/content/tooling bytes and the pinned archive hash, and finishes with
whitespace and worktree cleanliness checks. Host timing files and screenshots
are observations, not byte-stable expectations.


The first detached run at `0499319` passed all five suites, browser evidence
byte comparisons, headless evidence regeneration and preservation checks,
then stopped at `git diff --check` because the captured failure logs had
trailing whitespace. [Its log](initial-clean-validation.txt) is retained.
Commit `17a0e05` normalizes only those three log files; production, tests and
result JSON are byte-identical to `0499319`. A second fresh detached checkout
at `17a0e05` passed the complete script against the corrected evidence commit. Stored text
logs have trailing whitespace normalized; no reported command/result is removed.


[Complete clean-checkout validation](validation.txt) used Node 24.22.1,
npm 11.9.0 and Chromium 149.0.7827.55, initially without installed dependencies
or build output:

| Check | Result |
| --- | --- |
| Locked install, Chromium install, current build | Pass |
| Unit / integration / simulation | 143 / 66 / 13 passed |
| Browser / accessibility | 106 / 14 passed |
| New browser result JSON | Byte-identical to focused-run evidence |
| M4.3 diagnostics, 21-run report/summary, counterplay, targeted old/current scenarios, old-save capture and comparison | Byte-identical |
| M4.4 full-run clock/JSON continuation | All four cases pass, invariants unchanged |
| Historical economy/tradeoffs, content, prior evidence, pinned M3.5 archive | Preserved / pass |
| Whitespace, regenerated tracked files and detached worktree cleanliness | Pass |

The 106 browser checks include the original 103, two earned UI scenarios and
one separate synthetic inspector regression. The 143 unit checks include the
new metadata regression. Existing integration, simulation and accessibility
suites are unchanged. Hosted PR checks are separate from this detached local
pipeline and can be inspected on the PR; neither closes a human gate.
