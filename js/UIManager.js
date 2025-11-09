// UI Manager - handles in-game UI elements and updates
import { CONFIG } from './config.js';
import { Utils } from './utils.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.elements = new Map();
        this.notifications = [];
        this.tooltips = new Map();
        this.selectedDefenseType = 'firewall';
        this.hoveredDefenseType = null;
        this.showGrid = true;
        this.showStats = true;
        this.showControls = true;
    }
    
    setup() {
        console.log('Setting up UI manager...');
        
        // Create UI elements
        this.createUIElements();
        
        // Setup tooltips
        this.setupTooltips();
        
        // Create notifications container
        this.createNotificationsContainer();
        
        console.log('UI manager setup complete');
    }
    
    createUIElements() {
        // Resource display
        this.elements.set('resources', {
            type: 'resource',
            x: 10,
            y: 10,
            width: 300,
            height: 80,
            render: (ctx) => this.renderResources(ctx)
        });
        
        // Wave display
        this.elements.set('wave', {
            type: 'wave',
            x: 10,
            y: 100,
            width: 200,
            height: 40,
            render: (ctx) => this.renderWave(ctx)
        });
        
        // Lives display
        this.elements.set('lives', {
            type: 'lives',
            x: 10,
            y: 150,
            width: 200,
            height: 40,
            render: (ctx) => this.renderLives(ctx)
        });
        
        // Score display
        this.elements.set('score', {
            type: 'score',
            x: 10,
            y: 200,
            width: 200,
            height: 40,
            render: (ctx) => this.renderScore(ctx)
        });
        
        // Defense selection panel
        this.elements.set('defense_panel', {
            type: 'defense_panel',
            x: this.game.width - 320,
            y: 10,
            width: 310,
            height: 400,
            render: (ctx) => this.renderDefensePanel(ctx)
        });
        
        // Wave timer
        this.elements.set('wave_timer', {
            type: 'wave_timer',
            x: this.game.width / 2 - 100,
            y: 20,
            width: 200,
            height: 60,
            render: (ctx) => this.renderWaveTimer(ctx)
        });
        
        // Game controls
        this.elements.set('controls', {
            type: 'controls',
            x: this.game.width - 320,
            y: this.game.height - 100,
            width: 310,
            height: 90,
            render: (ctx) => this.renderControls(ctx)
        });
    }
    
    setupTooltips() {
        // Defense type tooltips
        for (const [type, config] of Object.entries(CONFIG.DEFENSE_TYPES)) {
            this.tooltips.set(type, {
                title: config.name,
                description: config.description,
                cost: config.cost,
                stats: {
                    damage: config.damage,
                    range: config.range,
                    fireRate: config.fireRate
                }
            });
        }
    }
    
    createNotificationsContainer() {
        const container = document.createElement('div');
        container.id = 'notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 340px;
            width: 300px;
            z-index: 1000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    update(deltaTime) {
        // Update notifications
        this.updateNotifications(deltaTime);
        
        // Update wave timer
        this.updateWaveTimer(deltaTime);
        
        // Update hover states
        this.updateHoverStates();
    }
    
    render(ctx) {
        // Render UI elements
        for (const [id, element] of this.elements) {
            if (this.shouldRenderElement(element)) {
                element.render(ctx);
            }
        }
        
        // Render notifications
        this.renderNotifications(ctx);
        
        // Render tooltips
        this.renderTooltips(ctx);
        
        // Render grid if enabled
        if (this.showGrid) {
            this.renderGrid(ctx);
        }
    }
    
    renderResources(ctx) {
        const element = this.elements.get('resources');
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(element.x, element.y, element.width, element.height);
        
        // Draw border
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 2;
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        
        // Draw resources
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        const resources = [
            { icon: '🧘', name: 'Dharma', value: this.game.resources.dharma },
            { icon: '📡', name: 'Bandwidth', value: this.game.resources.bandwidth },
            { icon: '🔒', name: 'Anonymity', value: this.game.resources.anonymity }
        ];
        
        let y = element.y + 10;
        for (const resource of resources) {
            ctx.fillText(`${resource.icon} ${resource.name}: ${Utils.formatNumber(resource.value)}`, 
                        element.x + 10, y);
            y += 25;
        }
    }
    
    renderWave(ctx) {
        const element = this.elements.get('wave');
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(element.x, element.y, element.width, element.height);
        
        // Draw border
        ctx.strokeStyle = '#0f3460';
        ctx.lineWidth = 2;
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        
        // Draw wave info
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Wave: ${this.game.wave}`, element.x + 10, element.y + element.height / 2);
    }
    
    renderLives(ctx) {
        const element = this.elements.get('lives');
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(element.x, element.y, element.width, element.height);
        
        // Draw border
        ctx.strokeStyle = this.game.lives > 5 ? '#10b981' : '#ff4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        
        // Draw lives
        ctx.fillStyle = this.game.lives > 5 ? '#ffffff' : '#ff4444';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`❤️ Lives: ${this.game.lives}`, element.x + 10, element.y + element.height / 2);
    }
    
    renderScore(ctx) {
        const element = this.elements.get('score');
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(element.x, element.y, element.width, element.height);
        
        // Draw border
        ctx.strokeStyle = '#f47068';
        ctx.lineWidth = 2;
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        
        // Draw score
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`⭐ Score: ${Utils.formatNumber(this.game.score)}`, 
                    element.x + 10, element.y + element.height / 2);
    }
    
    renderDefensePanel(ctx) {
        const element = this.elements.get('defense_panel');
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(element.x, element.y, element.width, element.height);
        
        // Draw border
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 2;
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        
        // Draw title
        ctx.fillStyle = '#e94560';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('🛡️ Defenses', element.x + element.width / 2, element.y + 10);
        
        // Draw defense options
        const defenseTypes = Object.entries(CONFIG.DEFENSE_TYPES);
        const buttonHeight = 50;
        const buttonSpacing = 5;
        let y = element.y + 40;
        
        for (const [type, config] of defenseTypes) {
            const isSelected = this.selectedDefenseType === type;
            const isHovered = this.hoveredDefenseType === type;
            const canAfford = this.game.canAfford(config.cost);
            
            // Draw button background
            ctx.fillStyle = isSelected ? '#e94560' : 
                           isHovered ? '#16213e' : 
                           canAfford ? '#0f3460' : '#333333';
            ctx.fillRect(element.x + 5, y, element.width - 10, buttonHeight);
            
            // Draw button border
            ctx.strokeStyle = isSelected ? '#ffffff' : '#666666';
            ctx.lineWidth = 1;
            ctx.strokeRect(element.x + 5, y, element.width - 10, buttonHeight);
            
            // Draw defense icon and name
            ctx.fillStyle = canAfford ? '#ffffff' : '#999999';
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${config.icon} ${config.name}`, element.x + 15, y + buttonHeight / 2);
            
            // Draw cost
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            const costText = Utils.formatResources(config.cost);
            ctx.fillText(costText, element.x + element.width - 15, y + buttonHeight / 2);
            
            y += buttonHeight + buttonSpacing;
        }
    }
    
    renderWaveTimer(ctx) {
        const element = this.elements.get('wave_timer');
        
        if (this.game.waveTimer <= 0) return;
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(element.x, element.y, element.width, element.height);
        
        // Draw border
        ctx.strokeStyle = '#f47068';
        ctx.lineWidth = 2;
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        
        // Draw timer text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Next Wave: ${Utils.formatTime(this.game.waveTimer)}`, 
                    element.x + element.width / 2, element.y + element.height / 2);
        
        // Draw progress bar
        const progress = this.game.waveTimer / CONFIG.WAVE_DELAY;
        ctx.fillStyle = '#f47068';
        ctx.fillRect(element.x + 10, element.y + element.height - 10, 
                    (element.width - 20) * progress, 5);
    }
    
    renderControls(ctx) {
        const element = this.elements.get('controls');
        
        if (!this.showControls) return;
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(element.x, element.y, element.width, element.height);
        
        // Draw border
        ctx.strokeStyle = '#16213e';
        ctx.lineWidth = 2;
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        
        // Draw control hints
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        const controls = [
            'Space: Pause',
            'ESC: Menu',
            '1-6: Select Defense',
            'N: Next Wave',
            'G: Toggle Grid'
        ];
        
        let y = element.y + 10;
        for (const control of controls) {
            ctx.fillText(control, element.x + 10, y);
            y += 18;
        }
    }
    
    renderGrid(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        const gridSize = CONFIG.GRID_SIZE;
        
        // Draw vertical lines
        for (let x = 0; x <= this.game.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.game.height);
            ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.game.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.game.width, y);
            ctx.stroke();
        }
    }
    
    renderNotifications(ctx) {
        // Notifications are rendered in DOM for better text handling
    }
    
    renderTooltips(ctx) {
        if (!this.hoveredDefenseType) return;
        
        const tooltip = this.tooltips.get(this.hoveredDefenseType);
        if (!tooltip) return;
        
        const mouseX = this.game.mouse.x;
        const mouseY = this.game.mouse.y;
        
        // Calculate tooltip position
        const tooltipWidth = 250;
        const tooltipHeight = 120;
        let x = mouseX + 15;
        let y = mouseY - tooltipHeight - 15;
        
        // Keep tooltip on screen
        if (x + tooltipWidth > this.game.width) {
            x = mouseX - tooltipWidth - 15;
        }
        if (y < 0) {
            y = mouseY + 15;
        }
        
        // Draw tooltip background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(x, y, tooltipWidth, tooltipHeight);
        
        // Draw tooltip border
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, tooltipWidth, tooltipHeight);
        
        // Draw tooltip content
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(tooltip.title, x + 10, y + 10);
        
        ctx.font = '12px Arial';
        ctx.fillStyle = '#cccccc';
        const lines = this.wrapText(tooltip.description, tooltipWidth - 20);
        let textY = y + 30;
        for (const line of lines) {
            ctx.fillText(line, x + 10, textY);
            textY += 15;
        }
        
        // Draw stats
        textY += 10;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Damage: ${tooltip.stats.damage}`, x + 10, textY);
        ctx.fillText(`Range: ${tooltip.stats.range}`, x + 80, textY);
        ctx.fillText(`Fire Rate: ${tooltip.stats.fireRate}ms`, x + 10, textY + 15);
    }
    
    updateNotifications(deltaTime) {
        // Update notification timers
        for (let i = this.notifications.length - 1; i >= 0; i--) {
            const notification = this.notifications[i];
            notification.duration -= deltaTime;
            
            if (notification.duration <= 0) {
                this.removeNotification(notification);
            }
        }
    }
    
    updateWaveTimer(deltaTime) {
        // Wave timer is updated in the main game loop
    }
    
    updateHoverStates() {
        // Check if mouse is over defense panel
        const element = this.elements.get('defense_panel');
        const mouseX = this.game.mouse.x;
        const mouseY = this.game.mouse.y;
        
        if (Utils.pointInRect(mouseX, mouseY, element.x, element.y, element.width, element.height)) {
            // Check which defense type is hovered
            const defenseTypes = Object.entries(CONFIG.DEFENSE_TYPES);
            const buttonHeight = 50;
            const buttonSpacing = 5;
            let y = element.y + 40;
            
            this.hoveredDefenseType = null;
            for (const [type, config] of defenseTypes) {
                if (Utils.pointInRect(mouseX, mouseY, element.x + 5, y, element.width - 10, buttonHeight)) {
                    this.hoveredDefenseType = type;
                    break;
                }
                y += buttonHeight + buttonSpacing;
            }
        } else {
            this.hoveredDefenseType = null;
        }
    }
    
    shouldRenderElement(element) {
        switch (element.type) {
            case 'controls':
                return this.showControls;
            case 'wave_timer':
                return this.game.waveTimer > 0;
            default:
                return true;
        }
    }
    
    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = this.game.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }
    
    // Public methods for updating UI
    updateResources() {
        // Resources are updated in render method
    }
    
    updateWave() {
        // Wave is updated in render method
    }
    
    updateLives() {
        // Lives are updated in render method
    }
    
    updateScore() {
        // Score is updated in render method
    }
    
    updateAll() {
        // Update all UI elements
        this.updateResources();
        this.updateWave();
        this.updateLives();
        this.updateScore();
    }
    
    // Notification methods
    showNotification(message, type = 'info', duration = CONFIG.NOTIFICATION_DURATION) {
        const notification = {
            id: Date.now(),
            message: message,
            type: type,
            duration: duration,
            element: null
        };
        
        // Create DOM element
        const element = document.createElement('div');
        element.className = `notification notification-${type}`;
        element.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
        `;
        element.textContent = message;
        
        // Add to container
        const container = document.getElementById('notifications-container');
        container.appendChild(element);
        
        // Animate in
        setTimeout(() => {
            element.style.transform = 'translateX(0)';
        }, 10);
        
        notification.element = element;
        this.notifications.push(notification);
        
        // Play sound based on type
        if (type === 'achievement') {
            this.game.audioManager.playSound('achievement');
        } else if (type === 'error') {
            this.game.audioManager.playSound('error');
        }
    }
    
    removeNotification(notification) {
        const index = this.notifications.indexOf(notification);
        if (index > -1) {
            // Animate out
            notification.element.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (notification.element.parentNode) {
                    notification.element.parentNode.removeChild(notification.element);
                }
            }, 300);
            
            this.notifications.splice(index, 1);
        }
    }
    
    getNotificationColor(type) {
        const colors = {
            info: '#0f3460',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            achievement: '#8b5cf6'
        };
        return colors[type] || colors.info;
    }
    
    // Defense selection
    selectDefenseType(type) {
        if (CONFIG.DEFENSE_TYPES[type]) {
            this.selectedDefenseType = type;
            this.showNotification(`Selected: ${CONFIG.DEFENSE_TYPES[type].name}`, 'info', 1000);
        }
    }
    
    getSelectedDefenseType() {
        return this.selectedDefenseType;
    }
    
    // Toggle methods
    toggleGrid() {
        this.showGrid = !this.showGrid;
        this.showNotification(`Grid ${this.showGrid ? 'enabled' : 'disabled'}`, 'info', 1000);
    }
    
    toggleStats() {
        this.showStats = !this.showStats;
        this.showNotification(`Stats ${this.showStats ? 'enabled' : 'disabled'}`, 'info', 1000);
    }
    
    toggleControls() {
        this.showControls = !this.showControls;
        this.showNotification(`Controls ${this.showControls ? 'enabled' : 'disabled'}`, 'info', 1000);
    }
    
    // Input handling
    handleClick(x, y) {
        // Check defense panel clicks
        const element = this.elements.get('defense_panel');
        if (Utils.pointInRect(x, y, element.x, element.y, element.width, element.height)) {
            const defenseTypes = Object.entries(CONFIG.DEFENSE_TYPES);
            const buttonHeight = 50;
            const buttonSpacing = 5;
            let buttonY = element.y + 40;
            
            for (const [type, config] of defenseTypes) {
                if (Utils.pointInRect(x, y, element.x + 5, buttonY, element.width - 10, buttonHeight)) {
                    if (this.game.canAfford(config.cost)) {
                        this.selectDefenseType(type);
                    } else {
                        this.showNotification('Cannot afford this defense!', 'error', 2000);
                    }
                    break;
                }
                buttonY += buttonHeight + buttonSpacing;
            }
        }
    }
}