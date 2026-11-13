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
- `bosses.raidTeam.abilities.emp` defines the current single health threshold,
  radius and disable duration. `reinforcements` defines the existing phase
  minion lists, spacing and per-wave HP multiplier. The runtime, save validator,
  canvas range marker and text warning read these same definitions. There is
  no timed wind-up. Historical 1.5.0 and earlier content retains its two
  thresholds for matching-build replay. `bosses.megaCorpTitan.abilities.shield` defines initial
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
interval. At M3.1, waves 6–20 retained their exact prior schedules; M4.1 later
authored them with explicit offsets. Zero intervals release
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

## M3.3 bounded economy simplification (balance 1.3.0, schema v3)

`economy.activeResources` is exactly `["dharma", "bandwidth"]` for 1.3.0.
Historical definitions may omit it to retain all three original currencies.
Current content must set starting Anonymity, tower Anonymity costs and enemy/boss
Anonymity bounties to zero. The shared wave-reward rule also pays zero Anonymity
when retired. Unknown/reordered/duplicate active resources or nonzero retired
supply/cost fail content validation. Runtime and simulator share these rules.
Dharma funds every tower; Bandwidth additionally constrains Encryption and
Distributor purchases/upgrades. Saving carries balances without interest.

Encryption costs 50 Dharma / 35 Bandwidth; Distributor costs 70 / 60. The existing
upgrade multiplier and exact rounding, refunds, aura growth/cap, passive income
and cap, attack stats, specializations, enemy mechanics and all waves/schedules
remain unchanged. There is no new exchange, sink, enemy behavior or income buff.

The three numeric resource keys remain in snapshots, ledgers and reports; this
bounded simplification retires an active decision without removing M2 accounting
fields. New runs produce zero Anonymity throughout. Schema **v3**, the existing
`dharmapala-shield/save/v2` discovery slot and independent preferences remain.
There is **no 1.2.0 → 1.3.0 migration**, including building/terminal saves. Exact
version rejection protects original bytes before session swap, blocks writes,
and offers export plus explicit Reset saved run. Preferences and the latest
recovery archive survive reset; export first for a durable copy. Matching old
builds are needed to continue retired runs. Current content also rejects pre-v2
refund imports through that recovery flow, rather than reprice old investments
or silently discard/convert Anonymity. Historical matching-content legacy refund
behavior remains tested. Schema v3 is unchanged because no serialized shape was
changed; balance 1.3.0 explicitly versions the changed economy meaning.

M3.2 specialization retention remains provisional pending actual observations.

## M3.4 Agent shield brace (balance 1.4.0, schema v4)

Only `enemies.federalAgent.brace` is added: `{windupMs:3000, durationMs:4000,
healthRatio:0.6}`. Exactly these fields are accepted; windup/duration must be
finite 1000–10000 ms, ratio positive and at most 1. No other regular enemy or
boss may have brace. Current content requires it. No legacy `special` labels
return. All 20 wave definitions, counts, offsets, intervals, HP multipliers and
rewards are byte-unchanged; waves 3–4 already introduce Agents. Existing Raid
reinforcements and later Agent waves inherit the same behavior without schedule
redesign. Tower stats/prices/branches, armor/resists/speed/HP/bounties, income,
aura/passive and boss rules are unchanged.

An Agent targets **itself only** (no radius, escort aura, targeting override or
stacking). On spawn its shield capacity is `round(maxHealth * healthRatio)`,
including wave/difficulty HP multipliers, but its shield starts at zero. Its
persisted `brace` stores `activatesAtMs = spawnedAtMs + windupMs`,
`expiresAtMs = activatesAtMs + durationMs` and boolean `activated:false`.
At the first fixed tick at/after activation, it gains that shield **once**.
At/after expiry any remainder becomes zero. If a large direct step skips the
whole window, no shield is granted. Behavior transitions run after scheduled
spawns and before tower/projectile combat; hits on the activation tick encounter
the shield, hits on the expiry tick encounter health. Floating point clock sums
can move a deadline to the next eligible 60 Hz tick; time is never rounded early.
Movement/slow does not delay either absolute deadline.

Existing targeting/range, collisions, chain and AoE rules remain. Each impact
applies vulnerability then resistance/armor, removes shield first and overflows
to health. Every tower can damage it; slow/vulnerability apply through shield
with their existing maximum-strength/maximum-expiry rules. Brace does not stack,
refill after breaking, regenerate, grant immunity or protect neighbors. Titan
alone uses the hit-free regeneration cooldown. Reports count actually absorbed
shield damage; granting or expiring unused capacity earns no damage credit.

The three-second warning is an early-damage window; sustained fire can break the
finite shield during its four-second lifetime; later coverage can fight after
expiry. Building remains between waves, so these are **preparation responses**,
not promises of in-wave selling, retarget controls or new purchases. Agent roster
inspection gives the exact effect and alternatives before Start Wave. Static
`!` warning, `S` shield, `×` broken and `✓` spent glyphs (with a visible legend),
a dashed warning ring and solid active shield ring/bar have
per-Agent semantic Combat status equivalents, including countdowns/capacity.
No animation/color-only cue is needed; both motion settings share the labels.
The text uses the existing non-live, keyboard-focusable status section; it is
not a claim of tested screen-reader usability or guaranteed nonoverlapping badges.

Death/leak removes the entity and its pending brace; there is no independent
callback to fire later. Terminal phases freeze retained entities for the final
snapshot and all future ticks/behavior updates are inert. Restart/menu disposal
clears them. Pause freezes simulated time; 2× uses the same fixed ticks/deadlines
in half the wall time. JSON continuation preserves deadlines, activation and
remaining shield. Validation checks exact deadlines from spawn/content, phase /
activation consistency, zero shield outside the active window, capacity/regen
against content, and no foreign brace state, before session replacement.

New wrapper/state snapshots explicitly use **schema v4** and balance **1.4.0**.
The storage discovery slot stays `dharmapala-shield/save/v2`; independent
preferences keep their existing keys/shape. No v3 1.3.0 (or prior) run is silently
converted, including building and terminal saves. Exact-version/schema rejection
retains original bytes, blocks writes, offers export and requires explicit Reset
saved run. Preferences and the latest recovery archive survive reset; export
first for durable recovery. Pre-v2 runs still use that same explicit recovery
under the retired economy. Continue old runs only in a matching old build.
Historical-content tooling remains pinned to historical definitions; it does
not bypass the current-content recovery gate. Specialization retention and the
broader M3 human gate remain provisional/open.

## M4.1 four-act authored campaign (balance 1.5.0, schema v4)

Waves 1–5 keep their M3.1 definitions exactly. Waves 6–20 now all use
`offsetMs` for mixed and sometimes repeated packets. The existing shared
compiler, stable event order, preview windows, scheduled-arrival gaps,
deliberate starts and fixed-clock 1×/2× behavior are unchanged. The preview
describes authored spawn timing, not an empty route, a build interval or boss
reinforcement timing. [The pressure plan](reviews/2026-11-12-m4.1/PRESSURE_PLAN.md)
records the old per-wave pressure and intended decisions before this edit;
[the comparison](reviews/2026-11-12-m4.1/comparison.md) lists each exact group
change and resulting production observations. Wave reward bonuses and all
non-wave balance values remain unchanged. Some late-wave enemy counts and type
mixes change, so earned bounty and combat outcomes can change even with the same
fixed prices and scripted purchases.

This is a content-meaning change, so new snapshots use balance **1.5.0**. The
wrapper and state still use **schema v4** because no saved state field changed.
`GameSession` construction and snapshot validation both classify 1.4.0 and
1.5.0 as v4, while still requiring an exact balance-version match on restore.
An old 1.4.0/v4 run is rejected before session swap; its original bytes remain
in `dharmapala-shield/save/v2`, writes are blocked, export is available, and
reset is explicit. Independent preference keys and the most recent recovery
archive survive reset; export before reset for durable retention. Retitling old
version strings is not a migration: pending wave events must match the 1.5.0
schedule and fail validation otherwise. The pinned 1.4.0 M3.5 build and all
historical evidence remain on their own content version. Level-3 specialization
retention and human M3/M4 acceptance remain open.

## M4.2 focused bosses (balance 1.6.0, schema v4)

Raid Team has one immediate EMP at **66% health**, with the existing 260-unit
radius and 1.5-second tower disable. It dispatches the same four minions as
before, now as one packet: Script Kiddie, Script Kiddie, Federal Agent, Script
Kiddie at 0/250/500/750 ms after the health trigger. Each reinforcement still
uses `1 + waveNumber × hpMultiplierPerWave`; the Agent still has its one-use
three-second warning and four-second 60%-health brace. The second 33% EMP and
misleading three-phase presentation are removed. The shared scheduler still
registers dynamic minions with its stable order and serializable events; no
authored wave group, reward, tower, economy or difficulty value changes.

Before Start Wave, the EMP warning names the one health trigger, range,
disable duration, exact reinforcement types and 250 ms spacing. It has no
wind-up; building and spreading coverage are preparation decisions. During a
wave, the warning remains while a Raid is pending or its EMP is unspent, then
clears after the trigger. Live status and the canvas say EMP spent rather than
implying more health phases. Titan's 35%-health shield, 4%-of-capacity-per-second
regeneration and three-second hit-free cooldown are unchanged. Its live status
now shows the countdown while recovery is delayed and a regenerating label
afterward; the amount bar remains visible. Wave 20 retains the staggered two
Titans and Raid under the M4.1 authored schedule.

Changing Raid's trigger and minion timing changes combat meaning, so current
content is balance **1.6.0**. New wrapper/state snapshots remain **schema v4**:
the existing `phase`, `firedPhases`, scheduler and shield fields already encode
the changed behavior. The storage discovery key remains
`dharmapala-shield/save/v2`; retired Anonymity is still numeric and zero in
current active supply. Exact balance-version validation rejects 1.5.0/v4 and
older bytes before session replacement, retaining the raw run, blocking
overwrite, permitting export and requiring explicit Reset saved run.
Preferences and the latest recovery archive survive reset; export before reset
for a durable copy. Relabeling old second-phase Raid bytes fails state
validation, not migration. Continue an old run only in its matching old build.
The pinned M3.5 1.4.0 archive and all earlier evidence remain unchanged.

The [M4.2 production comparison](reviews/2026-11-12-m4.2/comparison.md) pairs
all 21 fresh policy/difficulty runs and [boss trace](reviews/2026-11-12-m4.2/CURRENT_DESIGN.md)
shows the observed overlap that prompted this change. Repeats and automated
activity do not establish player understanding, challenge or build diversity.
