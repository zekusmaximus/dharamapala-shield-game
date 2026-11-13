# M4.3 diagnosis and proposed calibration, before editing 1.6.0

Source: merged main `c4f614e`, balance `1.6.0`, schema v4. The immutable
[M4.2 production report](../2026-11-12-m4.2/results.json) runs seven fixed
purchase policies on each of three fresh difficulty configurations, repeats
each, and plays authored waves in order through real combat. Its
[summary](../2026-11-12-m4.2/summary.md) and
[comparison](../2026-11-12-m4.2/comparison.md) retain per-wave accounts. The
matching content bytes are copied in `baseline-1.6.0.json`. The wave-3 earned
forks in the immutable [M4.2 counterplay report](../2026-11-12-m4.2/counterplay.json)
use default funds/lives and legal commands after playing waves 1–2. They do
not isolate the Agent from the other wave-3 enemies.

## Where the difficulties differ

The existing difficulty definitions scale enemy HP to 0.75/1.00/1.35 and
movement speed to 0.85/1.00/1.15 for Easy/Normal/Hard. Bounty multipliers are
1.15/1.00/0.85; they change earned money, while starting money, tower prices
and wave-clear rewards are shared. Player damage multipliers are
0.80/1.00/1.25. With the current rounding rule, one regular leak costs **one
life on all three**; a default boss leak costs **4/5/6** lives. These are
runtime definitions, not inferred difficulty ratings.

All 21 scripted runs repeat exactly. Easy has six wave-20 victories, all at
20 lives, and one weak-placement defeat at wave 3. Normal has six wave-20
victories: five at 20 lives and expansion-heavy at 10 lives after two Titan
leaks; weak-placement loses on wave 3. Hard has five wave-20 victories at
20 lives, an expansion-heavy defeat at wave 20 after four Titan leaks, and a
weak-placement defeat at wave 3. Existing-policy combat lasts 342.85/375.17/
408.10 simulated seconds across Easy/Normal/Hard and ends with 2418/4414,
2237/3832, and 1946/3332 Dharma/Bandwidth. These times exclude building and
observed human play. The different banks reflect existing bounty scaling,
combat and legal purchases; they are not grounds to retune the economy here.

## Where they do not

Every difficulty uses the same map, tower roster, prices, level-3 choices,
M4.1 wave groups/counts/offsets/intervals and reward bonuses, shared spawn
compiler, M4.2 boss abilities, and Agent brace. The same five fixed policies
(`existing`, `firewall-only`, `no-support`, `upgrade-heavy`, `counter-aware`)
clear all 20 waves without a leak on **each** difficulty. `counter-aware`
chooses exactly the existing policy's commands in this matrix, so it supplies
no independent adaptation result. Firewall-only and no-support also clear
without losses. Their differing combat seconds, money and attack activity
show tradeoffs, but no lives or boss-outcome penalty for those omissions.
Weak placement loses by 20 Script Kiddie leaks on wave 3 on all difficulties;
this is an obvious coverage failure, not measured counterplay to a new threat.

The earned wave-3 fork makes the opportunity cost more specific. A common
opening of two Firewalls and one Encryption plays waves 1–2. On wave 3,
`save` buys nothing; `central-expansion` legally spends 90 Dharma on three
Firewalls. Easy and Normal save **and** expansion both keep 20 lives. On Hard,
save leaks four Script Kiddies and one Federal Agent (15 lives), while central
expansion leaks none (20 lives); a single Firewall level-2 upgrade still leaks
one Script Kiddie. The Agent leak is observed in the mixed wave and cannot be
credited solely to its brace. Current Normal does not charge a life for
ignoring this introduced wave under that earned opening.

## Focused proposal

1. Keep Easy's existing multipliers. Six policy labels finish
   with all lives, including expansion-heavy; counter-aware duplicates the
   existing commands. The no-purchase wave-3
   fork remains safe. This is sufficient automated room to learn and recover;
   real learner experience is unmeasured.
2. Raise Normal HP `1.00 → 1.10` and speed `1.00 → 1.04`, leaving bounty and
   leak multipliers alone. In an exploratory in-memory production fork, saving
   at wave 3 then leaks two Script Kiddies; central expansion, a level-2
   Firewall, or either affordable level-3 Firewall branch avoids them. This
   creates a visible preparation cost with more than one legal response.
3. Raise Hard HP `1.35 → 1.38` and boss/regular leak multiplier `1.25 → 1.40`.
   The 1.38 HP probe makes firewall-only leak one wave-20 Quantum Hacker while
   existing, no-support and upgrade-heavy still win untouched. The leak
   multiplier makes a default Titan leak cost seven lives instead of six; a
   regular leak still costs one due to rounding. Keep Hard speed at 1.15 to
   avoid compressing the already faster authored packets.

This proposal changes **difficulty values only**. It uses M4.1's existing
composition and timing and the cost of choosing whether to prepare, without
rewriting the four-act schedule, bosses, tower roster or economy. The probes
are candidate selection, not acceptance: the final 21-run report, exact
repeats, targeted earned scenarios, full-campaign clock/JSON continuation and
clean-checkout pipeline must all pass before the proposal is retained. In
particular, a fixed-policy leak cannot establish human difficulty or prove a
single mechanic caused it. M3.2 retention, M3.5 collection, the human M3 gate
and M4 acceptance remain open.
