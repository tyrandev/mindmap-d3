import NodeSvg from "./NodeSvg.js";
import CircleMath from "../../math/CircleMath.js";
import CircleTextHelper from "../../../model/geometric/circle/CircleTextHelper.js";
import Circle from "../../../model/geometric/circle/Circle.js";
import Rectangle from "../../../model/geometric/rectangle/Rectangle.js";

export default class CircleSvg extends NodeSvg {
  drawShapeWithText(circle) {
    const circleSelection = this.drawCircleShape(circle);
    this.drawNodeText(circle);
    return circleSelection;
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

  drawNodeText(circle) {
    const textAttributes = this.calculateTextAttributes(circle);
    this.drawTextLines(circle, textAttributes);
  }

  calculateTextAttributes(circle) {
    const limitedText = CircleTextHelper.limitTextCharacterNumber(circle.text);
    const fontSize = CircleTextHelper.calculateFontSize(
      circle.text,
      circle.radius
    );
    const lines = CircleTextHelper.splitTextIntoLines(
      limitedText,
      circle.radius,
      fontSize
    );

    return { fontSize, lines };
  }

  drawTextLines(circle, { fontSize, lines }) {
    const lineHeight = fontSize + 4;

    lines.forEach((line, index) => {
      this.svg
        .append("text")
        .attr("x", circle.x)
        .attr("y", circle.y + (index - lines.length / 2 + 0.5) * lineHeight)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("fill", circle.textColor || "black")
        .style("font-size", `${fontSize}px`)
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
