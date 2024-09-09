import * as mc from "../../constants/MouseConstants.js";
import ColorPicker from "../../gui/topmenu/ColorPicker.js";
import MouseModeState from "../../state/MouseModeState.js";

export default class NodeSelectionHandler {
  constructor(selectionController) {
    this.selectionController = selectionController;
    this.modeManager = MouseModeState;
    this.colorPicker = ColorPicker.getColorPicker();
  }

  handleNodeSelection(node) {
    switch (this.modeManager.getMode()) {
      case mc.MOUSE_MODES.CHANGE_COLOR:
        this.selectionController.setSelectedNodeColor(
          this.colorPicker.getColor()
        );
        break;
      case mc.MOUSE_MODES.RESIZE:
        this.setSelectedNodeDimensions();
        break;
      case mc.MOUSE_MODES.RENAME:
        this.selectionController.renameSelectedNodePrompt();
        break;
      case mc.MOUSE_MODES.DELETE:
        this.selectionController.deleteSelectedNode();
        break;
      case mc.MOUSE_MODES.COPY_COLOR:
        this.colorPicker.setColor(node.getFillColor());
        this.modeManager.setMode(mc.MOUSE_MODES.CHANGE_COLOR);
        break;
      case mc.MOUSE_MODES.NORMAL:
      default:
        console.log("Node selected:", node);
        break;
    }
  }

  setSelectedNodeDimensions() {
    const newDemensionsString =
      document.getElementById("node-size-input").value;
    const newDimensions = parseFloat(newDemensionsString);
    this.selectionController.setSelectedCircleRadius(newDimensions);
    this.selectionController.setSelectedRectangleDimensions(
      newDemensionsString * 2,
      newDemensionsString
    );
  }
}
