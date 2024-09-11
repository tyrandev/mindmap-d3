import Circle from "../../model/geometric/circle/Circle.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import BorderlessRectangle from "../../model/geometric/rectangle/BorderlessRectangle.js";

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
    return Circle.fromJSON(data);
  }

  static createRectangleFromJson(data) {
    return Rectangle.fromJSON(data);
  }

  static createBorderlessRectangleFromJson(data) {
    return BorderlessRectangle.fromJSON(data);
  }

  static _initializeNode(node) {
    node.setId(NodeFactory.incrementId());
    return node;
  }
}
