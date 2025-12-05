// Balance data loader - loads and applies balance configuration
export class BalanceLoader {
    constructor() {
        this.balance = null;
        this.loaded = false;
    }

    async load() {
        try {
            const response = await fetch('/design/balance.json');
            if (!response.ok) {
                throw new Error(`Failed to load balance config: ${response.statusText}`);
            }
            this.balance = await response.json();
            this.loaded = true;
            console.log('Balance configuration loaded:', this.balance.version);
            return this.balance;
        } catch (error) {
            console.error('Error loading balance configuration:', error);
            // Fall back to hardcoded defaults if balance.json fails to load
            return this.getDefaultBalance();
        }
    }

    getDefaultBalance() {
        // Minimal fallback - the game should use balance.json
        return {
            version: "1.0.0-fallback",
            towers: {},
            enemies: {},
            bosses: {},
            waves: [],
            economy: {
                startCash: 130,
                startBandwidth: 60,
                startAnonymity: 100,
                initialLives: 20
            },
            difficulty: {
                Normal: { hpMult: 1.0, speedMult: 1.0, bountyMult: 1.0 }
            }
        };
    }

    // Convert balance.json format to legacy CONFIG format for compatibility
    toLegacyConfig() {
        if (!this.balance) return null;

        const legacyConfig = {
            INITIAL_DHARMA: this.balance.economy.startCash,
            INITIAL_BANDWIDTH: this.balance.economy.startBandwidth,
            INITIAL_ANONYMITY: this.balance.economy.startAnonymity,
            INITIAL_LIVES: this.balance.economy.initialLives,
            WAVE_DELAY: this.balance.balance?.waveDelayMs || 5000,
            ENEMY_SPAWN_DELAY: this.balance.balance?.enemySpawnDelayMs || 1000,
            MAX_WAVES: this.balance.waves.length,
            DEFENSE_TYPES: {},
            ENEMY_TYPES: {},
            BOSS_TYPES: {}
        };

        // Convert towers
        for (const [id, tower] of Object.entries(this.balance.towers)) {
            legacyConfig.DEFENSE_TYPES[id] = {
                name: tower.name,
                description: tower.description,
                icon: tower.icon,
                cost: tower.cost,
                damage: tower.baseDamage,
                range: tower.range,
                fireRate: 1000 / tower.ratePerSec, // Convert rate/sec to milliseconds
                color: tower.color,
                projectileSpeed: tower.projectileSpeed,
                special: tower.special
            };
        }

        // Convert enemies
        for (const [id, enemy] of Object.entries(this.balance.enemies)) {
            legacyConfig.ENEMY_TYPES[id] = {
                name: enemy.name,
                description: enemy.description,
                icon: enemy.icon,
                health: enemy.baseHP,
                speed: enemy.moveSpeed,
                reward: enemy.bounty,
                color: enemy.color,
                size: enemy.size,
                special: enemy.special
            };
        }

        // Convert bosses
        for (const [id, boss] of Object.entries(this.balance.bosses)) {
            legacyConfig.BOSS_TYPES[id] = {
                name: boss.name,
                description: boss.description,
                icon: boss.icon,
                health: boss.baseHP,
                speed: boss.moveSpeed,
                reward: boss.bounty,
                color: boss.color,
                size: boss.size,
                phases: boss.phases,
                special: boss.special
            };
        }

        return legacyConfig;
    }
}

// Global balance loader instance
export const balanceLoader = new BalanceLoader();
