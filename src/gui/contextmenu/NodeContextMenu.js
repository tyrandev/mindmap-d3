import mousePositionInstance from "../../input/mouse/MousePosition.js";
import ContextMenu from "./ContextMenu.js";
import ColorPicker from "../topmenu/ColorPicker.js";

export default class NodeContextMenu extends ContextMenu {
  constructor(controllerCore) {
    super(controllerCore, "node-context-menu");
    this.controllerCore = controllerCore;
    this.selectionController = this.controllerCore.selectionController;
    this.nodeCreationController = controllerCore.nodeCreationController;
    this.nodeDeletionController = controllerCore.nodeDeletionController;
    this.colorPicker = ColorPicker.getColorPicker();
    this.handleBorderColorChange = this.handleBorderColorChange.bind(this);
    this.handleFillColorChange = this.handleFillColorChange.bind(this);
    this.addBorderlessRectangle = this.addBorderlessRectangle.bind(this);
    this.colorPicker.addEventListener("input", this.handleFillColorChange);
    this.colorPicker.addEventListener(
      "colorChange",
      this.handleBorderColorChange
    );
  }

  initContextMenu() {
    document
      .getElementById("add-node")
      .addEventListener("mousedown", this.addCircle.bind(this));
    document
      .getElementById("add-rectangle")
      .addEventListener("mousedown", this.addRectangle.bind(this));
    document
      .getElementById("add-borderless-rectangle")
      .addEventListener("mousedown", this.addBorderlessRectangle.bind(this));
    document
      .getElementById("rename-node")
      .addEventListener("mousedown", this.renameNode.bind(this));
    document
      .getElementById("delete-node")
      .addEventListener("mousedown", this.deleteNode.bind(this));
    document
      .getElementById("resize-node")
      .addEventListener("mousedown", this.resizeNode.bind(this));
    document
      .getElementById("collapse-node")
      .addEventListener("mousedown", this.collapseNode.bind(this));
    document
      .getElementById("select-color-node")
      .addEventListener("mousedown", this.selectColorNode.bind(this));
    document
      .getElementById("random-color-node")
      .addEventListener("mousedown", this.randomColorNode.bind(this));
    document
      .getElementById("select-border-color-node")
      .addEventListener("mousedown", this.selectBorderColorNode.bind(this));
  }

  showContextMenu(node) {
    const { x, y } = mousePositionInstance.getMouseCoordinates();
    this.prepareContextMenu(x, y);
    this.contextMenu.style.display = "block";
    this.contextMenuNode = node;
  }

  addCircle() {
    if (!this.contextMenuNode) return;
    this.nodeCreationController.createCircle(this.contextMenuNode);
    this.hideContextMenu();
  }

  addRectangle() {
    if (!this.contextMenuNode) return;
    this.nodeCreationController.createRectangle(this.contextMenuNode);
    this.hideContextMenu();
  }

  addBorderlessRectangle() {
    if (!this.contextMenuNode) return;
    this.nodeCreationController.createBorderlessRectangle(this.contextMenuNode);
    this.hideContextMenu();
  }

  renameNode() {
    if (!this.contextMenuNode) return;
    this.selectionController.renameSelectedNodePrompt();
    this.hideContextMenu();
  }

  collapseNode() {
    if (!this.contextMenuNode) return;
    this.selectionController.toggleSelectedNodeCollapse();
    this.hideContextMenu();
  }

  deleteNode() {
    if (!this.contextMenuNode) return;
    this.nodeDeletionController.deleteNode(this.contextMenuNode);
    this.hideContextMenu();
  }

  resizeNode() {
    if (!this.contextMenuNode) {
      console.error("No circle selected for resizing.");
      return;
    }
    const newRadiusStr = prompt(
      "Enter new radius for the node:",
      this.contextMenuNode.radius
    );
    if (newRadiusStr === null) return;
    const newRadius = parseFloat(newRadiusStr);
    if (isNaN(newRadius) || newRadius <= 0) {
      alert("Invalid radius value. Please enter a number greater than 0.");
      return;
    }
    this.selectionController.setSelectedCircleRadius(newRadius);
    this.hideContextMenu();
  }

  selectColorNode() {
    if (!this.contextMenuNode) return;
    // Set a flag to indicate fill color change
    this.colorPicker.colorMode = "fill";
    this.colorPicker.trigger();
  }

  selectBorderColorNode() {
    if (!this.contextMenuNode) return;
    // Set a flag to indicate border color change
    this.colorPicker.colorMode = "border";
    this.colorPicker.trigger();
    console.log("Select border color node called");
  }

  handleBorderColorChange(event) {
    if (!this.contextMenuNode || this.colorPicker.colorMode !== "border")
      return;
    console.log("Handle border color change called");
    const selectedColor = event.detail.color; // Ensure the event structure is correct
    console.log("Color selected: ", selectedColor);
    this.contextMenuNode.setBorderColor(selectedColor);
    this.hideContextMenu();
  }

  handleFillColorChange(event) {
    if (!this.contextMenuNode || this.colorPicker.colorMode !== "fill") return;
    const selectedColor = event.target.value;
    this.selectionController.setSelectedNodeColor(selectedColor);
    this.hideContextMenu();
  }

  randomColorNode() {
    if (!this.contextMenuNode) return;
    this.selectionController.randomizeSelectedNodeColor();
    this.hideContextMenu();
  }
}
