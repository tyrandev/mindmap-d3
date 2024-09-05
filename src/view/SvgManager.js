import SvgInitializer from "./SvgInitializer.js";
import SvgZoom from "./SvgZoom.js";

class SvgManager {
  constructor() {
    if (SvgManager.instance) {
      return SvgManager.instance;
    }
    SvgManager.instance = this;
    this.svg = null;
    this.svgWidth = 0;
    this.svgHeight = 0;
    this.svgGroup = null;
    this.SvgInitializer = new SvgInitializer(this);
    this.svgZoom = new SvgZoom(this.svg, this.svgGroup);
  }

  getSvg() {
    if (!this.svg) {
      throw new Error("SVG not initialized. Call initialize() first.");
    }
    return this.svg;
  }

  getSvgWidth() {
    return this.svgWidth;
  }

  getSvgHeight() {
    return this.svgHeight;
  }

  getCenterX() {
    return this.svgWidth / 2;
  }

  getCenterY() {
    return this.svgHeight / 2;
  }

  getCenterCoordinates() {
    return {
      x: this.getCenterX(),
      y: this.getCenterY(),
    };
  }

  zoomIn() {
    this.svgZoom.zoomIn();
  }

  zoomOut() {
    this.svgZoom.zoomOut();
  }

  pan(addX, addY) {
    this.svgZoom.pan(addX, addY);
  }
}

const svgManager = new SvgManager();
export default svgManager;
