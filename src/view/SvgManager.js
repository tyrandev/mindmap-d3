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
    this.zoomBehavior = null; // To store zoom behavior
    SvgManager.instance = this;
    this.initialize();
    this.preventDefaultContextMenu();
    this.enableFocus();
    this.setupZoom(); // Initialize zoom behavior
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

    // Create a group element to handle transformations
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
    if (svgElement) {
      svgElement.addEventListener("contextmenu", (event) => {
        event.preventDefault(); // Prevent default context menu
      });
    } else {
      console.error("SVG element not found for context menu prevention.");
    }
  }

  enableFocus() {
    const svgElement = this.getSvgElement();
    if (svgElement) {
      svgElement.setAttribute("tabindex", "0"); // Enable focus on the SVG
    } else {
      console.error("SVG element not found for focus management.");
    }
  }

  setupZoom() {
    // Define zoom behavior
    this.zoomBehavior = d3
      .zoom()
      .scaleExtent([0.1, 10]) // Set zoom scale limits
      .on("zoom", (event) => this.handleZoom(event));

    // Apply zoom behavior to the SVG container group
    this.svg.call(this.zoomBehavior);
  }

  handleZoom(event) {
    // Apply zoom and pan transformations to the SVG group
    const { transform } = event;
    this.svgGroup.attr("transform", transform.toString());
  }
}

const svgManager = new SvgManager();
export default svgManager;
