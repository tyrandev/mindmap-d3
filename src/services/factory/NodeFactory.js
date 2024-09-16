import Circle from "../../model/geometric/circle/Circle.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import BorderlessRectangle from "../../model/geometric/rectangle/BorderlessRectangle.js";
import LinkFactory from "./LinkFactory.js";

export default class NodeFactory {
  static idCounter = 0;

  static incrementId() {
    return NodeFactory.idCounter++;
  }

  static createCircle(x, y) {
    return NodeFactory._initializeNode(new Circle(x, y));
  }

  static createRectangle(x, y) {
    return NodeFactory._initializeNode(new Rectangle(x, y));
  }

  static createBorderlessRectangle(x, y) {
    return NodeFactory._initializeNode(new BorderlessRectangle(x, y));
  }

  static createCircleFromJson(data) {
    return NodeFactory._initializeNode(Circle.fromJSON(data));
  }

  static createRectangleFromJson(data) {
    return NodeFactory._initializeNode(Rectangle.fromJSON(data));
  }

  static createBorderlessRectangleFromJson(data) {
    return NodeFactory._initializeNode(BorderlessRectangle.fromJSON(data));
  }

  static createNodeFromJson(data) {
    let node;
    switch (data.type) {
      case "Circle":
        node = NodeFactory.createCircleFromJson(data);
        break;
      case "Rectangle":
        node = NodeFactory.createRectangleFromJson(data);
        break;
      case "BorderlessRectangle":
        node = NodeFactory.createBorderlessRectangleFromJson(data);
        break;
      default:
        throw new Error(`Unknown node type: ${data.type}`);
    }

    console.log("data link", data.link);

    if (data.link) {
      const link = LinkFactory.createLinkFromJson(data.link);
      console.log("link loaded from json:", link);
      node.setLink(link);
    }

    return node;
  }

  static _initializeNode(node) {
    node.setId(NodeFactory.incrementId());
    return node;
  }
}
