// Particle system for visual effects
import { CONFIG, UTILS } from './config.js';

export class Particle {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.color = options.color || '#ffffff';
        this.size = options.size || 3;
        this.life = options.life || 1000;
        this.maxLife = options.life || 1000;
        this.gravity = options.gravity || 0;
        this.friction = options.friction || 0.98;
        this.fade = options.fade !== false;
        this.shrink = options.shrink !== false;
        this.rotation = options.rotation || 0;
        this.rotationSpeed = options.rotationSpeed || 0;
    }
    
    update(deltaTime) {
        // Update position
        this.x += this.vx * deltaTime / 1000;
        this.y += this.vy * deltaTime / 1000;
        
        // Apply physics
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity * deltaTime / 1000;
        
        // Update rotation
        this.rotation += this.rotationSpeed * deltaTime / 1000;
        
        // Update life
        this.life -= deltaTime;
        
        // Update size if shrinking
        if (this.shrink) {
            const lifePercent = this.life / this.maxLife;
            this.size = this.size * lifePercent;
        }
        
        return this.life > 0;
    }
    
    render(ctx) {
        const lifePercent = this.life / this.maxLife;
        
        ctx.save();
        
        // Apply fade
        if (this.fade) {
            ctx.globalAlpha = lifePercent;
        }
        
        // Apply rotation
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw particle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

export class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.particles = [];
        this.maxParticles = CONFIG.MAX_PARTICLES;
        this.emitters = new Map();
    }
    
    async init() {
        console.log('Initializing Particle System...');
        // Particle system initialization
    }
    
    update(deltaTime) {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            if (!particle.update(deltaTime)) {
                this.particles.splice(i, 1);
            }
        }
        
        // Update emitters
        for (const [id, emitter] of this.emitters) {
            emitter.update(deltaTime);
            if (emitter.isFinished) {
                this.emitters.delete(id);
            }
        }
    }
    
    render(ctx) {
        // Render particles
        for (const particle of this.particles) {
            particle.render(ctx);
        }
    }
    
    createParticle(x, y, options = {}) {
        if (this.particles.length >= this.maxParticles) {
            // Remove oldest particle
            this.particles.shift();
        }
        
        const particle = new Particle(x, y, options);
        this.particles.push(particle);
        return particle;
    }
    
    createExplosion(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = UTILS.random(50, 200);
            const size = UTILS.random(2, 6);
            
            this.createParticle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                size,
                life: UTILS.random(500, 1500),
                gravity: 100,
                friction: 0.95
            });
        }
    }
    
    createDamageParticles(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = UTILS.random(0, Math.PI * 2);
            const speed = UTILS.random(20, 100);
            const size = UTILS.random(1, 3);
            
            this.createParticle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                size,
                life: UTILS.random(200, 800),
                gravity: 50,
                friction: 0.9
            });
        }
    }
    
    createHitParticles(x, y, color, count = 5) {
        for (let i = 0; i < count; i++) {
            const angle = UTILS.random(0, Math.PI * 2);
            const speed = UTILS.random(10, 50);
            const size = UTILS.random(1, 2);
            
            this.createParticle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                size,
                life: UTILS.random(100, 400),
                gravity: 20,
                friction: 0.85
            });
        }
    }
    
    createPlacementEffect(x, y, color) {
        // Create placement particles
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            const speed = 30;
            const size = 2;
            
            this.createParticle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                size,
                life: 600,
                gravity: 0,
                friction: 0.9
            });
        }
    }
    
    createUpgradeEffect(x, y, color) {
        // Create upgrade particles
        for (let i = 0; i < 20; i++) {
            const angle = UTILS.random(0, Math.PI * 2);
            const speed = UTILS.random(30, 100);
            const size = UTILS.random(2, 4);
            
            this.createParticle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 50, // Upward bias
                color,
                size,
                life: UTILS.random(800, 2000),
                gravity: 100,
                friction: 0.95
            });
        }
    }
    
    createSellEffect(x, y, color) {
        // Create sell particles
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const speed = 40;
            const size = 3;
            
            this.createParticle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                size,
                life: 1000,
                gravity: 50,
                friction: 0.9
            });
        }
    }
    
    createTeleportEffect(x, y, color) {
        // Create teleport particles
        for (let i = 0; i < 25; i++) {
            const angle = UTILS.random(0, Math.PI * 2);
            const speed = UTILS.random(50, 150);
            const size = UTILS.random(1, 3);
            
            this.createParticle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                size,
                life: UTILS.random(300, 900),
                gravity: 0,
                friction: 0.85,
                fade: true,
                shrink: true
            });
        }
    }
    
    createErraticParticle(x, y, color) {
        // Create erratic movement particles
        const angle = UTILS.random(0, Math.PI * 2);
        const speed = UTILS.random(20, 60);
        
        this.createParticle(x, y, {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size: 2,
            life: 400,
            gravity: 0,
            friction: 0.8,
            rotationSpeed: UTILS.random(-5, 5)
        });
    }
    
    createQuantumParticle(x, y, color) {
        // Create quantum particles
        const angle = UTILS.random(0, Math.PI * 2);
        const speed = UTILS.random(30, 80);
        
        this.createParticle(x, y, {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size: UTILS.random(1, 4),
            life: UTILS.random(500, 1200),
            gravity: 0,
            friction: 0.9,
            fade: true
        });
    }
    
    createStealthParticle(x, y, color) {
        // Create stealth particles
        const angle = UTILS.random(0, Math.PI * 2);
        const speed = UTILS.random(10, 30);
        
        this.createParticle(x, y, {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size: 1,
            life: 600,
            gravity: 0,
            friction: 0.7,
            fade: true
        });
    }
    
    createCorruptParticle(x, y, color) {
        // Create corruption particles
        const angle = UTILS.random(0, Math.PI * 2);
        const speed = UTILS.random(15, 40);
        
        this.createParticle(x, y, {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size: UTILS.random(2, 5),
            life: UTILS.random(800, 2000),
            gravity: 20,
            friction: 0.85,
            fade: true
        });
    }
    
    createSlowParticle(x, y, color) {
        // Create slow effect particles
        const angle = UTILS.random(0, Math.PI * 2);
        const speed = UTILS.random(5, 20);
        
        this.createParticle(x, y, {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size: 2,
            life: 1000,
            gravity: 0,
            friction: 0.6,
            fade: true
        });
    }
    
    createEmitter(x, y, options = {}) {
        const emitter = new ParticleEmitter(x, y, options);
        const id = Date.now() + Math.random();
        this.emitters.set(id, emitter);
        return id;
    }
    
    removeEmitter(id) {
        this.emitters.delete(id);
    }
    
    clear() {
        this.particles = [];
        this.emitters.clear();
    }
    
    getParticleCount() {
        return this.particles.length;
    }
    
    getEmitterCount() {
        return this.emitters.size;
    }
}

export class ParticleEmitter {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.particleOptions = options.particleOptions || {};
        this.emitRate = options.emitRate || 10; // particles per second
        this.emitCount = options.emitCount || 0; // total particles to emit
        this.duration = options.duration || 0; // duration in ms
        this.isFinished = false;
        this.time = 0;
        this.lastEmit = 0;
        this.totalEmitted = 0;
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        // Check if finished
        if (this.duration > 0 && this.time >= this.duration) {
            this.isFinished = true;
            return;
        }
        
        if (this.emitCount > 0 && this.totalEmitted >= this.emitCount) {
            this.isFinished = true;
            return;
        }
        
        // Emit particles
        const emitInterval = 1000 / this.emitRate;
        if (this.time - this.lastEmit >= emitInterval) {
            this.emit();
            this.lastEmit = this.time;
        }
    }
    
    emit() {
        // This would be connected to the particle system
        // For now, just track emission
        this.totalEmitted++;
    }
}

export default ParticleSystem;