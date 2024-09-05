import * as d3 from "d3";

const SVG_MINDMAP_SELECTOR = "#mindMapSvg";

class SvgInitializer {
  constructor(svgElement) {
    this.svgElement = svgElement;
    this.svg = d3.select(svgElement);
  }

  initialize() {
    if (!this.svgElement) {
      throw new Error(
        `SVG element with selector ${SVG_MINDMAP_SELECTOR} not found.`
      );
    }
    const svgWidth = this.svgElement.clientWidth;
    const svgHeight = this.svgElement.clientHeight;
    this.svg.attr("width", svgWidth).attr("height", svgHeight);
    this.svgGroup = this.svg.append("g");
    return { svgWidth, svgHeight, svgGroup: this.svgGroup };
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
