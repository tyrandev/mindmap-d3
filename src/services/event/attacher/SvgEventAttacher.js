import SvgContextMenu from "../../../gui/contextmenu/SvgContextMenu.js";
import MouseModeState from "../../../state/MouseModeState.js";
import * as MouseConstants from "../../../constants/MouseConstants.js";
import ContextMenuEventEmitter from "../emitter/ContextMenuEventEmitter.js";
import svgManager from "../../../view/SvgManager.js";

export default class SvgEventAttacher {
  constructor(svg, controllerCore) {
    this.svg = svg;
    this.controllerCore = controllerCore;
    this.selectionController = this.controllerCore.selectionController;
    this.svgContextMenu = new SvgContextMenu(controllerCore);
  }

  attachEventListeners() {
    if (!this.svg) {
      console.error("SVG element is undefined or null");
      return;
    }

    this.svg
      .on("click", (event) => this.handleSvgClick(event))
      .on("contextmenu", (event) => this.handleContextMenu(event));

    this.svg
      .node()
      .addEventListener("wheel", this.handleMouseWheel.bind(this), {
        passive: false,
      });

    // Add mousedown event listener
    this.svg
      .node()
      .addEventListener("mousedown", this.handleMouseDown.bind(this));
  }

  handleSvgClick(event) {
    event.preventDefault();
    console.log("SVG background clicked");
    if (event.button === 0) {
      MouseModeState.setMode(MouseConstants.MOUSE_MODES.NORMAL);
      this.selectionController.unselectNode();
      ContextMenuEventEmitter.emit("onHideContextMenu");
    }
  }

  handleContextMenu(event) {
    event.preventDefault();
    if (this.selectionController.selectedNode) return;
    this.svgContextMenu.showContextMenu();
  }

  handleMouseWheel(event) {
    event.preventDefault();
    console.log("SVG mouse wheel working");
  }

  handleMouseDown(event) {
    event.preventDefault();
    console.log("Mouse down detected");

    if (event.button === 0) {
      // Left-click
      // Handle node dragging or selection logic here
      MouseModeState.setMode(MouseConstants.MOUSE_MODES.DRAGGING);
      console.log("Mouse mode set to DRAGGING");
    } else if (event.button === 1) {
      // Middle-click
      // Handle any other functionality for middle click
      console.log("Middle mouse button pressed");
    } else if (event.button === 2) {
      // Right-click
      // The contextmenu event handles right-click, so no need for this.
      console.log("Right-click ignored, handled by context menu.");
    }
  }
}
