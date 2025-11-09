// Level system - handles level progression and wave management
import { CONFIG } from './config.js';
import { Utils } from './utils.js';
import { Enemy } from './enemy.js';
import { Boss } from './Boss.js';

export class Level {
    constructor(game) {
        this.game = game;
        this.currentWave = 0;
        this.maxWaves = 20;
        this.waveInProgress = false;
        this.waveTimer = 0;
        this.enemiesSpawned = 0;
        this.enemiesToSpawn = 0;
        this.enemySpawnDelay = CONFIG.ENEMY_SPAWN_DELAY;
        this.lastEnemySpawnTime = 0;
        this.path = [];
        this.pathWidth = 40;
        
        // Wave configurations
        this.waveConfigs = this.generateWaveConfigs();
        
        // Level properties
        this.gridWidth = Math.floor(this.game.width / CONFIG.GRID_SIZE);
        this.gridHeight = Math.floor(this.game.height / CONFIG.GRID_SIZE);
        
        // Generate initial path
        this.generatePath();
    }
    
    async load() {
        console.log('Loading level...');
        
        // Load level assets if needed
        // For now, we'll use procedurally generated content
        
        console.log('Level loaded successfully');
    }
    
    update(deltaTime) {
        // Update wave timer
        if (this.waveTimer > 0) {
            this.waveTimer -= deltaTime;
            
            if (this.waveTimer <= 0 && !this.waveInProgress) {
                this.startWave(this.currentWave + 1);
            }
        }
        
        // Update enemy spawning
        if (this.waveInProgress && this.enemiesSpawned < this.enemiesToSpawn) {
            this.updateEnemySpawning(deltaTime);
        }
        
        // Check if wave is complete
        if (this.waveInProgress && this.enemiesSpawned >= this.enemiesToSpawn && 
            this.game.enemies.length === 0) {
            this.completeWave();
        }
    }
    
    render(ctx) {
        // Render path
        this.renderPath(ctx);
        
        // Render spawn and end points
        this.renderSpawnEndPoints(ctx);
        
        // Render wave info
        this.renderWaveInfo(ctx);
    }
    
    generateWaveConfigs() {
        const configs = [];
        
        for (let i = 1; i <= this.maxWaves; i++) {
            const config = {
                wave: i,
                enemies: [],
                delayBetweenWaves: CONFIG.WAVE_DELAY,
                bossWave: i % 5 === 0 // Boss every 5 waves
            };
            
            if (config.bossWave) {
                // Boss wave
                const bossType = i <= 10 ? 'raidTeam' : 'megaCorpTitan';
                config.enemies.push({
                    type: bossType,
                    count: 1,
                    delay: 2000,
                    health: 1 + (i - 5) * 0.2 // Boss gets stronger
                });
                
                // Add some regular enemies with boss
                config.enemies.push({
                    type: 'scriptKiddie',
                    count: 5 + i,
                    delay: 500
                });
            } else {
                // Regular wave
                const enemyTypes = Object.keys(CONFIG.ENEMY_TYPES);
                const difficulty = i / 10; // 0.1 to 1.0 difficulty
                
                // Generate enemies based on wave number
                for (let j = 0; j < enemyTypes.length; j++) {
                    const enemyType = enemyTypes[j];
                    const baseCount = Math.floor(3 + i * 0.5);
                    const variance = Math.floor(i * 0.3);
                    const count = baseCount + Math.floor(Math.random() * variance);
                    
                    // Higher waves have more difficult enemies
                    if (j <= Math.floor(difficulty * enemyTypes.length)) {
                        config.enemies.push({
                            type: enemyType,
                            count: Math.max(1, count),
                            delay: this.enemySpawnDelay,
                            health: 1 + difficulty * 0.5
                        });
                    }
                }
            }
            
            configs.push(config);
        }
        
        return configs;
    }
    
    generatePath() {
        // Generate a simple S-shaped path from left to right
        this.path = [];
        
        const startX = 0;
        const startY = Math.floor(this.gridHeight / 2);
        const endX = this.gridWidth - 1;
        const endY = Math.floor(this.gridHeight / 2);
        
        // Create waypoints
        const waypoints = [
            { x: startX, y: startY },
            { x: Math.floor(this.gridWidth * 0.2), y: startY },
            { x: Math.floor(this.gridWidth * 0.3), y: Math.floor(this.gridHeight * 0.3) },
            { x: Math.floor(this.gridWidth * 0.5), y: Math.floor(this.gridHeight * 0.3) },
            { x: Math.floor(this.gridWidth * 0.6), y: Math.floor(this.gridHeight * 0.7) },
            { x: Math.floor(this.gridWidth * 0.8), y: Math.floor(this.gridHeight * 0.7) },
            { x: endX, y: endY }
        ];
        
        // Interpolate between waypoints to create smooth path
        for (let i = 0; i < waypoints.length - 1; i++) {
            const start = waypoints[i];
            const end = waypoints[i + 1];
            
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const steps = Math.max(Math.abs(dx), Math.abs(dy));
            
            for (let j = 0; j <= steps; j++) {
                const t = j / steps;
                const x = Math.round(start.x + dx * t);
                const y = Math.round(start.y + dy * t);
                
                // Add some randomness to make path more interesting
                if (Math.random() < 0.3) {
                    const offsetY = Math.random() < 0.5 ? -1 : 1;
                    const newY = Math.max(1, Math.min(this.gridHeight - 2, y + offsetY));
                    this.path.push({ x: x * CONFIG.GRID_SIZE, y: newY * CONFIG.GRID_SIZE });
                } else {
                    this.path.push({ x: x * CONFIG.GRID_SIZE, y: y * CONFIG.GRID_SIZE });
                }
            }
        }
        
        // Ensure path has some points
        if (this.path.length === 0) {
            this.path = [
                { x: 0, y: this.game.height / 2 },
                { x: this.game.width, y: this.game.height / 2 }
            ];
        }
    }
    
    startWave(waveNumber) {
        if (waveNumber > this.maxWaves) {
            this.game.victory();
            return;
        }
        
        this.currentWave = waveNumber;
        this.waveInProgress = true;
        this.enemiesSpawned = 0;
        this.enemiesToSpawn = 0;
        this.lastEnemySpawnTime = 0;
        
        const waveConfig = this.waveConfigs[waveNumber - 1];
        if (!waveConfig) {
            console.error(`No configuration for wave ${waveNumber}`);
            return;
        }
        
        // Calculate total enemies to spawn
        for (const enemyGroup of waveConfig.enemies) {
            this.enemiesToSpawn += enemyGroup.count;
        }
        
        // Store current wave config for spawning
        this.currentWaveConfig = waveConfig;
        
        // Start spawning enemies
        this.spawnEnemyGroup(0);
        
        // Update UI
        this.game.uiManager.updateWave();
        
        // Show notification
        const waveText = waveConfig.bossWave ? `Boss Wave ${waveNumber}!` : `Wave ${waveNumber}`;
        this.game.uiManager.showNotification(waveText, 'warning', 3000);
        
        // Play sound
        this.game.audioManager.playSound('waveStart');
    }
    
    spawnEnemyGroup(groupIndex) {
        if (groupIndex >= this.currentWaveConfig.enemies.length) {
            return;
        }
        
        const enemyGroup = this.currentWaveConfig.enemies[groupIndex];
        
        for (let i = 0; i < enemyGroup.count; i++) {
            setTimeout(() => {
                this.spawnEnemy(enemyGroup.type, enemyGroup.health);
            }, i * enemyGroup.delay);
        }
        
        // Spawn next group after delay
        if (groupIndex < this.currentWaveConfig.enemies.length - 1) {
            setTimeout(() => {
                this.spawnEnemyGroup(groupIndex + 1);
            }, enemyGroup.count * enemyGroup.delay + 1000);
        }
    }
    
    spawnEnemy(enemyType, healthMultiplier = 1) {
        const enemyConfig = CONFIG.ENEMY_TYPES[enemyType];
        if (!enemyConfig) {
            console.error(`Unknown enemy type: ${enemyType}`);
            return;
        }
        
        let enemy;
        
        if (CONFIG.BOSS_TYPES[enemyType]) {
            // Spawn boss
            const bossConfig = CONFIG.BOSS_TYPES[enemyType];
            enemy = new Boss(this.game, this.path[0].x, this.path[0].y, enemyType);
            enemy.health = bossConfig.health * healthMultiplier;
            enemy.maxHealth = enemy.health;
        } else {
            // Spawn regular enemy
            enemy = new Enemy(this.game, this.path[0].x, this.path[0].y, enemyType);
            enemy.health = enemyConfig.health * healthMultiplier;
            enemy.maxHealth = enemy.health;
        }
        
        this.game.enemies.push(enemy);
        this.enemiesSpawned++;
        
        // Play spawn sound
        this.game.audioManager.playSound('enemySpawn');
    }
    
    updateEnemySpawning(deltaTime) {
        // Enemy spawning is handled by spawnEnemyGroup with delays
        // This method can be used for additional spawning logic
    }
    
    completeWave() {
        this.waveInProgress = false;
        
        // Give wave completion bonus
        const baseBonus = 50;
        const waveBonus = this.currentWave * 10;
        const totalBonus = baseBonus + waveBonus;
        
        this.game.resources.dharma += totalBonus;
        this.game.resources.bandwidth += Math.floor(totalBonus * 0.5);
        this.game.resources.anonymity += Math.floor(totalBonus * 0.3);
        
        // Update UI
        this.game.uiManager.updateResources();
        
        // Show notification
        this.game.uiManager.showNotification(
            `Wave ${this.currentWave} complete! +${totalBonus} resources`, 
            'success', 
            3000
        );
        
        // Set timer for next wave
        this.waveTimer = CONFIG.WAVE_DELAY;
        
        // Check achievements
        this.game.achievementManager.checkAchievement('wavesCompleted', this.currentWave);
        
        // Play sound
        this.game.audioManager.playSound('waveComplete');
    }
    
    renderPath(ctx) {
        if (this.path.length < 2) return;
        
        // Draw path background
        ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = this.pathWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);
        
        for (let i = 1; i < this.path.length; i++) {
            ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        
        ctx.stroke();
        
        // Draw path borders
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y - this.pathWidth / 2);
        
        for (let i = 1; i < this.path.length; i++) {
            ctx.lineTo(this.path[i].x, this.path[i].y - this.pathWidth / 2);
        }
        
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y + this.pathWidth / 2);
        
        for (let i = 1; i < this.path.length; i++) {
            ctx.lineTo(this.path[i].x, this.path[i].y + this.pathWidth / 2);
        }
        
        ctx.stroke();
        
        // Draw path direction indicators
        ctx.fillStyle = 'rgba(139, 92, 246, 0.4)';
        for (let i = 0; i < this.path.length - 1; i += 5) {
            const start = this.path[i];
            const end = this.path[i + 1];
            const angle = Utils.angle(start.x, start.y, end.x, end.y);
            
            ctx.save();
            ctx.translate(start.x, start.y);
            ctx.rotate(angle);
            
            // Draw arrow
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-10, -5);
            ctx.lineTo(-10, 5);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    renderSpawnEndPoints(ctx) {
        if (this.path.length === 0) return;
        
        // Draw spawn point
        const spawnPoint = this.path[0];
        ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.arc(spawnPoint.x, spawnPoint.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw spawn icon
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('S', spawnPoint.x, spawnPoint.y);
        
        // Draw end point
        const endPoint = this.path[this.path.length - 1];
        ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
        
        ctx.beginPath();
        ctx.arc(endPoint.x, endPoint.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw end icon
        ctx.fillStyle = '#ffffff';
        ctx.fillText('E', endPoint.x, endPoint.y);
    }
    
    renderWaveInfo(ctx) {
        if (this.waveTimer > 0 && !this.waveInProgress) {
            // Draw next wave timer
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(this.game.width / 2 - 100, 20, 200, 60);
            
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.game.width / 2 - 100, 20, 200, 60);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`Next Wave: ${Math.ceil(this.waveTimer / 1000)}s`, 
                        this.game.width / 2, 50);
        }
    }
    
    isOnPath(x, y) {
        // Check if a position is on the path
        for (let i = 0; i < this.path.length - 1; i++) {
            const start = this.path[i];
            const end = this.path[i + 1];
            
            // Check if point is near the line segment
            const dist = this.pointToLineDistance(x, y, start.x, start.y, end.x, end.y);
            if (dist <= this.pathWidth / 2) {
                return true;
            }
        }
        return false;
    }
    
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) {
            param = dot / lenSq;
        }
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    getPathPosition(progress) {
        // Get position on path based on progress (0-1)
        if (this.path.length === 0) {
            return { x: 0, y: 0 };
        }
        
        const totalLength = this.getPathLength();
        const targetLength = totalLength * progress;
        
        let currentLength = 0;
        for (let i = 0; i < this.path.length - 1; i++) {
            const start = this.path[i];
            const end = this.path[i + 1];
            const segmentLength = Utils.distance(start.x, start.y, end.x, end.y);
            
            if (currentLength + segmentLength >= targetLength) {
                const t = (targetLength - currentLength) / segmentLength;
                return {
                    x: start.x + (end.x - start.x) * t,
                    y: start.y + (end.y - start.y) * t
                };
            }
            
            currentLength += segmentLength;
        }
        
        return this.path[this.path.length - 1];
    }
    
    getPathLength() {
        let length = 0;
        for (let i = 0; i < this.path.length - 1; i++) {
            const start = this.path[i];
            const end = this.path[i + 1];
            length += Utils.distance(start.x, start.y, end.x, end.y);
        }
        return length;
    }
    
    reset() {
        this.currentWave = 0;
        this.waveInProgress = false;
        this.waveTimer = CONFIG.WAVE_DELAY;
        this.enemiesSpawned = 0;
        this.enemiesToSpawn = 0;
        this.lastEnemySpawnTime = 0;
        
        // Regenerate path for new game
        this.generatePath();
    }
    
    handleResize() {
        // Recalculate grid dimensions
        this.gridWidth = Math.floor(this.game.width / CONFIG.GRID_SIZE);
        this.gridHeight = Math.floor(this.game.height / CONFIG.GRID_SIZE);
        
        // Regenerate path for new dimensions
        this.generatePath();
    }
    
    // Getters
    getCurrentWave() {
        return this.currentWave;
    }
    
    getMaxWaves() {
        return this.maxWaves;
    }
    
    isWaveInProgress() {
        return this.waveInProgress;
    }
    
    getWaveProgress() {
        if (!this.waveInProgress || this.enemiesToSpawn === 0) {
            return 0;
        }
        return this.enemiesSpawned / this.enemiesToSpawn;
    }
    
    getEnemiesRemaining() {
        return this.enemiesToSpawn - this.enemiesSpawned + this.game.enemies.length;
    }
}