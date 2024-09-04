import NodeRenderer from "./NodeRenderer.js";
import CircleMath from "../../math/CircleMath.js";
import CircleTextHelper from "../../../model/geometric/circle/CircleTextHelper.js";
import Circle from "../../../model/geometric/circle/Circle.js";
import Rectangle from "../../../model/geometric/rectangle/Rectangle.js";
import * as d3 from "d3";

export default class CircleRenderer extends NodeRenderer {
  drawShapeWithText(circle) {
    const circleSelection = this.drawCircleShape(circle); // Get the selection
    this.drawNodeText(circle);
    this.renderCollapseIndicator(circle);
    this.attachEventListeners(circleSelection, circle); // Attach event listeners
  }

  drawCircleShape(circle) {
    return this.svg
      .append("circle")
      .attr("cx", circle.x)
      .attr("cy", circle.y)
      .attr("r", circle.radius)
      .attr("fill", circle.fillColor)
      .attr("stroke", circle.borderColor)
      .attr("stroke-width", circle.borderWidth);
  }

  computeTextLines(circle) {
    const lines = CircleTextHelper.splitTextIntoLines(
      circle.text,
      circle.radius,
      circle.fontSize
    );

    const lineHeight = circle.fontSize + 4;

    lines.forEach((line, index) => {
      this.svg
        .append("text")
        .attr("x", circle.x)
        .attr("y", circle.y + (index - lines.length / 2 + 0.5) * lineHeight)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("fill", circle.textColor || "black")
        .style("font-size", `${circle.fontSize}px`)
        .style("font-family", "Arial")
        .text(line);
    });
  }

  connectLineToChildNodes(circle, child) {
    const { startX, startY, endX, endY } = this.calculateConnectionPoints(
      circle,
      child
    );
    this.connectWithCurvedLine(
      startX,
      startY,
      endX,
      endY,
      circle.getLineColor()
    );
  }

  calculateConnectionPoints(circle, child) {
    const angle = CircleMath.calculateAngle(
      circle.x,
      circle.y,
      child.x,
      child.y
    );

    if (child instanceof Circle) {
      return CircleMath.calculateCircleToCircleConnection(circle, child, angle);
    } else if (child instanceof Rectangle) {
      return CircleMath.calculateCircleToRectangleConnection(
        circle,
        child,
        angle
      );
    } else {
      throw new Error("Unknown or unsupported type of node child");
    }
  }

  attachEventListeners(selection, circle) {
    if (!selection || selection.empty()) {
      console.error("Selection is undefined, null, or empty");
      return;
    }

    const drag = d3
      .drag()
      .on("start", (event) => this.handleDragStart(event, circle))
      .on("drag", (event) => this.handleDrag(event, circle))
      .on("end", (event) => this.handleDragEnd(event, circle));

    selection
      .on("mouseover", (event) => this.handleCircleMouseOver(event, circle))
      .on("mouseout", (event) => this.handleCircleMouseOut(event, circle))
      .on("click", (event) => this.handleCircleClick(event, circle)) // Add click event listener
      .call(drag);
  }

  handleCircleClick(event, circle) {
    console.log("Circle clicked:", circle);
  }

  handleCircleMouseOver(event, circle) {
    d3.select(event.currentTarget)
      .attr("stroke", "red")
      .attr("stroke-width", circle.borderWidth * 2);
  }

  handleCircleMouseOut(event, circle) {
    d3.select(event.currentTarget)
      .attr("stroke", circle.borderColor)
      .attr("stroke-width", circle.borderWidth);
  }

  handleDragStart(event, circle) {
    const svgElement = this.svg.node();
    const [x, y] = d3.pointer(event, svgElement);

    // Calculate the offset between the mouse pointer and the circle center
    this.dragOffset = {
      x: x - circle.x,
      y: y - circle.y,
    };
  }

  handleDrag(event, circle) {
    const svgElement = this.svg.node();
    const [x, y] = d3.pointer(event, svgElement);

    // Use the offset to update the circle's position
    circle.x = x - this.dragOffset.x;
    circle.y = y - this.dragOffset.y;

    d3.select(event.sourceEvent.target)
      .attr("cx", circle.x)
      .attr("cy", circle.y);
  }

  handleDragEnd(event, circle) {
    // Optional: handle drag end logic here
  }
}
