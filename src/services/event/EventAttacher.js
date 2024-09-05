import * as d3 from "d3";

export default class EventAttacher {
  constructor(svg, nodeController) {
    this.svg = svg;
    this.nodeController = nodeController;
    this.selectionController = this.nodeController.selectionController;
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
      .on("mouseover", (event) => this.handleCircleMouseOver(event, node))
      .on("mouseout", (event) => this.handleCircleMouseOut(event, node))
      .on("click", (event) => this.handleCircleClick(event, node))
      .call(drag);
  }

  handleCircleClick(event, node) {
    console.log("Circle clicked:", node);
  }

  handleCircleMouseOver(event, node) {
    // Handle mouse over, e.g., highlight the circle
    // d3.select(event.currentTarget).attr("stroke", "red").attr("stroke-width", circle.borderWidth * 2);
  }

  handleCircleMouseOut(event, node) {
    // Handle mouse out, e.g., revert highlight
    // d3.select(event.currentTarget).attr("stroke", circle.borderColor).attr("stroke-width", circle.borderWidth);
  }

  handleDragStart(event, node) {
    const svgElement = this.svg.node();
    const [x, y] = d3.pointer(event, svgElement);

    // Calculate the offset between the mouse pointer and the circle center
    this.dragOffset = {
      x: x - node.x,
      y: y - node.y,
    };
  }

  handleDrag(event, node) {
    const svgElement = this.svg.node();
    const [x, y] = d3.pointer(event, svgElement);

    // Use the offset to update the circle's position
    node.x = x - this.dragOffset.x;
    node.y = y - this.dragOffset.y;

    d3.select(event.sourceEvent.target).attr("cx", node.x).attr("cy", node.y);
  }

  handleDragEnd(event, node) {
    // Optional: handle drag end logic here
  }
}
