import * as d3 from "d3";

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
  }

  initialize() {
    const svgElement = d3.select(SVG_MINDMAP_SELECTOR).node();
    this.svgWidth = svgElement.clientWidth;
    this.svgHeight = svgElement.clientHeight;

    this.svg = d3
      .select(SVG_MINDMAP_SELECTOR)
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);

    return this.svg;
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

  //TODO: I need method getCenterCoordinates() which returns both x and y
}

const svgManager = new SvgManager();
export default svgManager;
