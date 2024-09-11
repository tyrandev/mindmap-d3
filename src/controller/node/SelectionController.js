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
    this.originalNodeColor = null;
  }

  setUnselectedNodeStyle() {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (selectedNode) {
      selectedNode.setFillColor(this.originalNodeColor);
      // selectedNode.borderWidth = nc.BASE_NODE_BORDER_WITH;
    }
  }

  setSelectedNodeStyle() {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (selectedNode) {
      this.originalNodeColor = selectedNode.fillColor;
      // selectedNode.setFillColor(
      //   ColorHandler.lightenColor(selectedNode.fillColor, 1.5)
      // );
      // selectedNode.borderWidth = nc.SELECTED_NODE_BORDER_WIDTH;
    }
  }

  selectNode(node) {
    const currentSelectedNode = this.nodeContainer.getSelectedNode();

    // If node is already selected, do nothing
    if (currentSelectedNode === node) return;

    // If another node was selected, reset its style
    if (currentSelectedNode) {
      this.setUnselectedNodeStyle();
    }

    // Set the new selected node
    this.nodeContainer.selectNode(node);

    // Apply the style for the new selected node
    this.setSelectedNodeStyle();
  }

  unselectNode() {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (!selectedNode) return;

    this.setUnselectedNodeStyle();
    this.nodeContainer.unselectNode(); // Unselect in nodeContainer
    this.originalNodeColor = null;
    console.log(
      "Node was unselected. Now it is:",
      this.nodeContainer.getSelectedNode()
    );
  }

  deleteSelectedNode() {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (!selectedNode) return;

    StackEventEmitter.emitSaveStateForUndo();
    this.nodeContainer.removeNodeAndChildren(selectedNode);
    this.nodeContainer.unselectNode();
  }

  renameSelectedNode(newText) {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (!selectedNode) return;

    StackEventEmitter.emitSaveStateForUndo();
    selectedNode.setText(newText);
  }

  renameSelectedNodePrompt() {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (!selectedNode) return;

    const currentName = selectedNode.text || "";
    const newName = prompt("Enter new name for the node:", currentName);
    if (!newName) return;
    this.renameSelectedNode(newName);
  }

  randomizeSelectedNodeColor() {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (!selectedNode) return;

    const randomColor = ColorHandler.getRandomLightColor();
    this.setSelectedNodeColor(randomColor);
  }

  setSelectedNodeColor(color) {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (!selectedNode) return;

    StackEventEmitter.emitSaveStateForUndo();
    selectedNode.setFillColor(color);
    this.originalNodeColor = color;
  }

  setSelectedNodeBorderColor(color) {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (!selectedNode) return;

    StackEventEmitter.emitSaveStateForUndo();
    selectedNode.setBorderColor(color);
  }

  updateSelectedNodeDimensions(deltaY) {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (!selectedNode) return;

    if (selectedNode instanceof Circle) {
      const delta = Math.sign(deltaY);
      const increment = delta * cc.DEFAULT_RADIUS_INCREMENT;
      const newRadius = selectedNode.radius + increment;
      this.setSelectedCircleRadius(newRadius);
    } else if (selectedNode instanceof Rectangle) {
      const percentageIncrement = deltaY * rc.PERCENTAGE_INCREMENT;
      const newWidth = selectedNode.width * (1 + percentageIncrement);
      const newHeight = selectedNode.height * (1 + percentageIncrement);
      this.setSelectedRectangleDimensions(newWidth, newHeight);
    }
  }

  setSelectedRectangleDimensions(newWidth, newHeight) {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (!(selectedNode instanceof Rectangle)) return;

    StackEventEmitter.emitSaveStateForUndo();
    selectedNode.setDimensions(newWidth, newHeight);
  }

  setSelectedCircleRadius(newRadius) {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (!(selectedNode instanceof Circle)) return;

    StackEventEmitter.emitSaveStateForUndo();
    selectedNode.setRadius(newRadius);
  }

  toggleSelectedNodeCollapse() {
    const selectedNode = this.nodeContainer.getSelectedNode();
    if (!selectedNode) return;
    if (!selectedNode.hasChildren()) return;

    StackEventEmitter.emitSaveStateForUndo();
    selectedNode.toggleCollapse();
  }

  getSelectedNode() {
    return this.nodeContainer.getSelectedNode();
  }
}
