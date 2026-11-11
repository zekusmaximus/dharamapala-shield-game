# M2.3 wave report verification

Based on latest main `ce7f095` (PR #20), on `feat/m2-3-wave-results`.
No applicable AGENTS.md was found in the checkout or workspace parents.
ROADMAP.md, the historical code review, M1.1–M1.5 and M2.1/M2.2 verification
READMEs were read before implementation. Historical evidence is unchanged.
This work concerns M2.3 only. M2 remains partial; M2.4–M2.6 remain open.

## Accounting and attribution

Reports cover preparation since the preceding result and the following wave.
Successful build/upgrade commands record exact per-resource costs; sales record
exact refunds. Kill resolution records the actual difficulty-adjusted bounty;
clear resolution records the actual clear reward, including the shared capped
Distributor income. That passive Dharma portion is shown separately, without
assigning the cap arbitrarily among installed Distributors. EMP suppresses aura
but does not suppress passive income. A defeat report has no clear income.

Production projectile impacts record health removed (capped at remaining health),
shield removed, final hits, and slow/vulnerability hit applications by source tower.
Health damage includes active vulnerability through the existing resistance/armor
calculation. Shield recovery can allow repeated removal. Status applications
include refreshes, overlapping effects and lethal hits; they are not unique targets,
measured time saved, damage credited to the applier or prevented leaks.

Production firing records shots and, for each enabled in-range Distributor, the
number of attacker shots fired with its aura present. Multiple supports can count
the same shot, including when the combined aura reaches its cap. This is observed
support activity, not a counterfactual count of extra shots or caused damage.
Installed towers with no activity still have rows. Existing lifetime inspector
counters retain their original meaning; the report's health/shield columns are
separate wave measurements. No combat or economy rule, balance value/version,
random draw, schedule, or fixed-step order changed.

Each leak records enemy type and configured life damage (actual remaining lives
clamp at zero), with its last observed attacking-tower range position. Geometry
is sampled before each production movement update, includes disabled attackers,
and excludes non-attacking support. Reports show coordinates, route percentage
and distance remaining to the fixed endpoint. No observation means no attacking
range was observed, not proof of a causal coverage failure. Range does not prove
a target was acquired, a cooldown ready or a projectile landed. Partial legacy
tracking cannot reconstruct earlier coverage.

## Lifecycle and saves

Semantic details/summary reports occupy the existing scrolling build panel above
the separately reserved Start Wave control. They survive starting and completing
later waves until individually dismissed; open disclosures survive report updates.
Terminal reports are also available inside the native terminal dialog. Dismissal
returns focus to another report or a usable phase control. Restart/new run resets
the run's reports. Deliberate starts and phase guards remain unchanged.

An optional `state.reports` extension preserves schema v2 and balance `1.0.0`.
New snapshots persist active accounting, coverage observations, pending reports
and dismissals. Candidate validation rejects invalid resource/count/type/location
payloads and duplicate report waves before session replacement. Snapshot cloning
isolates nested tracking data. Old valid v2 saves without the extension remain
loadable; the first tracked report is labelled partial. Past costs, impacts and
coverage are not invented from lifetime counters or historical basic results.
Later complete waves use full tracking. Preferences are unchanged.

## Test scope

Seven new integration checks use production commands, fixed steps, actual enemy
movement, firing and impact paths. Natural wave combat verifies accounting,
bounties, refunds, typed leaks and restoration through the next wave. A disabled
attacker fixture verifies geometry without claiming active fire coverage. A
Titan impact fixture verifies shield absorption and lethal health capping with
control applications; it invokes production projectile construction/impact,
not a full boss campaign. A positioned-enemy firing fixture checks overlapping
and disabled auras. Another real wave checks disabled support's passive income.
Legacy restoration, nested isolation and malformed report rejection are explicit.
None awards kills or calls completeWave to establish combat accounting.
Existing direct-resolution lifecycle/navigation fixtures remain lifecycle tests.

Six browser tests exercise normal pointer and real Tab/Enter access at 360×640,
390×844, 640×360, 844×390 and 1280×720, persistence across reload/Continue,
subsequent deliberate start, dismissal persistence and useful focus. Terminal
report access is checked in portrait. The browser report setup accelerates the
production wave with fixed steps and freezes RAF only in the fixture; it does
not award kills or clear waves directly. Axe scans cover expanded build and
defeat reports in portrait, excluding canvas pixels. All prior M1/M2 tests remain.

These are headless Chromium emulation, keyboard and automated axe checks. They
are not physical-device, screen-reader, Safari/Firefox, manual gesture, human
readability or player difficulty evidence. Attribution is intentionally limited
to observed activity; no balance comparisons or tuning were added.

## Clean-checkout validation

A fresh detached worktree at `6922ba9` began without node_modules or dist.
Node 24.22.1, npm 11.9.0, Playwright 1.61.1 and Chromium 149.0.7827.55
were used. Browser suites used CI=1, their own server and freshly built output.
Locked installation used a writable `/tmp` npm cache; Chromium installation used
`PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers`. System libraries
were already present; hosted CI installs them separately.

| Command | Result |
| --- | --- |
| npm ci | Pass |
| npx playwright install chromium | Pass |
| npm run build | Pass, fresh dist |
| npm run test:unit | 74 passed |
| npm run test:integration | 25 passed |
| npm run test:sim | 2 passed |
| npm run test:e2e | 63 passed |
| npm run test:a11y | 10 passed; no serious/critical violations in scanned UI |
| node tools/review/baseline.mjs | Byte-identical to corrected M1.4 baseline |
| git diff --check | Pass |

[Full validation output](validation.txt) records this sequence. Baseline SHA-256:
`63f3f0133cfa2b0c926493f1d6c7d737e93ec2df52524d39d62fff5a12034bbc`.
The first browser setup attempt lacked Chromium; installation resolved it.
An earlier clean run at `23c6f36` passed 62 browser checks and found one broad
terminal-text locator now matched the new reports too. Scoping the assertion to
the terminal summary preserved its original purpose; the final clean sequence
above passed all checks. No production behavior changed for that selector repair.
