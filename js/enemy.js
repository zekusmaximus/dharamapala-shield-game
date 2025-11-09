// Enemy class - represents enemy units
import { CONFIG } from './config.js';
import { Utils } from './utils.js';

export class Enemy {
    constructor(game, x, y, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;
        this.config = CONFIG.ENEMY_TYPES[type];
        
        // Enemy properties
        this.health = this.config.health;
        this.maxHealth = this.config.health;
        this.speed = this.config.speed;
        this.baseSpeed = this.config.speed;
        this.damage = 1; // Damage to player lives
        this.reward = { ...this.config.reward };
        
        // Movement properties
        this.pathIndex = 0;
        this.progress = 0;
        this.angle = 0;
        this.targetX = x;
        this.targetY = y;
        this.reachedEnd = false;
        
        // Combat properties
        this.isDead = false;
        this.deathTime = 0;
        this.resistance = {
            fire: 1,
            ice: 1,
            electric: 1,
            poison: 1
        };
        
        // Special abilities
        this.specialAbilityCooldown = 0;
        this.specialAbilityActive = false;
        this.specialAbilityDuration = 0;
        
        // Visual properties
        this.animationTime = 0;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.particles = [];
        this.trail = [];
        this.maxTrailLength = 10;
        
        // Status effects
        this.statusEffects = new Map();
        
        // AI properties
        this.targetPriority = 0;
        this.threatLevel = 1;
        this.lastSpecialTime = 0;
        
        // Initialize path following
        this.updateTarget();
    }
    
    update(deltaTime) {
        if (this.isDead) {
            this.updateDeath(deltaTime);
            return;
        }
        
        // Update animation
        this.animationTime += deltaTime;
        
        // Update status effects
        this.updateStatusEffects(deltaTime);
        
        // Update special abilities
        this.updateSpecialAbilities(deltaTime);
        
        // Update movement
        this.updateMovement(deltaTime);
        
        // Update trail
        this.updateTrail(deltaTime);
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Update AI
        this.updateAI(deltaTime);
        
        // Check if reached end
        this.checkEndReached();
    }
    
    render(ctx) {
        if (this.isDead) {
            this.renderDeath(ctx);
            return;
        }
        
        ctx.save();
        
        // Render trail
        this.renderTrail(ctx);
        
        // Render status effects
        this.renderStatusEffects(ctx);
        
        // Render enemy
        this.renderEnemy(ctx);
        
        // Render health bar
        this.renderHealthBar(ctx);
        
        // Render particles
        this.renderParticles(ctx);
        
        ctx.restore();
    }
    
    renderEnemy(ctx) {
        const centerX = this.x;
        const centerY = this.y;
        const size = this.config.size;
        
        // Apply status effect colors
        let color = this.config.color;
        if (this.statusEffects.has('frozen')) {
            color = '#87CEEB'; // Light blue for frozen
        } else if (this.statusEffects.has('burning')) {
            color = '#FF6347'; // Red-orange for burning
        } else if (this.statusEffects.has('poisoned')) {
            color = '#9ACD32'; // Yellow-green for poisoned
        }
        
        // Draw enemy body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw enemy border
        ctx.strokeStyle = this.getBorderColor();
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw enemy icon
        ctx.fillStyle = '#ffffff';
        ctx.font = `${size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.config.icon, centerX, centerY);
        
        // Draw special effects
        this.renderSpecialEffects(ctx, centerX, centerY, size);
    }
    
    renderSpecialEffects(ctx, centerX, centerY, size) {
        switch (this.type) {
            case 'scriptKiddie':
                // Erratic movement effect
                ctx.save();
                ctx.globalAlpha = 0.3 + Math.sin(this.animationTime * 0.01) * 0.3;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(centerX, centerY, size + 5, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                break;
                
            case 'federalAgent':
                // Persistent glow
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = '#4ecdc4';
                ctx.beginPath();
                ctx.arc(centerX, centerY, size + 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
                
            case 'corporateSaboteur':
                // Stealth effect
                if (this.statusEffects.has('stealthed')) {
                    ctx.save();
                    ctx.globalAlpha = 0.3;
                    ctx.fillStyle = '#95e77e';
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, size + 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                break;
                
            case 'aiSurveillance':
                // Scanning effect
                ctx.save();
                ctx.globalAlpha = 0.4;
                ctx.strokeStyle = '#ffe66d';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY, size + 10 + Math.sin(this.animationTime * 0.005) * 5, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                break;
                
            case 'quantumHacker':
                // Phase shift effect
                ctx.save();
                ctx.globalAlpha = 0.3 + Math.sin(this.animationTime * 0.008) * 0.3;
                ctx.fillStyle = '#a8e6cf';
                ctx.beginPath();
                ctx.arc(centerX, centerY, size + 15, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
                
            case 'corruptedMonk':
                // Corruption aura
                ctx.save();
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = '#ff8b94';
                ctx.beginPath();
                ctx.arc(centerX, centerY, size + 20, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
        }
    }
    
    renderHealthBar(ctx) {
        if (this.health >= this.maxHealth) return;
        
        const barWidth = 30;
        const barHeight = 4;
        const barY = this.y - this.config.size - 10;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);
        
        // Health fill
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#10b981' : 
                       healthPercent > 0.25 ? '#f59e0b' : '#ef4444';
        ctx.fillRect(this.x - barWidth / 2, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - barWidth / 2, barY, barWidth, barHeight);
    }
    
    renderTrail(ctx) {
        if (this.trail.length === 0) return;
        
        ctx.strokeStyle = this.config.color;
        ctx.lineCap = 'round';
        
        for (let i = 0; i < this.trail.length - 1; i++) {
            const point = this.trail[i];
            const nextPoint = this.trail[i + 1];
            const alpha = (i / this.trail.length) * 0.5;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.lineWidth = (i / this.trail.length) * 3;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
            ctx.restore();
        }
    }
    
    renderStatusEffects(ctx) {
        let yOffset = -this.config.size - 20;
        
        for (const [effectType, effect] of this.statusEffects) {
            ctx.fillStyle = this.getEffectColor(effectType);
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.getEffectIcon(effectType), this.x, this.y + yOffset);
            yOffset -= 15;
        }
    }
    
    renderParticles(ctx) {
        for (const particle of this.particles) {
            particle.render(ctx);
        }
    }
    
    renderDeath(ctx) {
        const deathProgress = (Date.now() - this.deathTime) / 1000; // 1 second death animation
        
        if (deathProgress > 1) return;
        
        ctx.save();
        ctx.globalAlpha = 1 - deathProgress;
        
        // Expand and fade
        const scale = 1 + deathProgress * 2;
        const size = this.config.size * scale;
        
        ctx.fillStyle = this.config.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    updateMovement(deltaTime) {
        if (this.reachedEnd) return;
        
        // Apply speed modifiers
        let currentSpeed = this.speed;
        
        if (this.statusEffects.has('slowed')) {
            currentSpeed *= 0.5;
        }
        
        if (this.statusEffects.has('hasted')) {
            currentSpeed *= 1.5;
        }
        
        // Special movement patterns
        switch (this.type) {
            case 'scriptKiddie':
                this.updateErraticMovement(deltaTime, currentSpeed);
                break;
            case 'federalAgent':
                this.updatePersistentMovement(deltaTime, currentSpeed);
                break;
            case 'corporateSaboteur':
                this.updateStealthMovement(deltaTime, currentSpeed);
                break;
            case 'aiSurveillance':
                this.updateAdaptiveMovement(deltaTime, currentSpeed);
                break;
            case 'quantumHacker':
                this.updateQuantumMovement(deltaTime, currentSpeed);
                break;
            case 'corruptedMonk':
                this.updateCorruptedMovement(deltaTime, currentSpeed);
                break;
            default:
                this.updateNormalMovement(deltaTime, currentSpeed);
        }
    }
    
    updateNormalMovement(deltaTime, speed) {
        // Move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 2) {
            const moveX = (dx / distance) * speed * deltaTime * 0.001;
            const moveY = (dy / distance) * speed * deltaTime * 0.001;
            
            this.x += moveX;
            this.y += moveY;
            
            this.angle = Math.atan2(dy, dx);
        } else {
            // Reached waypoint, move to next
            this.updateTarget();
        }
    }
    
    updateErraticMovement(deltaTime, speed) {
        // Add random movement
        const randomX = (Math.random() - 0.5) * speed * 0.3;
        const randomY = (Math.random() - 0.5) * speed * 0.3;
        
        this.updateNormalMovement(deltaTime, speed);
        
        this.x += randomX * deltaTime * 0.001;
        this.y += randomY * deltaTime * 0.001;
    }
    
    updatePersistentMovement(deltaTime, speed) {
        // Speed up near defenses
        let currentSpeed = speed;
        const nearestDefense = this.game.defenseManager.getNearestDefense(this.x, this.y, 200);
        
        if (nearestDefense) {
            currentSpeed *= 1.5;
        }
        
        this.updateNormalMovement(deltaTime, currentSpeed);
    }
    
    updateStealthMovement(deltaTime, speed) {
        // Periodically become invisible
        if (!this.statusEffects.has('stealthed') && Math.random() < 0.01) {
            this.applyStatusEffect('stealthed', 2000);
        }
        
        this.updateNormalMovement(deltaTime, speed);
    }
    
    updateAdaptiveMovement(deltaTime, speed) {
        // Learn from defense patterns and adapt
        const nearbyDefenses = this.game.defenseManager.getDefensesInRange(this.x, this.y, 300);
        
        if (nearbyDefenses.length > 0) {
            // Try to avoid high-threat defenses
            let avoidX = 0;
            let avoidY = 0;
            
            for (const defense of nearbyDefenses) {
                const dx = this.x - defense.centerX;
                const dy = this.y - defense.centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    avoidX += (dx / distance) * (200 / distance);
                    avoidY += (dy / distance) * (200 / distance);
                }
            }
            
            this.x += avoidX * deltaTime * 0.001;
            this.y += avoidY * deltaTime * 0.001;
        }
        
        this.updateNormalMovement(deltaTime, speed);
    }
    
    updateQuantumMovement(deltaTime, speed) {
        // Teleport occasionally
        if (Math.random() < 0.005) {
            // Teleport forward along path
            const teleportDistance = 100;
            const pathPosition = this.game.level.getPathPosition(this.progress + 0.1);
            
            this.x = pathPosition.x;
            this.y = pathPosition.y;
            
            // Create teleport effect
            this.createTeleportEffect();
        } else {
            this.updateNormalMovement(deltaTime, speed);
        }
    }
    
    updateCorruptedMovement(deltaTime, speed) {
        // Move slowly but heal nearby enemies
        this.updateNormalMovement(deltaTime, speed * 0.7);
        
        // Heal nearby corrupted enemies
        for (const enemy of this.game.enemies) {
            if (enemy !== this && enemy.type === 'corruptedMonk') {
                const distance = Utils.distance(this.x, this.y, enemy.x, enemy.y);
                if (distance <= 100) {
                    enemy.health = Math.min(enemy.maxHealth, enemy.health + deltaTime * 0.01);
                }
            }
        }
        
        // Corrupt nearby defenses
        for (const defense of this.game.defenses) {
            const distance = Utils.distance(this.x, this.y, defense.centerX, defense.centerY);
            if (distance <= 80) {
                defense.applyDebuff('corrupted', 1000);
            }
        }
    }
    
    updateTarget() {
        if (this.game.level && this.game.level.path.length > 0) {
            const path = this.game.level.path;
            
            if (this.pathIndex < path.length - 1) {
                this.pathIndex++;
                this.targetX = path[this.pathIndex].x;
                this.targetY = path[this.pathIndex].y;
                
                // Update progress
                this.progress = this.pathIndex / (path.length - 1);
            } else {
                this.reachedEnd = true;
            }
        }
    }
    
    updateTrail(deltaTime) {
        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y });
        
        // Limit trail length
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime);
            
            if (particle.isDead) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateStatusEffects(deltaTime) {
        for (const [effectType, effect] of this.statusEffects) {
            effect.duration -= deltaTime;
            
            if (effect.duration <= 0) {
                this.statusEffects.delete(effectType);
            }
        }
    }
    
    updateSpecialAbilities(deltaTime) {
        if (this.specialAbilityActive) {
            this.specialAbilityDuration -= deltaTime;
            if (this.specialAbilityDuration <= 0) {
                this.deactivateSpecialAbility();
            }
        }
        
        if (this.specialAbilityCooldown > 0) {
            this.specialAbilityCooldown -= deltaTime;
        }
    }
    
    updateAI(deltaTime) {
        // Update target priority based on various factors
        this.targetPriority = this.progress * 100; // Progress is most important
        this.targetPriority += (1 - this.health / this.maxHealth) * 50; // Lower health = higher priority
        this.targetPriority += this.speed * 0.5; // Faster enemies = higher priority
        this.targetPriority += this.reward.dharma * 2; // Higher reward = higher priority
        
        // Update threat level
        this.threatLevel = 1 + (this.maxHealth / 20) + (this.speed / 50);
    }
    
    updateDeath(deltaTime) {
        // Death animation is handled in renderDeath
    }
    
    takeDamage(amount, damageType = 'fire') {
        // Apply resistance
        const resistance = this.resistance[damageType] || 1;
        const actualDamage = amount * resistance;
        
        this.health -= actualDamage;
        
        // Create damage effect
        this.createDamageEffect(actualDamage);
        
        // Check if dead
        if (this.health <= 0) {
            this.die();
        }
        
        // Play sound
        this.game.audioManager.playSound('enemyHit');
    }
    
    die() {
        this.isDead = true;
        this.deathTime = Date.now();
        
        // Create death effect
        this.createDeathEffect();
        
        // Remove status effects
        this.statusEffects.clear();
    }
    
    createDamageEffect(damage) {
        // Create damage number
        const damageText = {
            x: this.x,
            y: this.y - this.config.size - 10,
            text: Math.floor(damage).toString(),
            color: '#ffffff',
            alpha: 1,
            velocity: { x: 0, y: -1 },
            update: function(deltaTime) {
                this.y += this.velocity.y;
                this.alpha -= deltaTime * 0.002;
                this.isDead = this.alpha <= 0;
            },
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(this.text, this.x, this.y);
                ctx.restore();
            }
        };
        
        this.particles.push(damageText);
    }
    
    createDeathEffect() {
        // Create explosion particles
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 * i) / 10;
            const speed = Utils.randomRange(2, 5);
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: this.config.color,
                size: Utils.randomRange(2, 4),
                update: function(deltaTime) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.98;
                    this.vy *= 0.98;
                    this.life -= deltaTime * 0.002;
                    this.isDead = this.life <= 0;
                },
                render: function(ctx) {
                    Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life);
                }
            });
        }
    }
    
    createTeleportEffect() {
        // Create teleport particles
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 30;
            
            this.particles.push({
                x: this.x + Math.cos(angle) * distance,
                y: this.y + Math.sin(angle) * distance,
                vx: 0,
                vy: 0,
                life: 1,
                color: '#a8e6cf',
                size: Utils.randomRange(1, 3),
                update: function(deltaTime) {
                    this.life -= deltaTime * 0.003;
                    this.size *= 0.95;
                    this.isDead = this.life <= 0;
                },
                render: function(ctx) {
                    Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life);
                }
            });
        }
    }
    
    applyStatusEffect(effectType, duration) {
        this.statusEffects.set(effectType, {
            type: effectType,
            duration: duration,
            startTime: Date.now()
        });
    }
    
    hasStatusEffect(effectType) {
        return this.statusEffects.has(effectType);
    }
    
    removeStatusEffect(effectType) {
        this.statusEffects.delete(effectType);
    }
    
    checkEndReached() {
        if (this.reachedEnd) {
            // Enemy reached the end
            this.game.lives -= this.damage;
            this.game.uiManager.updateLives();
            this.isDead = true;
            this.deathTime = Date.now();
            
            // Play sound
            this.game.audioManager.playSound('lifeLost');
        }
    }
    
    // Utility methods
    getBorderColor() {
        if (this.statusEffects.has('frozen')) {
            return '#87CEEB';
        } else if (this.statusEffects.has('burning')) {
            return '#FF6347';
        } else if (this.statusEffects.has('poisoned')) {
            return '#9ACD32';
        }
        return '#ffffff';
    }
    
    getEffectColor(effectType) {
        const colors = {
            frozen: '#87CEEB',
            burning: '#FF6347',
            poisoned: '#9ACD32',
            slowed: '#FFA500',
            hasted: '#00FF00',
            stealthed: '#95e77e',
            scrambled: '#DDA0DD'
        };
        return colors[effectType] || '#ffffff';
    }
    
    getEffectIcon(effectType) {
        const icons = {
            frozen: '❄️',
            burning: '🔥',
            poisoned: '☠️',
            slowed: '🐌',
            hasted: '⚡',
            stealthed: '👻',
            scrambled: '🌀'
        };
        return icons[effectType] || '✨';
    }
    
    // Save/Load support
    getSaveData() {
        return {
            x: this.x,
            y: this.y,
            type: this.type,
            health: this.health,
            maxHealth: this.maxHealth,
            pathIndex: this.pathIndex,
            progress: this.progress,
            statusEffects: Array.from(this.statusEffects.entries())
        };
    }
    
    loadSaveData(saveData) {
        this.x = saveData.x;
        this.y = saveData.y;
        this.type = saveData.type;
        this.health = saveData.health;
        this.maxHealth = saveData.maxHealth;
        this.pathIndex = saveData.pathIndex;
        this.progress = saveData.progress;
        
        // Restore status effects
        this.statusEffects = new Map(saveData.statusEffects || []);
        
        // Update target
        this.updateTarget();
    }
}