// Audio Manager - handles sound effects and music
import { CONFIG } from './config.js';

export class AudioManager {
    constructor(game) {
        this.game = game;
        this.sounds = new Map();
        this.music = new Map();
        this.masterVolume = CONFIG.MASTER_VOLUME;
        this.sfxVolume = CONFIG.SFX_VOLUME;
        this.musicVolume = CONFIG.MUSIC_VOLUME;
        this.isMuted = false;
        this.currentMusic = null;
        this.audioContext = null;
        this.gainNode = null;
        
        // Initialize audio context
        this.initializeAudioContext();
    }
    
    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = this.masterVolume;
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }
    
    async loadAudio() {
        console.log('Loading audio assets...');
        
        // Since we can't actually load audio files in this environment,
        // we'll create placeholder sound effects using Web Audio API
        this.createPlaceholderSounds();
        
        console.log('Audio loading complete');
    }
    
    createPlaceholderSounds() {
        // Create placeholder sound effects using Web Audio API oscillators
        if (!this.audioContext) return;
        
        // Sound definitions
        const soundDefinitions = {
            shoot: { frequency: 800, duration: 0.1, type: 'square' },
            hit: { frequency: 400, duration: 0.2, type: 'sawtooth' },
            enemyDeath: { frequency: 200, duration: 0.3, type: 'triangle' },
            placeDefense: { frequency: 600, duration: 0.15, type: 'sine' },
            upgradeDefense: { frequency: 1000, duration: 0.2, type: 'sine' },
            removeDefense: { frequency: 300, duration: 0.1, type: 'square' },
            waveStart: { frequency: 500, duration: 0.5, type: 'triangle' },
            waveComplete: { frequency: 800, duration: 0.3, type: 'sine' },
            enemySpawn: { frequency: 150, duration: 0.1, type: 'sawtooth' },
            lifeLost: { frequency: 100, duration: 0.5, type: 'square' },
            gameOver: { frequency: 200, duration: 1.0, type: 'sawtooth' },
            victory: { frequency: 1200, duration: 0.8, type: 'sine' },
            achievement: { frequency: 1000, duration: 0.4, type: 'sine' },
            error: { frequency: 150, duration: 0.2, type: 'square' },
            resourceGain: { frequency: 900, duration: 0.1, type: 'sine' },
            bossPhaseChange: { frequency: 300, duration: 0.6, type: 'sawtooth' },
            empBlast: { frequency: 100, duration: 0.8, type: 'square' },
            shieldRegen: { frequency: 700, duration: 0.3, type: 'sine' },
            minionSpawn: { frequency: 250, duration: 0.15, type: 'triangle' },
            resourceSteal: { frequency: 180, duration: 0.4, type: 'square' }
        };
        
        // Create sound functions
        for (const [name, definition] of Object.entries(soundDefinitions)) {
            this.sounds.set(name, () => this.playTone(definition));
        }
    }
    
    playTone(definition) {
        if (!this.audioContext || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.gainNode);
        
        oscillator.type = definition.type;
        oscillator.frequency.setValueAtTime(definition.frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + definition.duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + definition.duration);
    }
    
    playSound(name, volume = 1) {
        if (this.isMuted) return;
        
        const sound = this.sounds.get(name);
        if (sound) {
            sound();
        } else {
            console.warn(`Sound '${name}' not found`);
        }
    }
    
    playMusic(name, volume = 1) {
        if (this.isMuted) return;
        
        // Placeholder for background music
        // In a real implementation, you would load and play actual music files
        console.log(`Playing music: ${name}`);
    }
    
    stopMusic() {
        if (this.currentMusic) {
            console.log('Stopping music');
            this.currentMusic = null;
        }
    }
    
    pauseMusic() {
        if (this.currentMusic) {
            console.log('Pausing music');
        }
    }
    
    resumeMusic() {
        if (this.currentMusic) {
            console.log('Resuming music');
        }
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Utils.clamp(volume, 0, 1);
        if (this.gainNode) {
            this.gainNode.gain.value = this.masterVolume;
        }
        this.updateAllVolumes();
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Utils.clamp(volume, 0, 1);
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Utils.clamp(volume, 0, 1);
    }
    
    updateAllVolumes() {
        // Update all volume-dependent elements
        if (this.gainNode) {
            this.gainNode.gain.value = this.masterVolume;
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopMusic();
        }
        return this.isMuted;
    }
    
    // Advanced sound effects
    playExplosion(x, y, intensity = 1) {
        if (!this.audioContext || this.isMuted) return;
        
        // Create multi-layered explosion sound
        const layers = [
            { frequency: 100, duration: 0.5, type: 'sawtooth', volume: 0.3 },
            { frequency: 50, duration: 0.8, type: 'square', volume: 0.2 },
            { frequency: 200, duration: 0.2, type: 'triangle', volume: 0.1 }
        ];
        
        layers.forEach(layer => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.gainNode);
            
            oscillator.type = layer.type;
            oscillator.frequency.setValueAtTime(layer.frequency * intensity, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(layer.volume * this.sfxVolume * intensity, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + layer.duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + layer.duration);
        });
    }
    
    playLaser(frequency = 800, duration = 0.1) {
        if (!this.audioContext || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.gainNode);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, this.audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playPowerUp(frequency = 1200, duration = 0.3) {
        if (!this.audioContext || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.gainNode);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 2, this.audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playClick(volume = 0.5) {
        if (!this.audioContext || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.gainNode);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.05 * volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }
    
    // Background music generator (simple procedural music)
    generateBackgroundMusic() {
        if (!this.audioContext || this.isMuted) return;
        
        // Create a simple ambient background track
        const playNote = (frequency, startTime, duration) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.gainNode);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + startTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + startTime);
            gainNode.gain.linearRampToValueAtTime(this.musicVolume * 0.05, this.audioContext.currentTime + startTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + startTime + duration);
            
            oscillator.start(this.audioContext.currentTime + startTime);
            oscillator.stop(this.audioContext.currentTime + startTime + duration);
        };
        
        // Simple chord progression
        const chords = [
            [261.63, 329.63, 392.00], // C major
            [293.66, 369.99, 440.00], // D minor
            [329.63, 415.30, 493.88], // E minor
            [349.23, 440.00, 523.25]  // F major
        ];
        
        // Play chord progression
        chords.forEach((chord, chordIndex) => {
            chord.forEach((note, noteIndex) => {
                playNote(note, chordIndex * 2, 1.5);
            });
        });
    }
    
    // Resume audio context on user interaction (required by some browsers)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    // Get audio system info
    getAudioInfo() {
        return {
            contextState: this.audioContext ? this.audioContext.state : 'unavailable',
            masterVolume: this.masterVolume,
            sfxVolume: this.sfxVolume,
            musicVolume: this.musicVolume,
            isMuted: this.isMuted,
            soundsLoaded: this.sounds.size,
            musicLoaded: this.music.size
        };
    }
    
    // Cleanup
    cleanup() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        this.sounds.clear();
        this.music.clear();
    }
}