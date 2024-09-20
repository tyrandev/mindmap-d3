import mousePositionInstance from "../../input/mouse/MousePosition.js";
import ContextMenu from "./ContextMenu.js";
import ColorPicker from "../topmenu/ColorPicker.js";

export default class NodeContextMenu extends ContextMenu {
  constructor(controllerCore, linkController) {
    super(controllerCore, "node-context-menu");
    this.controllerCore = controllerCore;
    this.linkController = linkController;
    this.selectionController = this.controllerCore.selectionController;
    this.nodeCreationController = controllerCore.nodeCreationController;
    this.nodeDeletionController = controllerCore.nodeDeletionController;
    this.colorPicker = ColorPicker.getColorPicker();
    this.handleBorderColorChange = this.handleBorderColorChange.bind(this);
    this.handleFillColorChange = this.handleFillColorChange.bind(this);
    this.addBorderlessRectangle = this.addBorderlessRectangle.bind(this);
    this.handleSetMindmap = this.handleSetMindmap.bind(this);

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
      .getElementById("collapse-node")
      .addEventListener("mousedown", this.collapseNode.bind(this));
    document
      .getElementById("select-color-node")
      .addEventListener("mousedown", this.selectColorNode.bind(this));
    document
      .getElementById("random-color-node")
      .addEventListener("mousedown", this.randomColorNode.bind(this));
    document
      .getElementById("open-link")
      .addEventListener("mousedown", this.handleOpenLink.bind(this));
    document
      .getElementById("set-mindmap-link")
      .addEventListener("mousedown", this.handleSetMindmap.bind(this));
    document
      .getElementById("set-url-link")
      .addEventListener("mousedown", this.handleSetUrlLink.bind(this));
  }

  showContextMenu(node) {
    const { x, y } = mousePositionInstance.getMouseCoordinates();
    this.prepareContextMenu(x, y);
    this.contextMenu.style.display = "block";
    this.contextMenuNode = node;
    this.updateOpenLinkVisibility();
  }

  updateOpenLinkVisibility() {
    const openLinkMenuItem = document.getElementById("open-link");
    if (this.contextMenuNode && this.contextMenuNode.getLink()) {
      openLinkMenuItem.style.display = "block";
    } else {
      openLinkMenuItem.style.display = "none";
    }
  }

  handleOpenLink() {
    try {
      this.linkController.openLink(this.contextMenuNode);
    } catch (error) {
      alert(error.message);
    }
    this.hideContextMenu();
  }

  async handleSetUrlLink() {
    await this.linkController.promptSetUrlLink(this.contextMenuNode);
    this.hideContextMenu();
  }

  async handleSetMindmap() {
    await this.linkController.promptSetMindmapLink(this.contextMenuNode);
    this.hideContextMenu();
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

  selectColorNode() {
    if (!this.contextMenuNode) return;
    this.colorPicker.colorMode = "fill";
    this.colorPicker.trigger();
  }

  selectBorderColorNode() {
    if (!this.contextMenuNode) return;
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
