import svgManager from "../../../view/SvgManager.js";

export default class CollapseIndicatorRenderer {
  constructor() {
    this.svg = svgManager.getSvg();
  }

  drawCollapseIndicator(node) {
    if (!node.collapsed) return;

    const indicator = node.collapsed;
    const textY = indicator.calculateHeightOfCollapseIndicator(node);

    this.svg
      .append("text")
      .attr("x", node.x)
      .attr("y", textY)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("fill", "black")
      .style("font-size", "14px")
      .style("font-family", "Arial")
      .text("(collapsed)");
  }
}
