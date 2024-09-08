import Circle from "../../model/geometric/circle/Circle.js";
import * as nc from "../../constants/NodeConstants.js";
import StackState from "../../state/StackState.js";
import MousePosition from "../../input/mouse/MousePosition.js";
import RootNodeController from "./RootNodeController.js";
import NodeFactory from "../../services/factory/NodeFactory.js";
import svgManager from "../../view/SvgManager.js";
import StackEventEmitter from "../../services/event/emitter/StackEventEmitter.js";
import MindmapMath from "../../engine/math/MindmapMath.js";
import SelectionController from "./SelectionController.js";

export default class NodeController {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
    this.selectionController = new SelectionController(this.nodeContainer);
    this.rootNodeController = new RootNodeController(this, this.nodeContainer);
    this.rootNodeController.initRootNode();
    this.stackManager = new StackState(this.rootNodeController);
  }

  addConnectedNode(parentNode, nodeFactoryMethod) {
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
    this.putNodeIntoContainer(newNode);
  }

  addConnectedCircle(parentNode) {
    this.addConnectedNode(parentNode, NodeFactory.createCircle);
  }

  addConnectedRectangle(parentNode) {
    this.addConnectedNode(parentNode, NodeFactory.createRectangle);
  }

  addConnectedBorderlessRectangle(parentNode) {
    this.addConnectedNode(parentNode, NodeFactory.createBorderlessRectangle);
  }

  putNodeIntoContainer(node) {
    this.nodeContainer.putNodeIntoContainer(node);
  }

  putNodeAndChildrenIntoContainer(node) {
    this.nodeContainer.putNodeAndChildrenIntoContainer(node);
  }

  removeNode(node) {
    StackEventEmitter.emitSaveStateForUndo();
    this.nodeContainer.removeNodeAndChildren(node);
  }

  moveNode(node, newX, newY) {
    const deltaX = newX - node.x;
    const deltaY = newY - node.y;
    if (
      Math.sqrt(deltaX ** 2 + deltaY ** 2) >= nc.DISTANCE_MOVED_TO_SAVE_STATE
    ) {
      StackEventEmitter.emitSaveStateForUndo();
    }
    node.x = newX;
    node.y = newY;
    this.moveDescendants(node, deltaX, deltaY);
  }

  moveDescendants(node, deltaX, deltaY) {
    node.children.forEach((child) => {
      child.x += deltaX;
      child.y += deltaY;
      this.moveDescendants(child, deltaX, deltaY);
    });
  }

  moveRootNodeToCenter() {
    const rootNode = this.rootNodeController.getRootNode();
    if (!rootNode) {
      console.error("No root node found.");
      return;
    }
    const svgCenter = svgManager.getCenterCoordinates();
    const offsetX = svgCenter.x - rootNode.x;
    const offsetY = svgCenter.y - rootNode.y;
    this.moveNode(rootNode, rootNode.x + offsetX, rootNode.y + offsetY);
  }

  getNodeAtPosition(x, y) {
    return this.nodeContainer.getNodeAtPosition(x, y);
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
