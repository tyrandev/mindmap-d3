import svgManager from "../../view/SvgManager.js";
import * as d3 from "d3";

export default class WheelHandler {
  constructor(selectionController) {
    this.selectionController = selectionController;
    this.svg = d3.select(svgManager.getSvgElement()); // Get the SVG element
    this.initMouseWheelListener();
  }

  initMouseWheelListener() {
    this.svg.on("wheel", this.handleMouseWheel.bind(this));
  }

  handleMouseWheel(event) {
    // Prevent default scrolling behavior
    event.preventDefault();

    // Check if a node is selected
    if (!this.selectionController.selectedNode) return;

    // Update the selected node's dimensions based on wheel delta
    this.selectionController.updateSelectedNodeDimensions(
      event.deltaY > 0 ? -5 : 5
    );
  }
}
