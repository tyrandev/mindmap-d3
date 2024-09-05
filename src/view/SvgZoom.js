import * as d3 from "d3";

export default class SvgZoom {
  constructor(svgElement, svgGroup) {
    this.svg = svgElement;
    this.svgGroup = svgGroup;
    this.zoomBehavior = null;
    this.zoomScale = 1;
    this.setupZoom();
  }

  setupZoom() {
    try {
      this.zoomBehavior = d3
        .zoom()
        .scaleExtent([0.1, 10])
        .on("zoom", (event) => this.handleZoom(event));
      this.svg.call(this.zoomBehavior);
    } catch (error) {
      console.error("Error setting up zoom:", error);
    }
  }

  handleZoom(event) {
    try {
      const { transform } = event;
      this.svgGroup.attr("transform", transform.toString());
    } catch (error) {
      console.error("Error handling zoom event:", error);
    }
  }

  applyZoom() {
    try {
      const svgGroup = d3.select(this.svg.node());
      let currentTransform = d3.zoomTransform(svgGroup.node());

      svgGroup
        .transition()
        .duration(100)
        .attr(
          "transform",
          `translate(${currentTransform.x}, ${currentTransform.y}) scale(${this.zoomScale})`
        );
    } catch (error) {
      console.error("Error applying zoom:", error);
    }
  }

  zoomIn() {
    try {
      this.zoomScale += 0.05;
      this.applyZoom();
    } catch (error) {
      console.error("Error zooming in:", error);
    }
  }

  zoomOut() {
    try {
      this.zoomScale -= 0.05;
      this.applyZoom();
    } catch (error) {
      console.error("Error zooming out:", error);
    }
  }

  pan(addX, addY) {
    try {
      const svgGroup = d3.select(this.svg.node());
      let currentTransform = d3.zoomTransform(svgGroup.node());

      currentTransform.x += addX;
      currentTransform.y += addY;

      svgGroup
        .transition()
        .duration(100)
        .attr(
          "transform",
          `translate(${currentTransform.x}, ${currentTransform.y}) scale(${this.zoomScale})`
        );
    } catch (error) {
      console.error("Error during pan operation:", error);
    }
  }
}
