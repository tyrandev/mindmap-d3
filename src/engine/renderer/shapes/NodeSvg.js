import CollapseIndicator from "../../../model/indicators/CollapseIndicator.js";
import CollapseIndicatorRenderer from "../indicators/CollapseIndicatorRenderer.js";
import ConnectionLineSvg from "../lines/ConnectionLineSvg.js";

export default class NodeRenderer {
  constructor(svg) {
    if (!svg) {
      throw new Error("SVG element is required");
    }
    this.svg = svg;
    this.collapseIndicatorRenderer = new CollapseIndicatorRenderer();
    this.connectionLineSvg = new ConnectionLineSvg(svg);
  }

  render(node) {
    if (node.hasCollapsedAncestor()) return;

    const nodeSelection = this.drawShapeWithText(node);

    if (!node.collapsed) {
      node.children.forEach((child) => {
        this.connectionLineSvg.connectLineToChildNodes(node, child);
      });
    } else {
      this.renderCollapseIndicator(node);
    }
    return nodeSelection;
  }

  drawShapeWithText(node) {
    throw new Error("Method 'drawShapeWithText()' must be implemented.");
  }

  renderCollapseIndicator(node) {
    if (!(node.collapsed instanceof CollapseIndicator)) return;
    this.collapseIndicatorRenderer.drawCollapseIndicator(node);
  }

  drawNodeText(node) {
    this.computeTextLines(node);
  }

  computeTextLines(node) {
    throw new Error("Method 'computeTextLines()' must be implemented.");
  }
}
