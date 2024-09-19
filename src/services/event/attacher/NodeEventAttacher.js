import * as d3 from "d3";
import NodeContextMenu from "../../../gui/contextmenu/NodeContextMenu.js";
import NodeSelectionHandler from "../../../input/mouse/NodeSelectionHandler.js";
import MouseModeState from "../../../state/MouseModeState.js";
import * as mc from "../../../constants/MouseConstants.js";
import ContextMenuEventEmitter from "../emitter/ContextMenuEventEmitter.js";

export default class NodeEventAttacher {
  constructor(svg, controllerCore, linkController) {
    this.svg = svg;
    this.controllerCore = controllerCore;
    this.linkController = linkController;
    this.selectionController = this.controllerCore.selectionController;
    this.nodeContextMenu = new NodeContextMenu(controllerCore, linkController);
    this.nodeSelectionHandler = new NodeSelectionHandler(
      this.selectionController
    );
    this.nodeMovementController = this.controllerCore.nodeMovementController;
    this.dragOffset = { x: 0, y: 0 };
    this.grabbingTimeout = null;
  }

  attachEventListeners(selection, node) {
    if (!selection || selection.empty()) return;

    const drag = d3
      .drag()
      .on("start", (event) => this.handleDragStart(event, node))
      .on("drag", (event) => this.handleDrag(event, node))
      .on("end", (event) => this.handleDragEnd(event, node));

    selection
      .on("mousedown", (event) => this.handleNodeClick(event, node))
      .call(drag);

    selection
      .node()
      .addEventListener("wheel", this.handleMouseWheel.bind(this), {
        passive: true,
      });
  }

  handleNodeClick(event, node) {
    event.preventDefault();
    if (event.button === 0) {
      console.log("Node clicked:", node);
      this.selectionController.selectNode(node);
      this.nodeSelectionHandler.handleNodeSelection(node);
      ContextMenuEventEmitter.emit("onHideContextMenu");
    } else if (event.button === 2) {
      MouseModeState.setMode(mc.MOUSE_MODES.NORMAL);
      this.showNodeContextMenu(node);
    }
  }

  handleDragStart(event, node) {
    const svgElement = this.svg.node();
    const [x, y] = d3.pointer(event, svgElement);

    this.dragOffset = {
      x: x - node.x,
      y: y - node.y,
    };

    this.grabbingTimeout = setTimeout(() => {
      MouseModeState.setMode(mc.MOUSE_MODES.GRABBING);
    }, 110);
  }

  handleDrag(event, node) {
    try {
      const svgElement = this.svg.node();
      const [x, y] = d3.pointer(event, svgElement);
      const newX = x - this.dragOffset.x;
      const newY = y - this.dragOffset.y;
      this.nodeMovementController.moveNode(node, newX, newY);
      d3.select(event.sourceEvent.target).attr("cx", node.x).attr("cy", node.y);
    } catch (error) {
      console.warn("dragging node outside of mindmap borders");
    }
  }

  handleDragEnd(event, node) {
    console.log("Ended dragging of: ", node);
    if (this.grabbingTimeout) {
      clearTimeout(this.grabbingTimeout);
      this.grabbingTimeout = null;
    }
    MouseModeState.setMode(mc.MOUSE_MODES.NORMAL);
  }

  showNodeContextMenu(node) {
    this.selectionController.selectNode(node);
    this.nodeContextMenu.showContextMenu(node);
  }

  handleMouseWheel(event) {
    if (!this.selectionController.getSelectedNode()) return;
    this.selectionController.updateSelectedNodeDimensions(
      event.deltaY > 0 ? -5 : 5
    );
    console.log("mouse wheel");
  }
}
