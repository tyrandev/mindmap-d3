import CircleSvg from "./shapes/CircleSvg.js";
import RectangleSvg from "./shapes/RectangleSvg.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import Circle from "../../model/geometric/circle/Circle.js";
import svgManager from "../../view/SvgManager.js";
import ColorHandler from "../../util/color/ColorHandler.js";
import BorderlessRectangle from "../../model/geometric/rectangle/BorderlessRectangle.js";

export default class SvgCreator {
  constructor(nodeContainer, nodeEventAttacher) {
    this.nodeContainer = nodeContainer;
    this.nodeEventAttacher = nodeEventAttacher;
    this.svg = svgManager.getSvg();
    this.renderedNodes = new Set();
    this.CircleSvg = new CircleSvg(this.svg);
    this.RectangleSvg = new RectangleSvg(this.svg);
  }

  drawNodes() {
    this.svg.selectAll("*").remove();
    this.renderedNodes.clear();
    this.nodeContainer.getNodes().forEach((node) => this.renderNode(node));
  }

  renderNode(node) {
    const nodeSelection = this.renderNodeContent(node);
    this.addEventListeners(nodeSelection, node);
    this.applySelectionStyle(nodeSelection, node);
    this.trackNodeAsRendered(node);
    this.renderNodeChildren(node);
  }

  renderNodeContent(node) {
    if (node instanceof Rectangle) {
      return this.RectangleSvg.render(node);
    } else if (node instanceof Circle) {
      return this.CircleSvg.render(node);
    } else {
      throw new Error("Trying to render unsupported type of node");
    }
  }

  addEventListeners(nodeSelection, node) {
    this.nodeEventAttacher.attachEventListeners(nodeSelection, node);
  }

  trackNodeAsRendered(node) {
    this.renderedNodes.add(node.id);
  }

  renderNodeChildren(node) {
    if (node.children) {
      node.children.forEach((child) => this.renderNode(child));
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
}
