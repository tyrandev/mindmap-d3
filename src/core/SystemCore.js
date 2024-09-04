import OSUtil from "../util/os/OSUtil.js";
import BrowserUtil from "../util/browser/BrowserUtil.js";
import svgManager from "../view/SvgManager.js";
import Rectangle from "../model/geometric/rectangle/Rectangle.js";
import RectangleRenderer from "../engine/renderer/shapes/RectangleRenderer.js";

export default class SystemCore {
  startApplication() {
    console.log(OSUtil.getOS());
    console.log(BrowserUtil.getBrowser());
    console.log("Application started");
    this.initializeD3();
  }

  initializeD3() {
    // Initialize the SVG manager
    const svg = svgManager.initialize("#mindMapSvg");

    // Create a Rectangle instance
    const rectangle = new Rectangle(
      svgManager.getCenterX(),
      svgManager.getCenterY()
    );
    rectangle.setText("Sample Rectangle");
    rectangle.setDimensions(150, 100); // Set custom dimensions if needed
    rectangle.fillColor = "lightblue";
    rectangle.borderColor = "black";

    // Create a RectangleRenderer instance
    const rectangleRenderer = new RectangleRenderer(svg);

    // Draw the rectangle with text
    rectangleRenderer.drawShapeWithText(rectangle);
  }
}
