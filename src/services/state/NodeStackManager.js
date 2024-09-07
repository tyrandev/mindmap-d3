import StackEventEmitter from "../event/emitter/StackEventEmitter";

export default class NodeStackManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    StackEventEmitter.on("clearAllStacks", () => {
      this.clearAllStacks();
    });
  }

  saveStateForUndo(rootNode) {
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

  clearAllStacks() {
    this.undoStack = [];
    this.redoStack = [];
    console.log("All stacks cleared.");
  }
}
