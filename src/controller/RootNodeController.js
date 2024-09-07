import NodeFactory from "../services/factory/NodeFactory.js";
import svgManager from "../view/SvgManager";
import NodeSerializer from "../data/serialization/NodeSerializer.js";
import StackEventEmitter from "../services/event/emitter/StackEventEmitter.js";

export default class RootNodeController {
  constructor(controller, nodeContainer) {
    this.controller = controller;
    this.nodeContainer = nodeContainer;
    this.rootNode = null;
  }

  initRootNode(initialText = "Mindmap") {
    if (this.rootNode) {
      console.warn("Root node is already initialized.");
      return;
    }
    this.initRootCircle(initialText);
  }

  initRootCircle(initialText) {
    try {
      const { x, y } = svgManager.getCenterCoordinates();
      this.rootNode = NodeFactory.createCircle(x, y);
      this.rootNode.setText(initialText);
      this.controller.putNodeIntoContainer(this.rootNode);
      console.log("Root node is successfully initialized:", this.rootNode);
    } catch (error) {
      console.error("Error initializing root node:", error);
    }
  }

  getRootNode() {
    if (!this.rootNode) {
      console.error("Root node has not been initialized yet.");
      return null;
    }
    return this.rootNode;
  }

  reinitializeRootNode(initialText = "Mindmap") {
    if (this.rootNode) {
      this.controller.removeNode(this.rootNode);
      this.rootNode = null;
    }
    this.initRootNode(initialText);
    console.log("Root node has been reinitialized.");
  }

  setRootNode(newRootNode) {
    this.rootNode = newRootNode;
    console.log("Root node has been set to:", this.rootNode);
  }

  serializeRootNode() {
    const rootNode = this.getRootNode();
    if (!rootNode) {
      throw new Error("No root node to serialize.");
    }
    return NodeSerializer.serialize(rootNode);
  }

  resetMindmap() {
    this.nodeContainer.clearNodes();
    this.initRootNode();
    StackEventEmitter.emit("clearAllStacks");
  }

  loadRootNode(rootNode) {
    this.nodeContainer.clearNodes();
    this.nodeContainer.putNodeAndChildrenIntoContainer(rootNode);
    this.rootNode = rootNode;
    console.log("Root node has been loaded:", this.rootNode);
  }

  loadMindMap(rootNode) {
    this.loadRootNode(rootNode);
    this.moveRootNodeToCenter();
    StackEventEmitter.emit("clearAllStacks");
  }
}
