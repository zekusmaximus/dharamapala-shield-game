// Mobile manager for handling mobile-specific functionality
import { CONFIG, UTILS } from './config.js';

export class MobileManager {
    constructor(game) {
        this.game = game;
        this.isMobile = UTILS.isMobile();
        this.isTouch = UTILS.isTouch();
        this.orientation = 'portrait';
        this.deviceInfo = this.getDeviceInfo();
        
        // Mobile-specific features
        this.vibrationEnabled = true;
        this.gyroscopeEnabled = false;
        this.accelerometerEnabled = false;
        this.touchEnabled = true;
        
        // Performance settings
        this.performanceMode = 'balanced';
        this.particleQuality = 'medium';
        this.effectQuality = 'medium';
        
        // Touch controls
        this.touchControls = {
            enabled: true,
            sensitivity: 1.0,
            hapticFeedback: true
        };
        
        // Mobile UI
        this.mobileUI = {
            virtualControls: true,
            compactMode: false,
            autoHide: false
        };
    }
    
    async init() {
        console.log('Initializing Mobile Manager...');
        
        if (this.isMobile) {
            // Setup mobile-specific features
            await this.setupMobileFeatures();
            
            // Setup orientation handling
            this.setupOrientationHandling();
            
            // Setup touch optimization
            this.setupTouchOptimization();
            
            // Setup performance optimization
            this.setupPerformanceOptimization();
            
            // Setup mobile UI
            this.setupMobileUI();
            
            console.log('Mobile Manager initialized successfully');
        } else {
            console.log('Mobile Manager skipped - not a mobile device');
        }
    }
    
    async setupMobileFeatures() {
        // Setup vibration
        if ('vibrate' in navigator) {
            this.vibrationEnabled = true;
        }
        
        // Setup device orientation
        if ('DeviceOrientationEvent' in window) {
            try {
                // Request permission for iOS 13+
                if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                    const permission = await DeviceOrientationEvent.requestPermission();
                    this.gyroscopeEnabled = permission === 'granted';
                } else {
                    this.gyroscopeEnabled = true;
                }
            } catch (error) {
                console.log('Device orientation permission denied:', error);
            }
        }
        
        // Setup device motion
        if ('DeviceMotionEvent' in window) {
            try {
                // Request permission for iOS 13+
                if (typeof DeviceMotionEvent.requestPermission === 'function') {
                    const permission = await DeviceMotionEvent.requestPermission();
                    this.accelerometerEnabled = permission === 'granted';
                } else {
                    this.accelerometerEnabled = true;
                }
            } catch (error) {
                console.log('Device motion permission denied:', error);
            }
        }
        
        // Setup touch events
        if (this.isTouch) {
            this.touchEnabled = true;
        }
    }
    
    setupOrientationHandling() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            this.handleOrientationChange();
        });
        
        // Handle resize events
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Set initial orientation
        this.updateOrientation();
    }
    
    setupTouchOptimization() {
        if (!this.isTouch) return;
        
        // Prevent default touch behaviors
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault(); // Prevent pinch zoom
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault(); // Prevent pinch zoom
            }
        }, { passive: false });
        
        // Optimize touch scrolling
        document.body.style.touchAction = 'manipulation';
        
        // Disable double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    setupPerformanceOptimization() {
        // Detect device performance
        const performance = this.detectDevicePerformance();
        this.performanceMode = performance.mode;
        
        // Apply performance settings
        this.applyPerformanceSettings(performance);
    }
    
    setupMobileUI() {
        // Add mobile class to body
        document.body.classList.add('mobile');
        
        // Setup virtual controls
        if (this.mobileUI.virtualControls) {
            this.setupVirtualControls();
        }
        
        // Setup compact mode
        if (this.mobileUI.compactMode) {
            document.body.classList.add('compact');
        }
        
        // Setup auto-hide UI
        if (this.mobileUI.autoHide) {
            this.setupAutoHideUI();
        }
    }
    
    setupVirtualControls() {
        // Create virtual control elements
        const virtualControls = document.createElement('div');
        virtualControls.id = 'virtual-controls';
        virtualControls.className = 'virtual-controls';
        virtualControls.innerHTML = `
            <div class="virtual-dpad">
                <button class="dpad-btn dpad-up" data-action="up">↑</button>
                <button class="dpad-btn dpad-down" data-action="down">↓</button>
                <button class="dpad-btn dpad-left" data-action="left">←</button>
                <button class="dpad-btn dpad-right" data-action="right">→</button>
            </div>
            <div class="virtual-actions">
                <button class="action-btn action-primary" data-action="primary">A</button>
                <button class="action-btn action-secondary" data-action="secondary">B</button>
                <button class="action-btn action-special" data-action="special">X</button>
            </div>
        `;
        
        // Add to UI overlay
        document.getElementById('ui-overlay').appendChild(virtualControls);
        
        // Setup event listeners
        this.setupVirtualControlEvents(virtualControls);
    }
    
    setupVirtualControlEvents(container) {
        const buttons = container.querySelectorAll('button');
        
        buttons.forEach(button => {
            // Touch events
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const action = button.dataset.action;
                this.handleVirtualControl(action, true);
                this.provideHapticFeedback('light');
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                const action = button.dataset.action;
                this.handleVirtualControl(action, false);
            });
            
            // Mouse events for testing
            button.addEventListener('mousedown', (e) => {
                const action = button.dataset.action;
                this.handleVirtualControl(action, true);
            });
            
            button.addEventListener('mouseup', (e) => {
                const action = button.dataset.action;
                this.handleVirtualControl(action, false);
            });
        });
    }
    
    handleVirtualControl(action, isPressed) {
        // Handle virtual control input
        switch (action) {
            case 'up':
                this.game.inputManager.keys['ArrowUp'] = isPressed;
                break;
            case 'down':
                this.game.inputManager.keys['ArrowDown'] = isPressed;
                break;
            case 'left':
                this.game.inputManager.keys['ArrowLeft'] = isPressed;
                break;
            case 'right':
                this.game.inputManager.keys['ArrowRight'] = isPressed;
                break;
            case 'primary':
                this.game.inputManager.keys[' '] = isPressed; // Space
                break;
            case 'secondary':
                this.game.inputManager.keys['Escape'] = isPressed;
                break;
            case 'special':
                this.game.inputManager.keys['n'] = isPressed; // Next wave
                break;
        }
    }
    
    setupAutoHideUI() {
        let hideTimer;
        
        // Show UI on touch
        document.addEventListener('touchstart', () => {
            this.showMobileUI();
            
            // Reset hide timer
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                this.hideMobileUI();
            }, 5000);
        });
        
        // Hide UI after 5 seconds of inactivity
        hideTimer = setTimeout(() => {
            this.hideMobileUI();
        }, 5000);
    }
    
    getDeviceInfo() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        return {
            userAgent,
            platform,
            isIOS: /iPhone|iPad|iPod/.test(userAgent),
            isAndroid: /Android/.test(userAgent),
            isWindowsPhone: /Windows Phone/.test(userAgent),
            isTablet: /iPad|Android/.test(userAgent) && window.innerWidth > 768,
            pixelRatio: window.devicePixelRatio || 1,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            colorDepth: window.screen.colorDepth,
            touchPoints: navigator.maxTouchPoints || 0
        };
    }
    
    detectDevicePerformance() {
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Calculate performance score
        let score = 0;
        score += memory * 2; // Memory weight
        score += cores * 3; // CPU cores weight
        score -= pixelRatio * 2; // High pixel ratio penalty
        
        // Determine performance mode
        let mode;
        if (score >= 15) {
            mode = 'high';
        } else if (score >= 8) {
            mode = 'balanced';
        } else {
            mode = 'low';
        }
        
        return {
            score,
            mode,
            memory,
            cores,
            pixelRatio
        };
    }
    
    applyPerformanceSettings(performance) {
        switch (performance.mode) {
            case 'high':
                this.particleQuality = 'high';
                this.effectQuality = 'high';
                this.game.maxParticles = 100;
                break;
            case 'balanced':
                this.particleQuality = 'medium';
                this.effectQuality = 'medium';
                this.game.maxParticles = 50;
                break;
            case 'low':
                this.particleQuality = 'low';
                this.effectQuality = 'low';
                this.game.maxParticles = 25;
                break;
        }
        
        // Apply settings to game
        if (this.game.particleSystem) {
            this.game.particleSystem.maxParticles = this.game.maxParticles;
        }
    }
    
    handleOrientationChange() {
        this.updateOrientation();
        
        // Apply orientation-specific settings
        if (this.orientation === 'landscape') {
            this.applyLandscapeSettings();
        } else {
            this.applyPortraitSettings();
        }
        
        // Notify game of orientation change
        if (this.game.screenManager) {
            this.game.screenManager.handleResize();
        }
    }
    
    handleResize() {
        // Handle resize events
        this.updateOrientation();
        
        // Update game canvas size
        if (this.game && this.game.canvas) {
            this.game.handleResize();
        }
    }
    
    updateOrientation() {
        if (window.innerWidth > window.innerHeight) {
            this.orientation = 'landscape';
        } else {
            this.orientation = 'portrait';
        }
        
        // Update body class
        document.body.classList.remove('portrait', 'landscape');
        document.body.classList.add(this.orientation);
    }
    
    applyLandscapeSettings() {
        // Landscape-specific optimizations
        if (this.game.uiManager) {
            this.game.uiManager.hudVisible = true;
        }
        
        // Show virtual controls in landscape
        if (this.mobileUI.virtualControls) {
            const virtualControls = document.getElementById('virtual-controls');
            if (virtualControls) {
                virtualControls.style.display = 'flex';
            }
        }
    }
    
    applyPortraitSettings() {
        // Portrait-specific optimizations
        if (this.game.uiManager) {
            this.game.uiManager.hudVisible = true;
        }
        
        // Adjust virtual controls for portrait
        if (this.mobileUI.virtualControls) {
            const virtualControls = document.getElementById('virtual-controls');
            if (virtualControls) {
                virtualControls.style.display = 'flex';
                virtualControls.classList.add('portrait');
            }
        }
    }
    
    provideHapticFeedback(type = 'light') {
        if (!this.touchControls.hapticFeedback || !this.vibrationEnabled) return;
        
        switch (type) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(25);
                break;
            case 'heavy':
                navigator.vibrate(50);
                break;
            case 'success':
                navigator.vibrate([10, 50, 10]);
                break;
            case 'error':
                navigator.vibrate([50, 30, 50, 30, 50]);
                break;
            case 'warning':
                navigator.vibrate([30, 20, 30]);
                break;
        }
    }
    
    showMobileUI() {
        // Show mobile UI elements
        const hud = document.getElementById('game-hud');
        if (hud) {
            hud.style.opacity = '1';
        }
        
        const virtualControls = document.getElementById('virtual-controls');
        if (virtualControls) {
            virtualControls.style.opacity = '1';
        }
    }
    
    hideMobileUI() {
        // Hide mobile UI elements
        const hud = document.getElementById('game-hud');
        if (hud) {
            hud.style.opacity = '0.3';
        }
        
        const virtualControls = document.getElementById('virtual-controls');
        if (virtualControls) {
            virtualControls.style.opacity = '0.3';
        }
    }
    
    optimizeForMobile() {
        // Apply mobile optimizations
        if (!this.isMobile) return;
        
        // Reduce particle count
        if (this.game.particleSystem) {
            this.game.particleSystem.maxParticles = Math.floor(this.game.particleSystem.maxParticles * 0.5);
        }
        
        // Disable some visual effects
        if (this.game.uiManager) {
            this.game.uiManager.debugMode = false;
        }
        
        // Optimize game loop
        if (this.game) {
            this.game.targetFPS = 30; // Reduce to 30 FPS for better battery life
        }
    }
    
    getMobileStats() {
        return {
            isMobile: this.isMobile,
            isTouch: this.isTouch,
            orientation: this.orientation,
            deviceInfo: this.deviceInfo,
            performance: this.detectDevicePerformance(),
            vibrationEnabled: this.vibrationEnabled,
            gyroscopeEnabled: this.gyroscopeEnabled,
            accelerometerEnabled: this.accelerometerEnabled,
            touchEnabled: this.touchEnabled
        };
    }
    
    update(deltaTime) {
        // Mobile manager update logic
        // Could be used for performance monitoring, adaptive settings, etc.
        
        // Monitor performance and adjust settings if needed
        if (this.game.fps < 20 && this.performanceMode !== 'low') {
            this.applyPerformanceSettings({ mode: 'low' });
        }
    }
    
    render(ctx) {
        // Mobile manager render logic
        // Could be used for rendering mobile-specific UI elements
    }
}

export default MobileManager;