import SvgContextMenu from "../../../gui/contextmenu/SvgContextMenu.js";
import MouseModeManager from "../../../input/mouse/state/MouseModeManager.js";
import * as MouseConstants from "../../../constants/MouseConstants.js";
import ContextMenuEventEmitter from "../emitter/ContextMenuEventEmitter.js";

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
      this.selectionController.unselectNode();
      ContextMenuEventEmitter.emit("onHideContextMenu");
    }
  }

  handleContextMenu(event) {
    event.preventDefault();
    if (this.selectionController.selectedNode) return;
    this.svgContextMenu.showContextMenu();
  }
}
