import ContextMenu from "./ContextMenu.js";
import StorageUtil from "../../util/storage/StorageUtil.js";

export default class CanvasContextMenu extends ContextMenu {
  constructor(systemCore) {
    super(systemCore, "canvas-context-menu");
    this.nodeController = systemCore.nodeController;
  }

  initContextMenu() {
    document
      .getElementById("center-mindmap")
      .addEventListener("mousedown", this.centerMindmap.bind(this));
    document
      .getElementById("show-local-storage")
      .addEventListener("mousedown", this.toggleLocalStorage.bind(this));
    document
      .getElementById("new-mindmap")
      .addEventListener("mousedown", this.newMindmap.bind(this));
  }

  centerMindmap() {
    this.nodeController.moveRootNodeToCenter();
  }

  toggleLocalStorage() {
    StorageUtil.toggleStorageContainerDisplay();
  }

  newMindmap() {
    const userConfirmed = window.confirm(
      "Are you sure you want to reset the mindmap? This action cannot be undone."
    );
    if (!userConfirmed) return;
    this.nodeController.resetMindmap();
  }
}
