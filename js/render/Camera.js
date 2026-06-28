import { WORLD } from '../core/world.js';

export class Camera {
  constructor(canvas, world = WORLD) {
    this.canvas = canvas;
    this.world = world;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.cssWidth = world.width;
    this.cssHeight = world.height;
    this.dpr = 1;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.cssWidth = Math.max(1, rect.width);
    this.cssHeight = Math.max(1, rect.height);
    this.dpr = Math.max(1, globalThis.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.cssWidth * this.dpr);
    this.canvas.height = Math.round(this.cssHeight * this.dpr);
    this.scale = Math.min(
      this.cssWidth / this.world.width,
      this.cssHeight / this.world.height
    );
    this.offsetX = (this.cssWidth - this.world.width * this.scale) / 2;
    this.offsetY = (this.cssHeight - this.world.height * this.scale) / 2;
  }

  prepareScreen(context) {
    context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  prepareWorld(context) {
    context.setTransform(
      this.dpr * this.scale,
      0,
      0,
      this.dpr * this.scale,
      this.dpr * this.offsetX,
      this.dpr * this.offsetY
    );
  }

  screenToWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.offsetX) / this.scale,
      y: (clientY - rect.top - this.offsetY) / this.scale
    };
  }
}
