// Defense Manager - handles defense placement and management
import { CONFIG } from './config.js';
import { Utils } from './utils.js';
import { Defense } from './defense.js';

export class DefenseManager {
    constructor(game) {
        this.game = game;
        this.defenses = [];
        this.selectedDefenseType = 'firewall';
        this.placementPreview = null;
        this.showPlacementPreview = true;
        this.placementValid = false;
        this.lastPlacementTime = 0;
        this.placementCooldown = 500; // 500ms between placements
    }
    
    update(deltaTime) {
        // Update all defenses
        for (const defense of this.defenses) {
            defense.update(deltaTime);
        }
        
        // Update placement preview
        this.updatePlacementPreview();
        
        // Update placement cooldown
        if (this.lastPlacementTime > 0) {
            this.lastPlacementTime -= deltaTime;
        }
    }
    
    render(ctx) {
        // Render all defenses
        for (const defense of this.defenses) {
            defense.render(ctx);
        }
        
        // Render placement preview
        if (this.showPlacementPreview && this.placementPreview) {
            this.renderPlacementPreview(ctx);
        }
    }
    
    handleClick(x, y) {
        // Check if clicking on defense panel first
        const defensePanel = this.game.uiManager.elements.get('defense_panel');
        if (Utils.pointInRect(x, y, defensePanel.x, defensePanel.y, defensePanel.width, defensePanel.height)) {
            return; // Let UI manager handle this
        }
        
        // Try to place defense
        this.tryPlaceDefense(x, y);
    }
    
    tryPlaceDefense(x, y) {
        // Check placement cooldown
        if (this.lastPlacementTime > 0) {
            return;
        }
        
        // Get selected defense type
        const defenseType = this.game.uiManager.getSelectedDefenseType();
        const defenseConfig = CONFIG.DEFENSE_TYPES[defenseType];
        
        if (!defenseConfig) {
            return;
        }
        
        // Check if player can afford it
        if (!this.game.canAfford(defenseConfig.cost)) {
            this.game.uiManager.showNotification('Cannot afford this defense!', 'error', 2000);
            return;
        }
        
        // Check if placement is valid
        if (!this.isValidPlacement(x, y, defenseType)) {
            this.game.uiManager.showNotification('Invalid placement location!', 'error', 2000);
            return;
        }
        
        // Snap to grid
        const gridX = Math.floor(x / CONFIG.GRID_SIZE) * CONFIG.GRID_SIZE;
        const gridY = Math.floor(y / CONFIG.GRID_SIZE) * CONFIG.GRID_SIZE;
        
        // Create defense
        const defense = new Defense(this.game, gridX, gridY, defenseType);
        
        // Add to game
        this.defenses.push(defense);
        this.game.defenses.push(defense);
        
        // Spend resources
        this.game.spendResources(defenseConfig.cost);
        
        // Set placement cooldown
        this.lastPlacementTime = this.placementCooldown;
        
        // Play sound
        this.game.audioManager.playSound('placeDefense');
        
        // Show notification
        this.game.uiManager.showNotification(
            `${defenseConfig.name} placed!`, 
            'success', 
            1500
        );
        
        // Check achievements
        this.game.achievementManager.checkAchievement('defensesBuilt', this.defenses.length);
    }
    
    isValidPlacement(x, y, defenseType) {
        // Snap to grid
        const gridX = Math.floor(x / CONFIG.GRID_SIZE) * CONFIG.GRID_SIZE;
        const gridY = Math.floor(y / CONFIG.GRID_SIZE) * CONFIG.GRID_SIZE;
        
        // Check if within canvas bounds
        if (gridX < 0 || gridX >= this.game.width || 
            gridY < 0 || gridY >= this.game.height) {
            return false;
        }
        
        // Check if position is occupied
        for (const defense of this.defenses) {
            if (defense.x === gridX && defense.y === gridY) {
                return false;
            }
        }
        
        // Check if on path (if path system exists)
        if (this.game.level && this.game.level.isOnPath(gridX, gridY)) {
            return false;
        }
        
        // Check if too close to other defenses (minimum spacing)
        const minSpacing = CONFIG.GRID_SIZE;
        for (const defense of this.defenses) {
            const distance = Utils.distance(gridX, gridY, defense.x, defense.y);
            if (distance < minSpacing) {
                return false;
            }
        }
        
        return true;
    }
    
    updatePlacementPreview() {
        if (!this.showPlacementPreview) {
            this.placementPreview = null;
            return;
        }
        
        const mouseX = this.game.mouse.x;
        const mouseY = this.game.mouse.y;
        
        // Snap to grid
        const gridX = Math.floor(mouseX / CONFIG.GRID_SIZE) * CONFIG.GRID_SIZE;
        const gridY = Math.floor(mouseY / CONFIG.GRID_SIZE) * CONFIG.GRID_SIZE;
        
        // Get selected defense type
        const defenseType = this.game.uiManager.getSelectedDefenseType();
        
        // Check if placement is valid
        this.placementValid = this.isValidPlacement(mouseX, mouseY, defenseType);
        
        // Create preview object
        this.placementPreview = {
            x: gridX,
            y: gridY,
            type: defenseType,
            valid: this.placementValid
        };
    }
    
    renderPlacementPreview(ctx) {
        if (!this.placementPreview) return;
        
        const defenseConfig = CONFIG.DEFENSE_TYPES[this.placementPreview.type];
        
        // Draw placement area
        ctx.fillStyle = this.placementValid ? 
            'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(this.placementPreview.x, this.placementPreview.y, 
                    CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
        
        // Draw border
        ctx.strokeStyle = this.placementValid ? '#10b981' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.placementPreview.x, this.placementPreview.y, 
                      CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
        
        // Draw defense preview
        ctx.save();
        ctx.globalAlpha = 0.7;
        
        // Draw range circle
        ctx.beginPath();
        ctx.arc(this.placementPreview.x + CONFIG.GRID_SIZE / 2, 
               this.placementPreview.y + CONFIG.GRID_SIZE / 2, 
               defenseConfig.range, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.stroke();
        
        // Draw defense icon
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(defenseConfig.icon, 
                    this.placementPreview.x + CONFIG.GRID_SIZE / 2,
                    this.placementPreview.y + CONFIG.GRID_SIZE / 2);
        
        ctx.restore();
    }
    
    selectDefenseType(type) {
        if (CONFIG.DEFENSE_TYPES[type]) {
            this.selectedDefenseType = type;
            this.game.uiManager.selectDefenseType(type);
        }
    }
    
    getDefenseAt(x, y) {
        for (const defense of this.defenses) {
            if (Utils.pointInRect(x, y, defense.x, defense.y, CONFIG.GRID_SIZE, CONFIG.GRID_SIZE)) {
                return defense;
            }
        }
        return null;
    }
    
    removeDefense(defense) {
        const index = this.defenses.indexOf(defense);
        if (index > -1) {
            this.defenses.splice(index, 1);
            const gameIndex = this.game.defenses.indexOf(defense);
            if (gameIndex > -1) {
                this.game.defenses.splice(gameIndex, 1);
            }
            
            // Play sound
            this.game.audioManager.playSound('removeDefense');
            
            // Show notification
            this.game.uiManager.showNotification('Defense removed!', 'info', 1500);
        }
    }
    
    upgradeDefense(defense) {
        if (defense.canUpgrade()) {
            const upgradeCost = defense.getUpgradeCost();
            
            if (this.game.canAfford(upgradeCost)) {
                this.game.spendResources(upgradeCost);
                defense.upgrade();
                
                // Play sound
                this.game.audioManager.playSound('upgradeDefense');
                
                // Show notification
                this.game.uiManager.showNotification(
                    `${defense.config.name} upgraded to level ${defense.level}!`, 
                    'success', 
                    2000
                );
            } else {
                this.game.uiManager.showNotification('Cannot afford upgrade!', 'error', 2000);
            }
        }
    }
    
    getDefensesInRange(x, y, range) {
        return this.defenses.filter(defense => {
            const distance = Utils.distance(x, y, defense.x + CONFIG.GRID_SIZE / 2, 
                                           defense.y + CONFIG.GRID_SIZE / 2);
            return distance <= range;
        });
    }
    
    getNearestDefense(x, y, maxRange = Infinity) {
        let nearest = null;
        let nearestDistance = maxRange;
        
        for (const defense of this.defenses) {
            const distance = Utils.distance(x, y, defense.x + CONFIG.GRID_SIZE / 2, 
                                           defense.y + CONFIG.GRID_SIZE / 2);
            if (distance < nearestDistance) {
                nearest = defense;
                nearestDistance = distance;
            }
        }
        
        return nearest;
    }
    
    getTotalDefenseValue() {
        return this.defenses.reduce((total, defense) => {
            const config = CONFIG.DEFENSE_TYPES[defense.type];
            return total + config.cost.dharma + (config.cost.bandwidth * 0.5) + (config.cost.anonymity * 2);
        }, 0);
    }
    
    getDefenseStats() {
        const stats = {
            total: this.defenses.length,
            byType: {},
            totalDamage: 0,
            totalRange: 0,
            averageLevel: 0
        };
        
        for (const defense of this.defenses) {
            const type = defense.type;
            stats.byType[type] = (stats.byType[type] || 0) + 1;
            stats.totalDamage += defense.getDamage();
            stats.totalRange += defense.getRange();
            stats.averageLevel += defense.level;
        }
        
        if (this.defenses.length > 0) {
            stats.averageLevel /= this.defenses.length;
        }
        
        return stats;
    }
    
    clearAllDefenses() {
        this.defenses = [];
        this.game.defenses = [];
        this.game.uiManager.showNotification('All defenses cleared!', 'info', 1500);
    }
    
    togglePlacementPreview() {
        this.showPlacementPreview = !this.showPlacementPreview;
        this.game.uiManager.showNotification(
            `Placement preview ${this.showPlacementPreview ? 'enabled' : 'disabled'}`, 
            'info', 
            1000
        );
    }
    
    // Defense AI and targeting
    updateDefenseTargeting() {
        for (const defense of this.defenses) {
            if (defense.needsTarget()) {
                const target = this.findBestTarget(defense);
                if (target) {
                    defense.setTarget(target);
                }
            }
        }
    }
    
    findBestTarget(defense) {
        const defenseX = defense.x + CONFIG.GRID_SIZE / 2;
        const defenseY = defense.y + CONFIG.GRID_SIZE / 2;
        const range = defense.getRange();
        
        let bestTarget = null;
        let bestScore = -Infinity;
        
        for (const enemy of this.game.enemies) {
            const distance = Utils.distance(defenseX, defenseY, enemy.x, enemy.y);
            
            if (distance <= range) {
                // Calculate target score based on various factors
                let score = 0;
                
                // Prioritize enemies closer to the end
                score += enemy.progress * 100;
                
                // Prioritize lower health enemies
                score += (1 - enemy.health / enemy.maxHealth) * 50;
                
                // Prioritize faster enemies
                score += enemy.speed * 0.5;
                
                // Prioritize higher value enemies
                score += enemy.reward.dharma * 2;
                
                // Adjust for distance (closer is better)
                score += (range - distance) * 0.1;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = enemy;
                }
            }
        }
        
        return bestTarget;
    }
    
    // Special defense abilities
    activateSpecialAbility(defenseType) {
        for (const defense of this.defenses) {
            if (defense.type === defenseType && defense.hasSpecialAbility()) {
                defense.activateSpecialAbility();
            }
        }
    }
    
    // Defense effects and buffs
    applyDefenseBuff(defenseType, buffType, duration) {
        for (const defense of this.defenses) {
            if (defense.type === defenseType) {
                defense.applyBuff(buffType, duration);
            }
        }
    }
    
    removeDefenseBuff(defenseType, buffType) {
        for (const defense of this.defenses) {
            if (defense.type === defenseType) {
                defense.removeBuff(buffType);
            }
        }
    }
    
    // Save/Load support
    getSaveData() {
        return this.defenses.map(defense => defense.getSaveData());
    }
    
    loadSaveData(saveData) {
        this.defenses = [];
        this.game.defenses = [];
        
        for (const defenseData of saveData) {
            const defense = new Defense(this.game, defenseData.x, defenseData.y, defenseData.type);
            defense.loadSaveData(defenseData);
            this.defenses.push(defense);
            this.game.defenses.push(defense);
        }
    }
}