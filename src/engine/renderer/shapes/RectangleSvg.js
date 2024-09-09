import NodeSvg from "./NodeSvg.js";
import RectangleMath from "../../math/RectangleMath.js";
import Circle from "../../../model/geometric/circle/Circle.js";
import Rectangle from "../../../model/geometric/rectangle/Rectangle.js";
import * as d3 from "d3";

export default class RectangleSvg extends NodeSvg {
  drawShapeWithText(rectangle) {
    const rectangleSelection = this.drawRectangleShape(rectangle);
    this.drawNodeText(rectangle);
    this.renderCollapseIndicator(rectangle);
    return rectangleSelection;
  }

  drawRectangleShape(rectangle) {
    const allRadiiPositive = rectangle.cornerRadii.every(
      (radius) => radius > 0
    );

    if (allRadiiPositive) {
      return this.drawRoundedRectangle(rectangle);
    } else {
      return this.drawStandardRectangle(rectangle);
    }
  }

  drawStandardRectangle(rectangle) {
    return this.svg
      .append("rect")
      .attr("x", rectangle.x - rectangle.actualWidth / 2)
      .attr("y", rectangle.y - rectangle.height / 2)
      .attr("width", rectangle.actualWidth)
      .attr("height", rectangle.height)
      .attr("fill", rectangle.fillColor)
      .attr("stroke", rectangle.borderColor)
      .attr("stroke-width", rectangle.borderWidth);
  }

  drawRoundedRectangle(rectangle) {
    const [topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius] =
      RectangleMath.adjustRadii(
        rectangle.actualWidth,
        rectangle.height,
        rectangle.cornerRadii
      );

    return this.svg
      .append("rect")
      .attr("x", rectangle.x - rectangle.actualWidth / 2)
      .attr("y", rectangle.y - rectangle.height / 2)
      .attr("width", rectangle.actualWidth)
      .attr("height", rectangle.height)
      .attr("rx", topLeftRadius)
      .attr("ry", topLeftRadius)
      .attr("fill", rectangle.fillColor)
      .attr("stroke", rectangle.borderColor)
      .attr("stroke-width", rectangle.borderWidth);
  }

  computeTextLines(rectangle) {
    const lineHeight = rectangle.fontSize + 4;
    const lines = rectangle.text.split("\n");

    lines.forEach((line, index) => {
      const y = rectangle.y + (index - lines.length / 2 + 0.5) * lineHeight;
      this.svg
        .append("text")
        .attr("x", rectangle.x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("fill", rectangle.textColor || "black")
        .style("font-size", `${rectangle.fontSize}px`)
        .style("font-family", "Arial")
        .text(line);
    });
  }

  connectLineToChildNodes(rectangle, child) {
    const { startX, startY, endX, endY } = this.calculateConnectionPoints(
      rectangle,
      child
    );
    this.connectWithCurvedLine(
      startX,
      startY,
      endX,
      endY,
      rectangle.getLineColor()
    );
  }

  calculateConnectionPoints(rectangle, child) {
    if (child instanceof Circle) {
      return RectangleMath.calculateRectangleToCircleConnection(
        rectangle,
        child
      );
    } else if (child instanceof Rectangle) {
      return RectangleMath.calculateRectangleToRectangleConnection(
        rectangle,
        child
      );
    } else {
      throw new Error("Unknown or unsupported type of node child");
    }
  }
}
