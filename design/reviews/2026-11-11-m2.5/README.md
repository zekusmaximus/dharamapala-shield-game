# M2.5 wave-speed verification

Based on latest main `c035940` (M2.4, PR #22), on dedicated branch
`feat/m2-5-wave-speed`. No applicable AGENTS.md was found in the checkout or
workspace parents. ROADMAP.md, the historical code review, and M1.1–M1.5 /
M2.1–M2.4 verification READMEs were read before implementation. The review is
historical evidence. Earlier milestone evidence is unchanged. This completes
M2.5 only; M2 remains partial until M2.6.

## Speed and lifecycle rules

- New and restarted runs default to 1×. A run has only 1× and 2×. The selection
  is run state, not a presentation preference. It persists after a real wave
  clear and into the next deliberate build phase. Neither mode starts a wave.
- A real frame is clamped to 0–250 ms before applying the multiplier. The
  resulting simulated time joins the existing fractional clock accumulator.
  Combat still runs in 1000/60 ms steps with the same spawn, projectile, status,
  boss, shield, resource and report rules. A numerical tolerance of 1e-9 ms
  handles floating-point cancellation at exact step boundaries.
- Switching modes preserves already accumulated simulated time. Building,
  pause, Settings, menu and terminal phases do not call combat steps. Pausing
  and changing speed while paused keep the fraction. Resuming and Continue
  discard the inactive browser wall-time gap while retaining that saved fraction.
  A tab losing visibility auto-pauses. At a wave clear or terminal transition,
  the remainder of that frame is discarded rather than entering a new wave.
- The main controls are labelled, pressed-state buttons beside Start Wave;
  equivalent choices are inside Pause and in-run Settings dialogs. Menu Settings
  hides run-speed controls. Terminal controls are inactive behind the result
  dialog, and the session rejects later changes. Restart and a new run reset to
  1×. Returning to menu saves the departing run; Continue restores its speed.
- Optional `state.waveSpeed` keeps save schema v2, balance `1.0.0`, save key and
  preferences shape unchanged. Existing valid v2 saves without it load at 1×.
  Invalid values fail candidate validation before a session swap. The existing
  clock accumulator remains in the snapshot. No wave schedule or balance value
  was changed.

## Production combat evidence

Integration tests use the actual session clock and authored wave schedules.
Scenario setup jumps to waves 5, 15 or 20 and grants build funds; towers are
purchased with production commands. After Start Wave, no test awards kills,
directly resolves enemies or calls completeWave. A wave-20 fixture seeds the
prior completed-wave count solely to create a valid final-wave starting state;
it is not a full-campaign claim.

The 1× run receives each clamped real-frame delta; the 2× run receives half
that real time. State and runtime comparisons at checkpoints and results cover
actual spawning, projectile movement and impacts, slow application and expiry,
Raid Team threshold phases, Titan shield damage, kills/leaks, resources and the
complete M2.3 wave report. Varied deltas include short, fractional and over-cap
frames. A mid-Raid Team switch, paused speed change and restored mid-phase save
continue to the same report. Natural wave-1 defeat and wave-20 victory stop
further 2× advancement, preserve exact final counters and reject new speed
commands. Another naturally cleared wave keeps 2× in building and remains idle
until Start Wave. Clock-only unit checks cover step size, clamp order, invalid
deltas, a saved fraction and terminal callback cancellation; these clock checks
are separate from the production combat outcomes.

Browser tests use ordinary clicks at 360×640, 390×844, 640×360, 844×390 and
1280×720. They check visible 44 px controls, unobstructed Start Wave, pressed
state, selection without automatic start, and switching during a wave. A real
Shift-Tab / Enter / Tab flow selects 2× before starting; Pause and Settings
choices, frozen pause time, reload/Continue and resumed 2× are checked in
portrait. Existing M1/M2 layout, dialog, inspection, combat-feedback and report
regressions pass. The [portrait](portrait.png) and [landscape](landscape.png)
captures were made in headless Chromium at the implementation commit and visually
checked; they show the controls sharing the reserved action area.

## Reproduction and validation

From the repository root with Node >=22:

```bash
npm ci
npx playwright install chromium
npm run build
npm run test:unit
npm run test:integration
npm run test:sim
CI=1 npm run test:e2e
CI=1 npm run test:a11y
node tools/review/baseline.mjs > /tmp/m25-baseline.json
cmp /tmp/m25-baseline.json design/reviews/2026-11-11-m1.4/baseline.json
npm run balance:report -- --output=/tmp/m25-results.json
node tools/balance/summary.mjs /tmp/m25-results.json /tmp/m25-summary.md
cmp /tmp/m25-results.json design/reviews/2026-11-11-m2.4/results.json
cmp /tmp/m25-summary.md design/reviews/2026-11-11-m2.4/summary.md
git diff --check
```

A fresh detached worktree at implementation commit `9b52bd2` began without
`node_modules/` or `dist/`. Node 24.22.1, npm 11.9.0, Playwright 1.61.1 and
Chromium 149.0.7827.55 were used. The local npm cache was
`/tmp/dharamapala-m25-npm-cache`, and Chromium used the writable
`PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers`. The first working
checkout browser attempt lacked that executable; installing Chromium resolved
the setup issue. Local system browser libraries were present. [Full clean
output](validation.txt) records:

| Check | Result |
| --- | --- |
| Locked install, Chromium install, fresh build | Pass |
| Unit / integration / simulation | 76 / 31 / 7 passed |
| End-to-end / accessibility | 69 / 10 passed; axe found no serious or critical issues in scanned semantic UI |
| Legacy diagnostics vs corrected M1.4 | Byte-identical; SHA-256 `63f3f0133cfa2b0c926493f1d6c7d737e93ec2df52524d39d62fff5a12034bbc` |
| M2.4 report and derived summary | Both byte-identical; SHA-256 `b86ef6780b923a97b8c406c63e71544b64a6346d77c0f922dcb7ae9115f1a6c8` and `a7cd9ac0cf1c60f61f4b72c06eb5ee458f5c737141b33c30e3f8c7bf9fa709eb` |
| `git diff --check` | Pass |

The seven-policy M2.4 report remains default-speed production combat evidence,
with its original attribution and scenario limits. The new speed checks cover
selected real waves and terminal outcomes, not a 2× full campaign. Chromium
emulation, automated keyboard actions and axe are not physical-device touch,
screen-reader, Safari/Firefox, manual accessibility, performance or human
playtest evidence. M2.6 content validation and later gameplay/balance work are
outside this milestone.
