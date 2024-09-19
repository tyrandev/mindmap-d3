import * as d3 from "d3";

class SvgManager {
  constructor() {
    if (SvgManager.instance) {
      return SvgManager.instance;
    }
    SvgManager.instance = this;
    this.svg = d3
      .select("#svg-container")
      .append("svg")
      .attr("width", this.getContainerWidth())
      .attr("height", this.getContainerHeight());

    this.g = this.svg.append("g");
    this.setupZoom();
  }

  getSvg() {
    return this.svg;
  }

  getSvgGroup() {
    return this.g;
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
        this.g.attr("transform", event.transform);
      });

    this.svg.call(this.zoom);
  }

  zoomBy(factor) {
    const transform = d3.zoomTransform(this.svg.node());
    this.svg.transition().duration(500).call(this.zoom.scaleBy, factor);
  }

  zoomIn() {
    this.zoomBy(1.2);
  }

  zoomOut() {
    this.zoomBy(0.8);
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
}

const svgManager = new SvgManager();
export default svgManager;
