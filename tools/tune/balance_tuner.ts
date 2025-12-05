#!/usr/bin/env node

/**
 * Balance tuner - Grid search optimization for game balance parameters
 */

const fs = require('fs');
const path = require('path');
const { TowerDefenseSimulator } = require('../sim/run.ts');

// Load balance configuration
const balanceConfigPath = path.join(__dirname, '../../design/balance.json');
const originalBalance = JSON.parse(fs.readFileSync(balanceConfigPath, 'utf8'));

class BalanceTuner {
    constructor(options = {}) {
        this.options = {
            targetWinRate: options.targetWinRate || 0.68,
            targetLeaksPerRun: options.targetLeaksPerRun || 5,
            runsPerConfig: options.runsPerConfig || 10,
            maxCandidates: options.maxCandidates || 20,
            ...options
        };
        
        this.results = [];
        this.bestConfig = null;
        this.bestFitness = Infinity;
    }

    /**
     * Calculate fitness score for a simulation result
     * Lower is better
     */
    calculateFitness(results) {
        const winRate = results.filter(r => r.result === 'VICTORY').length / results.length;
        const avgLeaks = results.reduce((sum, r) => sum + r.totalLeaks, 0) / results.length;
        const avgWavesCompleted = results.reduce((sum, r) => sum + r.wavesCompleted, 0) / results.length;
        
        // Check for economy starvation (not enough resources)
        const avgFinalResources = results.reduce((sum, r) => sum + r.finalResources.dharma, 0) / results.length;
        const starvationPenalty = avgFinalResources < 50 ? (50 - avgFinalResources) * 2 : 0;
        
        // Check for economy snowballing (too many resources)
        const snowballPenalty = avgFinalResources > 500 ? (avgFinalResources - 500) * 0.5 : 0;
        
        // Primary fitness: distance from target win rate
        const winRatePenalty = Math.abs(winRate - this.options.targetWinRate) * 1000;
        
        // Leak penalty
        const leakPenalty = Math.abs(avgLeaks - this.options.targetLeaksPerRun) * 50;
        
        // Wave completion penalty (want to get far even in losses)
        const waveCompletionPenalty = Math.max(0, 15 - avgWavesCompleted) * 20;
        
        const totalFitness = winRatePenalty + leakPenalty + starvationPenalty + snowballPenalty + waveCompletionPenalty;
        
        return {
            fitness: totalFitness,
            winRate,
            avgLeaks,
            avgWavesCompleted,
            avgFinalResources,
            starvationPenalty,
            snowballPenalty
        };
    }

    /**
     * Run simulations with a specific balance configuration
     */
    async testConfiguration(config, label = 'test') {
        // Temporarily write config
        const tempConfigPath = path.join(__dirname, 'temp_balance.json');
        fs.writeFileSync(tempConfigPath, JSON.stringify(config, null, 2));
        
        const results = [];
        
        // Run multiple simulations with different seeds
        for (let i = 0; i < this.options.runsPerConfig; i++) {
            const seed = 1000 + i;
            const sim = new TowerDefenseSimulator('Normal', seed);
            
            // Monkey-patch the balance config
            Object.assign(sim, { balanceConfig: config });
            
            const result = sim.runSimulation(1, 20);
            results.push(result);
        }
        
        // Clean up temp file
        if (fs.existsSync(tempConfigPath)) {
            fs.unlinkSync(tempConfigPath);
        }
        
        const fitness = this.calculateFitness(results);
        
        return {
            label,
            config,
            results,
            fitness
        };
    }

    /**
     * Generate parameter variations for grid search
     */
    generateParameterGrid() {
        const variations = [];
        
        // Vary key tower parameters
        const damageMultipliers = [0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15];
        const rateMultipliers = [0.9, 0.95, 1.0, 1.05, 1.1];
        
        // Vary key enemy parameters
        const hpMultipliers = [0.85, 0.9, 0.95, 1.0, 1.05, 1.1];
        const speedMultipliers = [0.95, 1.0, 1.05];
        
        // Vary economy
        const bountyMultipliers = [0.9, 0.95, 1.0, 1.05, 1.1];
        
        // Sample combinations (limited to avoid explosion)
        let configCount = 0;
        const maxConfigs = this.options.maxCandidates;
        
        for (const damageMult of [0.9, 1.0, 1.1]) {
            for (const rateMult of [0.95, 1.0, 1.05]) {
                for (const hpMult of [0.9, 1.0, 1.1]) {
                    for (const bountyMult of [0.95, 1.0, 1.05]) {
                        if (configCount >= maxConfigs) break;
                        
                        const config = JSON.parse(JSON.stringify(originalBalance));
                        
                        // Apply tower modifications
                        for (const tower of Object.values(config.towers)) {
                            tower.baseDamage = Math.round(tower.baseDamage * damageMult);
                            tower.ratePerSec = tower.ratePerSec * rateMult;
                        }
                        
                        // Apply enemy modifications
                        for (const enemy of Object.values(config.enemies)) {
                            enemy.baseHP = Math.round(enemy.baseHP * hpMult);
                            enemy.bounty.dharma = Math.round(enemy.bounty.dharma * bountyMult);
                        }
                        
                        for (const boss of Object.values(config.bosses)) {
                            boss.baseHP = Math.round(boss.baseHP * hpMult);
                            boss.bounty.dharma = Math.round(boss.bounty.dharma * bountyMult);
                        }
                        
                        variations.push({
                            label: `D${damageMult}_R${rateMult}_H${hpMult}_B${bountyMult}`,
                            config,
                            params: { damageMult, rateMult, hpMult, bountyMult }
                        });
                        
                        configCount++;
                    }
                    if (configCount >= maxConfigs) break;
                }
                if (configCount >= maxConfigs) break;
            }
            if (configCount >= maxConfigs) break;
        }
        
        return variations;
    }

    /**
     * Run the tuning process
     */
    async tune() {
        console.log('\n=== Starting Balance Tuning ===');
        console.log(`Target Win Rate: ${this.options.targetWinRate * 100}%`);
        console.log(`Target Leaks: ${this.options.targetLeaksPerRun} per run`);
        console.log(`Runs per config: ${this.options.runsPerConfig}`);
        console.log(`Max candidates: ${this.options.maxCandidates}\n`);

        // Test baseline
        console.log('Testing baseline configuration...');
        const baseline = await this.testConfiguration(originalBalance, 'baseline');
        this.results.push(baseline);
        this.bestConfig = baseline;
        this.bestFitness = baseline.fitness.fitness;

        console.log(`Baseline - Win Rate: ${(baseline.fitness.winRate * 100).toFixed(1)}%, Avg Leaks: ${baseline.fitness.avgLeaks.toFixed(1)}, Fitness: ${baseline.fitness.fitness.toFixed(2)}\n`);

        // Generate and test variations
        const variations = this.generateParameterGrid();
        console.log(`Testing ${variations.length} parameter variations...`);

        for (let i = 0; i < variations.length; i++) {
            const variation = variations[i];
            console.log(`\n[${i + 1}/${variations.length}] Testing ${variation.label}...`);
            
            const result = await this.testConfiguration(variation.config, variation.label);
            this.results.push(result);
            
            console.log(`Win Rate: ${(result.fitness.winRate * 100).toFixed(1)}%, Avg Leaks: ${result.fitness.avgLeaks.toFixed(1)}, Fitness: ${result.fitness.fitness.toFixed(2)}`);
            
            if (result.fitness.fitness < this.bestFitness) {
                this.bestFitness = result.fitness.fitness;
                this.bestConfig = result;
                console.log(`*** NEW BEST CONFIG ***`);
            }
        }

        return this.generateReport();
    }

    /**
     * Generate tuning report
     */
    generateReport() {
        // Sort results by fitness
        const sorted = [...this.results].sort((a, b) => a.fitness.fitness - b.fitness.fitness);
        
        const report = {
            timestamp: new Date().toISOString(),
            options: this.options,
            totalConfigurations: this.results.length,
            bestConfiguration: {
                label: this.bestConfig.label,
                fitness: this.bestConfig.fitness,
                params: this.bestConfig.config
            },
            top10: sorted.slice(0, 10).map(r => ({
                label: r.label,
                fitness: r.fitness,
                winRate: r.fitness.winRate,
                avgLeaks: r.fitness.avgLeaks,
                avgWavesCompleted: r.fitness.avgWavesCompleted
            })),
            baseline: this.results.find(r => r.label === 'baseline')?.fitness || null
        };

        return report;
    }

    /**
     * Save best configuration to file
     */
    saveBestConfig(outputPath) {
        if (!this.bestConfig) {
            console.error('No best configuration found');
            return;
        }

        fs.writeFileSync(
            outputPath,
            JSON.stringify(this.bestConfig.config, null, 2)
        );
        console.log(`\nBest configuration saved to: ${outputPath}`);
    }
}

// CLI Interface
async function main() {
    const tuner = new BalanceTuner({
        targetWinRate: 0.68,
        targetLeaksPerRun: 5,
        runsPerConfig: 5, // Reduced for faster tuning
        maxCandidates: 15 // Limited for practical runtime
    });

    const report = await tuner.tune();

    // Output report
    console.log('\n\n=== TUNING COMPLETE ===');
    console.log('\nTop 10 Configurations:');
    report.top10.forEach((config, i) => {
        console.log(`${i + 1}. ${config.label} - Win: ${(config.winRate * 100).toFixed(1)}%, Leaks: ${config.avgLeaks.toFixed(1)}, Fitness: ${config.fitness.toFixed(2)}`);
    });

    // Save results
    const outputDir = path.join(__dirname, '../../design');
    const candidatesPath = path.join(outputDir, 'balance_candidates.json');
    const bestConfigPath = path.join(outputDir, 'balance_tuned.json');

    fs.writeFileSync(candidatesPath, JSON.stringify(report, null, 2));
    console.log(`\nFull report saved to: ${candidatesPath}`);

    tuner.saveBestConfig(bestConfigPath);

    // Generate markdown report
    generateMarkdownReport(report);
}

function generateMarkdownReport(report) {
    const md = `# Balance Tuning Report

## Summary

**Date:** ${new Date(report.timestamp).toLocaleString()}  
**Configurations Tested:** ${report.totalConfigurations}  
**Target Win Rate:** ${(report.options.targetWinRate * 100).toFixed(1)}%  
**Target Leaks per Run:** ${report.options.targetLeaksPerRun}

## Best Configuration

**Label:** ${report.bestConfiguration.label}  
**Win Rate:** ${(report.bestConfiguration.fitness.winRate * 100).toFixed(1)}%  
**Average Leaks:** ${report.bestConfiguration.fitness.avgLeaks.toFixed(1)}  
**Average Waves Completed:** ${report.bestConfiguration.fitness.avgWavesCompleted.toFixed(1)}  
**Fitness Score:** ${report.bestConfiguration.fitness.fitness.toFixed(2)}

## Baseline vs Best

| Metric | Baseline | Best | Δ |
|--------|----------|------|---|
| Win Rate | ${(report.baseline.winRate * 100).toFixed(1)}% | ${(report.bestConfiguration.fitness.winRate * 100).toFixed(1)}% | ${((report.bestConfiguration.fitness.winRate - report.baseline.winRate) * 100).toFixed(1)}% |
| Avg Leaks | ${report.baseline.avgLeaks.toFixed(1)} | ${report.bestConfiguration.fitness.avgLeaks.toFixed(1)} | ${(report.bestConfiguration.fitness.avgLeaks - report.baseline.avgLeaks).toFixed(1)} |
| Avg Waves | ${report.baseline.avgWavesCompleted.toFixed(1)} | ${report.bestConfiguration.fitness.avgWavesCompleted.toFixed(1)} | ${(report.bestConfiguration.fitness.avgWavesCompleted - report.baseline.avgWavesCompleted).toFixed(1)} |

## Top 10 Configurations

| Rank | Label | Win Rate | Avg Leaks | Avg Waves | Fitness |
|------|-------|----------|-----------|-----------|---------|
${report.top10.map((c, i) => `| ${i + 1} | ${c.label} | ${(c.winRate * 100).toFixed(1)}% | ${c.avgLeaks.toFixed(1)} | ${c.avgWavesCompleted.toFixed(1)} | ${c.fitness.toFixed(2)} |`).join('\n')}

## Recommendations

1. Apply the best configuration to \`design/balance.json\`
2. Run additional simulations with different strategies
3. Playtest to validate automated results
4. Consider A/B testing between top configurations

## Files Generated

- \`design/balance_candidates.json\` - Full tuning results
- \`design/balance_tuned.json\` - Best configuration
- \`design/BALANCE_REPORT.md\` - This report
`;

    const reportPath = path.join(__dirname, '../../design/BALANCE_REPORT.md');
    fs.writeFileSync(reportPath, md);
    console.log(`\nMarkdown report saved to: ${reportPath}`);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { BalanceTuner };
