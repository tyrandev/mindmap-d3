import * as nc from "../../constants/NodeConstants.js";
import StackState from "../../state/StackState.js";
import RootNodeController from "./RootNodeController.js";
import svgManager from "../../view/SvgManager.js";
import StackEventEmitter from "../../services/event/emitter/StackEventEmitter.js";
import SelectionController from "./SelectionController.js";
import NodeCreationController from "./NodeCreationController";
import NodeDeletionController from "./NodeDeletionController.js";
import NodeMovementController from "./NodeMovementController.js";

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
    this.nodeDeletionController = new NodeDeletionController(
      this.nodeContainer
    );
    this.nodeMovementController = new NodeMovementController(
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
    this.nodeDeletionController.deleteNode(node);
  }

  moveNode(node, newX, newY) {
    this.nodeMovementController.moveNode(node, newX, newY);
  }

  moveRootNodeToCenter() {
    const rootNode = this.rootNodeController.getRootNode();
    if (!rootNode) {
      console.error("No root node found.");
      return;
    }
    this.nodeMovementController.moveNodeToCenter(rootNode);
  }
}
