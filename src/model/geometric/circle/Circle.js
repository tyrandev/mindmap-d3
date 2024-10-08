import Node from "../node/Node.js";
import * as cc from "../../../constants/CircleConstants.js";

export default class Circle extends Node {
  constructor(x = 0, y = 0) {
    super(x, y);
    this.radius = cc.BASE_CIRCLE_RADIUS;
    this.setText(this.text);
  }

  clone() {
    const clone = new Circle(this.x, this.y);
    clone.radius = this.radius;
    clone.text = this.text;
    clone.fillColor = this.fillColor;
    clone.borderColor = this.borderColor;
    clone.textColor = this.textColor;
    clone.borderWidth = this.borderWidth;
    clone.setId(this.id);
    clone.collapsed = this.collapsed;
    clone.link = this.link;
    this.children.forEach((child) => {
      clone.addChildNode(child.clone());
    });
    return clone;
  }

  getRadius() {
    return this.radius;
  }

  isPointInsideOfNode(x, y) {
    const { dx, dy } = this.calculateDistanceDifferences(this.x, this.y, x, y);
    const squaredDistance = this.calculateSquaredDistance(dx, dy);
    return this.isDistanceWithinRadius(this.radius, squaredDistance);
  }

  calculateDistanceDifferences(circleX, circleY, x, y) {
    const dx = circleX - x;
    const dy = circleY - y;
    return { dx, dy };
  }

  calculateSquaredDistance(dx, dy) {
    return dx * dx + dy * dy;
  }

  isDistanceWithinRadius(radius, squaredDistance) {
    return squaredDistance <= radius * radius;
  }

  validateRadius(newRadius) {
    if (isNaN(newRadius)) {
      throw new Error(`Invalid radius value: ${newRadius}. Must be a number.`);
    }
    if (newRadius < cc.MIN_CIRCLE_RADIUS) {
      return cc.MIN_CIRCLE_RADIUS;
    }
    return newRadius;
  }

  setRadius(newRadius) {
    const validRadius = this.validateRadius(newRadius);
    this.radius = validRadius;
  }

  setText(newText) {
    this.text = newText;
  }

  getClassName() {
    return "Circle";
  }

  toJSON() {
    return {
      ...super.toJSON(),
      radius: this.radius,
    };
  }

  static fromJSON(data) {
    const circle = new Circle(data.x, data.y);
    Node.fromJSON(data, circle);
    circle.radius = data.radius;
    return circle;
  }

  equals(other) {
    if (!(other instanceof Circle)) return false;
    return super.equals(other) && this.radius === other.radius;
  }
}
