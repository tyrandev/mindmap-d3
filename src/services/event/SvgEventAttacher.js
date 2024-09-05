import SvgContextMenu from "../../gui/contextmenu/SvgContextMenu.js";
import mousePositionInstance from "../../input/mouse/MousePosition.js";
import MouseModeManager from "../../input/mouse/state/MouseModeManager.js";
import * as MouseConstants from "../../constants/MouseConstants.js";

export default class SvgEventAttacher {
  constructor(svg, nodeController) {
    this.svg = svg;
    this.nodeController = nodeController;
    this.selectionController = this.nodeController.selectionController;
    this.svgContextMenu = new SvgContextMenu(nodeController);
  }

  attachEventListeners() {
    if (!this.svg) {
      console.error("SVG element is undefined or null");
      return;
    }

    this.svg
      .on("click", (event) => this.handleSvgClick(event))
      .on("contextmenu", (event) => this.handleContextMenu(event));
  }

  handleSvgClick(event) {
    event.preventDefault();
    console.log("SVG background clicked");
    if (event.button === 0) {
      MouseModeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
      this.svgContextMenu.hideContextMenu();
    }
  }

  handleContextMenu(event) {
    event.preventDefault();
    if (this.selectionController.selectedNode) return;
    const { x, y } = mousePositionInstance.getMouseCoordinates();
    this.svgContextMenu.showContextMenu(x, y);
  }
}
