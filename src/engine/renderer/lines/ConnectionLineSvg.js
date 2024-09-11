import * as d3 from "d3";
import LineMath from "../../math/LineMath.js";
import CircleMath from "../../math/CircleMath.js";
import RectangleMath from "../../math/RectangleMath.js";
import Circle from "../../../model/geometric/circle/Circle.js";
import Rectangle from "../../../model/geometric/rectangle/Rectangle.js";

export default class ConnectionLineSvg {
  constructor(svg) {
    if (!svg) {
      throw new Error("SVG element is required");
    }
    this.svg = svg;
  }

  connectWithStraightLine(startX, startY, endX, endY, lineColor = "black") {
    this.svg
      .append("line")
      .attr("x1", startX)
      .attr("y1", startY)
      .attr("x2", endX)
      .attr("y2", endY)
      .attr("stroke", lineColor);
  }

  connectWithCurvedLine(startX, startY, endX, endY, lineColor = "black") {
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

  calculateConnectionPoints(startNode, endNode) {
    const angle = CircleMath.calculateAngle(
      startNode.x,
      startNode.y,
      endNode.x,
      endNode.y
    );

    if (startNode instanceof Circle && endNode instanceof Circle) {
      return CircleMath.calculateCircleToCircleConnection(
        startNode,
        endNode,
        angle
      );
    } else if (startNode instanceof Circle && endNode instanceof Rectangle) {
      return CircleMath.calculateCircleToRectangleConnection(
        startNode,
        endNode,
        angle
      );
    } else if (startNode instanceof Rectangle && endNode instanceof Circle) {
      return RectangleMath.calculateRectangleToCircleConnection(
        startNode,
        endNode,
        angle
      );
    } else if (startNode instanceof Rectangle && endNode instanceof Rectangle) {
      return RectangleMath.calculateRectangleToRectangleConnection(
        startNode,
        endNode,
        angle
      );
    } else {
      throw new Error("Unknown or unsupported types of nodes");
    }
  }
}
