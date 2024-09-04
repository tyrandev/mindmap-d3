import NodeRenderer from "./NodeRenderer.js";
import CircleMath from "../../math/CircleMath.js";
import CircleTextHelper from "../../../model/geometric/circle/CircleTextHelper.js";
import Circle from "../../../model/geometric/circle/Circle.js";
import Rectangle from "../../../model/geometric/rectangle/Rectangle.js";
import * as d3 from "d3";

export default class CircleRenderer extends NodeRenderer {
  drawShapeWithText(circle) {
    this.drawCircleShape(circle);
    this.drawNodeText(circle);
    this.renderCollapseIndicator(circle);
  }

  drawCircleShape(circle) {
    this.svg
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
      const y = circle.y + (index - lines.length / 2 + 0.5) * lineHeight;
      this.svg
        .append("text")
        .attr("x", circle.x)
        .attr("y", y)
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
}
