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

  applyZoom() {
    const svgGroup = d3.select(this.svg.node());
    let currentTransform = d3.zoomTransform(svgGroup.node());

    const svg = d3.select(this.svg.node());
    svg
      .transition()
      .duration(100)
      .attr(
        "transform",
        `translate(${currentTransform.x}, ${currentTransform.y}) scale(${this.zoomScale})`
      );
  }

  zoomIn() {
    this.zoomScale += 0.05;
    this.applyZoom();
  }

  zoomOut() {
    this.zoomScale -= 0.05;
    this.applyZoom();
  }

  pan(addX, addY) {
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
  }
}
