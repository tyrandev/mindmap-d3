import * as nc from "../../constants/NodeConstants.js";
import StackEventEmitter from "../../services/event/emitter/StackEventEmitter.js";
import svgManager from "../../view/SvgManager.js";

export default class NodeMovementController {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
  }

  moveNode(node, newX, newY) {
    const deltaX = newX - node.x;
    const deltaY = newY - node.y;

    if (
      Math.sqrt(deltaX ** 2 + deltaY ** 2) >= nc.DISTANCE_MOVED_TO_SAVE_STATE
    ) {
      StackEventEmitter.emitSaveStateForUndo();
    }
    node.x = newX;
    node.y = newY;
    this.moveDescendants(node, deltaX, deltaY);
  }

  moveDescendants(node, deltaX, deltaY) {
    node.children.forEach((child) => {
      child.x += deltaX;
      child.y += deltaY;
      this.moveDescendants(child, deltaX, deltaY);
    });
  }

  moveNodeToCenter(node) {
    const svgCenter = svgManager.getCenterCoordinates();
    const offsetX = svgCenter.x - node.x;
    const offsetY = svgCenter.y - node.y;
    this.moveNode(node, node.x + offsetX, node.y + offsetY);
  }
}
