import ContextMenu from "./ContextMenu.js";
import GuiDisplayUtil from "../../util/display/GuiDisplayUtil.js";

export default class SvgContextMenu extends ContextMenu {
  constructor(controllerCore) {
    super(controllerCore, "svg-context-menu");
    this.controllerCore = controllerCore;
    this.rootNodeController = this.controllerCore.rootNodeController;
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
    this.rootNodeController.moveRootNodeToCenter();
  }

  toggleLocalStorage() {
    GuiDisplayUtil.toggleStorageContainerDisplay();
  }

  newMindmap() {
    const userConfirmed = window.confirm(
      "Are you sure you want to reset the mindmap? This action cannot be undone."
    );
    if (!userConfirmed) return;
    this.rootNodeController.resetMindmap();
  }
}
