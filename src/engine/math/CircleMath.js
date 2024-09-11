import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import Circle from "../../model/geometric/circle/Circle.js";

export default class CircleMath {
  static calculateConnectionPoints(thisCircle, child) {
    const dx = child.x - thisCircle.x;
    const dy = child.y - thisCircle.y;
    const angle = Math.atan2(dy, dx);

    if (child instanceof Circle) {
      return CircleMath.calculateCircleToCircleConnection(
        thisCircle,
        child,
        angle
      );
    } else if (child instanceof Rectangle) {
      return CircleMath.calculateCircleToRectangleConnection(
        thisCircle,
        child,
        angle
      );
    } else {
      throw new Error("Unknown or unsupported type of node child");
    }
  }

  static calculateCircleToCircleConnection(sourceCircle, targetCircle, angle) {
    const startEdge = CircleMath.getCircleEdge(sourceCircle, angle);
    const endEdge = CircleMath.getCircleEdge(targetCircle, angle + Math.PI);

    CircleMath.checkForNaN(startEdge);
    CircleMath.checkForNaN(endEdge);

    return {
      startX: startEdge.x,
      startY: startEdge.y,
      endX: endEdge.x,
      endY: endEdge.y,
    };
  }

  static calculateCircleToRectangleConnection(
    sourceCircle,
    targetRectangle,
    angle
  ) {
    const closestPoint = CircleMath.getClosestPointOnRectangle(
      targetRectangle,
      sourceCircle,
      angle
    );
    const startEdge = CircleMath.getCircleEdge(sourceCircle, angle);

    CircleMath.checkForNaN(startEdge);
    CircleMath.checkForNaN(closestPoint);

    return {
      startX: startEdge.x,
      startY: startEdge.y,
      endX: closestPoint.x,
      endY: closestPoint.y,
    };
  }

  static getCircleEdge(circle, angle) {
    if (!(circle instanceof Circle)) return { x: NaN, y: NaN };

    const edgeX = circle.x + Math.cos(angle) * circle.radius;
    const edgeY = circle.y + Math.sin(angle) * circle.radius;

    return { x: edgeX, y: edgeY };
  }

  static getClosestPointOnRectangle(targetRectangle, sourceCircle, angle) {
    const halfWidth = targetRectangle.width / 2;
    const halfHeight = targetRectangle.height / 2;

    const dx = sourceCircle.x - targetRectangle.x;
    const dy = sourceCircle.y - targetRectangle.y;

    let closestX, closestY;

    if (Math.abs(dx) * 3.7 > Math.abs(dy)) {
      if (dx > 0) {
        closestX = targetRectangle.x + halfWidth;
        closestY = targetRectangle.y;
      } else {
        closestX = targetRectangle.x - halfWidth;
        closestY = targetRectangle.y;
      }
    } else {
      if (dy > 0) {
        closestX = targetRectangle.x;
        closestY = targetRectangle.y + halfHeight;
      } else {
        closestX = targetRectangle.x;
        closestY = targetRectangle.y - halfHeight;
      }
    }

    return { x: closestX, y: closestY };
  }

  static calculateAngle(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);

    if (isNaN(angle)) {
      throw new Error("Calculated angle is NaN");
    }

    return angle;
  }

  static checkForNaN(point) {
    if (isNaN(point.x) || isNaN(point.y)) {
      throw new Error("Calculated point is NaN");
    }
  }
}
