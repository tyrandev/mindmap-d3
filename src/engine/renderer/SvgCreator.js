import CircleSvg from "./shapes/CircleSvg.js";
import RectangleSvg from "./shapes/RectangleSvg.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import Circle from "../../model/geometric/circle/Circle.js";
import ColorHandler from "../../util/color/ColorHandler.js";
import BorderlessRectangle from "../../model/geometric/rectangle/BorderlessRectangle.js";
import ConnectionLineSvg from "./lines/ConnectionLineSvg.js";
import CollapseIndicatorSvg from "./indicators/CollapseIndicatorSvg.js";

export default class SvgCreator {
  constructor(svgGroup, nodeContainer, nodeEventAttacher) {
    this.nodeContainer = nodeContainer;
    this.nodeEventAttacher = nodeEventAttacher;
    this.svgGroup = svgGroup;
    this.renderedNodes = new Set();
    this.circleSvg = new CircleSvg(this.svgGroup);
    this.rectangleSvg = new RectangleSvg(this.svgGroup);
    this.connectionLineSvg = new ConnectionLineSvg(this.svgGroup);
    this.collapseIndicatorSvg = new CollapseIndicatorSvg(this.svgGroup);
  }

  drawNodes() {
    this.svgGroup.selectAll("*").remove();
    this.renderedNodes.clear();
    this.nodeContainer.getNodes().forEach((node) => this.renderNode(node));
  }

  renderNode(node) {
    const nodeSelection = this.renderNodeContent(node);
    this.renderNodeChildren(node);
    this.renderLines(node);
    this.renderCollapseIndicator(node);
    this.applySelectionStyle(nodeSelection, node);
    this.addEventListeners(nodeSelection, node);
  }

  renderNodeContent(node) {
    if (node.hasCollapsedAncestor()) return;
    if (node instanceof Rectangle) {
      return this.rectangleSvg.createSvgShapeWithText(node);
    } else if (node instanceof Circle) {
      return this.circleSvg.createSvgShapeWithText(node);
    } else {
      throw new Error("Trying to render unsupported type of node");
    }
  }

  addEventListeners(nodeSelection, node) {
    this.nodeEventAttacher.attachEventListeners(nodeSelection, node);
  }

  renderNodeChildren(node) {
    if (!node.children) return;
    node.children.forEach((child) => {
      this.renderNode(child);
    });
  }

  renderLines(node) {
    if (!node.children) return;
    node.children.forEach((child) => {
      if (node.collapsed) return;
      if (node.hasCollapsedAncestor()) return;
      this.connectionLineSvg.connectLineToChildNodes(node, child);
    });
  }

  renderCollapseIndicator(node) {
    if (node.hasCollapsedAncestor()) return;
    this.collapseIndicatorSvg.drawCollapseIndicator(node);
  }

  applySelectionStyle(nodeSelection, node) {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (selectedNode !== node) return;
    if (selectedNode instanceof BorderlessRectangle) return;
    const lightenedFillColor = ColorHandler.lightenColor(node.fillColor, 3);
    nodeSelection
      .attr("stroke", node.borderColor)
      .attr("stroke-width", node.borderWidth + 1)
      .attr("fill", lightenedFillColor);
  }
}
