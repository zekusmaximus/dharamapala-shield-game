# M4.1 pressure plan before content edits

Source: fetched main `c39b6fe`, balance `1.4.0`, and the immutable
[M3.4 21-run report](../2026-11-12-m3.4/results.json), which M4.4 reproduced.
The table below records the **existing** authored count and last spawn, plus
actual Normal/Hard `existing` policy peaks and combat durations. Both runs
retain 20 lives through every wave; this is a property of that scripted plan,
not evidence of human difficulty. Group starts in waves 6–20 are sequential
because none currently has `offsetMs`. Thus most threats arrive after the prior
type is resolved. Recovery refers to relative authored pressure, not an empty
route or an automatic build interval.

| Wave | Current authored threat | Count / last spawn s | Peak alive N/H | Combat s N/H | Decision this edit should expose |
| ---: | --- | ---: | ---: | ---: | --- |
| 1 | Two Kiddie packets | 8 / 8.6 | 4 / 4 | 15.7 / 16.0 | Established opening coverage; leave unchanged. |
| 2 | Faster Kiddie repeat | 10 / 6.8 | 8 / 8 | 16.7 / 18.1 | Expand or improve coverage; leave unchanged. |
| 3 | Agent escorts and Kiddies | 11 / 7.7 | 6 / 6 | 15.8 / 16.3 | React to brace and runners; leave unchanged. |
| 4 | Two mixed Agent/Kiddie packets | 11 / 7.2 | 7 / 7 | 16.2 / 17.3 | Commit to complementary defenses; leave unchanged. |
| 5 | Raid, Kiddie packets, reinforcements | 13 / 8.0 | 9 / 7 | 27.1 / 29.3 | Handle EMP and reinforcement climax; leave unchanged. |
| 6 | Agents then Saboteurs | 10 / 10.0 | 2 / 4 | 11.5 / 14.3 | Post-Raid recovery: spend the reward or bank it while testing brace against fire-resistant Saboteurs. |
| 7 | Kiddies then Agents then Saboteurs | 19 / 16.7 | 5 / 6 | 19.5 / 23.0 | Choose runner coverage versus heavier Agent damage as two mixed packets test the prior purchase. |
| 8 | Saboteurs then two Surveillance | 10 / 10.0 | 2 / 2 | 12.3 / 12.0 | Recovery/preview of armored Surveillance: inspect resistances and prepare a counter before the next mix. |
| 9 | Agents then Saboteurs then Surveillance | 17 / 18.0 | 3 / 5 | 19.9 / 21.4 | Buy for overlapping brace, fire resistance and armor rather than one type at a time. |
| 10 | Raid then Surveillance then Saboteurs | 16 / 14.7 | 9 / 10 | 26.1 / 28.5 | Choose whether to spread coverage or commit damage around warned EMP and two escort packets. |
| 11 | Surveillance then two Quantum Hackers | 8 / 9.2 | 2 / 3 | 10.5 / 13.9 | Post-Raid recovery: earn resources while introducing fast, broadly resistant Hackers beside armor. |
| 12 | Saboteurs then Surveillance then Hackers | 18 / 18.1 | 3 / 4 | 19.4 / 22.4 | Keep fast targets covered while armored ones occupy firing time. |
| 13 | Hackers then two Monks | 7 / 9.5 | 1 / 2 | 11.6 / 11.9 | Relative recovery: compare sustained heavy damage with fast-target coverage before Titan. |
| 14 | Surveillance then Hackers then Monks | 14 / 17.0 | 2 / 4 | 19.0 / 21.0 | Reintroduce Agent brace alongside armor and fast threats so an upgrade/placement commitment matters. |
| 15 | Titan then Hackers then Monks | 12 / 12.0 | 4 / 4 | 16.6 / 21.6 | Maintain coverage of fast threats while committing sustained damage to a regenerating shield. |
| 16 | Monks then Hackers | 15 / 17.1 | 3 / 5 | 20.0 / 22.6 | Post-Titan recovery: rebuild or bank while practicing the fast/heavy split. |
| 17 | Hackers then Monks then Surveillance | 25 / 24.6 | 4 / 6 | 27.3 / 30.5 | Recombine fast, heavy and armored pressure; retain a short Saboteur test. |
| 18 | Monks then Hackers then Titan | 17 / 18.0 | 3 / 5 | 24.0 / 27.0 | Fight a Titan while a mixed screen remains, including finite Agent brace. |
| 19 | Hackers then Monks then Surveillance | 33 / 30.7 | 6 / 8 | 32.6 / 37.5 | Pre-climax commitment: sustain coverage of fast and heavy threats plus a small resistant flank. |
| 20 | Two Titans then Raid then Monks then Hackers | 33 / 43.4 | 10 / 16 | 51.1 / 53.9 | Climax with staggered bosses, warned Raid behavior, fast pressure and Agent brace already learned. |

The proposed edit uses the existing absolute-offset compiler and preview. It
overlaps types in waves 6–20, splits some waves into two packets, and introduces
small Agent/Saboteur reprises by exchanging late-wave counts. It leaves waves
1–5, retained groups' HP multipliers, all reward bonuses, enemy/boss/tower rules,
prices and difficulty multipliers intact. New reprise groups receive explicit
wave-tier HP multipliers. Relative recovery waves 6/8/11/13/16 retain
income and preview the next threat; deliberate starts provide the actual build
opportunity. Spacing and overlap are hypotheses until fresh full-run results
show their consequences. No in-wave spending or active counter command exists.

Before accepting the edits, compare all 21 fresh policy/difficulty runs against
the M3.4 and M4.4 baseline, including peaks, combat durations, lives, typed
leaks, banks, bosses and support/control activity. Repeat every run. Keep the
M4.4 fixed-clock and JSON continuation invariants with the new content. If a
packet causes an unexplained spike or a dead end, revise this plan and document
the reason in the M4.1 evidence record.
