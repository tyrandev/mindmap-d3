import * as d3 from "d3";

const SVG_MINDMAP_SELECTOR = "#mindMapSvg";

class SvgInitializer {
  constructor(svgManager) {
    this.svgManager = svgManager; // Reference to SvgManager instance
    this.svgElement = d3.select(SVG_MINDMAP_SELECTOR).node();
    if (!this.svgElement) {
      throw new Error(
        `SVG element with selector ${SVG_MINDMAP_SELECTOR} not found.`
      );
    }
    this.svg = d3.select(this.svgElement);
    this.initializeSvg();
    this.preventDefaultContextMenu();
    this.enableFocus();
    this.svgManager.svg = this.svg;
    this.svgManager.svgWidth = this.svgElement.clientWidth;
    this.svgManager.svgHeight = this.svgElement.clientHeight;
    this.svgManager.svgGroup = this.svg.append("g");
  }

  initializeSvg() {
    this.svg
      .attr("width", this.svgElement.clientWidth)
      .attr("height", this.svgElement.clientHeight);
  }

  preventDefaultContextMenu() {
    if (!this.svgElement) {
      console.error("SVG element not found for context menu prevention.");
    }
    this.svgElement.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  enableFocus() {
    if (this.svgElement) {
      this.svgElement.setAttribute("tabindex", "0"); // Enable focus on the SVG
    } else {
      console.error("SVG element not found for focus management.");
    }
  }
}

export default SvgInitializer;
