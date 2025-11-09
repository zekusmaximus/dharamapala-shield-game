// Utility functions and helpers
export class Utils {
    // Math utilities
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    
    static lerp(start, end, t) {
        return start + (end - start) * t;
    }
    
    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    
    static angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
    
    static randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Color utilities
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    static colorWithAlpha(color, alpha) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    }
    
    // Array utilities
    static shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    static weightedRandom(options) {
        const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const option of options) {
            random -= option.weight;
            if (random <= 0) {
                return option.value;
            }
        }
        
        return options[options.length - 1].value;
    }
    
    // String utilities
    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    static formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${remainingSeconds}s`;
    }
    
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Storage utilities
    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    }
    
    static loadFromLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return defaultValue;
        }
    }
    
    static removeFromLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
            return false;
        }
    }
    
    // Performance utilities
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Canvas utilities
    static clearCanvas(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
    }
    
    static drawCircle(ctx, x, y, radius, color, alpha = 1) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    static drawRect(ctx, x, y, width, height, color, alpha = 1) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
        ctx.restore();
    }
    
    static drawText(ctx, text, x, y, font, color, align = 'left', baseline = 'top') {
        ctx.save();
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.fillText(text, x, y);
        ctx.restore();
    }
    
    static drawLine(ctx, x1, y1, x2, y2, color, width = 1, alpha = 1) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }
    
    // Collision detection
    static circleCollision(x1, y1, r1, x2, y2, r2) {
        return this.distance(x1, y1, x2, y2) < r1 + r2;
    }
    
    static rectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 &&
               x1 + w1 > x2 &&
               y1 < y2 + h2 &&
               y1 + h1 > y2;
    }
    
    static pointInCircle(px, py, cx, cy, radius) {
        return this.distance(px, py, cx, cy) <= radius;
    }
    
    static pointInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    }
    
    // Animation utilities
    static easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    static easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    static easeIn(t) {
        return t * t * t;
    }
    
    // Validation utilities
    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    // Resource management
    static preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
    
    static preloadAudio(src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => resolve(audio);
            audio.onerror = reject;
            audio.src = src;
        });
    }
    
    // Game-specific utilities
    static getEnemyTypeName(type) {
        const names = {
            scriptKiddie: 'Script Kiddie',
            federalAgent: 'Federal Agent',
            corporateSaboteur: 'Corporate Saboteur',
            aiSurveillance: 'AI Surveillance',
            quantumHacker: 'Quantum Hacker',
            corruptedMonk: 'Corrupted Monk'
        };
        return names[type] || 'Unknown Enemy';
    }
    
    static getDefenseTypeName(type) {
        const names = {
            firewall: 'Firewall Fortress',
            encryption: 'Encryption Monastery',
            decoy: 'Decoy Temple',
            mirror: 'Mirror Server',
            anonymity: 'Anonymity Shroud',
            distributor: 'Dharma Distributor'
        };
        return names[type] || 'Unknown Defense';
    }
    
    static getBossTypeName(type) {
        const names = {
            raidTeam: 'Raid Team',
            megaCorpTitan: 'MegaCorp Titan'
        };
        return names[type] || 'Unknown Boss';
    }
    
    static getResourceIcon(resource) {
        const icons = {
            dharma: '🧘',
            bandwidth: '📡',
            anonymity: '🔒'
        };
        return icons[resource] || '💰';
    }
    
    static formatResources(resources) {
        return Object.entries(resources)
            .map(([resource, amount]) => `${this.getResourceIcon(resource)} ${this.formatNumber(amount)}`)
            .join(' ');
    }
}

// Export for easy access
export const {
    clamp,
    lerp,
    distance,
    angle,
    randomRange,
    randomInt,
    hexToRgb,
    rgbToHex,
    colorWithAlpha,
    shuffle,
    weightedRandom,
    formatNumber,
    formatTime,
    capitalize,
    saveToLocalStorage,
    loadFromLocalStorage,
    removeFromLocalStorage,
    debounce,
    throttle,
    clearCanvas,
    drawCircle,
    drawRect,
    drawText,
    drawLine,
    circleCollision,
    rectCollision,
    pointInCircle,
    pointInRect,
    easeInOut,
    easeOut,
    easeIn,
    isValidEmail,
    isValidUrl,
    isMobile,
    isTouchDevice,
    preloadImage,
    preloadAudio,
    getEnemyTypeName,
    getDefenseTypeName,
    getBossTypeName,
    getResourceIcon,
    formatResources
} = Utils;