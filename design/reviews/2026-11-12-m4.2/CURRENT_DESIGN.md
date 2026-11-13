# Boss preparation and observed gap before M4.2

This describes production balance `1.5.0` at merged main `601c1ea`, before a
boss edit. No applicable `AGENTS.md` or existing M4.2 PR/remote branch was found.
The M4.1 four-act schedules and M4.4 full-run clock/continuation evidence are
the comparison baseline. M3 human collection remains deferred, not satisfied.

| Encounter | Current preparation decision | Information available before Start Wave | Production observation |
| --- | --- | --- | --- |
| Raid Team, waves 5/10/20 | Spread attackers so an immediate 260-unit EMP at 66% and 33% boss health cannot pause every firing lane for 1.5 s; cover health-triggered minions alongside authored packets. Each trigger schedules two reinforcements 250 ms apart: two Kiddies first, then an Agent with its one-use brace and a Kiddie. | Preview shows Raid arrival and authored packets. EMP warning names both health thresholds, radius, disable duration and reinforcements, but gives no reinforcement types or arrival timing. Inspector says reinforcements and EMP generally. Live status says `Phase 1 / 3`, `Phase 2 / 3`, `Phase 3 / 3`. No timed wind-up or in-wave build response exists. | The 18 reached runs per boss wave all fired both phases. All 18 wave-5/10 pairs were separated by at least 4.17/4.75 simulated seconds. At wave 20, 10 of 18 pairs fired within the same 1.5-second disable window (50–400 ms for those 10). The two bursts often hit the same 11–15 attackers in successful plans; the second mainly extends one disable by a fraction of a second. |
| Titan, waves 15/18/20 | Maintain hits through the armored, resistant shield to postpone its 3 s hit-free recovery; cover its route and the fast/heavy screen. It starts shielded, regains 4% of shield capacity per second after the delay, and does not have health phases. | Preview shows Titan timing and other authored packets; inspector advises sustained damage. Live text shows shield amount and fixed 3 s recovery rule, but not time remaining to recovery or that regeneration is occurring. | In 18 reached policy runs, 15 Titans recovered shield on wave 15 (1,290 shield total), none on wave 18, and 12 of 36 Titans recovered on wave 20 (5,803 shield total). Some wave-20 Titans recovered an entire shield. The rule matters in actual combat but its current live text does not expose the current recovery state. |
| Wave 20 combination | Prepare coverage for two Titans spawned 14 s apart, a Raid at 7 s, Monks/Hackers and four authored Agents; protect sustained Titan pressure from Raid EMP while handling the Agent brace windows and reinforcements. | All authored spawn windows are shown; the preview warns that dynamic reinforcements can overlap. Raid warning and Titan shield rule are separate; the live section omits exact reinforcement composition and recovery countdown. | Existing Easy/Normal/Hard plans all win with 20 lives, while Normal expansion-heavy leaks two Titans and Hard expansion-heavy loses with four Titan leaks. The strong scripted outcomes do not establish player difficulty. Wave-20 Raid phases frequently collapse into one disable decision even as Titan recovery remains active in some runs. |

Sources: shipped `design/balance.json`, `EnemySystem`, `combatFeedback`, inspector
and UI at `601c1ea`; [M4.1 results](../2026-11-12-m4.1/results.json),
[M4.1 comparison](../2026-11-12-m4.1/comparison.md), and
[M4.4 verification](../2026-11-12-m4.4/README.md). The read-only
[`trace-bosses.mjs`](trace-bosses.mjs) drove all 21 fresh policy/difficulty
production games through legal purchases, authored waves and 60 Hz combat.
[`boss-trace-before.json`](boss-trace-before.json) records each reached boss's
health trigger, affected tower count, reinforcement spawns, outcome and actual
shield regeneration; the run used `node design/reviews/2026-11-12-m4.2/trace-bosses.mjs design/reviews/2026-11-12-m4.2/boss-trace-before.json --old`.
The trace is an exact deterministic scripted observation, not evidence of player
comprehension, difficulty or build diversity.

**M4.2 decision:** Omit Raid's redundant second EMP phase. Keep its single
warned 66% trigger and the same four reinforcements, now dispatched together
at the shared 250 ms spacing. State the exact reinforcements before Start Wave
and show EMP ready/spent in live text without an implied third phase. Show
Titan's actual recovery countdown/regenerating state beside its shield amount.
Keep all authored wave groups, prices, towers, difficulty settings, Agent brace,
shared schedule compiler and clock rules untouched. This changes boss content
meaning and requires a new balance version, while the serialized state shape
remains schema v4. The final combination retains its staggered two-Titan/Raid
timing; the single EMP still forces the prepared layout to tolerate a disruption
while sustained Titan coverage matters.
