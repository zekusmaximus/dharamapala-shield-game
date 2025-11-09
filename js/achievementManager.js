// Achievement Manager - handles achievement tracking and rewards
import { CONFIG } from './config.js';
import { Utils } from './utils.js';

export class AchievementManager {
    constructor(game) {
        this.game = game;
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.progress = new Map();
        this.totalAchievements = 0;
        this.unlockedCount = 0;
        
        // Initialize achievements
        this.initializeAchievements();
        
        // Load saved progress
        this.loadProgress();
    }
    
    async load() {
        console.log('Loading achievements...');
        
        // Achievements are initialized in constructor
        console.log('Achievements loaded successfully');
    }
    
    initializeAchievements() {
        // Combat achievements
        this.registerAchievement('firstBlood', {
            id: 'firstBlood',
            name: 'First Blood',
            description: 'Defeat your first enemy',
            category: 'combat',
            type: 'boolean',
            requirement: 1,
            reward: { dharma: 10, bandwidth: 5, anonymity: 2 },
            icon: '🩸',
            hidden: false
        });
        
        this.registerAchievement('enemySlayer', {
            id: 'enemySlayer',
            name: 'Enemy Slayer',
            description: 'Defeat 100 enemies',
            category: 'combat',
            type: 'count',
            requirement: 100,
            reward: { dharma: 50, bandwidth: 25, anonymity: 10 },
            icon: '⚔️',
            hidden: false
        });
        
        this.registerAchievement('bossHunter', {
            id: 'bossHunter',
            name: 'Boss Hunter',
            description: 'Defeat 5 bosses',
            category: 'combat',
            type: 'count',
            requirement: 5,
            reward: { dharma: 100, bandwidth: 50, anonymity: 25 },
            icon: '👹',
            hidden: false
        });
        
        this.registerAchievement('perfectWave', {
            id: 'perfectWave',
            name: 'Perfect Wave',
            description: 'Complete a wave without taking damage',
            category: 'combat',
            type: 'boolean',
            requirement: 1,
            reward: { dharma: 25, bandwidth: 15, anonymity: 8 },
            icon: '🛡️',
            hidden: false
        });
        
        // Defense achievements
        this.registerAchievement('towerBuilder', {
            id: 'towerBuilder',
            name: 'Tower Builder',
            description: 'Build 50 defenses',
            category: 'defense',
            type: 'count',
            requirement: 50,
            reward: { dharma: 30, bandwidth: 20, anonymity: 10 },
            icon: '🏗️',
            hidden: false
        });
        
        this.registerAchievement('defenseMaster', {
            id: 'defenseMaster',
            name: 'Defense Master',
            description: 'Build one of each defense type',
            category: 'defense',
            type: 'boolean',
            requirement: 1,
            reward: { dharma: 40, bandwidth: 25, anonymity: 15 },
            icon: '🎯',
            hidden: false
        });
        
        this.registerAchievement('upgradeExpert', {
            id: 'upgradeExpert',
            name: 'Upgrade Expert',
            description: 'Upgrade 25 defenses to maximum level',
            category: 'defense',
            type: 'count',
            requirement: 25,
            reward: { dharma: 60, bandwidth: 35, anonymity: 20 },
            icon: '⬆️',
            hidden: false
        });
        
        this.registerAchievement('efficientBuilder', {
            id: 'efficientBuilder',
            name: 'Efficient Builder',
            description: 'Complete a wave using only 5 or fewer defenses',
            category: 'defense',
            type: 'boolean',
            requirement: 1,
            reward: { dharma: 35, bandwidth: 20, anonymity: 12 },
            icon: '💡',
            hidden: false
        });
        
        // Resource achievements
        this.registerAchievement('wealthyMonk', {
            id: 'wealthyMonk',
            name: 'Wealthy Monk',
            description: 'Accumulate 10,000 Dharma',
            category: 'resource',
            type: 'total',
            requirement: 10000,
            reward: { dharma: 100, bandwidth: 50, anonymity: 30 },
            icon: '💰',
            hidden: false
        });
        
        this.registerAchievement('bandwidthKing', {
            id: 'bandwidthKing',
            name: 'Bandwidth King',
            description: 'Accumulate 5,000 Bandwidth',
            category: 'resource',
            type: 'total',
            requirement: 5000,
            reward: { dharma: 50, bandwidth: 100, anonymity: 25 },
            icon: '📡',
            hidden: false
        });
        
        this.registerAchievement('anonymousMaster', {
            id: 'anonymousMaster',
            name: 'Anonymous Master',
            description: 'Accumulate 2,000 Anonymity',
            category: 'resource',
            type: 'total',
            requirement: 2000,
            reward: { dharma: 40, bandwidth: 30, anonymity: 100 },
            icon: '🔒',
            hidden: false
        });
        
        this.registerAchievement('resourceManager', {
            id: 'resourceManager',
            name: 'Resource Manager',
            description: 'Have all three resource types above 1,000 simultaneously',
            category: 'resource',
            type: 'boolean',
            requirement: 1,
            reward: { dharma: 75, bandwidth: 40, anonymity: 35 },
            icon: '📊',
            hidden: false
        });
        
        // Progression achievements
        this.registerAchievement('waveSurvivor', {
            id: 'waveSurvivor',
            name: 'Wave Survivor',
            description: 'Survive 10 waves',
            category: 'progression',
            type: 'count',
            requirement: 10,
            reward: { dharma: 80, bandwidth: 45, anonymity: 25 },
            icon: '🌊',
            hidden: false
        });
        
        this.registerAchievement('enduranceMaster', {
            id: 'enduranceMaster',
            name: 'Endurance Master',
            description: 'Survive 20 waves',
            category: 'progression',
            type: 'count',
            requirement: 20,
            reward: { dharma: 150, bandwidth: 80, anonymity: 50 },
            icon: '🏆',
            hidden: false
        });
        
        this.registerAchievement('speedRunner', {
            id: 'speedRunner',
            name: 'Speed Runner',
            description: 'Complete 10 waves in under 10 minutes',
            category: 'progression',
            type: 'boolean',
            requirement: 1,
            reward: { dharma: 60, bandwidth: 35, anonymity: 20 },
            icon: '⚡',
            hidden: false
        });
        
        this.registerAchievement('perfectionist', {
            id: 'perfectionist',
            name: 'Perfectionist',
            description: 'Complete the game without losing a life',
            category: 'progression',
            type: 'boolean',
            requirement: 1,
            reward: { dharma: 200, bandwidth: 100, anonymity: 75 },
            icon: '⭐',
            hidden: false
        });
        
        // Special achievements
        this.registerAchievement('secretPath', {
            id: 'secretPath',
            name: 'Secret Path',
            description: 'Discover a hidden gameplay mechanic',
            category: 'special',
            type: 'boolean',
            requirement: 1,
            reward: { dharma: 100, bandwidth: 60, anonymity: 40 },
            icon: '🗝️',
            hidden: true
        });
        
        this.registerAchievement('zenMaster', {
            id: 'zenMaster',
            name: 'Zen Master',
            description: 'Reach maximum meditation level',
            category: 'special',
            type: 'boolean',
            requirement: 1,
            reward: { dharma: 300, bandwidth: 150, anonymity: 100 },
            icon: '🧘',
            hidden: true
        });
        
        this.registerAchievement('cyberNinja', {
            id: 'cyberNinja',
            name: 'Cyber Ninja',
            description: 'Complete a wave using only stealth-based defenses',
            category: 'special',
            type: 'boolean',
            requirement: 1,
            reward: { dharma: 120, bandwidth: 70, anonymity: 50 },
            icon: '🥷',
            hidden: true
        });
        
        this.registerAchievement('digitalSavior', {
            id: 'digitalSavior',
            name: 'Digital Savior',
            description: 'Save the digital realm from ultimate corruption',
            category: 'special',
            type: 'boolean',
            requirement: 1,
            reward: { dharma: 500, bandwidth: 250, anonymity: 200 },
            icon: '🌟',
            hidden: true
        });
        
        this.totalAchievements = this.achievements.size;
        this.updateUnlockedCount();
    }
    
    registerAchievement(id, achievement) {
        this.achievements.set(id, achievement);
        this.progress.set(id, 0);
    }
    
    checkAchievement(id, value) {
        const achievement = this.achievements.get(id);
        if (!achievement || this.unlockedAchievements.has(id)) {
            return false;
        }
        
        // Update progress
        this.progress.set(id, value);
        
        // Check if achievement is unlocked
        if (this.isAchievementUnlocked(achievement, value)) {
            this.unlockAchievement(id);
            return true;
        }
        
        return false;
    }
    
    isAchievementUnlocked(achievement, value) {
        switch (achievement.type) {
            case 'count':
                return value >= achievement.requirement;
            case 'total':
                return value >= achievement.requirement;
            case 'boolean':
                return value === true;
            default:
                return false;
        }
    }
    
    unlockAchievement(id) {
        if (this.unlockedAchievements.has(id)) {
            return;
        }
        
        const achievement = this.achievements.get(id);
        if (!achievement) return;
        
        this.unlockedAchievements.add(id);
        this.updateUnlockedCount();
        
        console.log(`Achievement unlocked: ${achievement.name}`);
        
        // Show notification
        this.showAchievementNotification(achievement);
        
        // Play sound
        this.game.audioManager.playSound('achievement');
        
        // Grant rewards
        this.grantAchievementRewards(achievement);
        
        // Save progress
        this.saveProgress();
        
        // Check for meta-achievements
        this.checkMetaAchievements();
    }
    
    grantAchievementRewards(achievement) {
        if (achievement.reward) {
            this.game.addResources(achievement.reward);
            
            // Show reward notification
            const rewardText = Utils.formatResources(achievement.reward);
            this.game.uiManager.showNotification(
                `Rewards: ${rewardText}`,
                'success',
                2000
            );
        }
    }
    
    showAchievementNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-name">🏆 Achievement Unlocked!</div>
                <div class="achievement-title">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 350px;
            transform: translateX(400px);
            transition: transform 0.5s ease;
            border-left: 4px solid #fbbf24;
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, CONFIG.NOTIFICATION_DURATION);
    }
    
    checkMetaAchievements() {
        // Check for achievements based on other achievements
        const unlockedCount = this.unlockedAchievements.size;
        
        // Achievement collector achievements
        if (unlockedCount >= 10) {
            this.checkAchievement('achievementCollector10', 1);
        }
        
        if (unlockedCount >= 25) {
            this.checkAchievement('achievementCollector25', 1);
        }
        
        if (unlockedCount >= this.totalAchievements) {
            this.checkAchievement('completionist', 1);
        }
        
        // Category completion
        const categories = ['combat', 'defense', 'resource', 'progression', 'special'];
        for (const category of categories) {
            const categoryAchievements = this.getAchievementsByCategory(category);
            const categoryUnlocked = categoryAchievements.filter(a => this.unlockedAchievements.has(a.id)).length;
            
            if (categoryUnlocked === categoryAchievements.length) {
                this.checkAchievement(`${category}Master`, 1);
            }
        }
    }
    
    updateUnlockedCount() {
        this.unlockedCount = this.unlockedAchievements.size;
    }
    
    saveProgress() {
        const progressData = {
            unlocked: Array.from(this.unlockedAchievements),
            progress: Object.fromEntries(this.progress),
            version: '1.0.0'
        };
        
        Utils.saveToLocalStorage('dharmapala_shield_achievements', progressData);
    }
    
    loadProgress() {
        const progressData = Utils.loadFromLocalStorage('dharmapala_shield_achievements');
        if (progressData) {
            this.unlockedAchievements = new Set(progressData.unlocked || []);
            this.progress = new Map(Object.entries(progressData.progress || {}));
            this.updateUnlockedCount();
        }
    }
    
    // Game event handlers
    onEnemyKilled(enemy) {
        this.checkAchievement('firstBlood', 1);
        this.checkAchievement('enemySlayer', this.getProgress('enemySlayer') + 1);
        
        if (enemy.type === 'raidTeam' || enemy.type === 'megaCorpTitan') {
            this.checkAchievement('bossHunter', this.getProgress('bossHunter') + 1);
        }
    }
    
    onDefenseBuilt(defense) {
        this.checkAchievement('towerBuilder', this.getProgress('towerBuilder') + 1);
        this.checkDefenseMaster();
    }
    
    onDefenseUpgraded(defense) {
        if (defense.level === defense.maxLevel) {
            this.checkAchievement('upgradeExpert', this.getProgress('upgradeExpert') + 1);
        }
    }
    
    onWaveCompleted(wave, damageTaken) {
        this.checkAchievement('waveSurvivor', wave);
        
        if (damageTaken === 0) {
            this.checkAchievement('perfectWave', 1);
        }
        
        if (this.game.defenses.length <= 5) {
            this.checkAchievement('efficientBuilder', 1);
        }
        
        // Check speed runner
        const gameTime = (Date.now() - (this.game.startTime || Date.now())) / 1000 / 60; // minutes
        if (wave >= 10 && gameTime <= 10) {
            this.checkAchievement('speedRunner', 1);
        }
    }
    
    onGameCompleted(livesLost) {
        this.checkAchievement('enduranceMaster', 20);
        
        if (livesLost === 0) {
            this.checkAchievement('perfectionist', 1);
        }
        
        this.checkAchievement('digitalSavior', 1);
    }
    
    onResourcesUpdate(resources) {
        this.checkAchievement('wealthyMonk', resources.dharma);
        this.checkAchievement('bandwidthKing', resources.bandwidth);
        this.checkAchievement('anonymousMaster', resources.anonymity);
        
        if (resources.dharma >= 1000 && resources.bandwidth >= 1000 && resources.anonymity >= 1000) {
            this.checkAchievement('resourceManager', 1);
        }
    }
    
    checkDefenseMaster() {
        const defenseTypes = new Set();
        for (const defense of this.game.defenses) {
            defenseTypes.add(defense.type);
        }
        
        if (defenseTypes.size === Object.keys(CONFIG.DEFENSE_TYPES).length) {
            this.checkAchievement('defenseMaster', 1);
        }
    }
    
    // Utility methods
    getProgress(id) {
        return this.progress.get(id) || 0;
    }
    
    getUnlockedAchievements() {
        return Array.from(this.unlockedAchievements).map(id => ({
            ...this.achievements.get(id),
            progress: this.getProgress(id)
        }));
    }
    
    getAchievementsByCategory(category) {
        return Array.from(this.achievements.values()).filter(a => a.category === category);
    }
    
    getLockedAchievements() {
        return Array.from(this.achievements.values()).filter(a => !this.unlockedAchievements.has(a.id));
    }
    
    getAchievement(id) {
        return this.achievements.get(id);
    }
    
    isUnlocked(id) {
        return this.unlockedAchievements.has(id);
    }
    
    getProgressPercentage(id) {
        const achievement = this.achievements.get(id);
        if (!achievement) return 0;
        
        const current = this.getProgress(id);
        const required = achievement.requirement;
        
        return Math.min(100, Math.floor((current / required) * 100));
    }
    
    getTotalProgressPercentage() {
        return Math.floor((this.unlockedCount / this.totalAchievements) * 100);
    }
    
    getCategoryProgress(category) {
        const categoryAchievements = this.getAchievementsByCategory(category);
        const unlockedInCategory = categoryAchievements.filter(a => this.unlockedAchievements.has(a.id)).length;
        
        return {
            total: categoryAchievements.length,
            unlocked: unlockedInCategory,
            percentage: Math.floor((unlockedInCategory / categoryAchievements.length) * 100)
        };
    }
    
    getTotalRewards() {
        let totalRewards = { dharma: 0, bandwidth: 0, anonymity: 0 };
        
        for (const id of this.unlockedAchievements) {
            const achievement = this.achievements.get(id);
            if (achievement.reward) {
                totalRewards.dharma += achievement.reward.dharma || 0;
                totalRewards.bandwidth += achievement.reward.bandwidth || 0;
                totalRewards.anonymity += achievement.reward.anonymity || 0;
            }
        }
        
        return totalRewards;
    }
    
    resetProgress() {
        if (confirm('Are you sure you want to reset all achievement progress? This cannot be undone.')) {
            this.unlockedAchievements.clear();
            this.progress.clear();
            this.updateUnlockedCount();
            this.saveProgress();
            
            this.game.uiManager.showNotification(
                'Achievement progress reset',
                'info',
                2000
            );
        }
    }
    
    // Statistics
    getAchievementStats() {
        const categoryStats = {};
        
        for (const category of ['combat', 'defense', 'resource', 'progression', 'special']) {
            categoryStats[category] = this.getCategoryProgress(category);
        }
        
        return {
            total: this.totalAchievements,
            unlocked: this.unlockedCount,
            percentage: this.getTotalProgressPercentage(),
            categories: categoryStats,
            totalRewards: this.getTotalRewards()
        };
    }
}