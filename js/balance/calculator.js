// Balance calculation helpers for DPS, TTK, and effective damage
export class BalanceCalculator {
    /**
     * Calculate rate per second from cooldown in milliseconds
     * @param {number} cooldownMs - Cooldown in milliseconds
     * @returns {number} Rate per second
     */
    static cooldownToRate(cooldownMs) {
        if (cooldownMs <= 0) return 0;
        return 1000 / cooldownMs;
    }

    /**
     * Calculate cooldown from rate per second
     * @param {number} ratePerSec - Rate per second
     * @returns {number} Cooldown in milliseconds
     */
    static rateToCooldown(ratePerSec) {
        if (ratePerSec <= 0) return Infinity;
        return 1000 / ratePerSec;
    }

    /**
     * Calculate effective damage after resistances and armor
     * @param {number} baseDamage - Base damage of the attack
     * @param {number} resistMult - Resistance multiplier (0-1, where 1 = no resistance)
     * @param {number} armor - Target's armor value
     * @param {number} armorPen - Attacker's armor penetration (default 0)
     * @returns {number} Effective damage dealt
     */
    static effectiveDamage(baseDamage, resistMult = 1.0, armor = 0, armorPen = 0) {
        // Clamp resist multiplier to valid range
        resistMult = Math.max(0, Math.min(1, resistMult));
        
        // Calculate damage after resistance
        const damageAfterResist = baseDamage * resistMult;
        
        // Calculate effective armor (can't be negative)
        const effectiveArmor = Math.max(0, armor - armorPen);
        
        // Final damage is resist-reduced damage minus armor
        return Math.max(0, damageAfterResist - effectiveArmor);
    }

    /**
     * Calculate DPS (Damage Per Second)
     * @param {number} damage - Damage per hit
     * @param {number} ratePerSec - Attack rate per second
     * @param {Object} options - Additional options
     * @param {number} options.critChance - Critical hit chance (0-1)
     * @param {number} options.critMult - Critical hit multiplier
     * @param {number} options.aoeTargets - Number of targets hit by AOE (default 1)
     * @returns {number} Damage per second
     */
    static calculateDPS(damage, ratePerSec, options = {}) {
        const {
            critChance = 0,
            critMult = 1.0,
            aoeTargets = 1
        } = options;

        // Base DPS
        let dps = damage * ratePerSec;

        // Factor in critical hits (expected value)
        if (critChance > 0 && critMult > 1) {
            const avgDamageMultiplier = (1 - critChance) + (critChance * critMult);
            dps *= avgDamageMultiplier;
        }

        // Factor in AOE
        if (aoeTargets > 1) {
            dps *= aoeTargets;
        }

        return dps;
    }

    /**
     * Calculate Time To Kill (TTK)
     * @param {number} targetHP - Target's health points
     * @param {number} dps - Damage per second
     * @returns {number} Time to kill in seconds (Infinity if dps is 0)
     */
    static calculateTTK(targetHP, dps) {
        if (dps <= 0) return Infinity;
        return targetHP / dps;
    }

    /**
     * Calculate TTK for a specific tower against a specific enemy
     * @param {Object} tower - Tower configuration
     * @param {Object} enemy - Enemy configuration
     * @param {Object} difficulty - Difficulty modifiers
     * @returns {Object} TTK analysis
     */
    static analyzeTowerVsEnemy(tower, enemy, difficulty = { hpMult: 1.0 }) {
        // Calculate effective enemy HP
        const effectiveHP = enemy.baseHP * difficulty.hpMult;

        // Get resistance multiplier (assuming 'physical' damage type for most towers)
        const resistMult = enemy.resists?.physical || 1.0;

        // Calculate effective damage per hit
        const effDamage = this.effectiveDamage(
            tower.baseDamage,
            resistMult,
            enemy.armor || 0,
            0 // No armor pen by default
        );

        // Calculate DPS
        const dps = this.calculateDPS(effDamage, tower.ratePerSec, {
            critChance: tower.critChance || 0,
            critMult: tower.critMult || 1.0,
            aoeTargets: 1
        });

        // Calculate TTK
        const ttk = this.calculateTTK(effectiveHP, dps);

        return {
            effectiveHP,
            effectiveDamage: effDamage,
            dps,
            ttk,
            hitsToKill: Math.ceil(effectiveHP / Math.max(1, effDamage))
        };
    }

    /**
     * Calculate upgrade ROI (Return on Investment)
     * @param {Object} tower - Tower configuration
     * @param {number} currentLevel - Current tower level
     * @param {Object} upgradeConfig - Upgrade configuration
     * @returns {Object} ROI analysis
     */
    static calculateUpgradeROI(tower, currentLevel, upgradeConfig) {
        const {
            costMultiplierPerLevel,
            damagePerLevel,
            rangePerLevel,
            fireRatePerLevel
        } = upgradeConfig;

        // Calculate current stats
        const currentDamage = tower.baseDamage * (1 + currentLevel * damagePerLevel);
        const currentRange = tower.range * (1 + currentLevel * rangePerLevel);
        const currentRate = tower.ratePerSec * (1 + currentLevel * fireRatePerLevel);
        const currentDPS = this.calculateDPS(currentDamage, currentRate);

        // Calculate next level stats
        const nextLevel = currentLevel + 1;
        const nextDamage = tower.baseDamage * (1 + nextLevel * damagePerLevel);
        const nextRange = tower.range * (1 + nextLevel * rangePerLevel);
        const nextRate = tower.ratePerSec * (1 + nextLevel * fireRatePerLevel);
        const nextDPS = this.calculateDPS(nextDamage, nextRate);

        // Calculate upgrade cost
        const upgradeCost = tower.cost.dharma * Math.pow(costMultiplierPerLevel, nextLevel);

        // Calculate DPS gain per cost
        const dpsGain = nextDPS - currentDPS;
        const dpsPerCost = upgradeCost > 0 ? dpsGain / upgradeCost : 0;

        return {
            currentLevel,
            nextLevel,
            currentDPS,
            nextDPS,
            dpsGain,
            dpsGainPercent: (dpsGain / currentDPS) * 100,
            upgradeCost,
            dpsPerCost,
            rangeGain: nextRange - currentRange,
            rangeGainPercent: ((nextRange - currentRange) / currentRange) * 100
        };
    }

    /**
     * Validate balance parameters
     * @param {Object} params - Balance parameters to validate
     * @returns {Array} Array of validation errors (empty if valid)
     */
    static validateBalanceParams(params) {
        const errors = [];

        // Validate tower parameters
        if (params.towers) {
            for (const [towerId, tower] of Object.entries(params.towers)) {
                if (tower.baseDamage < 0) {
                    errors.push(`Tower ${towerId}: baseDamage cannot be negative`);
                }
                if (tower.ratePerSec < 0) {
                    errors.push(`Tower ${towerId}: ratePerSec cannot be negative`);
                }
                if (tower.range <= 0) {
                    errors.push(`Tower ${towerId}: range must be positive`);
                }
                if (tower.projectileSpeed < 0) {
                    errors.push(`Tower ${towerId}: projectileSpeed cannot be negative`);
                }
                if (tower.critChance < 0 || tower.critChance > 1) {
                    errors.push(`Tower ${towerId}: critChance must be between 0 and 1`);
                }
            }
        }

        // Validate enemy parameters
        if (params.enemies) {
            for (const [enemyId, enemy] of Object.entries(params.enemies)) {
                if (enemy.baseHP <= 0) {
                    errors.push(`Enemy ${enemyId}: baseHP must be positive`);
                }
                if (enemy.moveSpeed < 0) {
                    errors.push(`Enemy ${enemyId}: moveSpeed cannot be negative`);
                }
                if (enemy.armor < 0) {
                    errors.push(`Enemy ${enemyId}: armor cannot be negative`);
                }
                
                // Validate resistance multipliers
                if (enemy.resists) {
                    for (const [resistType, resistMult] of Object.entries(enemy.resists)) {
                        if (resistMult < 0 || resistMult > 1) {
                            errors.push(`Enemy ${enemyId}: resist ${resistType} must be between 0 and 1`);
                        }
                    }
                }
            }
        }

        // Validate difficulty parameters
        if (params.difficulty) {
            for (const [diffName, diff] of Object.entries(params.difficulty)) {
                if (diff.hpMult <= 0) {
                    errors.push(`Difficulty ${diffName}: hpMult must be positive`);
                }
                if (diff.speedMult <= 0) {
                    errors.push(`Difficulty ${diffName}: speedMult must be positive`);
                }
                if (diff.bountyMult <= 0) {
                    errors.push(`Difficulty ${diffName}: bountyMult must be positive`);
                }
            }
        }

        return errors;
    }

    /**
     * Calculate wave difficulty scaling
     * @param {number} wave - Wave number
     * @param {Object} balance - Balance configuration
     * @returns {Object} Scaling multipliers for the wave
     */
    static calculateWaveScaling(wave, balance) {
        const { hpGrowthRate, speedGrowthCap } = balance;

        // HP scales exponentially
        const hpMultiplier = Math.pow(1 + hpGrowthRate, wave - 1);

        // Speed scales linearly but capped
        const speedMultiplier = Math.min(
            speedGrowthCap,
            1 + (wave - 1) * 0.05
        );

        return {
            wave,
            hpMultiplier,
            speedMultiplier,
            rewardMultiplier: 1 + (wave - 1) * 0.08
        };
    }

    /**
     * Calculate economy balance for a given wave
     * @param {number} wave - Wave number
     * @param {Object} economy - Economy configuration
     * @param {number} enemiesKilled - Number of enemies killed
     * @returns {Object} Economy analysis
     */
    static calculateEconomyBalance(wave, economy, enemiesKilled) {
        const {
            waveClearBonus,
            waveClearBonusPerWave,
            killIncomeMult
        } = economy;

        // Wave completion bonus
        const waveBonus = waveClearBonus + (wave * waveClearBonusPerWave);

        // Estimated total income for wave
        const estimatedIncome = waveBonus;

        return {
            wave,
            waveBonus,
            estimatedIncome,
            canAffordBasicTower: estimatedIncome >= 30, // Firewall cost
            canAffordMidTower: estimatedIncome >= 60 // Anonymity cost
        };
    }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BalanceCalculator };
}
