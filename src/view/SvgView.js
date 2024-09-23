import * as d3 from "d3";

class SvgView {
  constructor() {
    if (SvgView.instance) {
      return SvgView.instance;
    }
    SvgView.instance = this;

    this.isZoomEnabled = true; // Control zooming

    this.svg = d3
      .select("#svg-container")
      .append("svg")
      .attr("width", this.getContainerWidth())
      .attr("height", this.getContainerHeight());

    this.g = this.svg.append("g");
    this.setupZoom();
    this.setSvgElementFocusable();
  }

  setSvgElementFocusable() {
    this.svgElement = this.svg.node();
    this.svgElement.setAttribute("tabindex", 0);
    this.svgElement.focus();
  }

  getSvg() {
    return this.svg;
  }

  getSvgGroup() {
    return this.g;
  }

  getSvgGElement() {
    return this.g.node();
  }

  getContainerWidth() {
    return d3.select("#svg-container").node().clientWidth;
  }

  getContainerHeight() {
    return d3.select("#svg-container").node().clientHeight;
  }

  setupZoom() {
    this.zoom = d3
      .zoom()
      .scaleExtent([0.25, 5])
      .on("zoom", (event) => {
        if (this.isZoomEnabled) {
          this.g.attr("transform", event.transform);
        }
      });

    this.svg.call(this.zoom);
  }

  zoomBy(factor) {
    if (this.isZoomEnabled) {
      const transform = d3.zoomTransform(this.svg.node());
      this.svg.transition().duration(500).call(this.zoom.scaleBy, factor);
    }
  }

  zoomIn() {
    this.zoomBy(1.1);
  }

  zoomOut() {
    this.zoomBy(0.9);
  }

  panTop() {
    this.pan(0, 50);
  }

  panBottom() {
    this.pan(0, -50);
  }

  panLeft() {
    this.pan(50, 0);
  }

  panRight() {
    this.pan(-50, 0);
  }

  pan(dx, dy) {
    const transform = d3.zoomTransform(this.svg.node());
    const newTransform = transform.translate(dx, dy);
    this.svg.transition().duration(500).call(this.zoom.transform, newTransform);
  }

  getSvgWidth() {
    return +this.svg.attr("width");
  }

  getSvgHeight() {
    return +this.svg.attr("height");
  }

  getCenterX() {
    return this.getSvgWidth() / 2;
  }

  getCenterY() {
    return this.getSvgHeight() / 2;
  }

  getCenterCoordinates() {
    return {
      x: this.getCenterX(),
      y: this.getCenterY(),
    };
  }

  // Method to reset zoom level to the default (scale = 1)
  resetZoom() {
    this.svg.transition().duration(500).call(this.zoom.scaleTo, 1);
  }

  // Method to reset panning by translating back to the original position (0, 0)
  resetPan() {
    const identityTransform = d3.zoomIdentity; // Default transform (scale 1, translate 0, 0)
    this.svg
      .transition()
      .duration(500)
      .call(this.zoom.transform, identityTransform);
  }

  // Method to enable or disable zooming
  setZoomEnabled(enabled) {
    this.isZoomEnabled = enabled;
    if (enabled) {
      // Adjust zoom level if re-enabled
      const currentTransform = d3.zoomTransform(this.svg.node());
      this.svg.call(this.zoom.transform, currentTransform); // Set to current transform
    }
    console.log("zoom is: ", enabled);
  }
}

const svgView = new SvgView();
export default svgView;
