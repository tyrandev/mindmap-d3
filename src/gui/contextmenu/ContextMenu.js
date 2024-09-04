export default class ContextMenu {
  constructor(systemCore, contextMenuId) {
    this.systemCore = systemCore;
    this.contextMenu = document.getElementById(contextMenuId);
    this.svg = document.getElementById("mindMapSvg");
    this.contextMenuNode = null;
    this.initContextMenu();
    this.preventBrowserContextMenu();
    document.addEventListener("click", this.handleDocumentClick.bind(this));
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
    if (this.svg) {
      this.svg.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
    } else {
      console.error("SVG element not found.");
    }
  }
}
