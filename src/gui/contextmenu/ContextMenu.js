import ContextMenuEventEmitter from "../../services/event/emitter/ContextMenuEventEmitter.js";
import mousePositionInstance from "../../input/mouse/MousePosition.js";

export default class ContextMenu {
  constructor(systemCore, contextMenuId) {
    this.systemCore = systemCore;
    this.contextMenu = document.getElementById(contextMenuId);
    this.svg = document.getElementById("mindMapSvg");
    this.contextMenuNode = null;
    this.initContextMenu();
    this.preventBrowserContextMenu();
    this.ensureSvgFocusable();
    document.addEventListener("mousedown", this.handleDocumentClick.bind(this));
    ContextMenuEventEmitter.on(
      "onHideContextMenu",
      this.hideContextMenu.bind(this)
    );
  }

  initContextMenu() {
    throw new Error("initContextMenu() must be implemented by subclass");
  }

  prepareContextMenu(x, y) {
    const rect = this.svg.getBoundingClientRect();
    const adjustedX = x + rect.left;
    const adjustedY = y + rect.top;
    this.contextMenu.style.left = `${adjustedX}px`;
    this.contextMenu.style.top = `${adjustedY}px`;
  }

  showContextMenu() {
    const { x, y } = mousePositionInstance.getMouseCoordinates();
    this.prepareContextMenu(x, y);
    this.contextMenu.style.display = "block";
  }

  hideContextMenu() {
    this.contextMenu.style.display = "none";
    this.svg.focus();
  }

  handleDocumentClick(event) {
    if (event.button !== 2) {
      this.hideContextMenu();
    }
  }

  preventBrowserContextMenu() {
    if (this.contextMenu) {
      this.contextMenu.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
    } else {
      console.error("Context menu element not found.");
    }
  }

  ensureSvgFocusable() {
    if (this.svg) {
      this.svg.setAttribute("tabindex", "0");
    } else {
      console.error("SVG element not found.");
    }
  }
}
