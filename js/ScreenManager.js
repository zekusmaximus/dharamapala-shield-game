// Screen manager - handles UI screen navigation and display
import { CONFIG } from './config.js';
import { Utils } from './utils.js';

export class ScreenManager {
    constructor(game) {
        this.game = game;
        this.currentScreen = null;
        this.screens = new Map();
        this.screenHistory = [];
        this.transitions = new Map();
        this.isTransitioning = false;
    }
    
    setup() {
        console.log('Setting up screen manager...');

        // Initialize screens
        this.initializeScreens();

        // Setup screen transitions
        this.setupTransitions();

        // Don't show screen yet - let start() handle it

        console.log('Screen manager setup complete');
    }
    
    initializeScreens() {
        // Main menu screen
        this.screens.set('main_menu', {
            id: 'main_menu',
            title: '🛡️ Dharmapala Shield',
            subtitle: 'A Buddhist Cyberpunk Tower Defense Game',
            buttons: [
                {
                    text: '🎮 New Game',
                    action: () => this.startNewGame(),
                    primary: true
                },
                {
                    text: '📂 Continue',
                    action: () => this.continueGame(),
                    disabled: () => !this.hasSaveGame()
                },
                {
                    text: '🏆 Achievements',
                    action: () => this.showScreen('achievements')
                },
                {
                    text: '⚙️ Settings',
                    action: () => this.showScreen('settings')
                }
            ],
            render: (ctx) => this.renderMainMenu(ctx)
        });
        
        // Pause screen
        this.screens.set('pause', {
            id: 'pause',
            title: '⏸️ Game Paused',
            overlay: true,
            buttons: [
                {
                    text: '▶️ Resume',
                    action: () => this.resumeGame(),
                    primary: true
                },
                {
                    text: '🔄 Restart',
                    action: () => this.restartGame()
                },
                {
                    text: '📋 Main Menu',
                    action: () => this.returnToMenu()
                },
                {
                    text: '⚙️ Settings',
                    action: () => this.showScreen('settings')
                }
            ],
            render: (ctx) => this.renderPauseScreen(ctx)
        });
        
        // Settings screen
        this.screens.set('settings', {
            id: 'settings',
            title: '⚙️ Settings',
            buttons: [
                {
                    text: '🔊 Sound: ON',
                    action: () => this.toggleSound(),
                    toggle: true,
                    state: () => this.game.audioManager ? !this.game.audioManager.isMuted : true
                },
                {
                    text: '💾 Auto Save: ON',
                    action: () => this.toggleAutoSave(),
                    toggle: true,
                    state: () => this.game.saveSystem ? this.game.saveSystem.autoSaveEnabled : true
                },
                {
                    text: '📱 Mobile Mode',
                    action: () => this.toggleMobileMode(),
                    toggle: true,
                    state: () => Utils.isMobile()
                },
                {
                    text: '🗑️ Clear All Saves',
                    action: () => this.clearAllSaves(),
                    danger: true
                },
                {
                    text: '⬅️ Back',
                    action: () => this.goBack(),
                    secondary: true
                }
            ],
            render: (ctx) => this.renderSettingsScreen(ctx)
        });
        
        // Achievements screen
        this.screens.set('achievements', {
            id: 'achievements',
            title: '🏆 Achievements',
            buttons: [
                {
                    text: '⬅️ Back',
                    action: () => this.goBack(),
                    secondary: true
                }
            ],
            render: (ctx) => this.renderAchievementsScreen(ctx)
        });
        
        // Game over screen
        this.screens.set('game_over', {
            id: 'game_over',
            title: '💀 Game Over',
            overlay: true,
            buttons: [
                {
                    text: '🔄 Try Again',
                    action: () => this.restartGame(),
                    primary: true
                },
                {
                    text: '📋 Main Menu',
                    action: () => this.returnToMenu()
                }
            ],
            render: (ctx) => this.renderGameOverScreen(ctx)
        });
        
        // Victory screen
        this.screens.set('victory', {
            id: 'victory',
            title: '🎉 Victory!',
            subtitle: 'You have defended the digital realm!',
            overlay: true,
            buttons: [
                {
                    text: '🎮 Play Again',
                    action: () => this.startNewGame(),
                    primary: true
                },
                {
                    text: '📋 Main Menu',
                    action: () => this.returnToMenu()
                }
            ],
            render: (ctx) => this.renderVictoryScreen(ctx)
        });
    }
    
    setupTransitions() {
        // Fade transition
        this.transitions.set('fade', {
            duration: 300,
            render: (ctx, progress, isOut) => {
                ctx.fillStyle = `rgba(0, 0, 0, ${isOut ? progress : 1 - progress})`;
                ctx.fillRect(0, 0, this.game.width, this.game.height);
            }
        });
        
        // Slide transition
        this.transitions.set('slide', {
            duration: 250,
            render: (ctx, progress, isOut) => {
                const offset = isOut ? progress * this.game.width : -(1 - progress) * this.game.width;
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(offset, 0, this.game.width, this.game.height);
            }
        });
    }
    
    showScreen(screenId, transition = 'fade') {
        if (this.isTransitioning) return;
        
        const screen = this.screens.get(screenId);
        if (!screen) {
            console.error(`Screen ${screenId} not found`);
            return;
        }
        
        // Add to history
        if (this.currentScreen && !screen.overlay) {
            this.screenHistory.push(this.currentScreen);
        }
        
        // Perform transition
        this.performTransition(this.currentScreen, screen, transition);
        
        this.currentScreen = screen;
    }
    
    hideScreen(screenId) {
        if (this.currentScreen && this.currentScreen.id === screenId) {
            if (this.screenHistory.length > 0) {
                const previousScreen = this.screenHistory.pop();
                this.showScreen(previousScreen.id);
            } else {
                this.hideAllScreens();
            }
        }
    }
    
    hideAllScreens() {
        this.currentScreen = null;
        this.screenHistory = [];
    }
    
    performTransition(fromScreen, toScreen, transitionType) {
        this.isTransitioning = true;
        const transition = this.transitions.get(transitionType);
        
        if (!transition) {
            this.isTransitioning = false;
            return;
        }
        
        const startTime = performance.now();
        const duration = transition.duration;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Render transition
            if (transition.render) {
                transition.render(this.game.ctx, Utils.easeInOut(progress), true);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isTransitioning = false;
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    render(ctx) {
        if (!this.currentScreen) return;

        // Render screen background
        if (this.currentScreen.overlay) {
            // Overlay screens (pause, etc.) get semi-transparent background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, this.game.width, this.game.height);
        } else {
            // Full-screen menus get solid background
            ctx.fillStyle = '#0f3460';
            ctx.fillRect(0, 0, this.game.width, this.game.height);
        }

        // Render screen content
        if (this.currentScreen.render) {
            this.currentScreen.render(ctx);
        }

        // Render buttons
        this.renderButtons(ctx);
    }
    
    renderButtons(ctx) {
        if (!this.currentScreen.buttons) return;
        
        const buttonWidth = 250;
        const buttonHeight = 50;
        const buttonSpacing = 15;
        const startY = this.game.height / 2 - 50;
        const centerX = this.game.width / 2;
        
        this.currentScreen.buttons.forEach((button, index) => {
            const y = startY + index * (buttonHeight + buttonSpacing);
            const x = centerX - buttonWidth / 2;
            
            // Check if button is disabled
            const isDisabled = button.disabled && button.disabled();
            
            // Draw button background
            ctx.fillStyle = isDisabled ? '#666' : 
                           button.primary ? '#e94560' : 
                           button.secondary ? '#0f3460' : 
                           button.danger ? '#ff4444' : '#16213e';
            
            ctx.fillRect(x, y, buttonWidth, buttonHeight);
            
            // Draw button border
            ctx.strokeStyle = isDisabled ? '#444' : '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, buttonWidth, buttonHeight);
            
            // Draw button text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            let buttonText = button.text;
            if (button.toggle && button.state) {
                buttonText = button.text.replace(/: (ON|OFF)/, `: ${button.state() ? 'ON' : 'OFF'}`);
            }
            
            ctx.fillText(buttonText, centerX, y + buttonHeight / 2);
        });
    }
    
    renderMainMenu(ctx) {
        // Render title
        ctx.fillStyle = '#e94560';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.currentScreen.title, this.game.width / 2, 150);
        
        // Render subtitle
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(this.currentScreen.subtitle, this.game.width / 2, 200);
        
        // Render decorative elements
        this.renderDecorativeElements(ctx);
    }
    
    renderPauseScreen(ctx) {
        // Render title
        ctx.fillStyle = '#e94560';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.currentScreen.title, this.game.width / 2, 200);
        
        // Render game stats
        this.renderGameStats(ctx);
    }
    
    renderSettingsScreen(ctx) {
        // Render title
        ctx.fillStyle = '#e94560';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.currentScreen.title, this.game.width / 2, 150);
        
        // Render settings info
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        
        const settingsInfo = [
            '🎮 Game Controls:',
            '  • Click/Tap to place defenses',
            '  • Space: Pause/Resume',
            '  • ESC: Open menu',
            '  • 1-6: Select defense type',
            '  • N: Start next wave',
            '',
            '📱 Mobile Controls:',
            '  • Tap to place defenses',
            '  • Use on-screen buttons',
            '',
            '💾 Game saves automatically'
        ];
        
        let y = 250;
        for (const line of settingsInfo) {
            ctx.fillText(line, 100, y);
            y += 25;
        }
    }
    
    renderAchievementsScreen(ctx) {
        // Render title
        ctx.fillStyle = '#e94560';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.currentScreen.title, this.game.width / 2, 100);
        
        // Render achievements
        if (this.game.achievementManager) {
            const achievements = this.game.achievementManager.getUnlockedAchievements();
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '18px Arial';
            ctx.textAlign = 'left';
            
            let y = 180;
            for (const achievement of achievements) {
                ctx.fillText(`🏆 ${achievement.name}`, 100, y);
                ctx.font = '14px Arial';
                ctx.fillStyle = '#cccccc';
                ctx.fillText(achievement.description, 120, y + 20);
                ctx.fillStyle = '#ffffff';
                ctx.font = '18px Arial';
                y += 50;
            }
            
            if (achievements.length === 0) {
                ctx.textAlign = 'center';
                ctx.fillText('No achievements unlocked yet. Keep playing!', this.game.width / 2, 300);
            }
        }
    }
    
    renderGameOverScreen(ctx) {
        // Render title
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.currentScreen.title, this.game.width / 2, 200);
        
        // Render final stats
        this.renderFinalStats(ctx);
    }
    
    renderVictoryScreen(ctx) {
        // Render title
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.currentScreen.title, this.game.width / 2, 180);
        
        // Render subtitle
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.fillText(this.currentScreen.subtitle, this.game.width / 2, 230);
        
        // Render final stats
        this.renderFinalStats(ctx);
    }
    
    renderGameStats(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        
        const stats = [
            `Wave: ${this.game.wave}`,
            `Lives: ${this.game.lives}`,
            `Score: ${Utils.formatNumber(this.game.score)}`,
            `🧘 Dharma: ${Utils.formatNumber(this.game.resources.dharma)}`,
            `📡 Bandwidth: ${Utils.formatNumber(this.game.resources.bandwidth)}`,
            `🔒 Anonymity: ${Utils.formatNumber(this.game.resources.anonymity)}`
        ];
        
        let y = 280;
        for (const stat of stats) {
            ctx.fillText(stat, this.game.width / 2, y);
            y += 30;
        }
    }
    
    renderFinalStats(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        
        const stats = [
            `Final Wave: ${this.game.wave}`,
            `Final Score: ${Utils.formatNumber(this.game.score)}`,
            `Enemies Defeated: ${this.getEnemiesDefeated()}`,
            `Defenses Built: ${this.game.defenses.length}`
        ];
        
        let y = 320;
        for (const stat of stats) {
            ctx.fillText(stat, this.game.width / 2, y);
            y += 35;
        }
    }
    
    renderDecorativeElements(ctx) {
        // Render decorative Buddhist-cyberpunk elements
        const time = performance.now() * 0.001;
        
        // Floating lotus symbols
        for (let i = 0; i < 5; i++) {
            const x = (this.game.width / 6) * (i + 1);
            const y = 300 + Math.sin(time + i) * 20;
            
            ctx.fillStyle = `rgba(233, 69, 96, ${0.3 + Math.sin(time + i) * 0.2})`;
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🪷', x, y);
        }
        
        // Circuit patterns
        ctx.strokeStyle = 'rgba(15, 52, 96, 0.3)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 3; i++) {
            const y = 400 + i * 50;
            ctx.beginPath();
            ctx.moveTo(0, y);
            
            for (let x = 0; x <= this.game.width; x += 20) {
                const offsetY = Math.sin((x + time * 100) * 0.02) * 10;
                ctx.lineTo(x, y + offsetY);
            }
            
            ctx.stroke();
        }
    }
    
    handleClick(x, y) {
        if (!this.currentScreen || !this.currentScreen.buttons) return;
        
        const buttonWidth = 250;
        const buttonHeight = 50;
        const buttonSpacing = 15;
        const startY = this.game.height / 2 - 50;
        const centerX = this.game.width / 2;
        
        this.currentScreen.buttons.forEach((button, index) => {
            const buttonY = startY + index * (buttonHeight + buttonSpacing);
            const buttonX = centerX - buttonWidth / 2;
            
            if (Utils.pointInRect(x, y, buttonX, buttonY, buttonWidth, buttonHeight)) {
                if (button.disabled && button.disabled()) {
                    return;
                }
                
                if (button.action) {
                    button.action();
                }
            }
        });
    }
    
    // Button actions
    startNewGame() {
        this.hideAllScreens();
        this.game.newGame();
    }
    
    continueGame() {
        this.hideAllScreens();
        this.game.loadGame();
        this.game.state = CONFIG.GAME_STATES.PLAYING;
    }
    
    resumeGame() {
        this.hideAllScreens();
        this.game.resume();
    }
    
    restartGame() {
        this.hideAllScreens();
        this.game.newGame();
    }
    
    returnToMenu() {
        this.hideAllScreens();
        this.game.state = CONFIG.GAME_STATES.MENU;
        this.showScreen('main_menu');
    }
    
    goBack() {
        if (this.screenHistory.length > 0) {
            const previousScreen = this.screenHistory.pop();
            this.currentScreen = previousScreen;
        } else {
            this.returnToMenu();
        }
    }
    
    toggleSound() {
        if (this.game.audioManager) {
            this.game.audioManager.toggleMute();
        }
    }
    
    toggleAutoSave() {
        if (this.game.saveSystem) {
            this.game.saveSystem.autoSaveEnabled = !this.game.saveSystem.autoSaveEnabled;
        }
    }
    
    toggleMobileMode() {
        // Mobile mode is determined by device, not toggleable
        console.log('Mobile mode is automatically detected based on device');
    }
    
    clearAllSaves() {
        if (confirm('Are you sure you want to clear all save data? This cannot be undone.')) {
            if (this.game.saveSystem) {
                this.game.saveSystem.clearAllSaves();
            }
        }
    }
    
    hasSaveGame() {
        if (!this.game.saveSystem) return false;
        const saves = this.game.saveSystem.getSaveSlots();
        return saves.some(save => save.data !== null);
    }
    
    getEnemiesDefeated() {
        // This would be tracked in the game state
        return Math.floor(this.game.score / 10); // Rough estimate
    }
}