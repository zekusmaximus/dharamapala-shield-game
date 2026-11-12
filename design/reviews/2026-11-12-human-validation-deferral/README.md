# Human-validation deferral · decision record

On 2026-11-12 the user explicitly accepted the proposed deferral: **“yes proceed
with deferral”**, following the proposal to revise the roadmap and continue
development under provisional assumptions. This records a change in work order,
not evidence that any human gate has passed.

Based on fetched main **c471f230094cb4bc5af09e4e1907fe64f9901247**, which merged
M3.5 preparation in PR #29. Branch: `docs/defer-human-validation`. The working
tree was clean before edits. No applicable AGENTS.md was found in the checkout
or workspace parents. Current ROADMAP.md, README.md, M3.5 follow-up evidence,
campaign reporter, simulation tests and CI workflow informed this change. Earlier
M1/M2/M3 evidence and the content contract remain unchanged.

## What is deferred and what remains unknown

Real first-time and returning-player collection for M3.5 is deferred. No actual
observations were supplied or collected in this decision. The subsequent session's
source-search report, quoted by the user, found none; it also reported a failed
Zoom search, so it does not rule out privately held records. This change does not
repeat that search or claim new observations.

M3.5, M3.2 specialization retention and the broader M3 human gate remain open.
Human engagement, difficulty, readability, build diversity, resource understanding,
replay intent and timing are unmeasured. Simulator policies, earned/funded
fixtures, Chromium and axe results still cannot establish them. The four-of-five
new-player test and returning improvement have not been assessed. The 4–7-minute
slice and 60–90-second first meaningful choice remain provisional targets.

The outstanding pilot remains at least five first-time players and a smaller
returning group, targeted at two or more separate sessions linked to earlier
same-build, same-difficulty results. Keep the original
[pinned build](../2026-11-12-m3.5/BUILD.md) and
[protocol-2 addendum](../2026-11-12-m3.5-follow-up/PROTOCOL_ADDENDUM.md).
If a later development build is playtested, record it as a separate cohort;
do not relabel or pool it with the pinned 1.4.0 archive. Future real sessions
must retain the original evidence-source distinctions and consented records.

## Immediate engineering scope

The user authorized proceeding under provisional assumptions. The selected next
task is **M4.4 automated verification of the existing twenty-wave campaign**.
This is an engineering choice within that authorization; the user did not
specifically prescribe the M4.4 test design.

Inspection confirms existing coverage in `tools/balance/report.mjs` and
`tests/sim/balance-report.test.js`: seven policies, Easy/Normal/Hard fresh
campaigns, deterministic repeats, M2 accounting, natural bosses/leaks and an
M3.4 report comparison. The reporter advances `session.step(1000/60)`; this
does not by itself exercise full-campaign `tick` speed accumulation or a restored
campaign. Selected-wave and five-wave continuation/speed tests already exist.
The next task should audit them and add the missing full-run checks without
duplicating established report scenarios.

Use fresh production runs, default funds/lives and authored waves in order.
Cover successful and naturally defeated plans, actual fixed-clock 1×/2×,
JSON pause/restore continuation through subsequent purchases and terminal
outcomes, and complete report/resource reconciliation. Distinguish lifecycle
fixtures and exact repeats from combat evidence and independent scenarios.
The [next-session prompt](NEXT_SESSION_PROMPT.md) makes this task executable
without another human-record search or another preparation-only PR.

No campaign test is implemented or newly passed by this documentation change.
M4.4 stays unchecked until its missing acceptance evidence is recorded. M4 as
a whole remains partial and subject to human validation. This decision does not
start wave/boss redesign, economy tuning, M5 or M6.

## Preserved baseline and verification

No runtime, tests, content, save shape, preferences or build scripts change.
Balance remains **1.4.0**, snapshots **v4** in `dharmapala-shield/save/v2`.
Anonymity remains retired from active supply/prices/UI with numeric accounting
retained. Encryption remains 50/35 and Distributor 70/60. Level-3 branches
remain provisional. Agent brace and shared scheduling, reports, pause/continue,
1×/2× and all economy/support rules remain unchanged. All earlier artifacts,
including the pinned archive and protocol templates, are preserved.

[validation.txt](validation.txt) records the exact source/commands and successful
results for `git diff --check`, edited/new Markdown links and heading anchors,
the pinned archive SHA-256, and byte-preservation checks against c471f23 for
production/content/tests/build files and every prior evidence directory. No
local gameplay suites were repeated for this documentation-only decision. PR CI
still runs the standard pipeline; its results are automated evidence, never
player evidence. No new gameplay test is warranted by these documentation edits.
