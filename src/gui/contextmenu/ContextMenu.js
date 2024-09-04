import SvgManager from "../../view/SvgManager.js";

export default class ContextMenu {
  constructor(systemCore, contextMenuId) {
    this.systemCore = systemCore;
    this.contextMenu = document.getElementById(contextMenuId);
    this.svg = this.getSvg();
    this.contextMenuNode = null;

    this.initContextMenu();
    this.preventBrowserContextMenu();
    document.addEventListener("click", this.handleDocumentClick.bind(this));
  }

  getSvg() {
    return SvgManager.getSvg(); // Retrieve the SVG container
  }

  initContextMenu() {
    throw new Error("initContextMenu() must be implemented by subclass");
  }

  prepareContextMenu(x, y) {
    const rect = this.svg.getBoundingClientRect();
    const adjustedX = x + rect.left; // Adjust x relative to SVG container
    const adjustedY = y + rect.top; // Adjust y relative to SVG container
    this.contextMenu.style.left = `${adjustedX}px`;
    this.contextMenu.style.top = `${adjustedY}px`;
  }

  showContextMenu(x, y) {
    this.prepareContextMenu(x, y);
    this.contextMenu.style.display = "block";
  }

  hideContextMenu() {
    this.contextMenu.style.display = "none";
    // Consider whether you need to regain focus for SVG, or if any additional action is required
  }

  handleDocumentClick(event) {
    if (event.button !== 2) {
      this.hideContextMenu();
    }
  }

  preventBrowserContextMenu() {
    this.svg.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }
}
