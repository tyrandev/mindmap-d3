import StackState from "../../state/StackState.js";
import RootNodeController from "../../controller/root/RootNodeController.js";
import SelectionController from "../../controller/selection/SelectionController.js";
import NodeCreationController from "../../controller/node/NodeCreationController.js";
import NodeDeletionController from "../../controller/node/NodeDeletionController.js";
import NodeMovementController from "../../controller/node/NodeMovementController.js";

export default class ControllerCore {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
    this.initializeControllers();
  }

  initializeControllers() {
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
    this.stackState = new StackState(this.rootNodeController);
    this.nodeCreationController = new NodeCreationController(
      this.nodeContainer
    );
  }

  getRootNodeController() {
    return this.rootNodeController;
  }
}
