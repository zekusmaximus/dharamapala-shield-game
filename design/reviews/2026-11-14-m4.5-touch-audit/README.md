# M4.5 supporting portrait/touch campaign audit

Source: latest fetched main `f46d2ba1677e21914db1293766661bca29384f8e`,
which merged PR #35. Dedicated branch: `m4.5-touch-campaign-audit`.
No applicable AGENTS.md was found in the checkout, workspace or parents.
Read ROADMAP.md, design/CONTENT_SCHEMA.md, the human-validation deferral,
M4.1 pressure/evidence, M4.2 boss/evidence, M4.3 diagnosis and continuation
audit, M4.4 clock/JSON evidence and PR #35's UI audit before editing.
No participant-record search or M3.5 kit recreation was performed.

This is automated support for M4.5 only. M3.2 specialization retention,
M3.5 collection, the human M3 gate, human M4.5 collection and M4 acceptance
remain open under the [deferral](../2026-11-12-human-validation-deferral/README.md).
M5/M6 are outside this work.

## Actual gap and scenario choice

Remote branches and all PRs were checked before implementation; PR #35 was
merged and no open PR or branch supplied an earned full-campaign touch run.
The merged campaign driver ran two pointer scripts at 1280×720. Existing
390×844 touch and portrait/landscape rotation tests in game.spec.js exercise
individual controls and skipped-wave presentation, not an earned campaign.
Synthetic/funded fixtures remain separate and establish no outcome here.

One added test reuses the [merged driver](../../../tests/e2e/campaign.spec.js)
and the immutable M4.3 Normal `save` recovery command/result evidence in
[scenarios-after.json](../2026-11-13-m4.3/scenarios-after.json). It starts
fresh at 390×844 with Chromium `hasTouch:true`, Normal, seed 1337, default
130/60/0 funds and 20 lives. It buys the established opening, postpones
wave-2/3 purchases, then follows the legal recovery purchases from wave 4.
All twenty authored waves run in order through production combat to natural
victory. No difficulty/policy matrix or new defeat scenario is added.
The desktop natural-defeat and same-roster retry test remains in the suite;
its existing evidence remains immutable.

All player actions use production UI. The shared activation helper chooses
ordinary Locator.tap for this run and the original clicks for desktop.
Canvas taps use read-only camera coordinates after checking size. Each legal
purchase and explicit level-3 choice checks the intended tower and resulting
level/branch. There are no forced actions. Locator taps use normal browser
scrolling to reach controls. Additional native Chromium touchStart/move/end
swipes exercise the build-content scroller after waves 3/16 and the natural
Victory dialog after wave 20; each must change the observed scroll position.
No DOM scrollTop assignment is used.

Read-only event observers collect spawns/boss outcomes and snapshots reconcile
state and ledgers. No grants, skipped waves, entity edits, direct hits,
synthetic kills, direct clears, direct step/tick, manual UI refresh or renderer
call establishes an outcome. Production RAF → tick → fixed-clock combat is
preserved. No combat/content change was needed. The one CSS fix below changes
only hit testing for the passive toast.

## Reproduced UI finding and narrow fix

The first timed run reached wave 2, where the wave-1 clear toast intercepted
the unforced Start wave 2 tap at 390×844. [The bounded failure log](toast-before.txt)
and [capture](toast-before.png) preserve the blocker. The toast normally expires
after 3200 browser ms; the paused automation clock made its interception persist
through Playwright retries. This is not evidence that a real player waits ten
seconds. The visible passive notification occupies the speed/start area during
its actual lifetime, so it should not consume input there.

The sole production change adds `pointer-events: none` to `.toast`. Its text,
position, lifetime and status announcement remain unchanged. The earned touch
regression explicitly requires the toast to still be visible at the wave-2 tap;
it does not wait for dismissal, hide it, force the action or click via JavaScript.
There is still brief visual overlap with the controls; this fix establishes
input access, not human readability or understanding of the covered label.
PR #35's inspector fixes are unchanged. No meaning/shape change warrants a
balance/schema bump.

An earlier launch preceded completion of the Chromium download and failed
before play; the initial unbounded blocker run was interrupted, then repeated
with a 10-second action timeout to produce the failure above. Those setup and
harness limits do not establish combat outcomes. Two rotation assertions were
also corrected during development: level-3 requires the explicit choice rather
than an enabled generic Upgrade button, and reinspection must retain the
already selected tower when comparing full build snapshots. These were test
assumption corrections, not further product defects.

## Checks and checkpoints

Every wave verifies authored preview counts/windows, boss warning, roster
inspection, tower inspection with combat purchases disabled, previous and
current reports, deliberate Start Wave, and the 1×/2× controls. Build frames
cannot start a wave. Pause → Save now → reload → Continue → Resume compares
the entire earned snapshot/state/runtime except savedAt, freezes paused
frames, retains reports and branches, and permits subsequent legal purchases.
The four checkpoint kinds are inherited from the merged driver:

- Earned build before waves 4 and 16.
- Wave-10 Raid after its single EMP is spent.
- Wave-15 Titan with a damaged shield.

Two bounded portrait → 844×390 landscape → portrait rotations additionally
run at earned build before wave 4 and during active spent-EMP combat in wave
10. They inspect the earned tower and roster in both orientations and verify
that Start Wave stays in the viewport with the correct enabled state.
Build rotation leaves full state/runtime unchanged. Combat rotation advances
ordinary RAFs (64 browser ms in each orientation), retains tower identity,
branches, lives and pending reports, and allows production combat to proceed.
Rotation snapshots/captures are observations, not claims of physical orientation
sensor or device testing. Natural victory freezes, survives reload/Continue,
retains the wave-3 leak report and permits Play again with default funds/lives,
no towers and no reports.

## Observed results

[Focused run](focused.txt): one added earned touch campaign passes, with no
console/page errors. [touch-recovery.json](touch-recovery.json) retains all
57 legal purchase/upgrade commands, 20 complete reports and 320 spawn
observations, including the four reload checkpoints, two rotation pairs and
three measured native scrolls. All gameplay fields (commands, reports, typed
leaks, boss outcomes, spawns and terminal values) equal the immutable
[PR #35 desktop recovery](../2026-11-14-m4.5-ui-audit/recovery.json).
Each wave separately matches M4.3's spending, bounty, clear income, resources,
lives, duration and summed tower activity. No historical artifact was refreshed.

| Result | Observation |
| --- | --- |
| Natural terminal | Victory, wave 20, 18 lives |
| Typed leaks | Two Script Kiddies on wave 3, one life each; no later leak |
| Bosses | Seven killed: Raid on 5/10/20 (one phase each); Titan on 15/18 and two on 20 |
| Final resources | 2227 Dharma / 3828 Bandwidth / 0 Anonymity |
| Full-campaign spending | 9215 / 1062 / 0 |
| Earned bounty | 7380 / 3677 / 0 |
| Clear income, including passive Dharma | 3932 / 1153 / 0 |
| Production combat time | 385733.3333334162 ms (385.733 s) |
| Focused automation wall time | 103696.154 ms (103.696 s); machine-dependent |

The whole-campaign ledger is `130 + 7380 + 3932 - 9215 = 2227` Dharma,
`60 + 3677 + 1153 - 1062 = 3828` Bandwidth, and zero numeric Anonymity.
This is M4.3's `save` recovery, not its different `existing` opening.

| Paused reload checkpoint | Combat ms | Reports | Resources D/B/A | Retained combat state |
| --- | ---: | ---: | --- | --- |
| Build before wave 4 | 62516.667 | 3 | 85/84/0 | Earned towers/explicit branches |
| Wave-10 spent EMP, after rotation | 173616.667 | 9 | 217/559/0 | Live Raid 400.8276 health, phase 1 fired; minions/schedule retained |
| Wave-15 damaged Titan | 238716.667 | 14 | 74/1263/0 | Live Titan 1045 health, 359.92 shield |
| Build before wave 16 | 256533.333 | 15 | 71/1644/0 | Earned towers/explicit branches; subsequent purchases succeed |

All four keep 2× and pass complete snapshot/state/runtime equality on
reload/Continue. Build rotation keeps 62516.667 combat ms exactly. Active
rotation advances 173366.667 → 173483.333 → 173616.667 combat ms through
ordinary scheduled frames at 2×; wave duration and all later gameplay still
match the desktop run. Native scrolls moved 2648→2528 and 2963→2864 in the
build scroller, and 278→147 in Victory. These are captured positions, not
portable pixel expectations.

The inspected [build portrait](build-portrait.png) /
[landscape](build-landscape.png), [combat portrait](combat-portrait.png) /
[landscape](combat-landscape.png), and [earned victory](touch-earned-victory.png)
captures retain the actual automated checkpoints. Scrolling is required for
long previews and accumulated reports; ordinary taps/swipes reach them and
restart. The toast's remaining visual overlap is recorded above. These
observations establish scripted control access, not human comprehension.

## Timings and limits

Browser time uses the merged Playwright clock installation. `clock.runFor`
executes the normal scheduled RAF/timer sequence rather than emitting one
large delta or replacing a combat method. Combat slices remain 256 ms initially,
1024 ms normally and 256 ms while seeking boss checkpoints; rotations add
64 ms per orientation. Swipe settling advances 256 ms in building/terminal
phases, which cannot add combat time. Build, paused and terminal frame slices
are checked separately.

Production gameTimeMs counts simulated combat only. The timing artifact records
host automation wall time, including rendering, assertions, taps and accelerated
browser scheduling. Neither measures player deliberation or observed play time.
Native compositor scroll offsets and host timings are retained observations,
not deterministic expectations. The comparison script excludes only scrolls
from touch replay byte comparison; it compares every other evidence field and
all gameplay fields against the merged desktop result. Each run must still
assert all three native swipes actually scroll.

Touch emulation is not physical-device, human or screen-reader validation.
Automated outcomes establish no player understanding, difficulty, build
diversity, confusion, replay intent or observed play time. Activity counters
remain activity/accounting measures, not causal credit for prevented leaks.

Balance stays **1.7.0**, wrapper/state **schema v4**, same storage slot and
preference/recovery rules. PR #35's inspector metadata and selected-tower
identity fixes are preserved byte-for-byte. Every wave/reward, explicit branch,
Agent one-use 3-second warning and 4-second 60%-health shield, Raid single
warned 66% EMP and four reinforcements, Titan recovery, numeric retired
Anonymity, shared scheduling and clock/save behavior remain unchanged.
Historical artifacts and the pinned M3.5 build are preserved.

## Reproduction

```bash
npm ci
npx playwright install chromium
npm run build
CAMPAIGN_AUDIT_OUTPUT=/tmp/m45-touch-focused npx playwright test tests/e2e/campaign.spec.js --project=e2e --workers=1
# From a new detached checkout, initially without node_modules or dist:
bash design/reviews/2026-11-14-m4.5-touch-audit/verify.sh > /tmp/m45-touch-validation.txt 2>&1
```

The new verify.sh runs the complete clean-checkout CI pipeline, original
pointer evidence byte comparisons, touch comparisons, existing full-run
clock/JSON matrix and M4.3 evidence regeneration, historical economy/tradeoffs,
production/content/tooling and prior-evidence preservation, pinned archive hash,
whitespace and clean-worktree checks. Hosted PR checks are separate.
