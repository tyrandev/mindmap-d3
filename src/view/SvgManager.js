import * as d3 from "d3";
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
    this.preventDefaultContextMenu();
    this.enableFocus();
    this.svgZoom = new SvgZoom(this.svg, this.svgGroup);
  }

  initialize() {
    const svgElement = d3.select(SVG_MINDMAP_SELECTOR).node();
    if (!svgElement) {
      throw new Error(
        `SVG element with selector ${SVG_MINDMAP_SELECTOR} not found.`
      );
    }
    this.svgWidth = svgElement.clientWidth;
    this.svgHeight = svgElement.clientHeight;
    this.svg = d3
      .select(SVG_MINDMAP_SELECTOR)
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);
    this.svgGroup = this.svg.append("g");
    return this.svg;
  }

  getSvgElement() {
    return d3.select(SVG_MINDMAP_SELECTOR).node();
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

  preventDefaultContextMenu() {
    const svgElement = this.getSvgElement();
    if (!svgElement) {
      console.error("SVG element not found for context menu prevention.");
    }
    svgElement.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  enableFocus() {
    const svgElement = this.getSvgElement();
    if (svgElement) {
      svgElement.setAttribute("tabindex", "0"); // Enable focus on the SVG
    } else {
      console.error("SVG element not found for focus management.");
    }
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
