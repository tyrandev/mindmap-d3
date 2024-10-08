export default class CollapseIndicatorSvg {
  constructor(svgGroup) {
    this.svgGroup = svgGroup;
  }

  drawCollapseIndicator(node) {
    if (!node.collapsed) return;

    const indicator = node.collapsed;
    const textY = indicator.calculateHeightOfCollapseIndicator(node);

    this.svgGroup
      .append("text")
      .attr("x", node.x)
      .attr("y", textY)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-weight", 100)
      .style("fill", "black")
      .style("font-size", "14px")
      .style("font-family", "Arial")
      .text("<collapsed>");
  }
}
