import MouseModeManager from "./state/MouseModeManager.js";
import MousePosition from "./MousePosition.js";
import ColorPicker from "../../gui/topmenu/ColorPicker.js";
import * as MouseConstants from "../../constants/MouseConstants.js";
import WheelHandler from "./WheelHandler.js";
import RightClickHandler from "./RightClickHandler.js";
import NodeSelectionHandler from "./NodeSelectionHandler.js";

export default class MouseHandler {
  constructor(systemCore) {
    this.systemCore = systemCore;
    this.svg = document.getElementById("mindMapSvg");
    this.nodeController = systemCore.nodeController;
    this.selectionController = this.nodeController.selectionController;
    this.mouseDown = false;
    this.draggingNode = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.colorPicker = ColorPicker.getColorPicker();
    this.modeManager = MouseModeManager;
    this.wheelHandler = new WheelHandler(this.selectionController);
    this.rightClickHandler = new RightClickHandler(systemCore);
    this.nodeSelectionHandler = new NodeSelectionHandler(
      this.selectionController,
      this.nodeController
    );

    this.initMouseListeners();
  }

  initMouseListeners() {
    const svg = this.svg;
    svg.addEventListener("mousedown", this.handleSvgMouseDown.bind(this));
    svg.addEventListener("mousemove", this.handleSvgMouseMove.bind(this));
    svg.addEventListener("mouseup", this.handleSvgMouseUp.bind(this));
    svg.addEventListener(
      "contextmenu",
      this.rightClickHandler.handleRightClick.bind(this.rightClickHandler)
    );
    svg.addEventListener("mouseleave", this.handleSvgMouseLeave.bind(this));
    svg.addEventListener("click", this.handleSvgClick.bind(this));
  }

  handleSvgMouseDown(event) {
    const { x, y } = this.getMouseCoordinates();

    if (event.button !== 0) return;

    this.mouseDown = true;
    const draggedNode = this.nodeController.getNodeAtPosition(x, y);

    if (draggedNode) {
      this.draggingNode = draggedNode;
      this.dragOffsetX = draggedNode.x - x;
      this.dragOffsetY = draggedNode.y - y;

      if (this.selectionController.selectedNode !== draggedNode) {
        this.selectionController.selectNode(draggedNode);
        this.handleSingleClick(draggedNode, x, y);
      }
    } else {
      this.selectionController.unselectNode();
      this.modeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
    }
  }

  handleSvgMouseMove() {
    if (!this.mouseDown || !this.draggingNode) return;
    const { x, y } = this.getMouseCoordinates();
    this.nodeController.moveNode(
      this.draggingNode,
      x + this.dragOffsetX,
      y + this.dragOffsetY
    );
  }

  handleSvgMouseUp(event) {
    this.mouseDown = false;
    this.draggingNode = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

  handleSvgClick(event) {
    console.log("Mouse clicked");
    // Additional logic for click events can be added here if needed
  }

  handleSingleClick(clickedNode, x, y) {
    console.log("left clicked on position: x: ", x, " y: ", y);
    if (
      this.selectionController.selectedNode &&
      this.selectionController.selectedNode !== clickedNode
    ) {
      this.selectionController.unselectNode();
    }
    if (clickedNode) {
      this.selectionController.selectNode(clickedNode);
      console.log("node clicked: ", clickedNode);
      this.nodeSelectionHandler.handleNodeSelection(clickedNode);
    } else {
      this.selectionController.unselectNode();
      this.modeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
    }
  }

  handleSvgMouseLeave(event) {
    this.mouseDown = false;
    this.draggingNode = null;
  }

  getMouseCoordinates() {
    return MousePosition.getMouseCoordinates();
  }
}
