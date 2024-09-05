import svgManager from "../../view/SvgManager.js";
import * as d3 from "d3";

export default class WheelHandler {
  constructor(selectionController) {
    this.selectionController = selectionController;
    this.svg = d3.select(svgManager.getSvgElement());
    this.initMouseWheelListener();
  }

  initMouseWheelListener() {
    this.svg.on("wheel", this.handleMouseWheel.bind(this));
  }

  handleMouseWheel(event) {
    event.preventDefault();
    if (!this.selectionController.selectedNode) return;
    this.selectionController.updateSelectedNodeDimensions(
      event.deltaY > 0 ? -5 : 5
    );
  }
}
