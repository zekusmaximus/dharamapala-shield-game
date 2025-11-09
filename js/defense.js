// Defense class - represents a single defense tower
import { CONFIG } from './config.js';
import { Utils } from './utils.js';
import { Projectile } from './Projectile.js';

export class Defense {
    constructor(game, x, y, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;
        this.config = CONFIG.DEFENSE_TYPES[type];
        
        // Defense properties
        this.level = 1;
        this.maxLevel = 5;
        this.experience = 0;
        this.experienceToNextLevel = 100;
        
        // Combat properties
        this.damage = this.config.damage;
        this.range = this.config.range;
        this.fireRate = this.config.fireRate;
        this.lastFireTime = 0;
        this.target = null;
        this.angle = 0;
        
        // Special abilities
        this.specialAbilityCooldown = 0;
        this.specialAbilityActive = false;
        this.specialAbilityDuration = 0;
        
        // Visual properties
        this.animationTime = 0;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.rotationSpeed = 0.02;
        this.particles = [];
        
        // Buffs and debuffs
        this.buffs = new Map();
        this.debuffs = new Map();
        
        // State
        this.isActive = true;
        this.isPlacing = false;
        this.isUpgrading = false;
        
        // Grid position
        this.gridX = Math.floor(x / CONFIG.GRID_SIZE);
        this.gridY = Math.floor(y / CONFIG.GRID_SIZE);
        
        // Center position
        this.centerX = x + CONFIG.GRID_SIZE / 2;
        this.centerY = y + CONFIG.GRID_SIZE / 2;
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        // Update animation
        this.animationTime += deltaTime;
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Update buffs and debuffs
        this.updateBuffs(deltaTime);
        this.updateDebuffs(deltaTime);
        
        // Update special ability
        this.updateSpecialAbility(deltaTime);
        
        // Find and engage targets
        this.updateTargeting();
        
        // Update rotation
        this.updateRotation(deltaTime);
        
        // Fire at targets
        this.updateFiring(deltaTime);
        
        // Update visual effects
        this.updateVisualEffects(deltaTime);
    }
    
    render(ctx) {
        if (!this.isActive) return;
        
        ctx.save();
        
        // Draw range circle when selected or hovering
        if (this.isSelected() || this.isHovered()) {
            this.renderRange(ctx);
        }
        
        // Draw base
        this.renderBase(ctx);
        
        // Draw turret
        this.renderTurret(ctx);
        
        // Draw special effects
        this.renderSpecialEffects(ctx);
        
        // Draw particles
        this.renderParticles(ctx);
        
        // Draw level indicator
        this.renderLevelIndicator(ctx);
        
        // Draw upgrade indicator
        if (this.canUpgrade()) {
            this.renderUpgradeIndicator(ctx);
        }
        
        ctx.restore();
    }
    
    renderBase(ctx) {
        const centerX = this.x + CONFIG.GRID_SIZE / 2;
        const centerY = this.y + CONFIG.GRID_SIZE / 2;
        const baseSize = CONFIG.GRID_SIZE * 0.8;
        
        // Draw base platform
        ctx.fillStyle = this.config.color;
        ctx.fillRect(centerX - baseSize / 2, centerY - baseSize / 2, baseSize, baseSize);
        
        // Draw base border
        ctx.strokeStyle = this.getBorderColor();
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - baseSize / 2, centerY - baseSize / 2, baseSize, baseSize);
        
        // Draw decorative elements based on type
        this.renderBaseDecorations(ctx, centerX, centerY, baseSize);
    }
    
    renderBaseDecorations(ctx, centerX, centerY, size) {
        switch (this.type) {
            case 'firewall':
                // Draw prayer flags
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('🙏', centerX, centerY - size / 4);
                break;
                
            case 'encryption':
                // Draw encryption symbols
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(centerX, centerY, size / 4, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'decoy':
                // Draw false target indicator
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(centerX, centerY, size / 3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'mirror':
                // Draw reflective surface
                const gradient = ctx.createLinearGradient(centerX - size / 2, centerY, centerX + size / 2, centerY);
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.5, this.config.color);
                gradient.addColorStop(1, '#ffffff');
                ctx.fillStyle = gradient;
                ctx.fillRect(centerX - size / 3, centerY - size / 6, size * 2 / 3, size / 3);
                break;
                
            case 'anonymity':
                // Draw cloaking effect
                ctx.fillStyle = `rgba(139, 92, 246, ${0.3 + Math.sin(this.animationTime * 0.002) * 0.2})`;
                ctx.beginPath();
                ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'distributor':
                // Draw energy flow
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY, size / 3, 0, Math.PI * 2);
                ctx.stroke();
                break;
        }
    }
    
    renderTurret(ctx) {
        const centerX = this.x + CONFIG.GRID_SIZE / 2;
        const centerY = this.y + CONFIG.GRID_SIZE / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.angle);
        
        // Draw turret barrel
        ctx.fillStyle = this.config.color;
        ctx.fillRect(0, -3, CONFIG.GRID_SIZE * 0.6, 6);
        
        // Draw turret tip
        ctx.beginPath();
        ctx.arc(CONFIG.GRID_SIZE * 0.6, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    renderRange(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = this.config.color;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.range, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = this.config.color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }
    
    renderSpecialEffects(ctx) {
        if (this.specialAbilityActive) {
            // Draw special ability aura
            const pulse = Math.sin(this.animationTime * 0.005) * 0.3 + 0.7;
            ctx.save();
            ctx.globalAlpha = pulse;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.range * 1.2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
    
    renderParticles(ctx) {
        for (const particle of this.particles) {
            particle.render(ctx);
        }
    }
    
    renderLevelIndicator(ctx) {
        if (this.level > 1) {
            const centerX = this.x + CONFIG.GRID_SIZE / 2;
            const centerY = this.y + CONFIG.GRID_SIZE / 2;
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`Lv${this.level}`, centerX, centerY);
        }
    }
    
    renderUpgradeIndicator(ctx) {
        const centerX = this.x + CONFIG.GRID_SIZE / 2;
        const centerY = this.y + CONFIG.GRID_SIZE / 2;
        
        // Draw upgrade arrow
        ctx.save();
        ctx.globalAlpha = 0.5 + Math.sin(this.animationTime * 0.003) * 0.3;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - CONFIG.GRID_SIZE / 2 - 5);
        ctx.lineTo(centerX - 5, centerY - CONFIG.GRID_SIZE / 2 - 10);
        ctx.lineTo(centerX + 5, centerY - CONFIG.GRID_SIZE / 2 - 10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    
    updateTargeting() {
        if (this.config.special === 'decoy') {
            // Decoys don't target enemies
            return;
        }
        
        // Find best target
        if (!this.target || !this.isValidTarget(this.target)) {
            this.target = this.findBestTarget();
        }
        
        // Update angle to face target
        if (this.target) {
            const targetAngle = Utils.angle(this.centerX, this.centerY, this.target.x, this.target.y);
            const angleDiff = targetAngle - this.angle;
            
            // Normalize angle difference
            let normalizedDiff = angleDiff;
            while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
            while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
            
            // Rotate towards target
            this.angle += normalizedDiff * 0.1;
        }
    }
    
    updateFiring(deltaTime) {
        if (this.config.special === 'decoy') {
            // Decoys don't fire
            return;
        }
        
        const currentTime = Date.now();
        const fireRate = this.getFireRate();
        
        if (this.target && this.isValidTarget(this.target) && 
            currentTime - this.lastFireTime >= fireRate) {
            this.fire();
            this.lastFireTime = currentTime;
        }
    }
    
    updateRotation(deltaTime) {
        // Idle rotation when no target
        if (!this.target) {
            this.angle += this.rotationSpeed;
        }
    }
    
    updateVisualEffects(deltaTime) {
        // Create ambient particles
        if (Math.random() < 0.1) {
            this.createAmbientParticle();
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
    
    updateBuffs(deltaTime) {
        for (const [buffType, buff] of this.buffs) {
            buff.duration -= deltaTime;
            if (buff.duration <= 0) {
                this.removeBuff(buffType);
            }
        }
    }
    
    updateDebuffs(deltaTime) {
        for (const [debuffType, debuff] of this.debuffs) {
            debuff.duration -= deltaTime;
            if (debuff.duration <= 0) {
                this.removeDebuff(debuffType);
            }
        }
    }
    
    updateSpecialAbility(deltaTime) {
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
    
    fire() {
        if (!this.target) return;
        
        // Create projectile
        const projectile = new Projectile(
            this.game,
            this.centerX,
            this.centerY,
            this.target,
            this.getDamage(),
            this.getProjectileSpeed(),
            this.config.color,
            this.type
        );
        
        this.game.projectiles.push(projectile);
        
        // Create muzzle flash
        this.createMuzzleFlash();
        
        // Play sound
        this.game.audioManager.playSound('shoot');
        
        // Apply special effects
        this.applyFireEffects();
    }
    
    applyFireEffects() {
        switch (this.type) {
            case 'encryption':
                // Encryption scrambles nearby enemies
                this.scrambleNearbyEnemies();
                break;
                
            case 'mirror':
                // Mirror has chance to reflect damage
                if (Math.random() < 0.1) {
                    this.createReflectionEffect();
                }
                break;
                
            case 'anonymity':
                // Anonymity cloaks nearby defenses
                this.cloakNearbyDefenses();
                break;
                
            case 'distributor':
                // Distributor boosts nearby defenses
                this.boostNearbyDefenses();
                break;
        }
    }
    
    scrambleNearbyEnemies() {
        const range = this.range * 0.5;
        for (const enemy of this.game.enemies) {
            const distance = Utils.distance(this.centerX, this.centerY, enemy.x, enemy.y);
            if (distance <= range) {
                enemy.applyDebuff('scrambled', 2000);
            }
        }
    }
    
    createReflectionEffect() {
        // Create visual effect for reflection
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: this.centerX,
                y: this.centerY,
                vx: Utils.randomRange(-3, 3),
                vy: Utils.randomRange(-3, 3),
                life: 1,
                color: '#53d8fb',
                size: Utils.randomRange(2, 4),
                update: function(deltaTime) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.life -= deltaTime * 0.002;
                    this.isDead = this.life <= 0;
                },
                render: function(ctx) {
                    Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life);
                }
            });
        }
    }
    
    cloakNearbyDefenses() {
        const range = this.range * 0.7;
        for (const defense of this.game.defenses) {
            if (defense !== this) {
                const distance = Utils.distance(this.centerX, this.centerY, 
                                               defense.centerX, defense.centerY);
                if (distance <= range) {
                    defense.applyBuff('cloaked', 3000);
                }
            }
        }
    }
    
    boostNearbyDefenses() {
        const range = this.range * 0.8;
        for (const defense of this.game.defenses) {
            if (defense !== this) {
                const distance = Utils.distance(this.centerX, this.centerY, 
                                               defense.centerX, defense.centerY);
                if (distance <= range) {
                    defense.applyBuff('boosted', 2000);
                }
            }
        }
    }
    
    createMuzzleFlash() {
        this.particles.push({
            x: this.centerX + Math.cos(this.angle) * CONFIG.GRID_SIZE * 0.6,
            y: this.centerY + Math.sin(this.angle) * CONFIG.GRID_SIZE * 0.6,
            vx: 0,
            vy: 0,
            life: 0.5,
            color: '#ffffff',
            size: 8,
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
    
    createAmbientParticle() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Utils.randomRange(0, CONFIG.GRID_SIZE / 2);
        
        this.particles.push({
            x: this.centerX + Math.cos(angle) * distance,
            y: this.centerY + Math.sin(angle) * distance,
            vx: Utils.randomRange(-0.5, 0.5),
            vy: Utils.randomRange(-0.5, 0.5),
            life: 1,
            color: this.config.color,
            size: Utils.randomRange(1, 2),
            update: function(deltaTime) {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= deltaTime * 0.001;
                this.isDead = this.life <= 0;
            },
            render: function(ctx) {
                Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life * 0.5);
            }
        });
    }
    
    findBestTarget() {
        let bestTarget = null;
        let bestScore = -Infinity;
        
        for (const enemy of this.game.enemies) {
            const distance = Utils.distance(this.centerX, this.centerY, enemy.x, enemy.y);
            
            if (distance <= this.range) {
                let score = 0;
                
                // Prioritize enemies closer to the end
                score += enemy.progress * 100;
                
                // Prioritize lower health enemies
                score += (1 - enemy.health / enemy.maxHealth) * 50;
                
                // Prioritize faster enemies
                score += enemy.speed * 0.5;
                
                // Adjust for distance
                score += (this.range - distance) * 0.1;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = enemy;
                }
            }
        }
        
        return bestTarget;
    }
    
    isValidTarget(target) {
        if (!target || target.isDead) return false;
        
        const distance = Utils.distance(this.centerX, this.centerY, target.x, target.y);
        return distance <= this.range;
    }
    
    needsTarget() {
        return !this.target || !this.isValidTarget(this.target);
    }
    
    setTarget(target) {
        this.target = target;
    }
    
    // Upgrade system
    canUpgrade() {
        return this.level < this.maxLevel;
    }
    
    getUpgradeCost() {
        const baseCost = this.config.cost.dharma;
        const multiplier = Math.pow(1.5, this.level);
        return {
            dharma: Math.floor(baseCost * multiplier),
            bandwidth: Math.floor(this.config.cost.bandwidth * multiplier * 0.5),
            anonymity: Math.floor(this.config.cost.anonymity * multiplier * 0.3)
        };
    }
    
    upgrade() {
        if (!this.canUpgrade()) return;
        
        this.level++;
        this.damage = Math.floor(this.config.damage * (1 + this.level * 0.2));
        this.range = this.config.range * (1 + this.level * 0.1);
        this.fireRate = Math.max(200, this.config.fireRate * (1 - this.level * 0.1));
        
        // Create upgrade effect
        this.createUpgradeEffect();
        
        // Add experience
        this.addExperience(50);
    }
    
    createUpgradeEffect() {
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 * i) / 10;
            this.particles.push({
                x: this.centerX,
                y: this.centerY,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                life: 1,
                color: '#10b981',
                size: Utils.randomRange(3, 6),
                update: function(deltaTime) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.95;
                    this.vy *= 0.95;
                    this.life -= deltaTime * 0.002;
                    this.isDead = this.life <= 0;
                },
                render: function(ctx) {
                    Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life);
                }
            });
        }
    }
    
    // Experience system
    addExperience(amount) {
        this.experience += amount;
        
        while (this.experience >= this.experienceToNextLevel && this.canUpgrade()) {
            this.experience -= this.experienceToNextLevel;
            this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
            this.level++;
        }
    }
    
    // Buff system
    applyBuff(buffType, duration) {
        this.buffs.set(buffType, {
            type: buffType,
            duration: duration,
            startTime: Date.now()
        });
    }
    
    removeBuff(buffType) {
        this.buffs.delete(buffType);
    }
    
    hasBuff(buffType) {
        return this.buffs.has(buffType);
    }
    
    applyDebuff(debuffType, duration) {
        this.debuffs.set(debuffType, {
            type: debuffType,
            duration: duration,
            startTime: Date.now()
        });
    }
    
    removeDebuff(debuffType) {
        this.debuffs.delete(debuffType);
    }
    
    hasDebuff(debuffType) {
        return this.debuffs.has(debuffType);
    }
    
    // Special abilities
    hasSpecialAbility() {
        return this.specialAbilityCooldown <= 0;
    }
    
    activateSpecialAbility() {
        if (!this.hasSpecialAbility()) return;
        
        this.specialAbilityActive = true;
        this.specialAbilityDuration = 5000; // 5 seconds
        this.specialAbilityCooldown = 30000; // 30 second cooldown
        
        // Apply ability effects
        this.applySpecialAbilityEffects();
    }
    
    deactivateSpecialAbility() {
        this.specialAbilityActive = false;
        this.specialAbilityDuration = 0;
    }
    
    applySpecialAbilityEffects() {
        switch (this.type) {
            case 'firewall':
                // Firewall creates temporary barrier
                this.createBarrierEffect();
                break;
                
            case 'encryption':
                // Encryption encrypts all projectiles
                this.encryptAllProjectiles();
                break;
                
            case 'mirror':
                // Mirror reflects all damage
                this.activateReflectionMode();
                break;
                
            case 'anonymity':
                // Anonymity cloaks entire area
                this.createCloakField();
                break;
                
            case 'distributor':
                // Distributor doubles resource generation
                this.activateResourceBoost();
                break;
        }
    }
    
    createBarrierEffect() {
        // Create visual barrier effect
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            this.particles.push({
                x: this.centerX + Math.cos(angle) * this.range,
                y: this.centerY + Math.sin(angle) * this.range,
                vx: -Math.cos(angle) * 2,
                vy: -Math.sin(angle) * 2,
                life: 2,
                color: '#e94560',
                size: Utils.randomRange(4, 8),
                update: function(deltaTime) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.life -= deltaTime * 0.001;
                    this.isDead = this.life <= 0;
                },
                render: function(ctx) {
                    Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life);
                }
            });
        }
    }
    
    encryptAllProjectiles() {
        for (const projectile of this.game.projectiles) {
            projectile.applyBuff('encrypted', 3000);
        }
    }
    
    activateReflectionMode() {
        this.applyBuff('reflection', this.specialAbilityDuration);
    }
    
    createCloakField() {
        const range = this.range * 1.5;
        for (const defense of this.game.defenses) {
            const distance = Utils.distance(this.centerX, this.centerY, 
                                           defense.centerX, defense.centerY);
            if (distance <= range) {
                defense.applyBuff('cloaked', this.specialAbilityDuration);
            }
        }
    }
    
    activateResourceBoost() {
        this.game.resourceBoost = 2; // Double resource generation
        setTimeout(() => {
            this.game.resourceBoost = 1;
        }, this.specialAbilityDuration);
    }
    
    // Getters with buff/debuff modifiers
    getDamage() {
        let damage = this.damage;
        
        if (this.hasBuff('boosted')) {
            damage *= 1.5;
        }
        
        if (this.hasDebuff('weakened')) {
            damage *= 0.7;
        }
        
        return Math.floor(damage);
    }
    
    getRange() {
        let range = this.range;
        
        if (this.hasBuff('boosted')) {
            range *= 1.2;
        }
        
        if (this.hasDebuff('blinded')) {
            range *= 0.8;
        }
        
        return range;
    }
    
    getFireRate() {
        let fireRate = this.fireRate;
        
        if (this.hasBuff('boosted')) {
            fireRate *= 0.7; // Faster firing
        }
        
        if (this.hasDebuff('slowed')) {
            fireRate *= 1.3; // Slower firing
        }
        
        return Math.max(100, fireRate);
    }
    
    getProjectileSpeed() {
        let speed = this.config.projectileSpeed;
        
        if (this.hasBuff('boosted')) {
            speed *= 1.3;
        }
        
        return speed;
    }
    
    getBorderColor() {
        if (this.hasBuff('cloaked')) {
            return 'rgba(139, 92, 246, 0.5)';
        }
        
        if (this.hasBuff('boosted')) {
            return '#10b981';
        }
        
        if (this.hasDebuff('corrupted')) {
            return '#ff4444';
        }
        
        return '#ffffff';
    }
    
    // Utility methods
    isSelected() {
        return this.game.uiManager.selectedDefense === this;
    }
    
    isHovered() {
        const mouseX = this.game.mouse.x;
        const mouseY = this.game.mouse.y;
        return Utils.pointInRect(mouseX, mouseY, this.x, this.y, CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    }
    
    takeDamage(amount) {
        // Defenses can take damage from certain enemy types
        if (this.hasDebuff('corrupted')) {
            this.isActive = false;
            this.createDestructionEffect();
        }
    }
    
    createDestructionEffect() {
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Utils.randomRange(2, 6);
            
            this.particles.push({
                x: this.centerX,
                y: this.centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: '#ff4444',
                size: Utils.randomRange(3, 8),
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
    
    // Save/Load support
    getSaveData() {
        return {
            x: this.x,
            y: this.y,
            type: this.type,
            level: this.level,
            experience: this.experience,
            experienceToNextLevel: this.experienceToNextLevel,
            buffs: Array.from(this.buffs.entries()),
            debuffs: Array.from(this.debuffs.entries())
        };
    }
    
    loadSaveData(saveData) {
        this.x = saveData.x;
        this.y = saveData.y;
        this.type = saveData.type;
        this.level = saveData.level;
        this.experience = saveData.experience;
        this.experienceToNextLevel = saveData.experienceToNextLevel;
        
        // Recalculate position
        this.centerX = this.x + CONFIG.GRID_SIZE / 2;
        this.centerY = this.y + CONFIG.GRID_SIZE / 2;
        this.gridX = Math.floor(this.x / CONFIG.GRID_SIZE);
        this.gridY = Math.floor(this.y / CONFIG.GRID_SIZE);
        
        // Restore buffs and debuffs
        this.buffs = new Map(saveData.buffs || []);
        this.debuffs = new Map(saveData.debuffs || []);
        
        // Update stats based on level
        this.damage = Math.floor(this.config.damage * (1 + this.level * 0.2));
        this.range = this.config.range * (1 + this.level * 0.1);
        this.fireRate = Math.max(200, this.config.fireRate * (1 - this.level * 0.1));
    }
}