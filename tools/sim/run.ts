#!/usr/bin/env node

/**
 * Deterministic headless tower defense simulator
 * Simulates game runs without graphics for balance testing
 */

const fs = require('fs');
const path = require('path');

// Load balance configuration
const balanceConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../design/balance.json'), 'utf8')
);

class SimulatedTower {
    constructor(type, config, x, y) {
        this.type = type;
        this.config = config;
        this.x = x;
        this.y = y;
        this.level = 1;
        this.lastFireTime = 0;
        this.kills = 0;
        this.damageDealt = 0;
    }

    getDamage() {
        const upgradeConfig = balanceConfig.upgrades;
        return this.config.baseDamage * (1 + (this.level - 1) * upgradeConfig.damagePerLevel);
    }

    getRange() {
        const upgradeConfig = balanceConfig.upgrades;
        return this.config.range * (1 + (this.level - 1) * upgradeConfig.rangePerLevel);
    }

    getFireRate() {
        const upgradeConfig = balanceConfig.upgrades;
        return this.config.ratePerSec * (1 + (this.level - 1) * upgradeConfig.fireRatePerLevel);
    }

    canFire(currentTime) {
        const fireRateMs = 1000 / this.getFireRate();
        return currentTime - this.lastFireTime >= fireRateMs;
    }

    findTarget(enemies) {
        let bestTarget = null;
        let bestProgress = -1;
        const range = this.getRange();

        for (const enemy of enemies) {
            if (enemy.isDead) continue;
            
            const dist = Math.sqrt(
                Math.pow(enemy.x - this.x, 2) + 
                Math.pow(enemy.y - this.y, 2)
            );

            if (dist <= range && enemy.progress > bestProgress) {
                bestProgress = enemy.progress;
                bestTarget = enemy;
            }
        }

        return bestTarget;
    }

    fire(target, currentTime) {
        if (!target || target.isDead) return false;

        const damage = this.getDamage();
        const resistMult = target.config.resists?.physical || 1.0;
        const armor = target.config.armor || 0;
        
        const effectiveDamage = Math.max(0, damage * resistMult - armor);
        
        target.takeDamage(effectiveDamage);
        this.damageDealt += effectiveDamage;
        this.lastFireTime = currentTime;

        if (target.isDead) {
            this.kills++;
        }

        return true;
    }

    upgrade() {
        const upgradeConfig = balanceConfig.upgrades;
        if (this.level < upgradeConfig.maxLevel) {
            this.level++;
            return true;
        }
        return false;
    }

    getUpgradeCost() {
        const upgradeConfig = balanceConfig.upgrades;
        return this.config.cost.dharma * Math.pow(upgradeConfig.costMultiplierPerLevel, this.level);
    }
}

class SimulatedEnemy {
    constructor(type, config, wave, difficulty) {
        this.type = type;
        this.config = config;
        this.wave = wave;
        
        // Apply difficulty modifiers
        const diffMod = difficulty || { hpMult: 1.0, speedMult: 1.0 };
        this.maxHealth = config.baseHP * diffMod.hpMult;
        this.health = this.maxHealth;
        this.speed = config.moveSpeed * diffMod.speedMult;
        this.bounty = { ...config.bounty };
        
        // Apply wave-specific HP multiplier if provided
        if (wave && wave.hpMult) {
            this.maxHealth *= wave.hpMult;
            this.health = this.maxHealth;
        }

        this.x = 0;
        this.y = 400; // Middle of a theoretical 800px tall map
        this.progress = 0;
        this.isDead = false;
        this.reachedEnd = false;
    }

    update(deltaTime) {
        if (this.isDead || this.reachedEnd) return;

        // Simple linear movement along path
        const moveDistance = (this.speed * deltaTime) / 1000;
        this.x += moveDistance;
        this.progress = Math.min(1.0, this.x / 1200); // Assuming 1200px wide map

        if (this.progress >= 1.0) {
            this.reachedEnd = true;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        }
    }
}

class TowerDefenseSimulator {
    constructor(difficulty = 'Normal', seed = 12345) {
        this.difficulty = balanceConfig.difficulty[difficulty];
        this.difficultyName = difficulty;
        this.seed = seed;
        this.rng = this.createSeededRNG(seed);
        
        this.towers = [];
        this.enemies = [];
        this.currentWave = 0;
        this.resources = {
            dharma: balanceConfig.economy.startCash,
            bandwidth: balanceConfig.economy.startBandwidth,
            anonymity: balanceConfig.economy.startAnonymity
        };
        this.lives = balanceConfig.economy.initialLives;
        this.time = 0;
        
        this.stats = {
            totalDamage: 0,
            totalKills: 0,
            totalLeaks: 0,
            wavesCompleted: 0,
            resourceHistory: [],
            waveResults: []
        };
    }

    createSeededRNG(seed) {
        let state = seed;
        return () => {
            state = (state * 1103515245 + 12345) & 0x7fffffff;
            return state / 0x7fffffff;
        };
    }

    placeTower(type, x, y) {
        const config = balanceConfig.towers[type];
        if (!config) {
            console.error(`Unknown tower type: ${type}`);
            return false;
        }

        if (this.resources.dharma < config.cost.dharma) {
            return false; // Can't afford
        }

        const tower = new SimulatedTower(type, config, x, y);
        this.towers.push(tower);
        
        this.resources.dharma -= config.cost.dharma;
        this.resources.bandwidth -= config.cost.bandwidth || 0;
        this.resources.anonymity -= config.cost.anonymity || 0;
        
        return true;
    }

    upgradeTower(towerIndex) {
        const tower = this.towers[towerIndex];
        if (!tower) return false;

        const cost = tower.getUpgradeCost();
        if (this.resources.dharma < cost) return false;

        if (tower.upgrade()) {
            this.resources.dharma -= cost;
            return true;
        }
        return false;
    }

    spawnWave(waveNumber) {
        if (waveNumber < 1 || waveNumber > balanceConfig.waves.length) {
            return false;
        }

        this.currentWave = waveNumber;
        const waveConfig = balanceConfig.waves[waveNumber - 1];
        
        for (const enemyGroup of waveConfig.enemies) {
            const enemyType = enemyGroup.id;
            const config = balanceConfig.enemies[enemyType] || balanceConfig.bosses[enemyType];
            
            if (!config) {
                console.error(`Unknown enemy type: ${enemyType}`);
                continue;
            }

            for (let i = 0; i < enemyGroup.count; i++) {
                const enemy = new SimulatedEnemy(
                    enemyType,
                    config,
                    enemyGroup,
                    this.difficulty
                );
                
                // Stagger spawn times
                enemy.spawnDelay = i * enemyGroup.interval;
                this.enemies.push(enemy);
            }
        }

        return true;
    }

    update(deltaTime) {
        this.time += deltaTime;

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Check spawn delay
            if (enemy.spawnDelay > 0) {
                enemy.spawnDelay -= deltaTime;
                continue;
            }

            enemy.update(deltaTime);

            // Check if enemy reached end
            if (enemy.reachedEnd && !enemy.isDead) {
                this.lives--;
                this.stats.totalLeaks++;
                this.enemies.splice(i, 1);
            } else if (enemy.isDead) {
                // Grant bounty
                this.resources.dharma += enemy.bounty.dharma || 0;
                this.resources.bandwidth += enemy.bounty.bandwidth || 0;
                this.resources.anonymity += enemy.bounty.anonymity || 0;
                this.stats.totalKills++;
                this.enemies.splice(i, 1);
            }
        }

        // Update towers
        for (const tower of this.towers) {
            if (tower.canFire(this.time)) {
                const target = tower.findTarget(this.enemies);
                if (target) {
                    tower.fire(target, this.time);
                }
            }
        }
    }

    isWaveComplete() {
        // Check if all enemies are dead, reached end, or not yet spawned
        return this.enemies.every(e => e.isDead || e.reachedEnd || e.spawnDelay > 0);
    }

    completeWave() {
        const waveConfig = balanceConfig.waves[this.currentWave - 1];
        const bonus = balanceConfig.economy.waveClearBonus + 
                     (this.currentWave * balanceConfig.economy.waveClearBonusPerWave) +
                     (waveConfig.rewardBonus || 0);
        
        this.resources.dharma += bonus;
        this.stats.wavesCompleted++;
        
        // Record wave results
        this.stats.waveResults.push({
            wave: this.currentWave,
            leaks: this.stats.totalLeaks,
            kills: this.stats.totalKills,
            resources: { ...this.resources },
            lives: this.lives,
            towerCount: this.towers.length,
            totalDPS: this.towers.reduce((sum, t) => sum + (t.damageDealt / (this.time / 1000)), 0)
        });

        // Clear enemies
        this.enemies = [];
    }

    executeCompetentStrategy() {
        // Wave 1: Place 2 firewalls
        if (this.currentWave === 1 && this.towers.length === 0) {
            this.placeTower('firewall', 300, 400);
            this.placeTower('firewall', 500, 400);
        }
        
        // Wave 2: Place encryption if we can afford it
        if (this.currentWave === 2 && this.resources.dharma >= 50) {
            this.placeTower('encryption', 400, 300);
        }

        // Wave 3: Upgrade first tower or place another
        if (this.currentWave === 3) {
            if (this.towers.length > 0 && this.resources.dharma >= this.towers[0].getUpgradeCost()) {
                this.upgradeTower(0);
            } else if (this.resources.dharma >= 30) {
                this.placeTower('firewall', 600, 400);
            }
        }

        // Wave 5 (boss): Place mirror if affordable
        if (this.currentWave === 5 && this.resources.dharma >= 75) {
            this.placeTower('mirror', 700, 400);
        }

        // Mid game: Focus on upgrades
        if (this.currentWave >= 6 && this.currentWave <= 12) {
            for (let i = 0; i < this.towers.length; i++) {
                if (this.resources.dharma >= this.towers[i].getUpgradeCost() * 1.5) {
                    this.upgradeTower(i);
                    break;
                }
            }
        }

        // Late game: Place distributor or anonymity
        if (this.currentWave >= 10 && this.resources.dharma >= 100 && this.towers.length < 8) {
            if (this.resources.dharma >= 100) {
                this.placeTower('distributor', 800, 400);
            } else if (this.resources.dharma >= 60) {
                this.placeTower('anonymity', 750, 350);
            }
        }

        // Very late game: More upgrades
        if (this.currentWave >= 15) {
            for (let i = 0; i < this.towers.length; i++) {
                const tower = this.towers[i];
                if (tower.level < 5 && this.resources.dharma >= tower.getUpgradeCost()) {
                    this.upgradeTower(i);
                    break;
                }
            }
        }
    }

    runWave(waveNumber, maxTime = 120000) {
        this.spawnWave(waveNumber);
        this.executeCompetentStrategy();
        
        const startTime = this.time;
        const timeStep = 100; // 100ms steps

        while (this.time - startTime < maxTime) {
            this.update(timeStep);
            
            if (this.isWaveComplete()) {
                this.completeWave();
                return true;
            }

            if (this.lives <= 0) {
                return false; // Game over
            }
        }

        // Timeout
        return false;
    }

    runSimulation(startWave = 1, endWave = 20) {
        console.log(`\n=== Starting Simulation: ${this.difficultyName} Difficulty ===`);
        console.log(`Seed: ${this.seed}`);
        console.log(`Waves: ${startWave} to ${endWave}\n`);

        for (let wave = startWave; wave <= endWave; wave++) {
            if (this.lives <= 0) {
                console.log(`\n--- GAME OVER at Wave ${wave} ---`);
                break;
            }

            const success = this.runWave(wave);
            
            console.log(`Wave ${wave}: ${success ? 'CLEARED' : 'FAILED'} | Lives: ${this.lives} | Resources: ${this.resources.dharma} | Towers: ${this.towers.length} | Leaks: ${this.stats.totalLeaks}`);

            if (!success) {
                break;
            }
        }

        return this.generateReport();
    }

    generateReport() {
        const report = {
            difficulty: this.difficultyName,
            seed: this.seed,
            result: this.lives > 0 ? 'VICTORY' : 'DEFEAT',
            wavesCompleted: this.stats.wavesCompleted,
            totalLeaks: this.stats.totalLeaks,
            totalKills: this.stats.totalKills,
            finalLives: this.lives,
            finalResources: { ...this.resources },
            towersBuilt: this.towers.length,
            averageDPS: this.towers.reduce((sum, t) => sum + (t.damageDealt / (this.time / 1000)), 0),
            waveResults: this.stats.waveResults,
            towerBreakdown: this.towers.map(t => ({
                type: t.type,
                level: t.level,
                kills: t.kills,
                damageDealt: t.damageDealt
            }))
        };

        return report;
    }
}

// CLI Interface
function main() {
    const args = process.argv.slice(2);
    const difficulty = args.find(a => ['Easy', 'Normal', 'Hard'].includes(a)) || 'Normal';
    const seedArg = args.find(a => a.startsWith('--seed='));
    const seed = seedArg ? parseInt(seedArg.split('=')[1]) : 1337;
    const wavesArg = args.find(a => a.startsWith('--waves='));
    const [startWave, endWave] = wavesArg ? wavesArg.split('=')[1].split('-').map(Number) : [1, 20];

    const sim = new TowerDefenseSimulator(difficulty, seed);
    const report = sim.runSimulation(startWave, endWave);

    // Output results
    console.log('\n=== SIMULATION COMPLETE ===');
    console.log(JSON.stringify(report, null, 2));

    // Save to file
    const outputDir = path.join(__dirname, 'out');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, `sim_${difficulty}_${seed}_${Date.now()}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
    console.log(`\nReport saved to: ${outputFile}`);

    // Exit with appropriate code
    process.exit(report.result === 'VICTORY' ? 0 : 1);
}

if (require.main === module) {
    main();
}

module.exports = { TowerDefenseSimulator, SimulatedTower, SimulatedEnemy };
