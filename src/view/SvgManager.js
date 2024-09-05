import * as d3 from "d3";
import SvgInitializer from "./SvgInitializer.js";
import SvgZoom from "./SvgZoom.js";

const SVG_MINDMAP_SELECTOR = "#mindMapSvg";

class SvgManager {
  constructor() {
    if (SvgManager.instance) {
      return SvgManager.instance;
    }
    this.svg = null;
    this.svgWidth = 0;
    this.svgHeight = 0;
    SvgManager.instance = this;
    this.initialize();
    this.svgZoom = new SvgZoom(this.svg, this.svgGroup);
  }

  initialize() {
    const svgElement = d3.select(SVG_MINDMAP_SELECTOR).node();
    if (!svgElement) {
      throw new Error(
        `SVG element with selector ${SVG_MINDMAP_SELECTOR} not found.`
      );
    }
    const svgInitializer = new SvgInitializer(svgElement);
    const { svgWidth, svgHeight, svgGroup } = svgInitializer.initialize();
    this.svgWidth = svgWidth;
    this.svgHeight = svgHeight;
    this.svgGroup = svgGroup;
    this.svg = d3.select(SVG_MINDMAP_SELECTOR);
    svgInitializer.preventDefaultContextMenu();
    svgInitializer.enableFocus();
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
