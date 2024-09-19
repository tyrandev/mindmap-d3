import svgView from "../../view/SvgView.js";
import GuiDisplayUtil from "../../util/display/GuiDisplayUtil.js";
import MouseModeState from "../../state/MouseModeState.js";
import * as MouseConstants from "../../constants/MouseConstants.js";
import StackEventEmitter from "../../services/event/emitter/StackEventEmitter.js";

export default class KeyboardHandler {
  constructor(controllerCore, mindmapLocalStorage) {
    this.svg = svgView.getSvg();
    this.controllerCore = controllerCore;
    this.rootController = controllerCore.rootController;
    this.selectionController = this.controllerCore.selectionController;
    this.nodeDeletionController = this.controllerCore.nodeDeletionController;
    this.mindmapLocalStorage = mindmapLocalStorage;
    this.initKeyListeners();
  }

  initKeyListeners() {
    const svgElement = this.svg.node();
    svgElement.addEventListener("keydown", this.handleKeyDown.bind(this));
    svgElement.addEventListener("keyup", this.handleShiftKeyUp.bind(this));
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
      z: this.handleUndo.bind(this),
      y: this.handleRedo.bind(this),
      s: this.handleSaveToLocalStorage.bind(this),
      e: this.handleExportToJson.bind(this),
      b: this.handleToggleLocalStorage.bind(this),
      m: this.handleListSavedMindMaps.bind(this),
      p: this.handleLoadMindMap.bind(this),
      d: this.handleDeleteMindMap.bind(this),
      o: this.handleCenterMindmap.bind(this),
      r: this.handleResetMindmap.bind(this),
      "+": this.handleZoomIn.bind(this),
      "-": this.handleZoomOut.bind(this),
      u: this.handleToggleTopMenu.bind(this),
      0: this.handleResetZoom.bind(this), // Adding handler for reset zoom/pan
    };

    if (handlers[key]) {
      event.preventDefault();
      handlers[key](event);
    }
  }

  handleResetZoom(event) {
    if (event.ctrlKey) {
      svgView.resetZoom();
    }
  }

  handleToggleTopMenu(event) {
    if (event.ctrlKey || event.metaKey) {
      GuiDisplayUtil.toggleTopMenuDisplay();
    }
  }

  handleResetMindmap(event) {
    if (event.ctrlKey) {
      this.controllerCore.resetMindmap();
    }
  }

  handleCenterMindmap(event) {
    if (event.ctrlKey) {
      this.controllerCore.moveRootNodeToCenter();
    }
  }

  handleShiftKeyUp(event) {
    if (event.key === "Shift") {
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
      this.selectionController.deleteSelectedNode();
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

  handleZoomIn(event) {
    if (event.ctrlKey || event.metaKey) {
      svgView.zoomIn();
    }
  }

  handleZoomOut(event) {
    if (event.ctrlKey || event.metaKey) {
      svgView.zoomOut();
    }
  }
}
