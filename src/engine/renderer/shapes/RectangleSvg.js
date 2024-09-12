import NodeSvg from "./NodeSvg.js";
import RectangleMath from "../../math/RectangleMath.js";

export default class RectangleSvg extends NodeSvg {
  constructor(svg) {
    super(svg);
  }

  createSvgShapeWithText(rectangle) {
    const rectangleSelection = this.drawRectangleShape(rectangle);
    this.drawNodeText(rectangle);
    return rectangleSelection;
  }

  drawRectangleShape(rectangle) {
    const rect = this.svg
      .append("rect")
      .attr("x", rectangle.x - rectangle.actualWidth / 2)
      .attr("y", rectangle.y - rectangle.height / 2)
      .attr("width", rectangle.actualWidth)
      .attr("height", rectangle.height)
      .attr("fill", rectangle.fillColor)
      .attr("stroke", rectangle.borderColor)
      .attr("stroke-width", rectangle.borderWidth);

    this.applyCornerRadius(rect, rectangle);
    return rect;
  }

  applyCornerRadius(rect, rectangle) {
    const [radius] = RectangleMath.adjustRadii(
      rectangle.actualWidth,
      rectangle.height,
      rectangle.cornerRadii
    );
    if (radius > 0) {
      rect.attr("rx", radius).attr("ry", radius);
    }
  }

  drawNodeText(rectangle) {
    this.computeTextLines(rectangle);
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
}
