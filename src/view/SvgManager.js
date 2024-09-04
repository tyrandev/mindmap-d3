import * as d3 from "d3";

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

  initialize(selector) {
    const svgElement = d3.select(selector).node();
    this.svgWidth = svgElement.clientWidth;
    this.svgHeight = svgElement.clientHeight;

    this.svg = d3
      .select(selector)
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
}

const svgManager = new SvgManager();
export default svgManager;
