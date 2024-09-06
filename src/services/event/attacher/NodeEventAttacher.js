import * as d3 from "d3";
import NodeContextMenu from "../../../gui/contextmenu/NodeContextMenu.js";
import NodeSelectionHandler from "../../../input/mouse/NodeSelectionHandler.js";
import MouseModeManager from "../../../input/mouse/state/MouseModeManager.js";
import * as MouseConstants from "../../../constants/MouseConstants.js";
import ContextMenuEventEmitter from "../emitter/ContextMenuEventEmitter.js";

export default class NodeEventAttacher {
  constructor(svg, nodeController) {
    this.svg = svg;
    this.nodeController = nodeController;
    this.selectionController = this.nodeController.selectionController;
    this.nodeContextMenu = new NodeContextMenu(nodeController);
    this.nodeSelectionHandler = new NodeSelectionHandler(this.nodeController);
    this.dragOffset = { x: 0, y: 0 };
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
      MouseModeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
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
  }

  handleDrag(event, node) {
    const svgElement = this.svg.node();
    const [x, y] = d3.pointer(event, svgElement);
    const deltaX = x - this.dragOffset.x - node.x;
    const deltaY = y - this.dragOffset.y - node.y;
    node.x = x - this.dragOffset.x;
    node.y = y - this.dragOffset.y;
    d3.select(event.sourceEvent.target).attr("cx", node.x).attr("cy", node.y);
    this.nodeController.moveDescendants(node, deltaX, deltaY);
  }

  handleDragEnd(event, node) {
    console.log("Ended dragging of: ", node);
  }

  showNodeContextMenu(node) {
    this.selectionController.selectNode(node);
    this.nodeContextMenu.showContextMenu(node);
  }

  // !! is not working
  handleMouseWheel(event) {
    if (!this.selectionController.selectedNode) return;
    this.selectionController.updateSelectedNodeDimensions(
      event.deltaY > 0 ? -5 : 5
    );
  }
}
