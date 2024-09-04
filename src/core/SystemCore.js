import OSUtil from "../util/os/OSUtil.js";
import BrowserUtil from "../util/browser/BrowserUtil.js";
import svgManager from "../view/SvgManager.js";
import Circle from "../model/geometric/circle/Circle.js";
import NodeContainer from "../model/geometric/node/NodeContainer.js";
import Rectangle from "../model/geometric/rectangle/Rectangle.js";
import GraphicsEngine from "../engine/GraphicsEngine.js";

export default class SystemCore {
  startApplication() {
    console.log(OSUtil.getOS());
    console.log(BrowserUtil.getBrowser());
    console.log("Application started");
    this.initializeD3();
    this.setupAndStartGraphicsEngine();
  }

  initializeD3() {
    svgManager.initialize("#mindMapSvg");
  }

  setupAndStartGraphicsEngine() {
    // Create NodeContainer
    const nodeContainer = new NodeContainer();

    // Create nodes
    const rectangleNode = new Rectangle(100, 100);
    rectangleNode.setText("Rectangle Node");

    const circleNode = new Circle(300, 100);
    circleNode.setText("Circle Node");

    // Add nodes to container
    nodeContainer.putNodeAndChildrenIntoContainer(rectangleNode);
    nodeContainer.putNodeAndChildrenIntoContainer(circleNode);

    // Set children (if needed)
    // rectangleNode.addChildNode(circleNode); // Example

    // Create GraphicsEngine and start animation
    const graphicsEngine = new GraphicsEngine(nodeContainer);
    graphicsEngine.start();
  }
}
