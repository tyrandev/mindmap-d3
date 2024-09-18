import NodeSvg from "./NodeSvg.js";
import CircleTextUtil from "../../../util/text/CircleTextUtil.js";

export default class CircleSvg extends NodeSvg {
  constructor(svg) {
    super(svg);
  }

  createSvgShapeWithText(circle) {
    const circleSelection = this.drawCircleShape(circle);
    this.drawText(circle);
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

  drawText(circle) {
    const textAttributes = this.calculateTextAttributes(circle);
    this.drawTextLines(circle, textAttributes);
  }

  calculateTextAttributes(circle) {
    const limitedText = CircleTextUtil.limitTextCharacterNumber(circle.text);
    const fontSize = CircleTextUtil.calculateFontSize(
      circle.text,
      circle.radius
    );
    const lines = CircleTextUtil.splitTextIntoLines(
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
}
