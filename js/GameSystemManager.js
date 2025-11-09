// Game system manager - initializes and manages all game systems
import { CONFIG } from './config.js';
import { Utils } from './utils.js';

export class GameSystemManager {
    constructor(game) {
        this.game = game;
        this.systems = new Map();
        this.initialized = false;
    }
    
    async init() {
        try {
            console.log('Initializing game systems...');
            
            // Initialize core systems
            await this.initializeCoreSystems();
            
            // Initialize gameplay systems
            await this.initializeGameplaySystems();
            
            // Initialize support systems
            await this.initializeSupportSystems();
            
            this.initialized = true;
            console.log('All game systems initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize game systems:', error);
            throw error;
        }
    }
    
    async initializeCoreSystems() {
        console.log('Initializing core systems...');
        
        // Initialize input system
        this.systems.set('input', new InputSystem(this.game));
        
        // Initialize renderer system
        this.systems.set('renderer', new RendererSystem(this.game));
        
        // Initialize audio system
        this.systems.set('audio', new AudioSystem(this.game));
        
        // Initialize save system
        this.systems.set('save', new SaveSystem(this.game));
        
        // Initialize achievement system
        this.systems.set('achievement', new AchievementSystem(this.game));
    }
    
    async initializeGameplaySystems() {
        console.log('Initializing gameplay systems...');
        
        // Initialize level system
        this.systems.set('level', new LevelSystem(this.game));
        
        // Initialize enemy system
        this.systems.set('enemy', new EnemySystem(this.game));
        
        // Initialize defense system
        this.systems.set('defense', new DefenseSystem(this.game));
        
        // Initialize projectile system
        this.systems.set('projectile', new ProjectileSystem(this.game));
        
        // Initialize particle system
        this.systems.set('particle', new ParticleSystem(this.game));
        
        // Initialize wave system
        this.systems.set('wave', new WaveSystem(this.game));
    }
    
    async initializeSupportSystems() {
        console.log('Initializing support systems...');
        
        // Initialize UI system
        this.systems.set('ui', new UISystem(this.game));
        
        // Initialize screen system
        this.systems.set('screen', new ScreenSystem(this.game));
        
        // Initialize camera system
        this.systems.set('camera', new CameraSystem(this.game));
        
        // Initialize path system
        this.systems.set('path', new PathSystem(this.game));
        
        // Initialize collision system
        this.systems.set('collision', new CollisionSystem(this.game));
    }
    
    getSystem(name) {
        return this.systems.get(name);
    }
    
    update(deltaTime) {
        if (!this.initialized) return;
        
        // Update all systems
        for (const [name, system] of this.systems) {
            if (system.update) {
                system.update(deltaTime);
            }
        }
    }
    
    render(ctx) {
        if (!this.initialized) return;
        
        // Render all systems in order
        const renderOrder = [
            'camera',
            'level',
            'defense',
            'enemy',
            'projectile',
            'particle',
            'ui',
            'screen'
        ];
        
        for (const systemName of renderOrder) {
            const system = this.systems.get(systemName);
            if (system && system.render) {
                system.render(ctx);
            }
        }
    }
    
    shutdown() {
        console.log('Shutting down game systems...');
        
        // Shutdown all systems
        for (const [name, system] of this.systems) {
            if (system.shutdown) {
                system.shutdown();
            }
        }
        
        this.systems.clear();
        this.initialized = false;
    }
}

// Individual system implementations
class InputSystem {
    constructor(game) {
        this.game = game;
        this.mouse = { x: 0, y: 0, isDown: false };
        this.touch = { x: 0, y: 0, isActive: false };
        this.keys = {};
        this.gestures = [];
    }
    
    update(deltaTime) {
        // Process gestures
        this.processGestures(deltaTime);
    }
    
    processGestures(deltaTime) {
        // Remove completed gestures
        this.gestures = this.gestures.filter(gesture => !gesture.completed);
        
        // Update active gestures
        for (const gesture of this.gestures) {
            gesture.update(deltaTime);
        }
    }
    
    addGesture(gesture) {
        this.gestures.push(gesture);
    }
}

class RendererSystem {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.width = game.width;
        this.height = game.height;
        this.backgroundColor = '#0a0a0a';
        this.gridColor = 'rgba(255, 255, 255, 0.1)';
    }
    
    render(ctx) {
        // Clear canvas
        Utils.clearCanvas(ctx, this.width, this.height);
        
        // Draw background
        this.drawBackground(ctx);
        
        // Draw grid
        this.drawGrid(ctx);
    }
    
    drawBackground(ctx) {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
    }
    
    drawGrid(ctx) {
        ctx.strokeStyle = this.gridColor;
        ctx.lineWidth = 1;
        
        const gridSize = CONFIG.GRID_SIZE;
        
        // Draw vertical lines
        for (let x = 0; x <= this.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
    }
}

class AudioSystem {
    constructor(game) {
        this.game = game;
        this.sounds = new Map();
        this.music = new Map();
        this.masterVolume = CONFIG.MASTER_VOLUME;
        this.sfxVolume = CONFIG.SFX_VOLUME;
        this.musicVolume = CONFIG.MUSIC_VOLUME;
        this.isMuted = false;
        this.currentMusic = null;
    }
    
    async loadSound(name, src) {
        try {
            const audio = new Audio(src);
            await Utils.preloadAudio(src);
            this.sounds.set(name, audio);
        } catch (error) {
            console.error(`Failed to load sound ${name}:`, error);
        }
    }
    
    async loadMusic(name, src) {
        try {
            const audio = new Audio(src);
            audio.loop = true;
            await Utils.preloadAudio(src);
            this.music.set(name, audio);
        } catch (error) {
            console.error(`Failed to load music ${name}:`, error);
        }
    }
    
    playSound(name, volume = 1) {
        if (this.isMuted) return;
        
        const sound = this.sounds.get(name);
        if (sound) {
            sound.currentTime = 0;
            sound.volume = volume * this.sfxVolume * this.masterVolume;
            sound.play().catch(error => {
                console.error(`Failed to play sound ${name}:`, error);
            });
        }
    }
    
    playMusic(name, volume = 1) {
        if (this.isMuted) return;
        
        const music = this.music.get(name);
        if (music) {
            // Stop current music
            this.stopMusic();
            
            // Play new music
            music.volume = volume * this.musicVolume * this.masterVolume;
            music.play().catch(error => {
                console.error(`Failed to play music ${name}:`, error);
            });
            this.currentMusic = music;
        }
    }
    
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }
    
    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }
    
    resumeMusic() {
        if (this.currentMusic) {
            this.currentMusic.play().catch(error => {
                console.error(`Failed to resume music:`, error);
            });
        }
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Utils.clamp(volume, 0, 1);
        this.updateAllVolumes();
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Utils.clamp(volume, 0, 1);
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Utils.clamp(volume, 0, 1);
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume * this.masterVolume;
        }
    }
    
    updateAllVolumes() {
        // Update music volume
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume * this.masterVolume;
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopMusic();
        }
    }
}

class SaveSystem {
    constructor(game) {
        this.game = game;
        this.saveSlots = [];
        this.currentSlot = 0;
        this.autoSaveEnabled = true;
        this.autoSaveInterval = CONFIG.AUTO_SAVE_INTERVAL;
    }
    
    save(data, slot = null) {
        const saveSlot = slot !== null ? slot : this.currentSlot;
        const saveData = {
            version: '1.0.0',
            timestamp: Date.now(),
            data: data
        };
        
        const key = `dharmapala_shield_save_${saveSlot}`;
        const success = Utils.saveToLocalStorage(key, saveData);
        
        if (success) {
            console.log(`Game saved to slot ${saveSlot}`);
            this.saveSlots[saveSlot] = saveData;
        }
        
        return success;
    }
    
    load(slot = null) {
        const saveSlot = slot !== null ? slot : this.currentSlot;
        const key = `dharmapala_shield_save_${saveSlot}`;
        const saveData = Utils.loadFromLocalStorage(key);
        
        if (saveData) {
            console.log(`Game loaded from slot ${saveSlot}`);
            this.saveSlots[saveSlot] = saveData;
            return saveData.data;
        }
        
        return null;
    }
    
    delete(slot) {
        const key = `dharmapala_shield_save_${slot}`;
        Utils.removeFromLocalStorage(key);
        delete this.saveSlots[slot];
        console.log(`Save slot ${slot} deleted`);
    }
    
    getSaveSlots() {
        return this.saveSlots.map((slot, index) => ({
            slot: index,
            timestamp: slot ? slot.timestamp : null,
            data: slot ? slot.data : null
        }));
    }
    
    clearAllSaves() {
        for (let i = 0; i < CONFIG.MAX_SAVE_SLOTS; i++) {
            this.delete(i);
        }
        console.log('All save slots cleared');
    }
}

class AchievementSystem {
    constructor(game) {
        this.game = game;
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.progress = new Map();
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
        if (this.isAchievementUnlocked(id, achievement, value)) {
            this.unlockAchievement(id);
            return true;
        }
        
        return false;
    }
    
    isAchievementUnlocked(id, achievement, value) {
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
        
        this.unlockedAchievements.add(id);
        const achievement = this.achievements.get(id);
        
        console.log(`Achievement unlocked: ${achievement.name}`);
        
        // Show notification
        this.showAchievementNotification(achievement);
        
        // Play sound
        this.game.audioManager.playSound('achievement');
        
        // Save progress
        this.saveProgress();
    }
    
    showAchievementNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-content">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.remove();
        }, CONFIG.NOTIFICATION_DURATION);
    }
    
    saveProgress() {
        const progressData = {
            unlocked: Array.from(this.unlockedAchievements),
            progress: Object.fromEntries(this.progress)
        };
        
        Utils.saveToLocalStorage('dharmapala_shield_achievements', progressData);
    }
    
    loadProgress() {
        const progressData = Utils.loadFromLocalStorage('dharmapala_shield_achievements');
        if (progressData) {
            this.unlockedAchievements = new Set(progressData.unlocked);
            this.progress = new Map(Object.entries(progressData.progress));
        }
    }
    
    getUnlockedAchievements() {
        return Array.from(this.unlockedAchievements).map(id => ({
            id: id,
            ...this.achievements.get(id)
        }));
    }
    
    getProgress(id) {
        return this.progress.get(id) || 0;
    }
}

// Placeholder systems (to be implemented)
class LevelSystem {
    constructor(game) {
        this.game = game;
    }
    
    update(deltaTime) {
        // Level system update logic
    }
    
    render(ctx) {
        // Level system render logic
    }
}

class EnemySystem {
    constructor(game) {
        this.game = game;
    }
    
    update(deltaTime) {
        // Enemy system update logic
    }
    
    render(ctx) {
        // Enemy system render logic
    }
}

class DefenseSystem {
    constructor(game) {
        this.game = game;
    }
    
    update(deltaTime) {
        // Defense system update logic
    }
    
    render(ctx) {
        // Defense system render logic
    }
}

class ProjectileSystem {
    constructor(game) {
        this.game = game;
    }
    
    update(deltaTime) {
        // Projectile system update logic
    }
    
    render(ctx) {
        // Projectile system render logic
    }
}

class ParticleSystem {
    constructor(game) {
        this.game = game;
    }
    
    update(deltaTime) {
        // Particle system update logic
    }
    
    render(ctx) {
        // Particle system render logic
    }
}

class WaveSystem {
    constructor(game) {
        this.game = game;
    }
    
    update(deltaTime) {
        // Wave system update logic
    }
    
    render(ctx) {
        // Wave system render logic
    }
}

class UISystem {
    constructor(game) {
        this.game = game;
    }
    
    update(deltaTime) {
        // UI system update logic
    }
    
    render(ctx) {
        // UI system render logic
    }
}

class ScreenSystem {
    constructor(game) {
        this.game = game;
    }
    
    update(deltaTime) {
        // Screen system update logic
    }
    
    render(ctx) {
        // Screen system render logic
    }
}

class CameraSystem {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
    }
    
    update(deltaTime) {
        // Camera system update logic
    }
    
    render(ctx) {
        // Camera system render logic
    }
}

class PathSystem {
    constructor(game) {
        this.game = game;
        this.paths = [];
    }
    
    update(deltaTime) {
        // Path system update logic
    }
    
    render(ctx) {
        // Path system render logic
    }
}

class CollisionSystem {
    constructor(game) {
        this.game = game;
    }
    
    update(deltaTime) {
        // Collision system update logic
    }
    
    render(ctx) {
        // Collision system render logic
    }
}