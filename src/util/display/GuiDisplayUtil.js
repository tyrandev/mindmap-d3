export default class GuiDisplayUtil {
  static toggleContainerDisplay(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID '${containerId}' not found.`);
      return;
    }

    const displayStyle = window.getComputedStyle(container).display;
    if (displayStyle === "none") {
      container.style.display = "block";
    } else {
      container.style.display = "none";
    }
  }

  static toggleStorageContainerDisplay() {
    this.toggleContainerDisplay("storage-container");
  }

  static toggleTopMenuDisplay() {
    this.toggleContainerDisplay("top-menu");
  }
}
