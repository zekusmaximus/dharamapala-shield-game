// Main game class - coordinates all game systems
import { CONFIG, updateConfigForMobile } from './config.js';
import { Utils } from './utils.js';
import { GameSystemManager } from './GameSystemManager.js';
import { ScreenManager } from './ScreenManager.js';
import { DefenseManager } from './DefenseManager.js';
import { UIManager } from './UIManager.js';
import { Level } from './level.js';
import { AudioManager } from './audioManager.js';
import { SaveSystem } from './saveSystem.js';
import { AchievementManager } from './achievementManager.js';

export class Game {
    constructor() {
        // Core properties
        this.canvas = null;
        this.ctx = null;
        this.width = CONFIG.CANVAS_WIDTH;
        this.height = CONFIG.CANVAS_HEIGHT;
        
        // Game state
        this.state = CONFIG.GAME_STATES.LOADING;
        this.isPaused = false;
        this.isGameOver = false;
        this.isVictory = false;
        
        // Game data
        this.resources = {
            dharma: CONFIG.INITIAL_DHARMA,
            bandwidth: CONFIG.INITIAL_BANDWIDTH,
            anonymity: CONFIG.INITIAL_ANONYMITY
        };
        this.lives = CONFIG.INITIAL_LIVES;
        this.wave = 0;
        this.score = 0;
        
        // Game systems
        this.systems = null;
        this.screenManager = null;
        this.defenseManager = null;
        this.uiManager = null;
        this.level = null;
        this.audioManager = null;
        this.saveSystem = null;
        this.achievementManager = null;
        
        // Game objects
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.defenses = [];
        
        // Timing
        this.lastTime = 0;
        this.deltaTime = 0;
        this.gameTime = 0;
        this.waveTimer = 0;
        this.autoSaveTimer = 0;
        
        // Input
        this.mouse = { x: 0, y: 0, isDown: false };
        this.touch = { x: 0, y: 0, isActive: false };
        this.keys = {};
        
        // Performance
        this.fps = 60;
        this.frameCount = 0;
        this.fpsTimer = 0;
        
        // Make game globally accessible
        window.game = this;
    }
    
    async init() {
        try {
            console.log('Initializing game...');
            
            // Get canvas and context
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            // Set canvas size
            this.resizeCanvas();
            
            // Initialize game systems
            this.systems = new GameSystemManager(this);
            await this.systems.init();
            
            // Initialize managers
            this.screenManager = new ScreenManager(this);
            this.defenseManager = new DefenseManager(this);
            this.uiManager = new UIManager(this);
            this.level = new Level(this);
            this.audioManager = new AudioManager(this);
            this.saveSystem = new SaveSystem(this);
            this.achievementManager = new AchievementManager(this);
            
            // Initialize input handlers
            this.setupInputHandlers();

            console.log('Game initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            throw error;
        }
    }
    
    setupUI() {
        try {
            console.log('Setting up UI...');
            
            // Setup screen manager
            this.screenManager.setup();
            
            // Setup UI manager
            this.uiManager.setup();
            
            // Setup mobile controls
            this.setupMobileControls();

            // Load saved game if exists (after UI is set up)
            this.loadGame();

            console.log('UI setup complete');
            
        } catch (error) {
            console.error('Failed to setup UI:', error);
            throw error;
        }
    }
    
    async loadContent() {
        try {
            console.log('Loading game content...');
            
            // Load audio
            await this.audioManager.loadAudio();
            
            // Load level
            await this.level.load();
            
            // Load achievements
            await this.achievementManager.load();
            
            console.log('Content loading complete');
            
        } catch (error) {
            console.error('Failed to load content:', error);
            throw error;
        }
    }
    
    start() {
        try {
            console.log('Starting game...');
            
            // Set game state
            this.state = CONFIG.GAME_STATES.MENU;
            
            // Show main menu
            this.screenManager.showScreen('main_menu');
            
            // Start game loop
            this.lastTime = performance.now();
            this.gameLoop();
            
            // Start auto-save
            this.startAutoSave();
            
            console.log('Game started successfully');
            
        } catch (error) {
            console.error('Failed to start game:', error);
            throw error;
        }
    }
    
    gameLoop(currentTime = 0) {
        // Calculate delta time
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update game time
        this.gameTime += this.deltaTime;
        
        // Update FPS
        this.updateFPS(currentTime);
        
        // Update game logic
        this.update(this.deltaTime);
        
        // Render game
        this.render();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // Don't update if game is paused or in menu
        if (this.state === CONFIG.GAME_STATES.PAUSED || 
            this.state === CONFIG.GAME_STATES.MENU ||
            this.state === CONFIG.GAME_STATES.LOADING) {
            return;
        }
        
        // Update level
        if (this.level) {
            this.level.update(deltaTime);
        }
        
        // Update enemies
        this.updateEnemies(deltaTime);
        
        // Update projectiles
        this.updateProjectiles(deltaTime);
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Update defenses
        this.updateDefenses(deltaTime);
        
        // Update UI
        if (this.uiManager) {
            this.uiManager.update(deltaTime);
        }
        
        // Update timers
        this.updateTimers(deltaTime);
        
        // Check game over
        this.checkGameOver();
    }
    
    render() {
        // Clear canvas
        Utils.clearCanvas(this.ctx, this.width, this.height);
        
        // Don't render game if in menu
        if (this.state === CONFIG.GAME_STATES.MENU || 
            this.state === CONFIG.GAME_STATES.LOADING) {
            return;
        }
        
        // Render level
        if (this.level) {
            this.level.render(this.ctx);
        }
        
        // Render defenses
        this.renderDefenses();
        
        // Render enemies
        this.renderEnemies();
        
        // Render projectiles
        this.renderProjectiles();
        
        // Render particles
        this.renderParticles();
        
        // Render UI overlay
        if (this.uiManager) {
            this.uiManager.render(this.ctx);
        }
        
        // Render screen overlay
        if (this.screenManager) {
            this.screenManager.render(this.ctx);
        }
    }
    
    updateEnemies(deltaTime) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime);
            
            // Remove dead enemies
            if (enemy.isDead) {
                this.onEnemyKilled(enemy);
                this.enemies.splice(i, 1);
                continue;
            }
            
            // Remove enemies that reached the end
            if (enemy.reachedEnd) {
                this.onEnemyReachedEnd(enemy);
                this.enemies.splice(i, 1);
            }
        }
    }
    
    updateProjectiles(deltaTime) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(deltaTime);
            
            // Remove inactive projectiles
            if (!projectile.isActive) {
                this.projectiles.splice(i, 1);
                continue;
            }
            
            // Check collisions
            this.checkProjectileCollisions(projectile);
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime);
            
            // Remove dead particles
            if (particle.isDead) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateDefenses(deltaTime) {
        for (const defense of this.defenses) {
            defense.update(deltaTime);
        }
    }
    
    updateTimers(deltaTime) {
        // Update wave timer
        if (this.waveTimer > 0) {
            this.waveTimer -= deltaTime;
        }
        
        // Update auto-save timer
        this.autoSaveTimer += deltaTime;
        if (this.autoSaveTimer >= CONFIG.AUTO_SAVE_INTERVAL) {
            this.saveGame();
            this.autoSaveTimer = 0;
        }
    }
    
    renderDefenses() {
        for (const defense of this.defenses) {
            defense.render(this.ctx);
        }
    }
    
    renderEnemies() {
        for (const enemy of this.enemies) {
            enemy.render(this.ctx);
        }
    }
    
    renderProjectiles() {
        for (const projectile of this.projectiles) {
            projectile.render(this.ctx);
        }
    }
    
    renderParticles() {
        for (const particle of this.particles) {
            particle.render(this.ctx);
        }
    }
    
    checkProjectileCollisions(projectile) {
        for (const enemy of this.enemies) {
            if (Utils.circleCollision(
                projectile.x, projectile.y, projectile.radius,
                enemy.x, enemy.y, enemy.radius
            )) {
                // Hit enemy
                enemy.takeDamage(projectile.damage);
                projectile.hit();
                
                // Create hit particles
                this.createHitParticles(projectile.x, projectile.y, enemy.color);
                
                // Play sound
                this.audioManager.playSound('hit');
                
                break;
            }
        }
    }
    
    onEnemyKilled(enemy) {
        // Add resources
        this.addResources(enemy.reward);
        
        // Add score
        this.score += enemy.scoreValue || 10;
        
        // Create death particles
        this.createDeathParticles(enemy.x, enemy.y, enemy.color);
        
        // Play sound
        this.audioManager.playSound('enemyDeath');
        
        // Check achievements
        this.achievementManager.checkAchievement('enemiesKilled', this.enemiesKilled);
    }
    
    onEnemyReachedEnd(enemy) {
        // Lose life
        this.lives--;
        
        // Play sound
        this.audioManager.playSound('lifeLost');
        
        // Update UI
        this.uiManager.updateLives();
        
        // Check game over
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    createHitParticles(x, y, color) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: Utils.randomRange(-2, 2),
                vy: Utils.randomRange(-2, 2),
                life: 1,
                color: color,
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
    
    createDeathParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: Utils.randomRange(-4, 4),
                vy: Utils.randomRange(-4, 4),
                life: 1,
                color: color,
                size: Utils.randomRange(3, 6),
                update: function(deltaTime) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.98;
                    this.vy *= 0.98;
                    this.life -= deltaTime * 0.001;
                    this.isDead = this.life <= 0;
                },
                render: function(ctx) {
                    Utils.drawCircle(ctx, this.x, this.y, this.size, this.color, this.life);
                }
            });
        }
    }
    
    addResources(resources) {
        for (const [resource, amount] of Object.entries(resources)) {
            this.resources[resource] += amount;
        }
        
        // Update UI
        this.uiManager.updateResources();
        
        // Play sound
        this.audioManager.playSound('resourceGain');
    }
    
    canAfford(cost) {
        for (const [resource, amount] of Object.entries(cost)) {
            if (this.resources[resource] < amount) {
                return false;
            }
        }
        return true;
    }
    
    spendResources(cost) {
        for (const [resource, amount] of Object.entries(cost)) {
            this.resources[resource] -= amount;
        }
        
        // Update UI
        this.uiManager.updateResources();
    }
    
    startNextWave() {
        this.wave++;
        this.level.startWave(this.wave);
        this.waveTimer = CONFIG.WAVE_DELAY;
        
        // Play sound
        this.audioManager.playSound('waveStart');
        
        // Update UI
        this.uiManager.updateWave();
    }
    
    pause() {
        if (this.state === CONFIG.GAME_STATES.PLAYING) {
            this.state = CONFIG.GAME_STATES.PAUSED;
            this.screenManager.showScreen('pause');
            this.audioManager.pauseMusic();
        }
    }
    
    resume() {
        if (this.state === CONFIG.GAME_STATES.PAUSED) {
            this.state = CONFIG.GAME_STATES.PLAYING;
            this.screenManager.hideScreen('pause');
            this.audioManager.resumeMusic();
        }
    }
    
    gameOver() {
        this.state = CONFIG.GAME_STATES.GAME_OVER;
        this.isGameOver = true;
        this.screenManager.showScreen('game_over');
        this.audioManager.playSound('gameOver');
        this.audioManager.stopMusic();
        
        // Save final score
        this.saveGame();
    }
    
    victory() {
        this.state = CONFIG.GAME_STATES.VICTORY;
        this.isVictory = true;
        this.screenManager.showScreen('victory');
        this.audioManager.playSound('victory');
        this.audioManager.stopMusic();
        
        // Save final score
        this.saveGame();
    }
    
    newGame() {
        // Reset game state
        this.resources = {
            dharma: CONFIG.INITIAL_DHARMA,
            bandwidth: CONFIG.INITIAL_BANDWIDTH,
            anonymity: CONFIG.INITIAL_ANONYMITY
        };
        this.lives = CONFIG.INITIAL_LIVES;
        this.wave = 0;
        this.score = 0;
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.defenses = [];
        
        // Reset level
        this.level.reset();
        
        // Update UI
        this.uiManager.updateAll();
        
        // Start game
        this.state = CONFIG.GAME_STATES.PLAYING;
        this.screenManager.hideAllScreens();
        
        // Start first wave
        this.startNextWave();
    }
    
    saveGame() {
        const saveData = {
            resources: this.resources,
            lives: this.lives,
            wave: this.wave,
            score: this.score,
            defenses: this.defenses.map(d => d.getSaveData()),
            timestamp: Date.now()
        };
        
        this.saveSystem.save(saveData);
    }
    
    loadGame() {
        const saveData = this.saveSystem.load();
        if (saveData) {
            this.resources = saveData.resources;
            this.lives = saveData.lives;
            this.wave = saveData.wave;
            this.score = saveData.score;
            
            // Load defenses
            if (saveData.defenses) {
                for (const defenseData of saveData.defenses) {
                    // TODO: Restore defenses from save data
                }
            }
            
            console.log('Game loaded from save');
        }
    }
    
    startAutoSave() {
        setInterval(() => {
            if (this.state === CONFIG.GAME_STATES.PLAYING) {
                this.saveGame();
            }
        }, CONFIG.AUTO_SAVE_INTERVAL);
    }
    
    updateFPS(currentTime) {
        this.frameCount++;
        this.fpsTimer += currentTime - this.lastTime;
        
        if (this.fpsTimer >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
        }
    }
    
    resizeCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    handleResize() {
        // Update config for new screen size
        updateConfigForMobile();
        
        // Update canvas size
        this.width = CONFIG.CANVAS_WIDTH;
        this.height = CONFIG.CANVAS_HEIGHT;
        this.resizeCanvas();
        
        // Update level
        if (this.level) {
            this.level.handleResize();
        }
    }
    
    setupInputHandlers() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    setupMobileControls() {
        const pauseBtn = document.getElementById('mobile-pause');
        const menuBtn = document.getElementById('mobile-menu');
        const nextWaveBtn = document.getElementById('mobile-next-wave');
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (this.state === CONFIG.GAME_STATES.PLAYING) {
                    this.pause();
                } else if (this.state === CONFIG.GAME_STATES.PAUSED) {
                    this.resume();
                }
            });
        }
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                this.pause();
                this.screenManager.showScreen('main_menu');
            });
        }
        
        if (nextWaveBtn) {
            nextWaveBtn.addEventListener('click', () => {
                if (this.state === CONFIG.GAME_STATES.PLAYING && this.waveTimer > 0) {
                    this.waveTimer = 0;
                    this.startNextWave();
                }
            });
        }
    }
    
    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.mouse.isDown = true;
        
        this.handleClick(this.mouse.x, this.mouse.y);
    }
    
    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    onMouseUp(e) {
        this.mouse.isDown = false;
    }
    
    onTouchStart(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.touch.x = touch.clientX - rect.left;
        this.touch.y = touch.clientY - rect.top;
        this.touch.isActive = true;
        
        this.handleClick(this.touch.x, this.touch.y);
    }
    
    onTouchMove(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.touch.x = touch.clientX - rect.left;
        this.touch.y = touch.clientY - rect.top;
    }
    
    onTouchEnd(e) {
        e.preventDefault();
        this.touch.isActive = false;
    }
    
    onKeyDown(e) {
        this.keys[e.key] = true;
        
        // Handle keyboard shortcuts
        switch (e.key) {
            case ' ':
                e.preventDefault();
                if (this.state === CONFIG.GAME_STATES.PLAYING) {
                    this.pause();
                } else if (this.state === CONFIG.GAME_STATES.PAUSED) {
                    this.resume();
                }
                break;
            case 'Escape':
                if (this.state === CONFIG.GAME_STATES.PLAYING) {
                    this.pause();
                }
                break;
            case 'n':
            case 'N':
                if (this.state === CONFIG.GAME_STATES.PLAYING && this.waveTimer > 0) {
                    this.waveTimer = 0;
                    this.startNextWave();
                }
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                // Select defense type
                const defenseTypes = Object.keys(CONFIG.DEFENSE_TYPES);
                const index = parseInt(e.key) - 1;
                if (index < defenseTypes.length) {
                    this.defenseManager.selectDefenseType(defenseTypes[index]);
                }
                break;
        }
    }
    
    onKeyUp(e) {
        this.keys[e.key] = false;
    }
    
    handleClick(x, y) {
        if (this.state !== CONFIG.GAME_STATES.PLAYING) {
            return;
        }
        
        // Handle defense placement
        this.defenseManager.handleClick(x, y);
    }
    
    checkGameOver() {
        if (this.lives <= 0 && !this.isGameOver) {
            this.gameOver();
        }
    }
}