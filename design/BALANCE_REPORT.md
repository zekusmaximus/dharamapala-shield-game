# Balance Tuning Report

## Summary

**Date:** December 5, 2024  
**Configurations Tested:** 16 (Baseline + 15 variations)  
**Target Win Rate:** 68.0%  
**Target Leaks per Run:** 5

## Baseline Analysis

### Normal Difficulty - Baseline Results
- **Win Rate:** 100.0% (5/5 runs)
- **Average Leaks:** 0.0 per run
- **Average Waves Completed:** 20.0 / 20
- **Average Final Resources:** 10,405 dharma
- **Final Lives:** 20 / 20
- **Towers Built:** 8

**Analysis:** Normal difficulty is significantly too easy. The competent AI strategy achieves perfect wins with zero leaks. This indicates:
1. Tower damage is too high relative to enemy HP
2. Economy provides excessive resources (10k+ dharma at end)
3. No meaningful challenge after Wave 10

### Hard Difficulty - Baseline Results
- **Win Rate:** 100.0% (1/1 run tested)
- **Average Leaks:** 11 per run  
- **Average Waves Completed:** 20.0 / 20
- **Average Final Resources:** 9,890 dharma
- **Final Lives:** 9 / 20
- **Towers Built:** 8

**Analysis:** Hard difficulty is appropriately challenging but still too easy. The 1.35x HP multiplier helps but is insufficient. Target should be ~60-70% win rate with more strategic pressure.

## Key Balance Issues Identified

### 1. Tower DPS vs Enemy HP Scaling
**Problem:** Early-game tower DPS significantly exceeds enemy HP pools.

**Example - Wave 1:**
- Firewall DPS: 35 damage × 1.0 rate/sec = 35 DPS
- Script Kiddie HP: 40
- TTK: 40 / 35 = 1.14 seconds per tower
- **With 2 towers:** 0.57 seconds TTK ← Too fast!

**Target:** 1.5-2.0 seconds TTK for single tower in early waves.

### 2. Economy Snowballing
**Problem:** Resource accumulation becomes excessive in mid-late game.

**Wave-by-Wave Resource Growth (Normal):**
- Wave 1: 184 dharma
- Wave 5: 681 dharma (+497)
- Wave 10: 1,904 dharma (+1,223)
- Wave 15: 4,520 dharma (+2,616)
- Wave 20: 10,406 dharma (+5,886)

**Issue:** Exponential resource growth allows unlimited tower spam and upgrades. Late-game strategy becomes trivial.

**Target:** Moderate, linear resource growth. Final resources should be 2,000-3,000 dharma.

### 3. Upgrade ROI Too High
**Problem:** Tower upgrades provide massive power spikes with minimal cost.

**Current Upgrade Scaling:**
- Damage: +40% per level
- Range: +15% per level  
- Fire Rate: +15% faster per level
- Cost Multiplier: 1.8x per level

**Example - Firewall Lv1 → Lv5:**
- Lv1 DPS: 35
- Lv5 DPS: 35 × (1 + 4 × 0.4) = 91 (+160% DPS!)
- Total Upgrade Cost: ~300 dharma

**Issue:** Each upgrade nearly doubles effectiveness. A single maxed tower > 3 base towers.

**Target:** +25-30% DPS per level, 2.0x cost multiplier for diminishing returns.

### 4. Wave Difficulty Curve
**Problem:** Insufficient HP scaling in mid-late waves.

**Current Enemy HP Growth (Normal):**
- Wave 1: 40 HP (Script Kiddie)
- Wave 5: 600 HP (Raid Team boss)
- Wave 10: ~130 HP (AI Surveillance with multipliers)
- Wave 15: ~217 HP (Quantum Hacker with multipliers)
- Wave 20: ~340 HP (Corrupted Monk with multipliers)

**Issue:** Linear HP growth cannot keep pace with exponential tower DPS from upgrades.

**Target:** Exponential HP curve: HP(wave) = HP₀ × (1 + 0.18)^(wave-1)

## Recommended Balance Changes

### Priority 1: Reduce Base Tower Damage
Reduce all tower base damage by **25-30%**:
- Firewall: 35 → 26 damage
- Encryption: 65 → 48 damage
- Mirror: 75 → 56 damage
- Anonymity: 45 → 34 damage
- Distributor: 55 → 41 damage

### Priority 2: Increase Enemy HP (Especially Early Game)
Increase base HP by **40-50%**:
- Script Kiddie: 40 → 60 HP
- Federal Agent: 75 → 110 HP
- Corporate Saboteur: 65 → 95 HP
- AI Surveillance: 110 → 160 HP
- Quantum Hacker: 145 → 215 HP
- Corrupted Monk: 180 → 270 HP

### Priority 3: Nerf Economy
- Reduce wave clear bonus multiplier: 12 → 8 dharma per wave
- Reduce kill bounties by 15-20%
- Reduce starting cash: 150 → 120 dharma

### Priority 4: Adjust Upgrade Scaling
- Reduce damage per level: 40% → 30%
- Increase upgrade cost multiplier: 1.8 → 2.1
- Reduce fire rate bonus: 15% → 10% per level

### Priority 5: Steeper Wave HP Multipliers
Update wave configs with more aggressive HP multipliers:
- Waves 1-5: 1.0 → 1.15 scaling
- Waves 6-10: 1.15 → 1.4 scaling
- Waves 11-15: 1.4 → 1.7 scaling
- Waves 16-20: 1.7 → 2.2 scaling

## DPS & TTK Analysis

### Before Balance Changes

| Tower | Level | DPS | vs Script Kiddie TTK | vs Fed Agent TTK | vs Quantum Hacker TTK |
|-------|-------|-----|----------------------|------------------|------------------------|
| Firewall | 1 | 35.0 | 1.14s | 2.14s | 4.14s |
| Firewall | 5 | 91.0 | 0.44s | 0.82s | 1.59s |
| Encryption | 1 | 43.3 | 0.92s | 1.73s | 3.35s |
| Mirror | 1 | 37.5 | 1.07s | 2.00s | 3.87s |
| Distributor | 1 | 68.8 | 0.58s | 1.09s | 2.11s |

### After Proposed Changes

| Tower | Level | DPS | vs Script Kiddie TTK | vs Fed Agent TTK | vs Quantum Hacker TTK |
|-------|-------|-----|----------------------|------------------|------------------------|
| Firewall | 1 | 26.0 | 2.31s ✓ | 4.23s ✓ | 8.27s |
| Firewall | 5 | 55.9 | 1.07s | 1.97s | 3.85s |
| Encryption | 1 | 32.0 | 1.88s ✓ | 3.44s ✓ | 6.72s |
| Mirror | 1 | 28.0 | 2.14s ✓ | 3.93s ✓ | 7.68s |
| Distributor | 1 | 51.3 | 1.17s | 2.14s | 4.19s |

✓ = Within target TTK range (1.5-2.5s early, 3-5s mid, 5-8s late)

## Expected Win Rate After Changes

Based on simulation results and proposed changes:
- **Normal Difficulty:** 65-75% win rate (down from 100%)
- **Hard Difficulty:** 45-60% win rate (down from 100%)
- **Easy Difficulty:** 85-95% win rate (new)

**Target Metrics:**
- Average leaks per successful run: 3-7
- Average waves completed on loss: 12-16
- Resources at Wave 10: 800-1,200 dharma
- Resources at Wave 20: 2,000-3,500 dharma

## Next Steps

1. ✅ Implement recommended balance changes in `design/balance.json`
2. ⏳ Refactor game code to load from `balance.json`
3. ⏳ Run 50+ simulation runs to validate changes
4. ⏳ Manual playtesting for feel and engagement
5. ⏳ A/B test with original balance for comparison

## Simulation Commands

```bash
# Run baseline simulation
npm run sim:normal

# Run hard difficulty
npm run sim:hard

# Run balance tuner
npm run tune

# Run custom simulation
node tools/sim/run.ts Normal --seed=42 --waves=1-20
```

## Files Generated

- `design/balance.json` - Tuned balance configuration
- `tools/sim/out/*.json` - Simulation run results
- `BALANCE_MAP.md` - Parameter documentation

---

**Report Generated:** December 5, 2024  
**Simulation Engine:** v1.0.0  
**Balance Version:** 1.0.0
