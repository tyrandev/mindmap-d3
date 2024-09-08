import svgManager from "../../view/SvgManager.js";
import GuiDisplayUtil from "../../util/display/GuiDisplayUtil.js";
import MouseModeState from "../../state/MouseModeState.js";
import * as MouseConstants from "../../constants/MouseConstants.js";
import StackEventEmitter from "../../services/event/emitter/StackEventEmitter.js";

export default class KeyboardHandler {
  constructor(nodeController, mindmapLocalStorage) {
    this.svg = svgManager.getSvg();
    this.nodeController = nodeController;
    this.selectionController = this.nodeController.selectionController;
    this.mindmapLocalStorage = mindmapLocalStorage;
    this.initKeyListeners();
  }

  initKeyListeners() {
    this.svg.node().addEventListener("keydown", this.handleKeyDown.bind(this));
    this.svg.node().addEventListener("keyup", this.handleShiftKeyUp.bind(this));
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    console.log("Key pressed:", event.key);

    const handlers = {
      f2: this.handleRenameNode.bind(this),
      f3: this.handleToggleCollapse.bind(this),
      backspace: this.handleDeleteNode.bind(this),
      delete: this.handleDeleteNode.bind(this),
      tab: this.handleRandomizeColor.bind(this),
      escape: this.handleUnselectNode.bind(this),
      shift: this.handleShiftKeyDown.bind(this),
      z: this.handleUndo.bind(this),
      y: this.handleRedo.bind(this),
      e: this.handleExportToJson.bind(this),
      b: this.handleToggleLocalStorage.bind(this),
      s: this.handleSaveToLocalStorage.bind(this),
      m: this.handleListSavedMindMaps.bind(this),
      p: this.handleLoadMindMap.bind(this),
      d: this.handleDeleteMindMap.bind(this),
      o: this.handleCenterMindmap.bind(this),
      r: this.handleResetMindmap.bind(this),
      "+": this.handleZoomIn.bind(this),
      "-": this.handleZoomOut.bind(this),
      u: this.handleToggleTopMenu.bind(this),
    };

    if (handlers[key]) {
      event.preventDefault();
      handlers[key](event);
    }

    this.handleArrowKeys(event);
  }

  handleToggleTopMenu(event) {
    if (event.ctrlKey || event.metaKey) {
      GuiDisplayUtil.toggleTopMenuDisplay();
    }
  }

  handleResetMindmap(event) {
    if (event.ctrlKey) {
      this.nodeController.resetMindmap();
    }
  }

  handleCenterMindmap(event) {
    if (event.ctrlKey) {
      this.nodeController.moveRootNodeToCenter();
    }
  }

  handleShiftKeyUp(event) {
    if (event.key === "Shift") {
      MouseModeState.setMode(MouseConstants.MOUSE_MODES.NORMAL);
    }
  }

  handleShiftKeyDown(event) {
    if (event.type === "keydown") {
      MouseModeState.setMode(MouseConstants.MOUSE_MODES.GRABBING_MINDMAP);
      console.log("Dragging is on");
    } else if (event.type === "keyup") {
      MouseModeState.setMode(MouseConstants.MOUSE_MODES.NORMAL);
    }
  }

  handleUndo(event) {
    if (event.ctrlKey) {
      StackEventEmitter.emit("undo");
    }
  }

  handleRedo(event) {
    if (event.ctrlKey) {
      StackEventEmitter.emit("redo");
    }
  }

  handleToggleCollapse(event) {
    this.selectionController.toggleSelectedNodeCollapse();
  }

  handleRenameNode(event) {
    this.selectionController.renameSelectedNodePrompt();
  }

  handleExportToJson(event) {
    if (event.ctrlKey || event.metaKey) {
      this.mindmapLocalStorage.exportToJson();
    }
  }

  handleToggleLocalStorage(event) {
    if (event.ctrlKey || event.metaKey) {
      GuiDisplayUtil.toggleStorageContainerDisplay();
    }
  }

  handleDeleteNode(event) {
    if (this.selectionController.getSelectedNode()) {
      this.nodeController.removeNode(
        this.selectionController.getSelectedNode()
      );
    }
  }

  handleRandomizeColor(event) {
    this.selectionController.randomizeSelectedNodeColor();
  }

  handleUnselectNode(event) {
    this.selectionController.unselectNode();
  }

  handleSaveToLocalStorage(event) {
    if (event.ctrlKey || event.metaKey) {
      this.mindmapLocalStorage.saveToLocalStorage();
    }
  }

  handleListSavedMindMaps(event) {
    if (event.ctrlKey || event.metaKey) {
      const savedMindMaps = this.mindmapLocalStorage.listSavedMindMaps();
      this.mindmapLocalStorage.createLocalStorageList();
      alert("Saved mind maps:\n" + savedMindMaps.join("\n"));
    }
  }

  handleLoadMindMap(event) {
    if (event.ctrlKey || event.metaKey) {
      const savedMindMaps = this.mindmapLocalStorage.listSavedMindMaps();
      const selectedMap = prompt(
        "Enter the name of the mind map to load:",
        savedMindMaps.join(", ")
      );
      if (selectedMap) {
        this.mindmapLocalStorage.loadFromLocalStorage(selectedMap);
      }
    }
  }

  handleDeleteMindMap(event) {
    if (event.ctrlKey || event.metaKey) {
      const savedMindMaps = this.mindmapLocalStorage.listSavedMindMaps();
      const mapToDelete = prompt(
        "Enter the name of the mind map to delete:",
        savedMindMaps.join(", ")
      );
      if (mapToDelete) {
        this.mindmapLocalStorage.deleteFromLocalStorage(mapToDelete);
        alert(`Mind map '${mapToDelete}' has been deleted.`);
      }
    }
  }

  handleIncreaseNodeSize() {
    this.selectionController.updateSelectedNodeDimensions(5);
  }

  handleDecreaseNodeSize() {
    this.selectionController.updateSelectedNodeDimensions(-5);
  }

  handleZoomIn() {
    svgManager.zoomIn();
  }

  handleZoomOut() {
    svgManager.zoomOut();
  }

  handleArrowKeys(event) {
    const step = 10;

    switch (event.key) {
      case "ArrowUp":
        svgManager.pan(0, -step);
        break;
      case "ArrowDown":
        svgManager.pan(0, step);
        break;
      case "ArrowLeft":
        svgManager.pan(-step, 0);
        break;
      case "ArrowRight":
        svgManager.pan(step, 0);
        break;
      default:
        return;
    }
  }
}
