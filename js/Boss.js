// Boss class - represents boss enemies
import { CONFIG } from './config.js';
import { Utils } from './utils.js';
import { Enemy } from './enemy.js';

export class Boss extends Enemy {
    constructor(game, x, y, type) {
        super(game, x, y, type);
        
        // Boss-specific properties
        this.bossConfig = CONFIG.BOSS_TYPES[type];
        this.health = this.bossConfig.health;
        this.maxHealth = this.bossConfig.health;
        this.speed = this.bossConfig.speed;
        this.baseSpeed = this.bossConfig.speed;
        this.damage = 5; // More damage to player lives
        this.reward = { ...this.bossConfig.reward };
        
        // Boss-specific properties
        this.phases = this.bossConfig.phases;
        this.currentPhase = 1;
        this.phaseHealthThreshold = this.maxHealth / this.phases;
        this.size = this.bossConfig.size;
        
        // Special abilities
        this.specialAbilityCooldown = 0;
        this.specialAbilityActive = false;
        this.specialAbilityDuration = 0;
        this.lastSpecialTime = 0;
        this.minionSpawnTimer = 0;
        this.empBlastTimer = 0;
        this.shieldRegenTimer = 0;
        
        // Visual properties
        this.animationTime = 0;
        this.pulsePhase = 0;
        this.warningRadius = 0;
        this.shieldActive = false;
        this.shieldHealth = 0;
        this.maxShieldHealth = 100;
        
        // Initialize boss-specific behavior
        this.initializeBossBehavior();
    }
    
    initializeBossBehavior() {
        switch (this.type) {
            case 'raidTeam':
                this.specialAbilityCooldown = 5000; // 5 seconds
                this.minionSpawnTimer = 3000; // 3 seconds
                this.empBlastTimer = 8000; // 8 seconds
                break;
                
            case 'megaCorpTitan':
                this.specialAbilityCooldown = 4000; // 4 seconds
                this.shieldRegenTimer = 6000; // 6 seconds
                this.shieldActive = true;
                this.shieldHealth = this.maxShieldHealth;
                break;
        }
    }
    
    update(deltaTime) {
        if (this.isDead) {
            this.updateDeath(deltaTime);
            return;
        }
        
        // Update animation
        this.animationTime += deltaTime;
        this.pulsePhase += deltaTime * 0.002;
        
        // Update status effects
        this.updateStatusEffects(deltaTime);
        
        // Update boss phases
        this.updatePhases();
        
        // Update special abilities
        this.updateSpecialAbilities(deltaTime);
        
        // Update movement
        this.updateMovement(deltaTime);
        
        // Update trail
        this.updateTrail(deltaTime);
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Update boss-specific behavior
        this.updateBossBehavior(deltaTime);
        
        // Check if reached end
        this.checkEndReached();
    }
    
    render(ctx) {
        if (this.isDead) {
            this.renderDeath(ctx);
            return;
        }
        
        ctx.save();
        
        // Render warning radius for special abilities
        this.renderWarningRadius(ctx);
        
        // Render shield if active
        if (this.shieldActive) {
            this.renderShield(ctx);
        }
        
        // Render trail
        this.renderTrail(ctx);
        
        // Render status effects
        this.renderStatusEffects(ctx);
        
        // Render boss
        this.renderBoss(ctx);
        
        // Render health bar
        this.renderHealthBar(ctx);
        
        // Render phase indicator
        this.renderPhaseIndicator(ctx);
        
        // Render particles
        this.renderParticles(ctx);
        
        ctx.restore();
    }
    
    renderBoss(ctx) {
        const centerX = this.x;
        const centerY = this.y;
        const size = this.size + Math.sin(this.pulsePhase) * 3;
        
        // Draw boss body with gradient
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size);
        gradient.addColorStop(0, this.config.color);
        gradient.addColorStop(0.7, this.config.color);
        gradient.addColorStop(1, this.getDarkerColor(this.config.color));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw boss border
        ctx.strokeStyle = this.getBorderColor();
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw boss icon
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.bossConfig.icon, centerX, centerY);
        
        // Draw boss-specific effects
        this.renderBossEffects(ctx, centerX, centerY, size);
    }
    
    renderBossEffects(ctx, centerX, centerY, size) {
        switch (this.type) {
            case 'raidTeam':
                this.renderRaidTeamEffects(ctx, centerX, centerY, size);
                break;
                
            case 'megaCorpTitan':
                this.renderMegaCorpTitanEffects(ctx, centerX, centerY, size);
                break;
        }
    }
    
    renderRaidTeamEffects(ctx, centerX, centerY, size) {
        // Draw minion spawn indicators
        if (this.minionSpawnTimer > 0 && this.minionSpawnTimer < 1000) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = '#ff6b35';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(centerX, centerY, size + 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        // Draw EMP blast warning
        if (this.empBlastTimer > 0 && this.empBlastTimer < 2000) {
            ctx.save();
            ctx.globalAlpha = 0.3 + Math.sin(this.animationTime * 0.01) * 0.2;
            ctx.fillStyle = '#ff6b35';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    renderMegaCorpTitanEffects(ctx, centerX, centerY, size) {
        // Draw market manipulation effect
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = '#c77dff';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 3; i++) {
            const radius = size + 20 + i * 15;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
        
        // Draw shield regeneration effect
        if (this.shieldRegenTimer > 0 && this.shieldRegenTimer < 1000) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#c77dff';
            ctx.beginPath();
            ctx.arc(centerX, centerY, size + 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    renderShield(ctx) {
        if (this.shieldHealth <= 0) return;
        
        const centerX = this.x;
        const centerY = this.y;
        const shieldRadius = this.size + 15;
        
        // Draw shield bubble
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.sin(this.animationTime * 0.005) * 0.1;
        ctx.fillStyle = '#c77dff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw shield border
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = '#c77dff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw shield cracks if damaged
        if (this.shieldHealth < this.maxShieldHealth) {
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = '#ff4444';
            ctx.lineWidth = 1;
            
            const crackCount = Math.floor((1 - this.shieldHealth / this.maxShieldHealth) * 5);
            for (let i = 0; i < crackCount; i++) {
                const angle = (Math.PI * 2 * i) / crackCount + this.animationTime * 0.001;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(angle) * shieldRadius,
                    centerY + Math.sin(angle) * shieldRadius
                );
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }
    
    renderWarningRadius(ctx) {
        if (this.warningRadius <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.warningRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        this.warningRadius -= deltaTime * 0.1;
        if (this.warningRadius < 0) {
            this.warningRadius = 0;
        }
    }
    
    renderHealthBar(ctx) {
        const barWidth = 60;
        const barHeight = 6;
        const barY = this.y - this.size - 20;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);
        
        // Health fill
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#10b981' : 
                       healthPercent > 0.25 ? '#f59e0b' : '#ef4444';
        ctx.fillRect(this.x - barWidth / 2, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - barWidth / 2, barY, barWidth, barHeight);
        
        // Boss name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.bossConfig.name, this.x, barY - 5);
    }
    
    renderPhaseIndicator(ctx) {
        if (this.phases <= 1) return;
        
        const indicatorY = this.y - this.size - 35;
        const indicatorWidth = 40;
        const indicatorHeight = 4;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(this.x - indicatorWidth / 2, indicatorY, indicatorWidth, indicatorHeight);
        
        // Phase fill
        const phasePercent = this.currentPhase / this.phases;
        ctx.fillStyle = '#e94560';
        ctx.fillRect(this.x - indicatorWidth / 2, indicatorY, indicatorWidth * phasePercent, indicatorHeight);
        
        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - indicatorWidth / 2, indicatorY, indicatorWidth, indicatorHeight);
        
        // Phase text
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Phase ${this.currentPhase}/${this.phases}`, this.x, indicatorY - 3);
    }
    
    updatePhases() {
        const newPhase = Math.ceil((1 - this.health / this.maxHealth) * this.phases);
        
        if (newPhase > this.currentPhase) {
            this.currentPhase = newPhase;
            this.onPhaseChange();
        }
    }
    
    onPhaseChange() {
        // Called when boss enters a new phase
        this.game.uiManager.showNotification(
            `${this.bossConfig.name} enters Phase ${this.currentPhase}!`,
            'warning',
            3000
        );
        
        // Play phase change sound
        this.game.audioManager.playSound('bossPhaseChange');
        
        // Create phase change effect
        this.createPhaseChangeEffect();
        
        // Increase boss power in new phase
        this.speed *= 1.2;
        this.damage = Math.floor(this.damage * 1.3);
        
        // Reset special ability cooldown
        this.specialAbilityCooldown = 0;
    }
    
    createPhaseChangeEffect() {
        // Create dramatic phase change effect
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = Utils.randomRange(3, 8);
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.5,
                color: this.config.color,
                size: Utils.randomRange(4, 8),
                update: function(deltaTime) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.95;
                    this.vy *= 0.95;
                    this.life -= deltaTime * 0.001;
                    this.isDead = this.life <= 0;
                },
                render: function(ctx) {
                    Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life);
                }
            });
        }
    }
    
    updateBossBehavior(deltaTime) {
        switch (this.type) {
            case 'raidTeam':
                this.updateRaidTeamBehavior(deltaTime);
                break;
                
            case 'megaCorpTitan':
                this.updateMegaCorpTitanBehavior(deltaTime);
                break;
        }
    }
    
    updateRaidTeamBehavior(deltaTime) {
        // Update minion spawn timer
        if (this.minionSpawnTimer > 0) {
            this.minionSpawnTimer -= deltaTime;
        } else {
            this.spawnMinions();
            this.minionSpawnTimer = 5000; // 5 seconds
        }
        
        // Update EMP blast timer
        if (this.empBlastTimer > 0) {
            this.empBlastTimer -= deltaTime;
        } else {
            this.performEMPBlast();
            this.empBlastTimer = 10000; // 10 seconds
        }
    }
    
    updateMegaCorpTitanBehavior(deltaTime) {
        // Update shield regeneration timer
        if (this.shieldRegenTimer > 0) {
            this.shieldRegenTimer -= deltaTime;
        } else {
            this.regenerateShield();
            this.shieldRegenTimer = 8000; // 8 seconds
        }
        
        // Update market manipulation
        if (Math.random() < 0.01) {
            this.performMarketManipulation();
        }
    }
    
    spawnMinions() {
        const minionCount = 3 + this.currentPhase;
        const spawnRadius = 50;
        
        for (let i = 0; i < minionCount; i++) {
            const angle = (Math.PI * 2 * i) / minionCount;
            const spawnX = this.x + Math.cos(angle) * spawnRadius;
            const spawnY = this.y + Math.sin(angle) * spawnRadius;
            
            // Create a minion enemy
            const minion = new Enemy(this.game, spawnX, spawnY, 'scriptKiddie');
            minion.health = 15; // Weaker than normal
            minion.maxHealth = 15;
            minion.speed = 60;
            
            this.game.enemies.push(minion);
        }
        
        // Show notification
        this.game.uiManager.showNotification(
            `${this.bossConfig.name} spawns minions!`,
            'warning',
            2000
        );
        
        // Play sound
        this.game.audioManager.playSound('minionSpawn');
    }
    
    performEMPBlast() {
        // Create EMP blast effect
        this.warningRadius = 200;
        
        // Damage all defenses in range
        for (const defense of this.game.defenses) {
            const distance = Utils.distance(this.x, this.y, defense.centerX, defense.centerY);
            if (distance <= 200) {
                // Temporarily disable defense
                defense.applyDebuff('emp', 3000);
            }
        }
        
        // Show notification
        this.game.uiManager.showNotification(
            `${this.bossConfig.name} uses EMP Blast!`,
            'error',
            3000
        );
        
        // Play sound
        this.game.audioManager.playSound('empBlast');
    }
    
    regenerateShield() {
        if (!this.shieldActive) {
            this.shieldActive = true;
        }
        
        this.shieldHealth = Math.min(this.maxShieldHealth, this.shieldHealth + 50);
        
        // Show notification
        this.game.uiManager.showNotification(
            `${this.bossConfig.name} regenerates shield!`,
            'warning',
            2000
        );
        
        // Play sound
        this.game.audioManager.playSound('shieldRegen');
    }
    
    performMarketManipulation() {
        // Steal resources from player
        const stolenDharma = Math.floor(this.game.resources.dharma * 0.1);
        const stolenBandwidth = Math.floor(this.game.resources.bandwidth * 0.1);
        const stolenAnonymity = Math.floor(this.game.resources.anonymity * 0.1);
        
        this.game.resources.dharma = Math.max(0, this.game.resources.dharma - stolenDharma);
        this.game.resources.bandwidth = Math.max(0, this.game.resources.bandwidth - stolenBandwidth);
        this.game.resources.anonymity = Math.max(0, this.game.resources.anonymity - stolenAnonymity);
        
        // Update UI
        this.game.uiManager.updateResources();
        
        // Show notification
        this.game.uiManager.showNotification(
            `${this.bossConfig.name} steals resources!`,
            'error',
            3000
        );
        
        // Play sound
        this.game.audioManager.playSound('resourceSteal');
    }
    
    takeDamage(amount, damageType = 'fire') {
        // Apply shield damage first
        if (this.shieldActive && this.shieldHealth > 0) {
            const shieldDamage = Math.min(amount, this.shieldHealth);
            this.shieldHealth -= shieldDamage;
            amount -= shieldDamage;
            
            if (this.shieldHealth <= 0) {
                this.shieldActive = false;
                this.shieldHealth = 0;
                
                // Show notification
                this.game.uiManager.showNotification(
                    `${this.bossConfig.name}'s shield destroyed!`,
                    'success',
                    2000
                );
            }
        }
        
        // Apply remaining damage to health
        if (amount > 0) {
            super.takeDamage(amount, damageType);
        }
    }
    
    createDeathEffect() {
        // Create epic boss death effect
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const speed = Utils.randomRange(5, 10);
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 2,
                color: this.config.color,
                size: Utils.randomRange(6, 12),
                update: function(deltaTime) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.95;
                    this.vy *= 0.95;
                    this.life -= deltaTime * 0.001;
                    this.isDead = this.life <= 0;
                },
                render: function(ctx) {
                    Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life);
                }
            });
        }
        
        // Create explosion shockwave
        this.warningRadius = 150;
    }
    
    // Utility methods
    getDarkerColor(color) {
        // Simple color darkening
        const rgb = Utils.hexToRgb(color);
        if (rgb) {
            return Utils.rgbToHex(
                Math.floor(rgb.r * 0.7),
                Math.floor(rgb.g * 0.7),
                Math.floor(rgb.b * 0.7)
            );
        }
        return color;
    }
    
    // Override save data for boss
    getSaveData() {
        const saveData = super.getSaveData();
        saveData.currentPhase = this.currentPhase;
        saveData.shieldActive = this.shieldActive;
        saveData.shieldHealth = this.shieldHealth;
        return saveData;
    }
    
    loadSaveData(saveData) {
        super.loadSaveData(saveData);
        this.currentPhase = saveData.currentPhase || 1;
        this.shieldActive = saveData.shieldActive || false;
        this.shieldHealth = saveData.shieldHealth || 0;
    }
}