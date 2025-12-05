# Balance Map - Tower Defense Game

## Overview
This document maps all balance-related parameters across the codebase and their consolidation into `design/balance.json`.

## Files Containing Balance Data

### 1. `/js/config.js`
Primary configuration file containing all game balance parameters.

**Tower/Defense Parameters:**
- `CONFIG.DEFENSE_TYPES` - All tower types with their stats
  - `firewall` - Basic blocking tower
    - cost: {dharma: 30, bandwidth: 0, anonymity: 0}
    - damage: 40
    - range: 200
    - fireRate: 1000ms (1.0 ratePerSec)
    - projectileSpeed: 30
  - `encryption` - Cipher tower
    - cost: {dharma: 50, bandwidth: 20, anonymity: 10}
    - damage: 70
    - range: 180
    - fireRate: 1500ms (0.667 ratePerSec)
    - projectileSpeed: 25
  - `decoy` - Distraction tower (no damage)
    - cost: {dharma: 30, bandwidth: 15, anonymity: 5}
    - damage: 0
    - range: 150
  - `mirror` - Reflection tower
    - cost: {dharma: 75, bandwidth: 40, anonymity: 20}
    - damage: 80
    - range: 250
    - fireRate: 2000ms (0.5 ratePerSec)
    - projectileSpeed: 35
  - `anonymity` - Cloaking tower
    - cost: {dharma: 60, bandwidth: 30, anonymity: 40}
    - damage: 50
    - range: 300
    - fireRate: 1200ms (0.833 ratePerSec)
    - projectileSpeed: 32
  - `distributor` - Boost tower
    - cost: {dharma: 100, bandwidth: 60, anonymity: 30}
    - damage: 60
    - range: 350
    - fireRate: 800ms (1.25 ratePerSec)
    - projectileSpeed: 35

**Enemy Parameters:**
- `CONFIG.ENEMY_TYPES` - All enemy types with stats
  - `scriptKiddie` - Fast, erratic enemy
    - health: 30
    - speed: 90
    - reward: {dharma: 5, bandwidth: 2, anonymity: 1}
  - `federalAgent` - Persistent enemy
    - health: 60
    - speed: 70
    - reward: {dharma: 10, bandwidth: 5, anonymity: 3}
  - `corporateSaboteur` - Stealth enemy
    - health: 50
    - speed: 80
    - reward: {dharma: 15, bandwidth: 8, anonymity: 5}
  - `aiSurveillance` - Adaptive enemy
    - health: 90
    - speed: 60
    - reward: {dharma: 20, bandwidth: 12, anonymity: 8}
  - `quantumHacker` - Teleporting enemy
    - health: 120
    - speed: 100
    - reward: {dharma: 30, bandwidth: 20, anonymity: 15}
  - `corruptedMonk` - Corrupting enemy
    - health: 150
    - speed: 50
    - reward: {dharma: 50, bandwidth: 30, anonymity: 25}

**Boss Parameters:**
- `CONFIG.BOSS_TYPES` - Boss enemies
  - `raidTeam`
    - health: 500
    - speed: 30
    - reward: {dharma: 100, bandwidth: 60, anonymity: 40}
  - `megaCorpTitan`
    - health: 800
    - speed: 20
    - reward: {dharma: 200, bandwidth: 120, anonymity: 80}

**Economy Parameters:**
- `INITIAL_DHARMA`: 150 (starting cash)
- `INITIAL_BANDWIDTH`: 60
- `INITIAL_ANONYMITY`: 100
- `INITIAL_LIVES`: 20

**Wave Parameters:**
- `WAVE_DELAY`: 5000ms (5 seconds between waves)
- `ENEMY_SPAWN_DELAY`: 1000ms (1 second between spawns)
- `MAX_WAVES`: 20

### 2. `/js/defense.js`
Tower/defense implementation with upgrade mechanics.

**Upgrade Mechanics:**
- Level system: 1-5 levels
- Upgrade cost formula: baseCost * 1.5^level
- Damage scaling: baseDamage * (1 + level * 0.25) [+25% per level]
- Range scaling: baseRange * (1 + level * 0.12) [+12% per level]
- Fire rate scaling: baseFireRate * (1 - level * 0.12) [faster by 12% per level]

### 3. `/js/enemy.js`
Enemy implementation with movement and combat.

**Resistance System:**
- Default resistances: {fire: 1, ice: 1, electric: 1, poison: 1}
- Damage calculation: damage * resistance

### 4. `/js/level.js`
Wave generation and spawning logic.

**Wave Generation:**
- Boss waves: Every 5th wave
- Enemy count scaling: 2 + wave * 0.5 base count
- Health multiplier: 1 + difficulty * 0.35
- Wave completion bonus: 40 + wave * 12 resources

## Consolidated Parameters in design/balance.json

All parameters have been consolidated into a single source of truth:
- Tower stats (damage, rate, range, projectile speed, costs)
- Enemy stats (HP, speed, bounty, resistances)
- Wave compositions and scaling curves
- Economy parameters (starting resources, income multipliers)
- Difficulty modifiers

## DPS & TTK Calculations

### Formulas
- **Rate Per Second**: 1000 / fireRateMs
- **DPS**: damage * ratePerSec
- **Effective Damage**: (damage * resistMult) - max(0, armor - armorPen)
- **TTK**: enemyHP / effectiveDPS

### Example Calculations
- Firewall vs Script Kiddie (W1):
  - DPS = 40 * (1000/1000) = 40 DPS
  - TTK = 30 / 40 = 0.75 seconds
- Encryption vs Federal Agent (W5):
  - DPS = 70 * (1000/1500) = 46.67 DPS
  - TTK = 60 / 46.67 = 1.29 seconds

## Migration Notes

When refactoring code:
1. Load balance.json at game initialization
2. Map old CONFIG keys to new balance data structure
3. Maintain backward compatibility for save files
4. Add runtime validation for balance parameters
5. Hot-reload balance.json in dev mode for rapid iteration
