# M3.5 pilot analysis plan · set before observations

## Cohorts and reporting

Collect at least five consecutive eligible first-time sessions and at least two
separate returning sessions, preferably from those same players on the same
archive. Record all sessions and exclusions with reasons; do not select only
successes. Use Normal as the common difficulty and analyze any participant-chosen
other difficulty separately. Do not combine a later game revision with the
1.4.0 build without reporting it as a new cohort. An immediate retry belongs to
the original session, not the returning group. A returning session must link its
earlier result and state the intended change before play.

Produce a per-session evidence table with anonymous ID, cohort, build, device,
difficulty, unaided start, first meaningful-choice wall time, first wave-5 result
wall time, waves reached, lives/leaks and typed losses, build/spend sequence,
first confusion, warning/report use, counter and explanation, retry plan/action/
result, specialization opportunity/choice/rationale, and replay intention.
Quote the player only with consent. Put participant words, direct observation,
facilitator interpretations and automated measures in separate columns/notes.
Report missing items explicitly. Give counts and ranges for this pilot, with
individual records available for audit; do not calculate or advertise population
win rates or statistical significance.

## Roadmap gate decision rules

For the **four of five new players** gate, score each of the first five eligible
first-time players on a conjunction of three observed criteria:

1. They reach the first deliberate Start Wave unaided, after making a legal
   opening build. Built-in tutorial use is allowed; facilitator navigation or
   strategy hints before that point make `unaided = false`.
2. Without being told a solution, they identify a first-five threat and explain
   a specific response they actually made. The relevant direct record must show
   the response and a compatible successful result (for example, that threat
   was killed or its wave cleared). This is evidence of a useful counter in
   this play, not proof that the response alone caused the result. A hypothetical
   counter or a prompted answer is insufficient.
3. They name one specific useful next adjustment tied to a noticed outcome and
   possible under build-phase rules and earned resources. Check its cost, timing
   and prerequisite against the observed bank or reachable next-wave income;
   do not credit an unaffordable imagined purchase.

Report each criterion and the conjunction for all participants. The roadmap
threshold is **at least four of the first five** satisfying all three; if more
players join, report all of them too. Unknown/missing is not a pass. Explain
ambiguous cases with linked observation and quote IDs. Do not infer
understanding solely from a successful wave.

For **returning improvement**, compare each returning player with their own
earlier same-build, same-difficulty result. A deliberate change must be stated
before the new run, enacted, and linked to a better observable result: first a
later wave reached, then (for matched wave-5 completions) more lives remaining
or fewer typed leaks. If these are tied, report changed spending/coverage and
simulated time descriptively, but do not claim the gate from time alone because
speed and deliberation differ. State how many returning players improved and
which did not; one anecdote cannot stand in for the group. Repeated purchases
without a stated change do not count as deliberate adaptation.

For **specialization diversity**, record the number who reach each affordable
level-3 choice and both options' actual prices and bank. Look for at least two
different branch choices with participant explanations tied to a threat or build
plan and defensible under the measured resource/placement constraints. A branch
shown only in a funded fixture, an unaffordable option, or a choice made after
facilitator coaching does not support retention. If the pilot does not naturally
offer such choices, mark the retention question unresolved and consider a later,
separately labelled task; do not grant resources inside this pilot.

For **understanding under resource constraints**, inspect the sequence of actual
bank, prices, opportunities and blockers at each decision. Compare what players
say they expected with the chosen action, wave report and result. Note when the
game's text enables an accurate explanation, when it misleads, and when a good
counter was unavailable at that moment. Include saving and Distributor's passive
income/active aura distinction when players encounter them. Status application,
aura-present shots, health/shield removal and sampled range are activity measures
with the M2.3 attribution limits, not causal credit. Do not prescribe a mandatory
tower or infer a globally optimal purchase from this pilot.

Record the **4–7-minute first-five slice** and **60–90-second first meaningful
choice** targets as observed wall times and context, not pass/fail cutoffs. State
which attempts completed wave 5, which included retries and pauses, and the
effects of participant-selected 2×. Do not enforce a duration, insert waiting,
skip reading/building, or change the protocol to make the numbers look better.

## Revision and verification rule

Group repeated confusion/losses only after preserving each individual case.
Consider a narrow first-five fix only when a direct observation and participant
explanation support it, or a defect is independently reproduced. Record the
before/after question and affected players. For a code/content change, add a
focused regression; compare M3.4 and corrected historical reports, check full
campaign regressions, and run the documented clean-checkout pipeline. If combat,
economy, derived save state or content meaning changes, update the content
contract, change the balance/schema version as required, and preserve prior raw
save bytes through export/reset recovery. Retest the revised first-five slice
with new people and distinguish its evidence from the 1.4.0 cohort. Without
actual observations or reproduced defects, make no gameplay revision.

Keep four evidence categories distinct in the eventual summary: human sessions,
automated test/simulator/Chromium/axe results, physical-device use, and actual
screen-reader use. A physical-device or screen-reader claim requires a recorded
session using one; an automated scan cannot supply it. M3.2 specialization
retention, M3.5 and the broader M3 gate stay open until their human evidence is
reviewed.
