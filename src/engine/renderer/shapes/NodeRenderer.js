import LineMath from "../../math/LineMath.js";
import CollapseIndicator from "../../../model/indicators/CollapseIndicator.js";
import CollapseIndicatorRenderer from "../indicators/CollapseIndicatorRenderer.js";
import * as d3 from "d3";

export default class NodeRenderer {
  constructor(svg) {
    this.svg = svg;
    this.collapseIndicatorRenderer = new CollapseIndicatorRenderer();
  }

  drawShapeWithText(node) {
    throw new Error("Method 'drawShapeWithText()' must be implemented.");
  }

  renderCollapseIndicator(node) {
    if (!(node.collapsed instanceof CollapseIndicator)) return;
    this.collapseIndicatorRenderer.drawCollapseIndicator(node);
  }

  drawNodeText(node) {
    this.setTextStyle(node);
    this.computeTextLines(node);
  }

  setTextStyle(node) {
    // D3 handles text style differently, so this method can be simplified.
    // We'll set styles directly in the D3 chain.
  }

  computeTextLines(node) {
    throw new Error("Method 'computeTextLines()' must be implemented.");
  }

  connectLineToChildNodes(node, child) {
    this.connectWithCurvedLine(
      node.x,
      node.y,
      child.x,
      child.y,
      node.getLineColor()
    );
  }

  connectWithStraightLine(startX, startY, endX, endY) {
    this.svg
      .append("line")
      .attr("x1", startX)
      .attr("y1", startY)
      .attr("x2", endX)
      .attr("y2", endY)
      .attr("stroke", "black"); // Set color and other styles as needed
  }

  connectWithCurvedLine(startX, startY, endX, endY, lineColor) {
    const { controlX1, controlY1, controlX2, controlY2 } =
      LineMath.calculateControlPointsForCurvedLine(startX, startY, endX, endY);

    const path = d3.path();
    path.moveTo(startX, startY);
    path.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);

    this.svg
      .append("path")
      .attr("d", path.toString())
      .attr("stroke", lineColor)
      .attr("fill", "none");
  }

  render(node) {
    if (node.hasCollapsedAncestor()) return;

    this.drawShapeWithText(node);

    if (!node.collapsed) {
      node.children.forEach((child) => {
        this.connectLineToChildNodes(node, child);
      });
    } else {
      this.renderCollapseIndicator(node);
    }
  }
}
