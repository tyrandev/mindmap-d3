import FpsTracker from "./FpsTracker.js";

const TARGET_FPS = 60;

export default class AnimationController {
  constructor(onAnimateCallback) {
    this.frameRate = 1000 / TARGET_FPS;
    this.onAnimateCallback = onAnimateCallback;
    this.lastFrameTime = performance.now();
    this.animationFrameId = null;
    this.fpsTracker = new FpsTracker();
  }

  start() {
    this.lastFrameTime = performance.now();
    this.fpsTracker = new FpsTracker();
    this.scheduleNextFrame();
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  animate() {
    const now = performance.now();
    if (this.shouldUpdate(now)) {
      this.updateLastFrameTime(now);
      this.fpsTracker.incrementFrames();
      this.onAnimateCallback();
    }
    this.fpsTracker.update(now);
    this.scheduleNextFrame();
  }

  shouldUpdate(now) {
    const elapsedTime = now - this.lastFrameTime;
    return elapsedTime >= this.frameRate;
  }

  updateLastFrameTime(now) {
    const elapsedTime = now - this.lastFrameTime;
    this.lastFrameTime = now - (elapsedTime % this.frameRate);
  }

  scheduleNextFrame() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}
