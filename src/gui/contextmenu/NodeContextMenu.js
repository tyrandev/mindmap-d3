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
    this.handleOpenLink = this.handleOpenLink.bind(this);
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
      .getElementById("open-link")
      .addEventListener("mousedown", this.handleOpenLink.bind(this));
    document
      .getElementById("set-mindmap-link")
      .addEventListener("mousedown", this.handleSetMindmap.bind(this));
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
    if (!this.contextMenuNode) return;

    const link = this.contextMenuNode.getLink();
    if (!link) {
      alert("No link is set for this node.");
      return;
    }

    if (link.getType() === "MindmapLink") {
      const mindmapName = link.getMindmapName();
      console.log(`Opening mindmap link: ${mindmapName}`);
      try {
        this.linkController.mindmapLocalStorage.loadFromLocalStorage(
          mindmapName
        );
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    } else {
      alert("Unsupported link type.");
    }

    this.hideContextMenu();
  }

  async handleSetMindmap() {
    if (!this.contextMenuNode) return;

    // Get the list of available mindmaps
    const mindmaps =
      this.linkController.mindmapLocalStorage.listSavedMindMaps();
    if (mindmaps.length === 0) {
      alert("No mindmaps available to link.");
      return;
    }

    // Prompt the user to choose a mindmap to link to the node
    const userInput = prompt(
      `Select a mindmap to link to this node (Available mindmaps: ${mindmaps.join(
        ", "
      )}):`
    );

    if (!userInput) {
      alert("Mindmap selection canceled.");
      return;
    }

    // Sanitize input: remove extra spaces and convert to lower case for comparison
    const selectedMindmap = userInput.trim();

    // Validate the user's selection
    const mindmapExists = mindmaps.some(
      (map) => map.toLowerCase() === selectedMindmap.toLowerCase()
    );

    if (mindmapExists) {
      try {
        // If valid, set the link to the selected mindmap
        this.linkController.setMindmapLink(
          this.contextMenuNode,
          selectedMindmap
        );
        console.log(`Mindmap link set to: ${selectedMindmap}`);
      } catch (error) {
        alert(`Error setting mindmap link: ${error.message}`);
      }
    } else {
      // If the mindmap name doesn't exist, show an error
      alert(`Invalid mindmap name. Please select from: ${mindmaps.join(", ")}`);
    }

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
