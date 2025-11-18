// Game system manager - lightweight coordinator for game systems
import { CONFIG } from './config.js';
import { Utils } from './utils.js';

export class GameSystemManager {
    constructor(game) {
        this.game = game;
        this.initialized = false;
    }

    async init() {
        try {
            console.log('Initializing game system manager...');

            // Game systems are initialized directly in main.js
            // This manager serves as a lightweight coordinator

            this.initialized = true;
            console.log('Game system manager initialized successfully');

        } catch (error) {
            console.error('Failed to initialize game system manager:', error);
            throw error;
        }
    }

    shutdown() {
        console.log('Shutting down game system manager...');
        this.initialized = false;
    }
}
