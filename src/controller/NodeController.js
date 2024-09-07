import Circle from "../model/geometric/circle/Circle.js";
import * as CircleConstants from "../constants/CircleConstants.js";
import NodeStackManager from "../services/state/NodeStackManager.js";
import MousePosition from "../input/mouse/MousePosition.js";
import RootNodeController from "./RootNodeController.js";
import NodeFactory from "../services/factory/NodeFactory.js";
import svgManager from "../view/SvgManager.js";
import StackEventEmitter from "../services/event/emitter/StackEventEmitter.js";
import MindmapMath from "../engine/math/MindmapMath.js";
import SelectionController from "./SelectionController.js";

export default class NodeController {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
    this.selectionController = new SelectionController();
    this.stackManager = new NodeStackManager();
    this.rootNodeController = new RootNodeController(this);
    this.rootNodeController.initRootNode();
    this.setupEventListeners();
  }

  putNodeIntoContainer(node) {
    this.nodeContainer.putNodeIntoContainer(node);
  }

  putNodeAndChildrenIntoContainer(node) {
    this.nodeContainer.putNodeAndChildrenIntoContainer(node);
  }

  getNodeAtPosition(x, y) {
    return this.nodeContainer.getNodeAtPosition(x, y);
  }

  removeNode(node) {
    this.saveStateForUndo();
    this.nodeContainer.removeNodeAndChildren(node);
  }

  moveNode(node, newX, newY) {
    const deltaX = newX - node.x;
    const deltaY = newY - node.y;
    if (
      Math.sqrt(deltaX ** 2 + deltaY ** 2) >=
      CircleConstants.DISTANCE_MOVED_TO_SAVE_STATE
    ) {
      this.saveStateForUndo();
      console.log("enough distance travelled for save state");
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

  addConnectedNode(parentNode, nodeFactoryMethod) {
    if (parentNode.collapsed) return;
    this.saveStateForUndo();
    const distanceFromParentNode =
      this.calculateDistanceFromParentNode(parentNode);
    const { x, y } = this.calculatePositionOfNewNode(
      parentNode,
      distanceFromParentNode
    );
    const newNode = nodeFactoryMethod(x, y, parentNode.getFillColor());
    console.log(newNode);
    parentNode.addChildNode(newNode);
    newNode.setFillColor(parentNode.getFillColor());
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

  resetAllNodes() {
    this.nodeContainer.clearNodes();
  }

  resetMindmap() {
    this.nodeContainer.clearNodes();
    this.rootNodeController.reinitializeRootNode();
    StackEventEmitter.emit("clearAllStacks");
  }

  loadRootNode(rootNode) {
    this.resetAllNodes();
    this.nodeContainer.putNodeAndChildrenIntoContainer(rootNode);
    this.rootNodeController.setRootNode(rootNode);
  }

  loadMindMap(rootNode) {
    this.loadRootNode(rootNode);
    this.moveRootNodeToCenter();
    StackEventEmitter.emit("clearAllStacks");
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

  serializeRootNode() {
    return this.rootNodeController.serializeRootNode();
  }

  saveStateForUndo() {
    this.stackManager.saveStateForUndo(this.rootNodeController.getRootNode());
  }

  undo() {
    this.stackManager.undo(
      this.rootNodeController.getRootNode(),
      (newState) => {
        this.loadRootNode(newState);
      }
    );
  }

  redo() {
    this.stackManager.redo(
      this.rootNodeController.getRootNode(),
      (newState) => {
        this.loadRootNode(newState);
      }
    );
  }

  setupEventListeners() {
    StackEventEmitter.on("saveStateForUndo", () => {
      this.saveStateForUndo();
    });

    StackEventEmitter.on("undo", () => {
      this.undo();
    });

    StackEventEmitter.on("redo", () => {
      this.redo();
    });
  }
}
