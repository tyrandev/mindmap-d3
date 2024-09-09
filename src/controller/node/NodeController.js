import * as nc from "../../constants/NodeConstants.js";
import StackState from "../../state/StackState.js";
import RootNodeController from "./RootNodeController.js";
import svgManager from "../../view/SvgManager.js";
import StackEventEmitter from "../../services/event/emitter/StackEventEmitter.js";
import SelectionController from "./SelectionController.js";
import NodeCreationController from "./NodeCreationController";

export default class NodeController {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
    this.selectionController = new SelectionController(this.nodeContainer);
    this.rootNodeController = new RootNodeController(this, this.nodeContainer);
    this.rootNodeController.initRootNode();
    this.stackManager = new StackState(this.rootNodeController);
    this.nodeCreationController = new NodeCreationController(
      this.nodeContainer
    );
  }

  createCircle(parentNode) {
    this.nodeCreationController.createCircle(parentNode);
  }

  createRectangle(parentNode) {
    this.nodeCreationController.createRectangle(parentNode);
  }

  deleteNode(node) {
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

  moveNodeToCenter(node) {
    const svgCenter = svgManager.getCenterCoordinates();
    const offsetX = svgCenter.x - node.x;
    const offsetY = svgCenter.y - node.y;
    this.moveNode(node, node.x + offsetX, node.y + offsetY);
  }

  moveRootNodeToCenter() {
    const rootNode = this.rootNodeController.getRootNode();
    if (!rootNode) {
      console.error("No root node found.");
      return;
    }
    this.moveNodeToCenter(rootNode);
  }
}
