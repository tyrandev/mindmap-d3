import NodeContextMenu from "../../gui/contextmenu/NodeContextMenu.js";
import SvgContextMenu from "../../gui/contextmenu/SvgContextMenu.js";
import * as MouseConstants from "../../constants/MouseConstants.js";
import MousePosition from "./MousePosition.js";
import MouseModeManager from "./state/MouseModeManager.js";

export default class RightClickHandler {
  constructor(nodeController) {
    this.modeManager = MouseModeManager;
    this.nodeController = nodeController;
    this.selectionController = this.nodeController.selectionController;
    this.nodeContextMenu = new NodeContextMenu(nodeController);
    this.canvasContextMenu = new SvgContextMenu(nodeController);
  }

  handleRightClick(event) {
    event.preventDefault();
    if (event.button !== 2) return;

    const { x, y } = this.getMouseCoordinates();
    const rightClickedNode = this.nodeController.getNodeAtPosition(x, y);

    if (rightClickedNode) {
      this.showNodeContextMenu(rightClickedNode, x, y);
    } else {
      this.showCanvasContextMenu(x, y);
    }

    this.modeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
  }

  showCanvasContextMenu(x, y) {
    this.selectionController.unselectNode();
    this.canvasContextMenu.showContextMenu(x, y);
    this.nodeContextMenu.hideContextMenu();
  }

  showNodeContextMenu(node, x, y) {
    this.selectionController.selectNode(node);
    this.nodeContextMenu.showContextMenu(node, x, y);
    this.canvasContextMenu.hideContextMenu();
  }

  getMouseCoordinates() {
    return MousePosition.getMouseCoordinates();
  }
}
