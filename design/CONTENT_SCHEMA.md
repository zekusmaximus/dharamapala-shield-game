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
Balance version `1.0.0`, save schema v2 and preference keys stay unchanged, so
existing valid saves continue under the same numeric rules. Future edits that
change combat/economy meaning or derived saved entity stats must use a new
balance version and an explicit migration or the existing export/reset recovery
flow. Run the corrected M1.4 diagnostics and M2.4 seven-policy report after
such edits; deterministic repeats establish reproducibility, not player
difficulty or a balance target.
