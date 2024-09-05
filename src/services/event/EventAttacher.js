import * as d3 from "d3";
import NodeContextMenu from "../../gui/contextmenu/NodeContextMenu";

export default class EventAttacher {
  constructor(svg, nodeController) {
    this.svg = svg;
    this.nodeController = nodeController;
    this.selectionController = this.nodeController.selectionController;
    this.nodeContextMenu = new NodeContextMenu(nodeController);
    this.dragOffset = { x: 0, y: 0 };
  }

  attachEventListeners(selection, node) {
    if (!selection || selection.empty()) {
      console.error("Selection is undefined, null, or empty");
      return;
    }

    const drag = d3
      .drag()
      .on("start", (event) => this.handleDragStart(event, node))
      .on("drag", (event) => this.handleDrag(event, node))
      .on("end", (event) => this.handleDragEnd(event, node));

    selection
      .on("mousedown", (event) => this.handleNodeClick(event, node))
      .call(drag);
  }

  handleNodeClick(event, node) {
    event.preventDefault();

    if (event.button === 0) {
      // Left click
      console.log("Node clicked:", node);
      this.selectionController.selectNode(node);
      this.nodeContextMenu.hideContextMenu();
    } else if (event.button === 2) {
      // Right click
      this.showNodeContextMenu(node);
    }
  }

  showNodeContextMenu(node) {
    this.selectionController.selectNode(node);
    this.nodeContextMenu.showContextMenu(node, node.x, node.y);
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

    // Move the node's descendants
    this.nodeController.moveDescendants(node, deltaX, deltaY);
  }

  handleDragEnd(event, node) {
    // Optional: handle drag end logic here
  }
}
