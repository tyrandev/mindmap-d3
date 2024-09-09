import StackEventEmitter from "../../services/event/emitter/StackEventEmitter.js";

export default class NodeDeletionController {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
  }

  deleteNode(node) {
    StackEventEmitter.emitSaveStateForUndo();
    this.nodeContainer.removeNodeAndChildren(node);
  }
}
