import svgManager from "../../view/SvgManager.js";

class MousePosition {
  static instance = null;

  static getInstance() {
    if (!MousePosition.instance) {
      MousePosition.instance = new MousePosition();
    }
    return MousePosition.instance;
  }

  constructor() {
    if (MousePosition.instance) {
      throw new Error(
        "Use MousePosition.getInstance() to get the single instance of this class."
      );
    }
    this.svg = svgManager.getSvg(); // Get the SVG container
    this.mouseX = 0;
    this.mouseY = 0;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.svg.node().addEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseMove(event) {
    const coordinates = this.getMouseCoordinatesFromEvent(event);
    this.mouseX = coordinates.x;
    this.mouseY = coordinates.y;
  }

  getMouseCoordinatesFromEvent(event) {
    if (!event) {
      console.error("getMouseCoordinates called without event object");
      return { x: 0, y: 0 };
    }

    const svgRect = this.svg.node().getBoundingClientRect();
    return {
      x: event.clientX - svgRect.left,
      y: event.clientY - svgRect.top,
    };
  }

  getMouseCoordinates() {
    return {
      x: this.mouseX,
      y: this.mouseY,
    };
  }

  getX() {
    return this.mouseX;
  }

  getY() {
    return this.mouseY;
  }
}

const mousePositionInstance = MousePosition.getInstance();
export default mousePositionInstance;
