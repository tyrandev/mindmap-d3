import * as MouseConstants from "../../constants/MouseConstants.js";
import ColorPicker from "../../gui/topmenu/ColorPicker.js";
import MouseModeManager from "./state/MouseModeManager.js";

export default class NodeSelectionHandler {
  constructor(selectionController, nodeController) {
    this.selectionController = selectionController;
    this.nodeController = nodeController;
    this.modeManager = MouseModeManager;
    this.colorPicker = ColorPicker.getColorPicker();
  }

  handleNodeSelection(node) {
    switch (this.modeManager.getMode()) {
      case MouseConstants.MOUSE_MODES.CHANGE_COLOR:
        const selectedColor = this.colorPicker.getColor();
        this.selectionController.setSelectedNodeColor(selectedColor);
        break;
      case MouseConstants.MOUSE_MODES.RESIZE:
        const newRadiusStr = document.getElementById(
          "circle-radius-input"
        ).value;
        const newRadius = parseFloat(newRadiusStr);
        this.selectionController.setSelectedCircleRadius(newRadius);
        break;
      case MouseConstants.MOUSE_MODES.RENAME:
        this.selectionController.renameSelectedNodePrompt();
        break;
      case MouseConstants.MOUSE_MODES.DELETE:
        this.nodeController.removeNode(node);
        break;
      case MouseConstants.MOUSE_MODES.COPY_COLOR:
        this.colorPicker.setColor(node.getFillColor());
        this.modeManager.setMode(MouseConstants.MOUSE_MODES.CHANGE_COLOR);
        break;
      case MouseConstants.MOUSE_MODES.NORMAL:
      default:
        console.log("Node selected:", node);
        break;
    }
  }
}
