import * as MouseConstants from "../constants/MouseConstants.js";

class MouseModeState {
  constructor() {
    if (MouseModeState.instance) {
      return MouseModeState.instance;
    }
    this.currentMode = MouseConstants.MOUSE_MODES.NORMAL;
    this.setSvgElement();
    MouseModeState.instance = this;
  }

  static getInstance() {
    if (!MouseModeState.instance) {
      MouseModeState.instance = new MouseModeState();
    }
    return MouseModeState.instance;
  }

  setSvgElement() {
    this.svg = document.getElementById("svg-container");
    if (!this.svg) {
      throw new Error("SVG container element not found: #svg-container");
    }
  }

  getMode() {
    return this.currentMode;
  }

  setMode(mode) {
    if (!Object.values(MouseConstants.MOUSE_MODES).includes(mode)) {
      console.error(`Invalid mode: ${mode}`);
      return;
    }
    if (this.currentMode !== mode) {
      this.currentMode = mode;
      this.updateSvgCursorStyle();
    }
  }

  updateSvgCursorStyle() {
    if (this.svg) {
      const mode = this.getMode();
      this.svg.style.cursor = MouseConstants.CURSOR_STYLES[mode] || "default";
    }
  }
}
const mouseModeState = MouseModeState.getInstance();
export default mouseModeState;
