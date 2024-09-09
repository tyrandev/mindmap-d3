import StackEventEmitter from "../../services/event/emitter/StackEventEmitter.js";
import NodeFactory from "../../services/factory/NodeFactory.js";
import MousePosition from "../../input/mouse/MousePosition.js";
import MindmapMath from "../../engine/math/MindmapMath.js";
import Circle from "../../model/geometric/circle/Circle.js";

export default class NodeCreationController {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
  }

  createConnectedNode(parentNode, nodeFactoryMethod) {
    if (parentNode.collapsed) return;
    StackEventEmitter.emitSaveStateForUndo();
    const distanceFromParentNode =
      this.calculateDistanceFromParentNode(parentNode);
    const { x, y } = this.calculatePositionOfNewNode(
      parentNode,
      distanceFromParentNode
    );
    const newNode = nodeFactoryMethod(x, y);
    newNode.setFillColor(parentNode.getFillColor());
    parentNode.addChildNode(newNode);
    this.nodeContainer.putNodeIntoContainer(newNode);
  }

  createCircle(parentNode) {
    this.createConnectedNode(parentNode, NodeFactory.createCircle);
  }

  createRectangle(parentNode) {
    this.createConnectedNode(parentNode, NodeFactory.createRectangle);
  }

  createBorderlessRectangle(parentNode) {
    this.createConnectedNode(parentNode, NodeFactory.createBorderlessRectangle);
  }

  calculateDistanceFromParentNode(parentNode) {
    return parentNode instanceof Circle
      ? parentNode.radius * 2.2
      : parentNode.width * 1.25;
  }

  calculatePositionOfNewNode(parentNode, distanceFromParentNode) {
    const mouseX = MousePosition.getX();
    const mouseY = MousePosition.getY();
    return MindmapMath.calculatePositionOfNewNode(
      parentNode,
      distanceFromParentNode,
      mouseX,
      mouseY
    );
  }
}
