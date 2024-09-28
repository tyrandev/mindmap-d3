import SvgContextMenu from "../../../gui/contextmenu/SvgContextMenu.js";
import MouseModeState from "../../../state/MouseModeState.js";
import * as MouseConstants from "../../../constants/MouseConstants.js";
import ContextMenuEventEmitter from "../emitter/ContextMenuEventEmitter.js";
import * as d3 from "d3";

export default class SvgEventAttacher {
  constructor(svg, controllerCore) {
    this.svg = svg;
    this.controllerCore = controllerCore;
    this.selectionController = this.controllerCore.selectionController;
    this.svgContextMenu = new SvgContextMenu(controllerCore);
  }

  attachEventListeners() {
    if (!this.svg) {
      throw new Error("SVG element is undefined or null");
    }
    this.svg
      .on("click", (event) => this.handleSvgClick(event))
      .on("contextmenu", (event) => this.handleContextMenu(event));
  }

  handleSvgClick(event) {
    event.preventDefault();
    const [x, y] = d3.pointer(event, this.svg.node());
    console.log(`Click position: x=${x}, y=${y}`);
    if (event.button === 0) {
      MouseModeState.setMode(MouseConstants.MOUSE_MODES.NORMAL);
      this.selectionController.unselectNode();
      ContextMenuEventEmitter.emit("onHideContextMenu");
    }
  }

  handleContextMenu(event) {
    event.preventDefault();
    if (this.selectionController.getSelectedNode()) return;
    this.svgContextMenu.showContextMenu();
  }
}
