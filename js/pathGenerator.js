// Path generator for creating enemy paths
import { CONFIG, UTILS } from './config.js';

export class PathGenerator {
    constructor(game) {
        this.game = game;
        this.path = [];
        this.waypoints = [];
        this.pathType = 'default';
        this.difficulty = 'normal';
        this.seed = Date.now();
    }
    
    async init() {
        console.log('Initializing Path Generator...');
        // Path generator initialization
    }
    
    generatePath(options = {}) {
        const {
            type = 'default',
            difficulty = 'normal',
            width = this.game.canvas.width,
            height = this.game.canvas.height,
            seed = Date.now()
        } = options;
        
        this.pathType = type;
        this.difficulty = difficulty;
        this.seed = seed;
        
        // Set random seed for reproducible paths
        this.setRandomSeed(seed);
        
        switch (type) {
            case 'default':
                return this.generateDefaultPath(width, height);
            case 'spiral':
                return this.generateSpiralPath(width, height);
            case 'zigzag':
                return this.generateZigzagPath(width, height);
            case 'loop':
                return this.generateLoopPath(width, height);
            case 'cross':
                return this.generateCrossPath(width, height);
            default:
                return this.generateDefaultPath(width, height);
        }
    }
    
    setRandomSeed(seed) {
        // Simple seedable random number generator
        this.randomSeed = seed;
        this.random = () => {
            this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
            return this.randomSeed / 233280;
        };
    }
    
    generateDefaultPath(width, height) {
        const path = [];
        const margin = 50;
        const segments = 6;
        
        // Start from left side
        path.push({ x: 0, y: height / 2 });
        
        // Generate waypoints
        for (let i = 1; i < segments; i++) {
            const x = (width / segments) * i;
            const y = margin + this.random() * (height - 2 * margin);
            path.push({ x, y });
        }
        
        // End at right side
        path.push({ x: width, y: height / 2 });
        
        // Smooth the path
        return this.smoothPath(path);
    }
    
    generateSpiralPath(width, height) {
        const path = [];
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) / 2 - 50;
        const turns = 3;
        const points = 50;
        
        for (let i = 0; i <= points; i++) {
            const t = i / points;
            const angle = t * turns * Math.PI * 2;
            const radius = t * maxRadius;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            path.push({ x, y });
        }
        
        return path;
    }
    
    generateZigzagPath(width, height) {
        const path = [];
        const segments = 8;
        const amplitude = height / 4;
        
        // Start from left side
        path.push({ x: 0, y: height / 2 });
        
        // Generate zigzag pattern
        for (let i = 1; i < segments; i++) {
            const x = (width / segments) * i;
            const direction = i % 2 === 0 ? 1 : -1;
            const y = height / 2 + direction * amplitude * (0.5 + this.random() * 0.5);
            path.push({ x, y });
        }
        
        // End at right side
        path.push({ x: width, y: height / 2 });
        
        return path;
    }
    
    generateLoopPath(width, height) {
        const path = [];
        const centerX = width / 2;
        const centerY = height / 2;
        const radiusX = width / 3;
        const radiusY = height / 3;
        const points = 40;
        
        // Start from left side
        path.push({ x: 0, y: height / 2 });
        
        // Connect to loop
        path.push({ x: centerX - radiusX, y: centerY });
        
        // Generate loop
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radiusX;
            const y = centerY + Math.sin(angle) * radiusY;
            path.push({ x, y });
        }
        
        // Exit to right side
        path.push({ x: centerX + radiusX, y: centerY });
        path.push({ x: width, y: height / 2 });
        
        return path;
    }
    
    generateCrossPath(width, height) {
        const path = [];
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Start from top
        path.push({ x: centerX, y: 0 });
        
        // Go to center
        path.push({ x: centerX, y: centerY });
        
        // Branch based on random choice
        if (this.random() < 0.5) {
            // Go right
            path.push({ x: width, y: centerY });
        } else {
            // Go left
            path.push({ x: 0, y: centerY });
        }
        
        return path;
    }
    
    smoothPath(path) {
        if (path.length < 3) return path;
        
        const smoothedPath = [path[0]];
        
        for (let i = 1; i < path.length - 1; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const next = path[i + 1];
            
            // Calculate control points for smooth curve
            const cp1x = prev.x + (curr.x - prev.x) * 0.5;
            const cp1y = prev.y + (curr.y - prev.y) * 0.5;
            const cp2x = curr.x + (next.x - curr.x) * 0.5;
            const cp2y = curr.y + (next.y - curr.y) * 0.5;
            
            // Add intermediate points
            const steps = 10;
            for (let j = 0; j < steps; j++) {
                const t = j / steps;
                const x = this.bezierPoint(cp1x, curr.x, cp2x, t);
                const y = this.bezierPoint(cp1y, curr.y, cp2y, t);
                smoothedPath.push({ x, y });
            }
        }
        
        smoothedPath.push(path[path.length - 1]);
        return smoothedPath;
    }
    
    bezierPoint(p0, p1, p2, t) {
        return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    }
    
    getPathLength(path) {
        let length = 0;
        for (let i = 1; i < path.length; i++) {
            const dx = path[i].x - path[i - 1].x;
            const dy = path[i].y - path[i - 1].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }
    
    getPathPointAtDistance(path, distance) {
        let currentDistance = 0;
        
        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const dx = curr.x - prev.x;
            const dy = curr.y - prev.y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);
            
            if (currentDistance + segmentLength >= distance) {
                const t = (distance - currentDistance) / segmentLength;
                return {
                    x: prev.x + dx * t,
                    y: prev.y + dy * t,
                    angle: Math.atan2(dy, dx)
                };
            }
            
            currentDistance += segmentLength;
        }
        
        return path[path.length - 1];
    }
    
    generateObstacles(width, height, count = 5) {
        const obstacles = [];
        const minSize = 30;
        const maxSize = 80;
        
        for (let i = 0; i < count; i++) {
            const obstacle = {
                x: minSize + this.random() * (width - 2 * minSize),
                y: minSize + this.random() * (height - 2 * minSize),
                width: minSize + this.random() * (maxSize - minSize),
                height: minSize + this.random() * (maxSize - minSize),
                type: this.random() < 0.5 ? 'rock' : 'tree'
            };
            obstacles.push(obstacle);
        }
        
        return obstacles;
    }
    
    validatePath(path, obstacles) {
        // Check if path intersects with obstacles
        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            
            for (const obstacle of obstacles) {
                if (this.lineIntersectsRect(prev.x, prev.y, curr.x, curr.y, obstacle)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    lineIntersectsRect(x1, y1, x2, y2, rect) {
        // Check if line segment intersects with rectangle
        const left = rect.x;
        const right = rect.x + rect.width;
        const top = rect.y;
        const bottom = rect.y + rect.height;
        
        // Check if line is completely to one side of the rectangle
        if (x1 < left && x2 < left) return false;
        if (x1 > right && x2 > right) return false;
        if (y1 < top && y2 < top) return false;
        if (y1 > bottom && y2 > bottom) return false;
        
        // Check if either endpoint is inside the rectangle
        if (x1 >= left && x1 <= right && y1 >= top && y1 <= bottom) return true;
        if (x2 >= left && x2 <= right && y2 >= top && y2 <= bottom) return true;
        
        // Check for line intersection with rectangle edges
        return this.lineIntersectsLine(x1, y1, x2, y2, left, top, right, top) ||
               this.lineIntersectsLine(x1, y1, x2, y2, right, top, right, bottom) ||
               this.lineIntersectsLine(x1, y1, x2, y2, right, bottom, left, bottom) ||
               this.lineIntersectsLine(x1, y1, x2, y2, left, bottom, left, top);
    }
    
    lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (Math.abs(denom) < 0.0001) return false;
        
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
        
        return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    }
    
    update(deltaTime) {
        // Path generator update logic
        // Could be used for animated paths or dynamic path changes
    }
    
    render(ctx) {
        // Render path for debugging
        if (this.path.length < 2) return;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);
        
        for (let i = 1; i < this.path.length; i++) {
            ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Render waypoints
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (const point of this.path) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

export default PathGenerator;