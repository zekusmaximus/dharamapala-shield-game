// Game configuration and constants
export const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: window.innerWidth > 768 ? 1200 : window.innerWidth,
    CANVAS_HEIGHT: window.innerWidth > 768 ? 800 : window.innerHeight * 0.6,
    GRID_SIZE: window.innerWidth > 768 ? 40 : 30,
    
    // Game balance
    INITIAL_DHARMA: 100,
    INITIAL_BANDWIDTH: 50,
    INITIAL_ANONYMITY: 75,
    INITIAL_LIVES: 20,
    
    // Wave settings
    WAVE_DELAY: 5000, // 5 seconds between waves
    ENEMY_SPAWN_DELAY: 1000, // 1 second between enemy spawns
    
    // Defense types
    DEFENSE_TYPES: {
        firewall: {
            name: 'Firewall Fortress',
            description: 'Basic blocking defense with prayer flag flair',
            icon: '🛡️',
            cost: { dharma: 25, bandwidth: 0, anonymity: 0 },
            damage: 15,
            range: 200,
            fireRate: 1000,
            color: '#e94560',
            projectileSpeed: 5,
            special: 'basic'
        },
        encryption: {
            name: 'Encryption Monastery',
            description: 'Scrambles data packets with rotating ciphers',
            icon: '🔐',
            cost: { dharma: 50, bandwidth: 20, anonymity: 10 },
            damage: 25,
            range: 180,
            fireRate: 1500,
            color: '#0f3460',
            projectileSpeed: 4,
            special: 'encrypt'
        },
        decoy: {
            name: 'Decoy Temple',
            description: 'False targets that misdirect attackers',
            icon: '🎯',
            cost: { dharma: 30, bandwidth: 15, anonymity: 5 },
            damage: 0,
            range: 150,
            fireRate: 0, // Doesn't fire projectiles
            color: '#f47068',
            projectileSpeed: 0,
            special: 'decoy'
        },
        mirror: {
            name: 'Mirror Server',
            description: 'Reflects hostile traffic back to its source',
            icon: '🔁',
            cost: { dharma: 75, bandwidth: 40, anonymity: 20 },
            damage: 40,
            range: 250,
            fireRate: 2000,
            color: '#53d8fb',
            projectileSpeed: 8,
            special: 'reflect'
        },
        anonymity: {
            name: 'Anonymity Shroud',
            description: 'Cloaks friendly network activity',
            icon: '🕶️',
            cost: { dharma: 60, bandwidth: 30, anonymity: 40 },
            damage: 20,
            range: 300,
            fireRate: 1200,
            color: '#8b5cf6',
            projectileSpeed: 6,
            special: 'cloak'
        },
        distributor: {
            name: 'Dharma Distributor',
            description: 'Speeds up delivery and resource flow',
            icon: '📡',
            cost: { dharma: 100, bandwidth: 60, anonymity: 30 },
            damage: 30,
            range: 350,
            fireRate: 800,
            color: '#10b981',
            projectileSpeed: 7,
            special: 'boost'
        }
    },
    
    // Enemy types
    ENEMY_TYPES: {
        scriptKiddie: {
            name: 'Script Kiddie',
            description: 'Fast, erratic movement patterns',
            icon: '👾',
            health: 20,
            speed: 80,
            reward: { dharma: 5, bandwidth: 2, anonymity: 1 },
            color: '#ff6b6b',
            size: 15,
            special: 'erratic'
        },
        federalAgent: {
            name: 'Federal Agent',
            description: 'Persistent, speeds up near defenses',
            icon: '🕵️',
            health: 40,
            speed: 60,
            reward: { dharma: 10, bandwidth: 5, anonymity: 3 },
            color: '#4ecdc4',
            size: 18,
            special: 'persistent'
        },
        corporateSaboteur: {
            name: 'Corporate Saboteur',
            description: 'Stealth capabilities, periodically invisible',
            icon: '💼',
            health: 35,
            speed: 70,
            reward: { dharma: 15, bandwidth: 8, anonymity: 5 },
            color: '#95e77e',
            size: 16,
            special: 'stealth'
        },
        aiSurveillance: {
            name: 'AI Surveillance',
            description: 'Adaptive scanning, learns from defense patterns',
            icon: '🤖',
            health: 60,
            speed: 50,
            reward: { dharma: 20, bandwidth: 12, anonymity: 8 },
            color: '#ffe66d',
            size: 20,
            special: 'adaptive'
        },
        quantumHacker: {
            name: 'Quantum Hacker',
            description: 'Phase-shifting and teleportation abilities',
            icon: '⚛️',
            health: 80,
            speed: 90,
            reward: { dharma: 30, bandwidth: 20, anonymity: 15 },
            color: '#a8e6cf',
            size: 22,
            special: 'teleport'
        },
        corruptedMonk: {
            name: 'Corrupted Monk',
            description: 'Healing aura, corrupts nearby defenses',
            icon: '👹',
            health: 100,
            speed: 40,
            reward: { dharma: 50, bandwidth: 30, anonymity: 25 },
            color: '#ff8b94',
            size: 25,
            special: 'corrupt'
        }
    },
    
    // Boss types
    BOSS_TYPES: {
        raidTeam: {
            name: 'Raid Team',
            description: 'Spawns minions and uses EMP bursts',
            icon: '🚀',
            health: 500,
            speed: 30,
            reward: { dharma: 100, bandwidth: 60, anonymity: 40 },
            color: '#ff6b35',
            size: 40,
            phases: 3,
            special: 'minions'
        },
        megaCorpTitan: {
            name: 'MegaCorp Titan',
            description: 'Shield regeneration and market manipulation',
            icon: '🏢',
            health: 800,
            speed: 20,
            reward: { dharma: 200, bandwidth: 120, anonymity: 80 },
            color: '#c77dff',
            size: 50,
            phases: 4,
            special: 'shield'
        }
    },
    
    // Achievement categories
    ACHIEVEMENT_CATEGORIES: {
        combat: 'Combat Mastery',
        defense: 'Defense Strategy',
        resource: 'Resource Management',
        progression: 'Game Progression',
        special: 'Special Accomplishments'
    },
    
    // Visual settings
    PARTICLE_COUNT: 50,
    TRAIL_LENGTH: 10,
    GLOW_INTENSITY: 0.8,
    
    // Performance settings
    MAX_PROJECTILES: 100,
    MAX_ENEMIES: 50,
    MAX_PARTICLES: 200,
    
    // Mobile settings
    TOUCH_THRESHOLD: 10,
    DOUBLE_TAP_DELAY: 300,
    LONG_PRESS_DELAY: 500,
    
    // Audio settings
    MASTER_VOLUME: 0.7,
    SFX_VOLUME: 0.8,
    MUSIC_VOLUME: 0.5,
    
    // Save settings
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    MAX_SAVE_SLOTS: 3,
    
    // UI settings
    NOTIFICATION_DURATION: 3000,
    TOAST_DURATION: 2000,
    ANIMATION_DURATION: 300,
    
    // Game states
    GAME_STATES: {
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'game_over',
        VICTORY: 'victory',
        LOADING: 'loading'
    },
    
    // Screen types
    SCREEN_TYPES: {
        MAIN_MENU: 'main_menu',
        GAME: 'game',
        PAUSE: 'pause',
        SETTINGS: 'settings',
        ACHIEVEMENTS: 'achievements',
        GAME_OVER: 'game_over',
        VICTORY: 'victory'
    }
};

// Dynamic configuration updates
export function updateConfigForMobile() {
    if (window.innerWidth <= 768) {
        CONFIG.CANVAS_WIDTH = window.innerWidth;
        CONFIG.CANVAS_HEIGHT = window.innerHeight * 0.6;
        CONFIG.GRID_SIZE = 30;
        CONFIG.PARTICLE_COUNT = 25;
        CONFIG.MAX_PARTICLES = 100;
        CONFIG.MAX_PROJECTILES = 50;
    }
}

// Update config on window resize
window.addEventListener('resize', updateConfigForMobile);
updateConfigForMobile();