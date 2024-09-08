import * as MouseConstants from "../../constants/MouseConstants.js";
import ColorPicker from "../../gui/topmenu/ColorPicker.js";
import MouseModeManager from "./state/MouseModeManager.js";

export default class NodeSelectionHandler {
  constructor(selectionController) {
    this.selectionController = selectionController;
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
        this.setSelectedNodeDimensions();
        break;
      case MouseConstants.MOUSE_MODES.RENAME:
        this.selectionController.renameSelectedNodePrompt();
        break;
      case MouseConstants.MOUSE_MODES.DELETE:
        this.selectionController.removeSelectedNode();
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

  setSelectedNodeDimensions() {
    const newDemensionsString = document.getElementById(
      "circle-radius-input"
    ).value;
    const newDimensions = parseFloat(newDemensionsString);
    this.selectionController.setSelectedCircleRadius(newDimensions);
    this.selectionController.setSelectedRectangleDimensions(
      newDemensionsString * 2,
      newDemensionsString
    );
  }
}
