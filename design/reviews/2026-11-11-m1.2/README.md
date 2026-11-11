# M1.2 dialog cancellation verification

Verified 2026-11-11 on branch `fix/m1.2-dialog-cancellation`, based on latest
main `5a58d36` (M1.1, PR #14). No applicable AGENTS.md files were present.
Historical review and M1.1 evidence are unchanged. M1.3–M1.5 remain planned.

## R03 verification

Code inspection confirmed all five dialogs still lacked native `cancel` handlers.
Added real-key regressions, built the client, and tested main's exact GameUI.js
in that output to isolate the baseline from the working UI changes. Chromium
confirmed both reported failures: tutorial Escape closed the modal but retained
TUTORIAL; settings Escape closed the modal but retained PAUSED. The captured
failures are [tutorial](r03-before.txt) and [settings](r03-settings-before.txt).
Then rebuilt the complete current output before all repaired browser checks.
Chromium was initially missing and installed with `npx playwright install chromium`.

## Cancellation rules and focus

Native cancel prevents the browser's close-only default and invokes the same
action used by the corresponding visible button:

| Dialog | Escape / native cancel | Focus after action |
| --- | --- | --- |
| Tutorial, including replay and post-placement guidance | Skip tutorial; complete TUTORIAL into BUILDING, clear guidance/highlight | Start Wave |
| Settings opened during building or a wave | Done; resume the exact phase settings paused | Settings |
| Settings in menu | Done; remain in menu | Settings |
| Settings over an already paused session | Keep PAUSED with the pause modal available | Resume |
| Pause | Resume the saved building/wave phase | Pause |
| Sale | Cancel; retain selected tower and resources | Sell |
| Victory / game over | Main menu | New game |

Restart buttons focus Start Wave after the new build phase exists. The shared
close helper rejects detached, disabled, hidden and collapsed-content targets,
and chooses an available modal control or useful game control as a fallback.
Settings opens before pausing so no transient pause dialog replaces its focus.
Tutorial replay is disabled outside building (including a paused wave); it no
longer resumes a wave only to reject the replay. Existing semantic dialog markup,
engine, balance, deliberate wave starts and M1.1 mobile disclosures are preserved.

## Interaction evidence

Eight new e2e tests use real Tab, Shift-Tab, Enter and Escape. No new interaction
test calls focus(), dispatches cancel events, or invokes the UI cancellation
methods directly. Desktop 1280×720 and portrait 360×640 sequences cover explicit
tutorial skip, replay, guided placement and post-placement cancellation; building
and wave settings with both Done and Escape; sale Cancel and Escape; and pause
Escape/Resume. Assertions check phases, modal visibility, focused controls,
unchanged towers, and frozen game time, wave counters, enemy and projectile data.
Wave time must advance again after resume. Building stays idle until Start Wave.
Both terminal outcomes exercise Play again, Main menu and Escape with actual key
navigation. Only terminal setup uses `enterTerminal`; these are navigation
fixtures, not simulated full-campaign evidence.

All 27 prior e2e tests remain intact, including M1.1's pointer/touch matrix at
360×640, 390×844, 640×360, 844×390 and 1280×720, largest preview, rotation,
disclosures and keyboard building. Axe additionally scans all five dialogs,
including both terminal outcomes.

## Validation

Node 24.22.1, Playwright 1.61.1, headless Chromium 149.0.7827.55.

| Command | Result |
| --- | --- |
| `npm run build` | Pass; rebuilt before current browser suites |
| `npm run test:unit` | 22 passed |
| `npm run test:integration` | 4 passed |
| `npm run test:sim` | 2 passed |
| `npm run test:e2e` | 35 passed (27 preserved + 8 new) |
| `npm run test:a11y` | 6 passed (5 preserved + dialog scan) |
| `node tools/review/baseline.mjs` | Deep JSON equality with historical baseline, including all 12 policy/difficulty outcomes |
| `git diff --check` | Pass |

[Validation output](validation.txt) records the full suite results. Policy parity
preserves known defects assigned to later milestones; it does not validate them.

These are Chromium keyboard checks, pointer/touch emulation and axe scans
(excluding canvas and asserting no serious/critical violations). They are not
physical-device, screen-reader, Safari/Firefox, manual gesture or human playtest
evidence. The already-paused settings fallback is defensive code, not an
additional user-facing settings entry point tested by the key flows. Save,
preferences, combat fixes and CI remain M1.3–M1.5; M1 is not complete.
