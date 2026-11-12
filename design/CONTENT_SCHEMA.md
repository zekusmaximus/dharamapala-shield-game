# Runtime content contract

`design/balance.json` is the content consumed by the browser, `GameSession`, the
simulator, and the balance reporter. `validateBalance` checks it before a session
starts or a save is restored. It requires the runtime's fields, their types and
ranges, referenced enemy IDs, ordered waves, and the current active tower/boss
IDs. Unknown keys in runtime objects fail validation, so adding a plausible
looking property cannot silently imply a mechanic. The validator does not judge
whether a numeric choice is fun or balanced.

## Active fields

- Tower names, descriptions, icons and colors appear in the UI. Costs, attack
  stats, damage type, status durations/strengths, and Distributor support feed
  production combat, inspector comparisons, and economy. Status percentages
  with no application duration are rejected. `combat.status` defines shared
  upgrade growth and caps; `combat.chain` defines the existing Encryption chain
  unlock, target count, radius and secondary damage. Distributor aura growth is
  in its `support` definition; its overall cap remains in `economy`.
- Enemy and boss names, descriptions, icons, colors and sizes feed presentation.
  HP, armor, physical/fire/shock resistance, speed and bounty feed combat and
  rewards. An optional positive `leakDamage` overrides the existing regular/boss
  default. Wave groups name these IDs and define count, interval and HP
  multiplier. Wave rewards, difficulty, economy and upgrades keep their existing
  production meanings.
- `bosses.raidTeam.abilities.emp` defines the two existing health thresholds,
  radius and disable duration. `reinforcements` defines the existing phase
  minion lists, spacing and per-wave HP multiplier. The runtime, save validator,
  canvas range marker and text warning read these same definitions. There is
  no timed wind-up. `bosses.megaCorpTitan.abilities.shield` defines initial
  shield-to-health ratio, regeneration rate and hit-free recovery delay. No
  health-triggered Titan phases exist.
- `migration.deferredTowerRefunds` is still read only while importing legacy
  saves. These are compatibility values, not buildable tower definitions.

## Removed inert fields

M2.6 removed `towers.*.special`, `enemies.*.special`, `bosses.*.special`,
`bosses.*.phases`, `towers.*.status.burnDps`, `economy.interestPct`, and the
top-level `balance` block. No production path used them. In particular, labels
such as “erratic”, “stealth” and “teleport” did not give regular enemies those
abilities; `burnDps` did not burn; `interestPct` did not pay interest; target
TTK/growth numbers did not tune waves; and delay fields did not control the
deliberate Start Wave or authored spawn intervals. The historical review and
earlier milestone evidence retain their original descriptions of those fields.
The current validator rejects their reintroduction.

Values moved into the active schema retain their pre-M2.6 numbers. The content
file hash changes because its structure changed; it is not a combat outcome.
At M2.6, balance version `1.0.0`, save schema v2 and preference keys stayed
unchanged, so valid saves continued under the same numeric rules. Future edits that
change combat/economy meaning or derived saved entity stats must use a new
balance version and an explicit migration or the existing export/reset recovery
flow. Run the corrected M1.4 diagnostics and M2.4 seven-policy report after
such edits; deterministic repeats establish reproducibility, not player
difficulty or a balance target.

## M3.1 authored spawn windows (balance 1.1.0)

A wave group may include `offsetMs`: a finite, nonnegative absolute simulated
millisecond offset after **Start Wave**. Its count spawns at
`offsetMs + index * interval`. Groups can overlap or appear out of time order.
Omitting the offset retains the original sequential rule: start after the
preceding group's start plus **count × interval**, including the trailing
interval. Thus waves 6–20 retain their exact schedules. Zero intervals release
simultaneously; fractional offsets release on the first eligible fixed tick.
Derived times must remain finite. Compiled events sort by due time, breaking ties
in authored group/index order, then receive contiguous chronological `order`
values. Runtime, simulator, preview and save validation share this compiler.
Dynamic health-triggered Raid reinforcements retain the existing scheduler rules.

The preview aggregates each enemy type and lists every packet's count, first/last
arrival and interval. It identifies gaps of at least two simulated seconds between
scheduled arrivals; those gaps are **not** promised empty battlefields, build
phases or pauses in health-triggered boss reinforcements. At 2× the same schedule
uses half the real time. Neither speed nor a recovery gap starts the next wave.

The first five schedules changed, so balance is now `1.1.0`. Schema v2 and run /
preference keys are unchanged. There is **no v2 1.0.0 → 1.1.0 migration**, even
for building or terminal saves. The exact-version validator rejects them before
session replacement; the existing recovery UI retains the original raw payload,
blocks overwrites, offers export and requires explicit Reset saved run before a
new run can be saved. Reset keeps independent preferences and the most recent
recovery archive. Export first for a durable copy; old runs can continue only in
an installation with their matching old content. Legacy pre-v2 tower-refund import
remains the explicit build-state import described in M1.3, not a migration of v2
combat. M1's historical 1.0.0 terminal repair remains tested against that version;
it does not bypass the new version gate.

## M3.2 provisional specializations (balance 1.2.0, schema v3)

Firewall and Encryption now require one of two `specializations` at the upgrade
from level 2 to 3. Distributor remains linear. Definitions have exactly two IDs:
`focus`/`coverage` and `sustain`/`reach`. Each has nonempty `name`/`description`,
positive finite multipliers (at most 10) for `damage`, `range`, `rate`, `slow`,
`duration`, and `vulnerability` (keys end in `Multiplier`), and an integer
`chainTargets` from 0–10 (Firewall must have zero). Unknown fields fail validation.
Balance 1.2.0 requires both attacking towers' definitions; historical linear
content can still run in the comparison tools.

`getTowerStats` first computes the linear level, then applies the chosen branch
once at levels 3–5. Slow/vulnerability retain the shared tower caps. The branch's
chain count replaces the old level-4 unlock; secondary damage/radius and full
status application still use the shared combat rules. There is no new damage,
armor, enemy, targeting or stacking mechanic. Level 1–2, base costs, upgrade cost
formula, investment/refund, Distributor aura/income and all wave schedules remain
unchanged. Equal branch prices deliberately isolate coverage/hit/control choices
from currencies in this prototype; measured opportunity costs are in M3.2 evidence.

`upgradeDefense(id, specialization)` requires a valid ID exactly at level 2 for
these towers. Missing/foreign choices fail atomically; later attempts to choose
again fail. Later upgrades preserve the choice. Selling uses the existing refund;
rebuilding allows a new choice. Runtime, simulator, renderer, leak coverage and
semantic inspection all use the same derived stats. A null stats argument is the
linear comparison for tools/blueprints, not a level-3 runtime purchase option.

New snapshots explicitly use **schemaVersion 3** in both wrapper and state, and
every tower has `specialization`: null below level 3 / on Distributor; a valid
own branch ID for attacking towers at levels 3–5. Candidate validation rejects
missing, malformed, foreign or premature choices before session replacement.
The storage slot stays `dharmapala-shield/save/v2` so startup discovers and
protects existing bytes; the key is not the payload version. Preference keys and
shape are unchanged.

There is **no v2 1.1.0/1.0.0 → v3 1.2.0 migration**, including building and
terminal saves. Original payloads are retained, writes blocked, export offered,
and Reset saved run remains explicit. Preferences and the most recent recovery
archive survive reset; export before resetting for a durable copy. Historical
1.0.0 terminal repair is tested only with matching historical linear content.
Pre-v2 refund import still handles lower-level attackers and Distributors; a
legacy attacker already at level 3+ is rejected through recovery rather than
inventing a specialization. Continue old runs only with their matching old build.

The specializations are a **provisional prototype**. Automated scenario-dependent
results do not satisfy the roadmap requirement for players making different
defensible choices. Human retention acceptance remains open.
