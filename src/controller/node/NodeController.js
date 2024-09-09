import StackState from "../../state/StackState.js";
import RootNodeController from "./RootNodeController.js";
import SelectionController from "./SelectionController.js";
import NodeCreationController from "./NodeCreationController";
import NodeDeletionController from "./NodeDeletionController.js";
import NodeMovementController from "./NodeMovementController.js";

export default class NodeController {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
    this.selectionController = new SelectionController(this.nodeContainer);
    this.nodeMovementController = new NodeMovementController(
      this.nodeContainer
    );
    this.nodeDeletionController = new NodeDeletionController(
      this.nodeContainer
    );
    this.rootNodeController = new RootNodeController(
      this.nodeMovementController,
      this.nodeContainer,
      this.nodeDeletionController
    );
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
    this.nodeDeletionController.deleteNode(node);
  }

  moveNode(node, newX, newY) {
    this.nodeMovementController.moveNode(node, newX, newY);
  }
}
