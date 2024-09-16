import CircleSvg from "./shapes/CircleSvg.js";
import RectangleSvg from "./shapes/RectangleSvg.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import Circle from "../../model/geometric/circle/Circle.js";
import svgManager from "../../view/SvgManager.js";
import ColorHandler from "../../util/color/ColorHandler.js";
import BorderlessRectangle from "../../model/geometric/rectangle/BorderlessRectangle.js";
import ConnectionLineSvg from "./lines/ConnectionLineSvg.js";
import CollapseIndicator from "../../model/indicators/CollapseIndicator.js";
import CollapseIndicatorSvg from "./indicators/CollapseIndicatorSvg.js";

export default class SvgCreator {
  constructor(nodeContainer, nodeEventAttacher) {
    this.nodeContainer = nodeContainer;
    this.nodeEventAttacher = nodeEventAttacher;
    this.svg = svgManager.getSvg();
    this.renderedNodes = new Set();
    this.circleSvg = new CircleSvg(this.svg);
    this.rectangleSvg = new RectangleSvg(this.svg);
    this.connectionLineSvg = new ConnectionLineSvg(this.svg);
    this.collapseIndicatorSvg = new CollapseIndicatorSvg();
  }

  drawNodes() {
    this.svg.selectAll("*").remove();
    this.renderedNodes.clear();
    this.nodeContainer.getNodes().forEach((node) => this.renderNode(node));
  }

  renderNode(node) {
    const nodeSelection = this.renderNodeContent(node);
    this.renderCollapseIndicator(node);
    this.applySelectionStyle(nodeSelection, node);
    this.renderNodeChildren(node);
    this.addEventListeners(nodeSelection, node);
    this.applyLinkStyle(nodeSelection, node);
  }

  renderNodeContent(node) {
    if (node.hasCollapsedAncestor()) return;
    if (node instanceof Rectangle) {
      return this.rectangleSvg.getSvgNode(node);
    } else if (node instanceof Circle) {
      return this.circleSvg.getSvgNode(node);
    } else {
      throw new Error("Trying to getSvgNode unsupported type of node");
    }
  }

  addEventListeners(nodeSelection, node) {
    this.nodeEventAttacher.attachEventListeners(nodeSelection, node);
  }

  renderNodeChildren(node) {
    if (!node.children) return;
    node.children.forEach((child) => {
      this.renderNode(child);
      if (!node.collapsed) {
        this.connectionLineSvg.connectLineToChildNodes(node, child);
      }
    });
  }

  renderCollapseIndicator(node) {
    if (node.collapsed && node.collapsed instanceof CollapseIndicator) {
      this.collapseIndicatorSvg.drawCollapseIndicator(node);
    }
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

  applyLinkStyle(nodeSelection, node) {
    if (node.link) {
      nodeSelection.select("text").style("text-decoration", "underline");
    }
  }
}
