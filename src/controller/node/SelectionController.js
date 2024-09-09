import ColorHandler from "../../util/color/ColorHandler.js";
import * as cc from "../../constants/CircleConstants.js";
import * as rc from "../../constants/RectangleConstants.js";
import * as nc from "../../constants/NodeConstants.js";
import Circle from "../../model/geometric/circle/Circle.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import StackEventEmitter from "../../services/event/emitter/StackEventEmitter.js";

export default class SelectionController {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
    this.selectedNode = null;
    this.originalNodeColor = null;
  }

  setUnselectedNodeStyle() {
    this.selectedNode.setFillColor(this.originalNodeColor);
    this.selectedNode.borderWidth = nc.BASE_NODE_BORDER_WITH;
  }

  setSelectedNodeStyle() {
    this.selectedNode.setFillColor(
      ColorHandler.lightenColor(this.selectedNode.fillColor, 1.5)
    );
    this.selectedNode.borderWidth = nc.SELECTED_NODE_BORDER_WIDTH;
  }

  selectNode(node) {
    if (this.selectedNode === node) return;
    if (this.selectedNode && this.originalNodeColor) {
      this.setUnselectedNodeStyle();
    }
    this.selectedNode = node;
    this.originalNodeColor = node.fillColor;
    this.setSelectedNodeStyle();
  }

  unselectNode() {
    if (!this.selectedNode) return;
    this.setUnselectedNodeStyle();
    this.selectedNode = null;
    this.originalNodeColor = null;
    console.log("Node was unselected. Now it is:", this.selectedNode);
  }

  removeSelectedNode() {
    if (!this.selectedNode) return;
    StackEventEmitter.emitSaveStateForUndo();
    this.nodeContainer.removeNodeAndChildren(this.selectedNode);
  }

  renameSelectedNode(newText) {
    if (!this.selectedNode) return;
    StackEventEmitter.emitSaveStateForUndo();
    this.selectedNode.setText(newText);
  }

  renameSelectedNodePrompt() {
    const currentName = this.selectedNode.text || "";
    const newName = prompt("Enter new name for the node:", currentName);
    if (!newName) return;
    this.renameSelectedNode(newName);
  }

  randomizeSelectedNodeColor() {
    if (!this.selectedNode) return;
    const randomColor = ColorHandler.getRandomLightColor();
    this.setSelectedNodeColor(randomColor);
  }

  setSelectedNodeColor(color) {
    if (!this.selectedNode) return;
    StackEventEmitter.emitSaveStateForUndo();
    this.selectedNode.setFillColor(color);
    this.originalNodeColor = color;
  }

  setSelectedNodeBorderColor(color) {
    if (!this.selectedNode) return;
    StackEventEmitter.emitSaveStateForUndo();
    this.selectedNode.setBorderColor(color);
  }

  updateSelectedNodeDimensions(deltaY) {
    if (this.selectedNode instanceof Circle) {
      const delta = Math.sign(deltaY);
      const increment = delta * cc.DEFAULT_RADIUS_INCREMENT;
      const newRadius = this.selectedNode.radius + increment;
      this.setSelectedCircleRadius(newRadius);
    } else if (this.selectedNode instanceof Rectangle) {
      const percentageIncrement = deltaY * rc.PERCENTAGE_INCREMENT;
      const newWidth = this.selectedNode.width * (1 + percentageIncrement);
      const newHeight = this.selectedNode.height * (1 + percentageIncrement);
      this.setSelectedRectangleDimensions(newWidth, newHeight);
    }
  }

  setSelectedRectangleDimensions(newWidth, newHeight) {
    if (!(this.selectedNode instanceof Rectangle)) return;
    StackEventEmitter.emitSaveStateForUndo();
    this.selectedNode.setDimensions(newWidth, newHeight);
  }

  setSelectedCircleRadius(newRadius) {
    if (!(this.selectedNode instanceof Circle)) return;
    StackEventEmitter.emitSaveStateForUndo();
    this.selectedNode.setRadius(newRadius);
  }

  toggleSelectedNodeCollapse() {
    if (!this.selectedNode) return;
    if (!this.selectedNode.hasChildren()) return;
    StackEventEmitter.emitSaveStateForUndo();
    this.selectedNode.toggleCollapse();
  }

  getSelectedNode() {
    return this.selectedNode;
  }
}
