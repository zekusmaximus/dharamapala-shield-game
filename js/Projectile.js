// Projectile class - represents projectiles fired by defenses
import { CONFIG } from './config.js';
import { Utils } from './utils.js';

export class Projectile {
    constructor(game, x, y, target, damage, speed, color, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = speed;
        this.color = color;
        this.type = type;
        
        // Projectile properties
        this.vx = 0;
        this.vy = 0;
        this.radius = 4;
        this.isActive = true;
        this.piercing = false;
        this.homing = false;
        this.splash = false;
        this.splashRadius = 0;
        this.piercedTargets = new Set();
        
        // Visual properties
        this.trail = [];
        this.maxTrailLength = 10;
        this.particles = [];
        this.animationTime = 0;
        
        // Special properties based on type
        this.initializeSpecialProperties();
        
        // Calculate initial velocity
        this.updateVelocity();
    }
    
    initializeSpecialProperties() {
        switch (this.type) {
            case 'firewall':
                // Basic projectile
                this.radius = 4;
                break;
                
            case 'encryption':
                // Slower but piercing
                this.speed *= 0.8;
                this.piercing = true;
                this.radius = 3;
                this.color = '#0f3460';
                break;
                
            case 'mirror':
                // Fast and reflects
                this.speed *= 1.2;
                this.radius = 5;
                this.color = '#53d8fb';
                break;
                
            case 'anonymity':
                // Homing projectile
                this.homing = true;
                this.radius = 3;
                this.color = '#8b5cf6';
                break;
                
            case 'distributor':
                // Splash damage
                this.splash = true;
                this.splashRadius = 50;
                this.radius = 6;
                this.color = '#10b981';
                break;
        }
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        // Update animation
        this.animationTime += deltaTime;
        
        // Update velocity if homing
        if (this.homing && this.target && !this.target.isDead) {
            this.updateVelocity();
        }
        
        // Update position
        this.x += this.vx * deltaTime * 0.001;
        this.y += this.vy * deltaTime * 0.001;
        
        // Update trail
        this.updateTrail(deltaTime);
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Check collisions
        this.checkCollisions();
        
        // Check if out of bounds
        this.checkBounds();
        
        // Create particles
        this.createParticles();
    }
    
    render(ctx) {
        if (!this.isActive) return;
        
        // Render trail
        this.renderTrail(ctx);
        
        // Render particles
        this.renderParticles(ctx);
        
        // Render projectile
        this.renderProjectile(ctx);
    }
    
    renderProjectile(ctx) {
        ctx.save();
        
        // Apply special effects
        if (this.type === 'encryption') {
            // Encrypted projectile has data stream effect
            ctx.globalAlpha = 0.8 + Math.sin(this.animationTime * 0.01) * 0.2;
        } else if (this.type === 'mirror') {
            // Mirror projectile has reflective glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        } else if (this.type === 'anonymity') {
            // Anonymity projectile cloaks itself
            ctx.globalAlpha = 0.6 + Math.sin(this.animationTime * 0.008) * 0.3;
        }
        
        // Draw projectile
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw special indicators
        this.renderSpecialIndicators(ctx);
        
        ctx.restore();
    }
    
    renderSpecialIndicators(ctx) {
        if (this.splash) {
            // Draw splash radius indicator
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.splashRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        if (this.piercing) {
            // Draw piercing indicator
            ctx.save();
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('P', this.x, this.y);
            ctx.restore();
        }
        
        if (this.homing) {
            // Draw homing indicator
            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
    
    renderTrail(ctx) {
        if (this.trail.length === 0) return;
        
        ctx.strokeStyle = this.color;
        ctx.lineCap = 'round';
        
        for (let i = 0; i < this.trail.length - 1; i++) {
            const point = this.trail[i];
            const nextPoint = this.trail[i + 1];
            const alpha = (i / this.trail.length) * 0.5;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.lineWidth = (i / this.trail.length) * this.radius;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
            ctx.restore();
        }
    }
    
    renderParticles(ctx) {
        for (const particle of this.particles) {
            particle.render(ctx);
        }
    }
    
    updateVelocity() {
        if (!this.target || this.target.isDead) {
            // Continue in current direction if no target
            return;
        }
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
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
    
    checkCollisions() {
        if (!this.target || this.target.isDead) {
            // Find new target if current one is dead
            this.findNewTarget();
            return;
        }
        
        const distance = Utils.distance(this.x, this.y, this.target.x, this.target.y);
        
        if (distance <= this.target.radius + this.radius) {
            this.hit();
        }
    }
    
    checkBounds() {
        const margin = 50;
        if (this.x < -margin || this.x > this.game.width + margin ||
            this.y < -margin || this.y > this.game.height + margin) {
            this.isActive = false;
        }
    }
    
    createParticles() {
        // Create particles based on projectile type
        if (Math.random() < 0.3) {
            switch (this.type) {
                case 'firewall':
                    this.createFireParticle();
                    break;
                case 'encryption':
                    this.createDataParticle();
                    break;
                case 'mirror':
                    this.createReflectiveParticle();
                    break;
                case 'anonymity':
                    this.createCloakParticle();
                    break;
                case 'distributor':
                    this.createEnergyParticle();
                    break;
            }
        }
    }
    
    createFireParticle() {
        this.particles.push({
            x: this.x + (Math.random() - 0.5) * 4,
            y: this.y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: 0.5,
            color: '#ff6b6b',
            size: 2,
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
    
    createDataParticle() {
        this.particles.push({
            x: this.x,
            y: this.y,
            vx: 0,
            vy: 0,
            life: 0.3,
            color: '#0f3460',
            size: 1,
            update: function(deltaTime) {
                this.life -= deltaTime * 0.003;
                this.isDead = this.life <= 0;
            },
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x - 1, this.y - 1, 2, 2);
                ctx.restore();
            }
        });
    }
    
    createReflectiveParticle() {
        const angle = Math.random() * Math.PI * 2;
        this.particles.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            life: 0.4,
            color: '#53d8fb',
            size: 3,
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
    
    createCloakParticle() {
        this.particles.push({
            x: this.x + (Math.random() - 0.5) * 8,
            y: this.y + (Math.random() - 0.5) * 8,
            vx: 0,
            vy: -0.5,
            life: 0.6,
            color: '#8b5cf6',
            size: 2,
            update: function(deltaTime) {
                this.y += this.vy;
                this.life -= deltaTime * 0.001;
                this.isDead = this.life <= 0;
            },
            render: function(ctx) {
                Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life * 0.5);
            }
        });
    }
    
    createEnergyParticle() {
        this.particles.push({
            x: this.x,
            y: this.y,
            vx: 0,
            vy: 0,
            life: 0.2,
            color: '#10b981',
            size: 4,
            update: function(deltaTime) {
                this.life -= deltaTime * 0.004;
                this.size *= 0.95;
                this.isDead = this.life <= 0;
            },
            render: function(ctx) {
                Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life);
            }
        });
    }
    
    hit() {
        if (!this.target || this.target.isDead) return;
        
        // Check if already pierced this target
        if (this.piercing && this.piercedTargets.has(this.target)) {
            return;
        }
        
        // Deal damage
        this.target.takeDamage(this.damage);
        
        // Add to pierced targets
        if (this.piercing) {
            this.piercedTargets.add(this.target);
        }
        
        // Apply splash damage
        if (this.splash) {
            this.applySplashDamage();
        }
        
        // Create hit effect
        this.createHitEffect();
        
        // Apply special effects
        this.applySpecialEffects();
        
        // Deactivate if not piercing
        if (!this.piercing) {
            this.isActive = false;
        }
    }
    
    applySplashDamage() {
        for (const enemy of this.game.enemies) {
            if (enemy === this.target) continue;
            
            const distance = Utils.distance(this.x, this.y, enemy.x, enemy.y);
            if (distance <= this.splashRadius) {
                const splashDamage = this.damage * 0.5; // 50% splash damage
                enemy.takeDamage(splashDamage);
            }
        }
    }
    
    createHitEffect() {
        // Create hit particles
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5;
            const speed = Utils.randomRange(2, 4);
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.5,
                color: this.color,
                size: Utils.randomRange(2, 4),
                update: function(deltaTime) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.95;
                    this.vy *= 0.95;
                    this.life -= deltaTime * 0.003;
                    this.isDead = this.life <= 0;
                },
                render: function(ctx) {
                    Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life);
                }
            });
        }
    }
    
    applySpecialEffects() {
        switch (this.type) {
            case 'encryption':
                // Encryption scrambles enemy
                if (this.target) {
                    this.target.applyStatusEffect('scrambled', 1000);
                }
                break;
                
            case 'mirror':
                // Mirror has chance to reflect
                if (Math.random() < 0.1 && this.target) {
                    this.createReflectionEffect();
                }
                break;
                
            case 'anonymity':
                // Anonymity cloaks enemy temporarily
                if (this.target) {
                    this.target.applyStatusEffect('stealthed', 500);
                }
                break;
                
            case 'distributor':
                // Distributor boosts nearby defenses
                this.boostNearbyDefenses();
                break;
        }
    }
    
    createReflectionEffect() {
        // Create visual reflection effect
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                life: 0.8,
                color: '#53d8fb',
                size: Utils.randomRange(3, 6),
                update: function(deltaTime) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.9;
                    this.vy *= 0.9;
                    this.life -= deltaTime * 0.002;
                    this.isDead = this.life <= 0;
                },
                render: function(ctx) {
                    Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life);
                }
            });
        }
    }
    
    boostNearbyDefenses() {
        const range = 100;
        for (const defense of this.game.defenses) {
            const distance = Utils.distance(this.x, this.y, defense.centerX, defense.centerY);
            if (distance <= range) {
                defense.applyBuff('boosted', 1000);
            }
        }
    }
    
    findNewTarget() {
        // Find new target for homing projectiles
        if (!this.homing) return;
        
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        for (const enemy of this.game.enemies) {
            if (enemy.isDead) continue;
            
            const distance = Utils.distance(this.x, this.y, enemy.x, enemy.y);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        }
        
        this.target = nearestEnemy;
    }
    
    // Buff system
    applyBuff(buffType, duration) {
        // Apply buff to projectile
        switch (buffType) {
            case 'speed':
                this.speed *= 1.5;
                break;
            case 'damage':
                this.damage *= 1.5;
                break;
            case 'piercing':
                this.piercing = true;
                break;
            case 'homing':
                this.homing = true;
                break;
        }
    }
    
    // Utility methods
    getSpeed() {
        return this.speed;
    }
    
    getDamage() {
        return this.damage;
    }
    
    isActive() {
        return this.isActive;
    }
}