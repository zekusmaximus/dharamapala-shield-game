// Input manager for handling keyboard, mouse, and touch input
import { CONFIG, UTILS } from './config.js';

export class InputManager {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            left: false,
            right: false,
            middle: false
        };
        this.touch = {
            active: false,
            touches: []
        };
        this.gestures = {
            tap: null,
            longPress: null,
            doubleTap: null,
            swipe: null
        };
        this.callbacks = new Map();
        
        // Touch timing
        this.touchStartTime = 0;
        this.lastTapTime = 0;
        this.longPressTimer = null;
        this.touchStartPos = { x: 0, y: 0 };
        
        // Input state
        this.isEnabled = true;
        this.isPaused = false;
    }
    
    async init() {
        console.log('Initializing Input Manager...');
        
        // Setup keyboard listeners
        this.setupKeyboardListeners();
        
        // Setup mouse listeners
        this.setupMouseListeners();
        
        // Setup touch listeners
        this.setupTouchListeners();
        
        // Setup gesture recognition
        this.setupGestureRecognition();
        
        console.log('Input Manager initialized successfully');
    }
    
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.isEnabled || this.isPaused) return;
            
            this.keys[e.key] = true;
            
            // Handle special keys
            this.handleSpecialKeys(e);
            
            // Trigger callbacks
            this.triggerCallbacks('keydown', e);
        });
        
        document.addEventListener('keyup', (e) => {
            if (!this.isEnabled || this.isPaused) return;
            
            this.keys[e.key] = false;
            
            // Trigger callbacks
            this.triggerCallbacks('keyup', e);
        });
    }
    
    setupMouseListeners() {
        const canvas = this.game.canvas;
        
        canvas.addEventListener('mousedown', (e) => {
            if (!this.isEnabled || this.isPaused) return;
            
            this.updateMousePosition(e);
            this.updateMouseButton(e.button, true);
            
            // Trigger callbacks
            this.triggerCallbacks('mousedown', e);
        });
        
        canvas.addEventListener('mouseup', (e) => {
            if (!this.isEnabled || this.isPaused) return;
            
            this.updateMousePosition(e);
            this.updateMouseButton(e.button, false);
            
            // Trigger callbacks
            this.triggerCallbacks('mouseup', e);
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!this.isEnabled || this.isPaused) return;
            
            this.updateMousePosition(e);
            
            // Trigger callbacks
            this.triggerCallbacks('mousemove', e);
        });
        
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        canvas.addEventListener('wheel', (e) => {
            if (!this.isEnabled || this.isPaused) return;
            
            // Trigger callbacks
            this.triggerCallbacks('wheel', e);
        });
    }
    
    setupTouchListeners() {
        const canvas = this.game.canvas;
        
        canvas.addEventListener('touchstart', (e) => {
            if (!this.isEnabled || this.isPaused) return;
            
            e.preventDefault();
            this.touch.active = true;
            this.touchStartTime = Date.now();
            this.updateTouchPosition(e);
            
            // Start long press timer
            this.startLongPressTimer();
            
            // Trigger callbacks
            this.triggerCallbacks('touchstart', e);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            if (!this.isEnabled || this.isPaused) return;
            
            e.preventDefault();
            this.updateTouchPosition(e);
            
            // Cancel long press if moved too much
            if (this.getTouchDistance() > CONFIG.TOUCH_THRESHOLD) {
                this.cancelLongPressTimer();
            }
            
            // Trigger callbacks
            this.triggerCallbacks('touchmove', e);
        });
        
        canvas.addEventListener('touchend', (e) => {
            if (!this.isEnabled || this.isPaused) return;
            
            e.preventDefault();
            this.touch.active = false;
            this.updateTouchPosition(e);
            
            // Handle tap gestures
            this.handleTapGesture();
            
            // Cancel long press timer
            this.cancelLongPressTimer();
            
            // Trigger callbacks
            this.triggerCallbacks('touchend', e);
        });
        
        canvas.addEventListener('touchcancel', (e) => {
            if (!this.isEnabled || this.isPaused) return;
            
            e.preventDefault();
            this.touch.active = false;
            this.cancelLongPressTimer();
            
            // Trigger callbacks
            this.triggerCallbacks('touchcancel', e);
        });
    }
    
    setupGestureRecognition() {
        // Setup gesture recognition logic
        this.gestureThresholds = {
            tap: CONFIG.TOUCH_THRESHOLD,
            longPress: CONFIG.LONG_PRESS_DURATION,
            doubleTap: CONFIG.DOUBLE_TAP_DURATION,
            swipe: 50
        };
    }
    
    handleSpecialKeys(e) {
        switch (e.key) {
            case 'Escape':
                this.handleEscapeKey();
                break;
            case ' ':
                e.preventDefault();
                this.handleSpaceKey();
                break;
            case 'p':
            case 'P':
                this.handlePauseKey();
                break;
            case 'n':
            case 'N':
                this.handleNextWaveKey();
                break;
        }
        
        // Number keys for defense selection
        if (e.key >= '1' && e.key <= '6') {
            this.handleDefenseSelection(parseInt(e.key));
        }
    }
    
    handleEscapeKey() {
        if (this.game.state === CONFIG.GAME_STATES.PLAYING) {
            this.game.pause();
        } else if (this.game.state === CONFIG.GAME_STATES.PAUSED) {
            this.game.resume();
        } else {
            this.game.screenManager.showScreen('main_menu');
        }
    }
    
    handleSpaceKey() {
        if (this.game.state === CONFIG.GAME_STATES.PLAYING) {
            this.game.pause();
        } else if (this.game.state === CONFIG.GAME_STATES.PAUSED) {
            this.game.resume();
        }
    }
    
    handlePauseKey() {
        if (this.game.state === CONFIG.GAME_STATES.PLAYING) {
            this.game.pause();
        } else if (this.game.state === CONFIG.GAME_STATES.PAUSED) {
            this.game.resume();
        }
    }
    
    handleNextWaveKey() {
        if (this.game.state === CONFIG.GAME_STATES.PLAYING) {
            this.game.startNextWave();
        }
    }
    
    handleDefenseSelection(number) {
        const defenseTypes = ['firewall', 'encryption', 'decoy', 'mirror', 'anonymity', 'distributor'];
        const defenseType = defenseTypes[number - 1];
        
        if (defenseType) {
            this.game.defenseManager.setSelectedDefense(defenseType);
        }
    }
    
    updateMousePosition(e) {
        const rect = this.game.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    updateMouseButton(button, isPressed) {
        switch (button) {
            case 0: // Left click
                this.mouse.left = isPressed;
                break;
            case 1: // Middle click
                this.mouse.middle = isPressed;
                break;
            case 2: // Right click
                this.mouse.right = isPressed;
                break;
        }
    }
    
    updateTouchPosition(e) {
        const rect = this.game.canvas.getBoundingClientRect();
        this.touch.touches = [];
        
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            this.touch.touches.push({
                id: touch.identifier,
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            });
        }
        
        // Update start position for first touch
        if (this.touch.touches.length > 0) {
            this.touchStartPos = {
                x: this.touch.touches[0].x,
                y: this.touch.touches[0].y
            };
        }
    }
    
    startLongPressTimer() {
        this.longPressTimer = setTimeout(() => {
            this.handleLongPress();
        }, CONFIG.LONG_PRESS_DURATION);
    }
    
    cancelLongPressTimer() {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }
    
    handleLongPress() {
        const now = Date.now();
        const duration = now - this.touchStartTime;
        
        if (duration >= CONFIG.LONG_PRESS_DURATION) {
            this.gestures.longPress = {
                x: this.touchStartPos.x,
                y: this.touchStartPos.y,
                duration
            };
            
            this.triggerCallbacks('longpress', this.gestures.longPress);
        }
    }
    
    handleTapGesture() {
        const now = Date.now();
        const duration = now - this.touchStartTime;
        
        // Check if it's a valid tap
        if (duration < 300 && this.getTouchDistance() < CONFIG.TOUCH_THRESHOLD) {
            const tap = {
                x: this.touchStartPos.x,
                y: this.touchStartPos.y,
                duration,
                timestamp: now
            };
            
            // Check for double tap
            if (this.lastTapTime && (now - this.lastTapTime) < CONFIG.DOUBLE_TAP_DURATION) {
                this.gestures.doubleTap = tap;
                this.triggerCallbacks('doubletap', tap);
            } else {
                this.gestures.tap = tap;
                this.triggerCallbacks('tap', tap);
            }
            
            this.lastTapTime = now;
        }
    }
    
    getTouchDistance() {
        if (this.touch.touches.length === 0) return 0;
        
        const touch = this.touch.touches[0];
        const dx = touch.x - this.touchStartPos.x;
        const dy = touch.y - this.touchStartPos.y;
        
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    registerCallback(event, callback) {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }
        this.callbacks.get(event).push(callback);
    }
    
    unregisterCallback(event, callback) {
        if (this.callbacks.has(event)) {
            const callbacks = this.callbacks.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    triggerCallbacks(event, data) {
        if (this.callbacks.has(event)) {
            const callbacks = this.callbacks.get(event);
            for (const callback of callbacks) {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in input callback for ${event}:`, error);
                }
            }
        }
    }
    
    isKeyPressed(key) {
        return this.keys[key] || false;
    }
    
    isMouseButtonPressed(button) {
        switch (button) {
            case 'left':
                return this.mouse.left;
            case 'middle':
                return this.mouse.middle;
            case 'right':
                return this.mouse.right;
            default:
                return false;
        }
    }
    
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    getTouchPosition() {
        if (this.touch.touches.length > 0) {
            return { x: this.touch.touches[0].x, y: this.touch.touches[0].y };
        }
        return null;
    }
    
    getActiveTouches() {
        return [...this.touch.touches];
    }
    
    getLastGesture(type) {
        return this.gestures[type];
    }
    
    enable() {
        this.isEnabled = true;
    }
    
    disable() {
        this.isEnabled = false;
        this.reset();
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    reset() {
        this.keys = {};
        this.mouse.left = false;
        this.mouse.right = false;
        this.mouse.middle = false;
        this.touch.active = false;
        this.touch.touches = [];
        this.cancelLongPressTimer();
        this.gestures = {
            tap: null,
            longPress: null,
            doubleTap: null,
            swipe: null
        };
    }
    
    update(deltaTime) {
        // Input manager update logic
        // Could be used for input buffering, gesture recognition, etc.
    }
    
    render(ctx) {
        // Input manager render logic
        // Could be used for debugging input visualization
        if (CONFIG.DEBUG_MODE) {
            this.renderDebugInfo(ctx);
        }
    }
    
    renderDebugInfo(ctx) {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.font = '12px monospace';
        
        // Render mouse position
        ctx.fillText(`Mouse: (${Math.round(this.mouse.x)}, ${Math.round(this.mouse.y)})`, 10, 100);
        
        // Render active keys
        const activeKeys = Object.keys(this.keys).filter(key => this.keys[key]);
        if (activeKeys.length > 0) {
            ctx.fillText(`Keys: ${activeKeys.join(', ')}`, 10, 120);
        }
        
        // Render touch info
        if (this.touch.active) {
            ctx.fillText(`Touch: ${this.touch.touches.length} touches`, 10, 140);
            for (let i = 0; i < this.touch.touches.length; i++) {
                const touch = this.touch.touches[i];
                ctx.fillText(`  Touch ${i}: (${Math.round(touch.x)}, ${Math.round(touch.y)})`, 10, 160 + i * 20);
            }
        }
    }
}

export default InputManager;