import NodeContextMenu from "../../gui/contextmenu/NodeContextMenu.js";
import CanvasContextMenu from "../../gui/contextmenu/CanvasContextMenu.js";
import * as MouseConstants from "../../constants/MouseConstants.js";
import MousePosition from "./MousePosition.js";
import MouseModeManager from "./state/MouseModeManager.js";

export default class RightClickHandler {
  constructor(systemCore) {
    this.systemCore = systemCore;
    this.modeManager = MouseModeManager;
    this.nodeContextMenu = new NodeContextMenu(systemCore);
    this.canvasContextMenu = new CanvasContextMenu(systemCore);
  }

  handleRightClick(event) {
    event.preventDefault();
    if (event.button !== 2) return;

    const { x, y } = this.getMouseCoordinates();
    const rightClickedNode = this.systemCore.nodeController.getNodeAtPosition(
      x,
      y
    );

    if (rightClickedNode) {
      this.showNodeContextMenu(rightClickedNode, x, y);
    } else {
      this.showCanvasContextMenu(x, y);
    }

    this.modeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
  }

  showCanvasContextMenu(x, y) {
    this.systemCore.nodeController.selectionController.unselectNode();
    this.canvasContextMenu.showContextMenu(x, y);
    this.nodeContextMenu.hideContextMenu();
  }

  showNodeContextMenu(node, x, y) {
    this.systemCore.nodeController.selectionController.selectNode(node);
    this.nodeContextMenu.showContextMenu(node, x, y);
    this.canvasContextMenu.hideContextMenu();
  }

  getMouseCoordinates() {
    return MousePosition.getMouseCoordinates();
  }
}
