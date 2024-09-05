import * as d3 from "d3";

const SVG_MINDMAP_SELECTOR = "#mindMapSvg";

class SvgInitializer {
  constructor(svgManager) {
    this.svgManager = svgManager;
    this.svgElement = this.getSvgElement();
    this.svg = d3.select(this.svgElement);
    this.initializeSvg();
    this.preventDefaultContextMenu();
    this.enableFocus();
    this.setupSvgManager();
  }

  getSvgElement() {
    const svgElement = d3.select(SVG_MINDMAP_SELECTOR).node();
    if (!svgElement) {
      throw new Error(
        `SVG element with selector ${SVG_MINDMAP_SELECTOR} not found.`
      );
    }
    return svgElement;
  }

  initializeSvg() {
    this.setSvgDimensions();
    this.createSvgGroup();
  }

  setSvgDimensions() {
    this.svg
      .attr("width", this.svgElement.clientWidth)
      .attr("height", this.svgElement.clientHeight);
  }

  createSvgGroup() {
    this.svgGroup = this.svg.append("g");
  }

  preventDefaultContextMenu() {
    this.svgElement.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  enableFocus() {
    this.svgElement.setAttribute("tabindex", "0"); // Enable focus on the SVG
  }

  setupSvgManager() {
    this.svgManager.svg = this.svg;
    this.svgManager.svgWidth = this.svgElement.clientWidth;
    this.svgManager.svgHeight = this.svgElement.clientHeight;
    this.svgManager.svgGroup = this.svgGroup;
  }
}

export default SvgInitializer;
