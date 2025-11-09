// Save System - handles game save/load functionality
import { CONFIG } from './config.js';
import { Utils } from './utils.js';

export class SaveSystem {
    constructor(game) {
        this.game = game;
        this.saveSlots = [];
        this.currentSlot = 0;
        this.autoSaveEnabled = true;
        this.autoSaveInterval = CONFIG.AUTO_SAVE_INTERVAL;
        this.lastAutoSave = 0;
        this.saveVersion = '1.0.0';
        
        // Initialize save slots
        this.initializeSaveSlots();
    }
    
    initializeSaveSlots() {
        // Load existing save slots
        for (let i = 0; i < CONFIG.MAX_SAVE_SLOTS; i++) {
            const saveData = this.loadFromSlot(i);
            this.saveSlots[i] = saveData;
        }
    }
    
    save(slot = null, customName = null) {
        const saveSlot = slot !== null ? slot : this.currentSlot;
        
        // Create save data
        const saveData = {
            version: this.saveVersion,
            timestamp: Date.now(),
            name: customName || `Save ${saveSlot + 1}`,
            gameData: this.createGameData()
        };
        
        // Validate save data
        if (!this.validateSaveData(saveData)) {
            console.error('Invalid save data');
            return false;
        }
        
        // Save to local storage
        const success = this.saveToSlot(saveSlot, saveData);
        
        if (success) {
            this.saveSlots[saveSlot] = saveData;
            console.log(`Game saved to slot ${saveSlot}`);
            
            // Show notification
            this.game.uiManager.showNotification(
                `Game saved to slot ${saveSlot + 1}`,
                'success',
                2000
            );
            
            // Update last auto save time
            this.lastAutoSave = Date.now();
        } else {
            console.error(`Failed to save to slot ${saveSlot}`);
            this.game.uiManager.showNotification(
                'Failed to save game',
                'error',
                3000
            );
        }
        
        return success;
    }
    
    load(slot = null) {
        const saveSlot = slot !== null ? slot : this.currentSlot;
        
        const saveData = this.loadFromSlot(saveSlot);
        if (!saveData) {
            console.log(`No save data found in slot ${saveSlot}`);
            this.game.uiManager.showNotification(
                'No save data found',
                'error',
                2000
            );
            return false;
        }
        
        // Validate save data
        if (!this.validateSaveData(saveData)) {
            console.error('Invalid save data');
            this.game.uiManager.showNotification(
                'Invalid save data',
                'error',
                2000
            );
            return false;
        }
        
        // Check version compatibility
        if (!this.isVersionCompatible(saveData.version)) {
            console.warn(`Save version ${saveData.version} may not be compatible`);
            this.game.uiManager.showNotification(
                'Save version may be incompatible',
                'warning',
                3000
            );
        }
        
        // Load game data
        const success = this.loadGameData(saveData.gameData);
        
        if (success) {
            this.currentSlot = saveSlot;
            console.log(`Game loaded from slot ${saveSlot}`);
            
            // Show notification
            this.game.uiManager.showNotification(
                `Game loaded from slot ${saveSlot + 1}`,
                'success',
                2000
            );
            
            // Update last auto save time
            this.lastAutoSave = Date.now();
        } else {
            console.error(`Failed to load from slot ${saveSlot}`);
            this.game.uiManager.showNotification(
                'Failed to load game',
                'error',
                2000
            );
        }
        
        return success;
    }
    
    createGameData() {
        return {
            // Game state
            state: this.game.state,
            resources: { ...this.game.resources },
            lives: this.game.lives,
            wave: this.game.wave,
            score: this.game.score,
            
            // Game objects
            defenses: this.game.defenses.map(defense => defense.getSaveData()),
            enemies: this.game.enemies.map(enemy => enemy.getSaveData()),
            
            // Level data
            levelData: {
                currentWave: this.game.level.currentWave,
                waveInProgress: this.game.level.waveInProgress,
                waveTimer: this.game.level.waveTimer
            },
            
            // UI state
            selectedDefenseType: this.game.uiManager.selectedDefenseType,
            
            // Settings
            settings: {
                masterVolume: this.game.audioManager.masterVolume,
                sfxVolume: this.game.audioManager.sfxVolume,
                musicVolume: this.game.audioManager.musicVolume,
                isMuted: this.game.audioManager.isMuted
            },
            
            // Statistics
            statistics: {
                enemiesKilled: this.getEnemiesKilled(),
                defensesBuilt: this.game.defenses.length,
                totalScore: this.game.score,
                playTime: Date.now() - (this.game.startTime || Date.now())
            }
        };
    }
    
    loadGameData(gameData) {
        try {
            // Load game state
            this.game.state = gameData.state || CONFIG.GAME_STATES.MENU;
            this.game.resources = { ...gameData.resources };
            this.game.lives = gameData.lives || CONFIG.INITIAL_LIVES;
            this.game.wave = gameData.wave || 0;
            this.game.score = gameData.score || 0;
            
            // Clear existing game objects
            this.game.defenses = [];
            this.game.enemies = [];
            this.game.projectiles = [];
            this.game.particles = [];
            
            // Load defenses
            if (gameData.defenses) {
                for (const defenseData of gameData.defenses) {
                    const defense = this.createDefenseFromSaveData(defenseData);
                    if (defense) {
                        this.game.defenses.push(defense);
                    }
                }
            }
            
            // Load enemies (only if wave is in progress)
            if (gameData.enemies && gameData.levelData.waveInProgress) {
                for (const enemyData of gameData.enemies) {
                    const enemy = this.createEnemyFromSaveData(enemyData);
                    if (enemy) {
                        this.game.enemies.push(enemy);
                    }
                }
            }
            
            // Load level data
            if (gameData.levelData) {
                this.game.level.currentWave = gameData.levelData.currentWave;
                this.game.level.waveInProgress = gameData.levelData.waveInProgress;
                this.game.level.waveTimer = gameData.levelData.waveTimer;
            }
            
            // Load UI state
            if (gameData.selectedDefenseType) {
                this.game.uiManager.selectedDefenseType = gameData.selectedDefenseType;
            }
            
            // Load settings
            if (gameData.settings) {
                this.game.audioManager.masterVolume = gameData.settings.masterVolume;
                this.game.audioManager.sfxVolume = gameData.settings.sfxVolume;
                this.game.audioManager.musicVolume = gameData.settings.musicVolume;
                this.game.audioManager.isMuted = gameData.settings.isMuted;
            }
            
            // Update UI
            this.game.uiManager.updateAll();
            
            return true;
        } catch (error) {
            console.error('Error loading game data:', error);
            return false;
        }
    }
    
    createDefenseFromSaveData(defenseData) {
        try {
            const Defense = require('./defense.js').Defense;
            const defense = new Defense(this.game, defenseData.x, defenseData.y, defenseData.type);
            defense.loadSaveData(defenseData);
            return defense;
        } catch (error) {
            console.error('Error creating defense from save data:', error);
            return null;
        }
    }
    
    createEnemyFromSaveData(enemyData) {
        try {
            if (CONFIG.BOSS_TYPES[enemyData.type]) {
                const Boss = require('./Boss.js').Boss;
                const enemy = new Boss(this.game, enemyData.x, enemyData.y, enemyData.type);
                enemy.loadSaveData(enemyData);
                return enemy;
            } else {
                const Enemy = require('./enemy.js').Enemy;
                const enemy = new Enemy(this.game, enemyData.x, enemyData.y, enemyData.type);
                enemy.loadSaveData(enemyData);
                return enemy;
            }
        } catch (error) {
            console.error('Error creating enemy from save data:', error);
            return null;
        }
    }
    
    validateSaveData(saveData) {
        if (!saveData || typeof saveData !== 'object') {
            return false;
        }
        
        if (!saveData.version || !saveData.timestamp || !saveData.gameData) {
            return false;
        }
        
        const gameData = saveData.gameData;
        if (!gameData.resources || !gameData.lives || !gameData.wave) {
            return false;
        }
        
        return true;
    }
    
    isVersionCompatible(version) {
        // Simple version compatibility check
        const currentVersion = this.saveVersion.split('.');
        const saveVersion = version.split('.');
        
        // Major version must match
        return currentVersion[0] === saveVersion[0];
    }
    
    saveToSlot(slot, saveData) {
        const key = `dharmapala_shield_save_${slot}`;
        return Utils.saveToLocalStorage(key, saveData);
    }
    
    loadFromSlot(slot) {
        const key = `dharmapala_shield_save_${slot}`;
        return Utils.loadFromLocalStorage(key);
    }
    
    delete(slot) {
        const key = `dharmapala_shield_save_${slot}`;
        const success = Utils.removeFromLocalStorage(key);
        
        if (success) {
            this.saveSlots[slot] = null;
            console.log(`Save slot ${slot} deleted`);
            
            // Show notification
            this.game.uiManager.showNotification(
                `Save slot ${slot + 1} deleted`,
                'info',
                2000
            );
        }
        
        return success;
    }
    
    clearAllSaves() {
        let successCount = 0;
        
        for (let i = 0; i < CONFIG.MAX_SAVE_SLOTS; i++) {
            if (this.delete(i)) {
                successCount++;
            }
        }
        
        console.log(`Cleared ${successCount} save slots`);
        return successCount;
    }
    
    getSaveSlots() {
        return this.saveSlots.map((slot, index) => ({
            slot: index,
            exists: slot !== null,
            name: slot ? slot.name : `Empty Slot ${index + 1}`,
            timestamp: slot ? slot.timestamp : null,
            version: slot ? slot.version : null,
            gameData: slot ? slot.gameData : null
        }));
    }
    
    getSaveSlotInfo(slot) {
        const saveData = this.saveSlots[slot];
        if (!saveData) {
            return null;
        }
        
        return {
            slot: slot,
            name: saveData.name,
            timestamp: saveData.timestamp,
            version: saveData.version,
            formattedDate: new Date(saveData.timestamp).toLocaleString(),
            wave: saveData.gameData.wave,
            score: saveData.gameData.score,
            lives: saveData.gameData.lives,
            resources: saveData.gameData.resources,
            defensesCount: saveData.gameData.defenses ? saveData.gameData.defenses.length : 0,
            playTime: saveData.gameData.statistics ? saveData.gameData.statistics.playTime : 0
        };
    }
    
    autoSave() {
        if (!this.autoSaveEnabled) {
            return;
        }
        
        const now = Date.now();
        if (now - this.lastAutoSave >= this.autoSaveInterval) {
            // Auto-save to slot 0
            this.save(0, 'Auto-save');
        }
    }
    
    exportSave(slot) {
        const saveData = this.loadFromSlot(slot);
        if (!saveData) {
            return null;
        }
        
        // Create export data
        const exportData = {
            exportVersion: '1.0.0',
            game: 'Dharmapala Shield',
            exportedAt: Date.now(),
            saveData: saveData
        };
        
        // Convert to JSON string
        const jsonString = JSON.stringify(exportData, null, 2);
        
        // Create blob
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create download URL
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `dharmapala_shield_save_${slot}_${new Date().toISOString().slice(0, 10)}.json`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        // Show notification
        this.game.uiManager.showNotification(
            `Save slot ${slot + 1} exported`,
            'success',
            2000
        );
        
        return true;
    }
    
    importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    // Validate import data
                    if (!importData.saveData) {
                        throw new Error('Invalid import file format');
                    }
                    
                    // Find empty slot or ask user to overwrite
                    const emptySlot = this.findEmptySlot();
                    
                    if (emptySlot !== -1) {
                        // Import to empty slot
                        if (this.saveToSlot(emptySlot, importData.saveData)) {
                            this.saveSlots[emptySlot] = importData.saveData;
                            this.game.uiManager.showNotification(
                                `Save imported to slot ${emptySlot + 1}`,
                                'success',
                                2000
                            );
                            resolve(emptySlot);
                        } else {
                            reject(new Error('Failed to save imported data'));
                        }
                    } else {
                        // Ask user to overwrite
                        if (confirm('No empty slots available. Overwrite slot 1?')) {
                            if (this.saveToSlot(0, importData.saveData)) {
                                this.saveSlots[0] = importData.saveData;
                                this.game.uiManager.showNotification(
                                    'Save imported to slot 1 (overwritten)',
                                    'warning',
                                    3000
                                );
                                resolve(0);
                            } else {
                                reject(new Error('Failed to save imported data'));
                            }
                        } else {
                            reject(new Error('Import cancelled'));
                        }
                    }
                } catch (error) {
                    console.error('Error importing save:', error);
                    this.game.uiManager.showNotification(
                        'Failed to import save file',
                        'error',
                        3000
                    );
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }
    
    findEmptySlot() {
        for (let i = 0; i < CONFIG.MAX_SAVE_SLOTS; i++) {
            if (!this.saveSlots[i]) {
                return i;
            }
        }
        return -1;
    }
    
    getEnemiesKilled() {
        // This would be tracked in the game state
        // For now, return an estimate based on score
        return Math.floor(this.game.score / 10);
    }
    
    toggleAutoSave() {
        this.autoSaveEnabled = !this.autoSaveEnabled;
        
        this.game.uiManager.showNotification(
            `Auto-save ${this.autoSaveEnabled ? 'enabled' : 'disabled'}`,
            'info',
            2000
        );
        
        return this.autoSaveEnabled;
    }
    
    setAutoSaveInterval(interval) {
        this.autoSaveInterval = Math.max(10000, interval); // Minimum 10 seconds
    }
    
    // Statistics
    getTotalPlayTime() {
        let totalTime = 0;
        
        for (const slot of this.saveSlots) {
            if (slot && slot.gameData && slot.gameData.statistics) {
                totalTime += slot.gameData.statistics.playTime || 0;
            }
        }
        
        return totalTime;
    }
    
    getHighScore() {
        let highScore = 0;
        
        for (const slot of this.saveSlots) {
            if (slot && slot.gameData && slot.gameData.score) {
                highScore = Math.max(highScore, slot.gameData.score);
            }
        }
        
        return highScore;
    }
    
    getTotalWavesCompleted() {
        let totalWaves = 0;
        
        for (const slot of this.saveSlots) {
            if (slot && slot.gameData && slot.gameData.wave) {
                totalWaves += slot.gameData.wave;
            }
        }
        
        return totalWaves;
    }
}