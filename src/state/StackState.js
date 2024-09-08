import StackEventEmitter from "../services/event/emitter/StackEventEmitter";

export default class StackState {
  constructor(rootNodeController) {
    this.rootNodeController = rootNodeController;
    this.undoStack = [];
    this.redoStack = [];
    this.setupEventListeners();
  }

  clearAllStacks() {
    this.undoStack = [];
    this.redoStack = [];
    console.log("All stacks cleared.");
  }

  saveStateForUndo() {
    const rootNode = this.rootNodeController.getRootNode();
    if (rootNode) {
      this.undoStack.push(rootNode.clone());
      this.redoStack = [];
    }
  }

  undo(currentRootNode, restoreStateCallback) {
    if (this.undoStack.length > 0) {
      const state = this.undoStack.pop();
      this.redoStack.push(currentRootNode.clone());
      restoreStateCallback(state);
    }
  }

  redo(currentRootNode, restoreStateCallback) {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push(currentRootNode.clone());
      restoreStateCallback(state);
    }
  }

  undoAction() {
    this.undo(this.rootNodeController.getRootNode(), (newState) => {
      this.rootNodeController.loadRootNode(newState);
    });
  }

  redoAction() {
    this.redo(this.rootNodeController.getRootNode(), (newState) => {
      this.rootNodeController.loadRootNode(newState);
    });
  }

  setupEventListeners() {
    StackEventEmitter.on("clearAllStacks", () => {
      this.clearAllStacks();
    });
    StackEventEmitter.on("saveStateForUndo", () => {
      this.saveStateForUndo();
    });
    StackEventEmitter.on("undo", () => {
      this.undoAction();
    });
    StackEventEmitter.on("redo", () => {
      this.redoAction();
    });
  }
}
