import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import Circle from "../../model/geometric/circle/Circle.js";

export default class RectangleMath {
  static adjustRadii(width, height, radii) {
    let [radius] = radii;

    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;

    return [radius];
  }

  static getRectangleMiddleSide(dx, dy, width, height, x, y) {
    const rectHalfWidth = width / 2;
    const rectHalfHeight = height / 2;

    let edgeX, edgeY;

    // Adjust the multiplier (e.g., 1.5) to favor horizontal connections
    if (Math.abs(dx) * 1.49 > Math.abs(dy)) {
      // Connect to the left or right side
      if (dx > 0) {
        edgeX = x + rectHalfWidth;
        edgeY = y;
      } else {
        edgeX = x - rectHalfWidth;
        edgeY = y;
      }
    } else {
      // Connect to the top or bottom side
      if (dy > 0) {
        edgeX = x;
        edgeY = y + rectHalfHeight;
      } else {
        edgeX = x;
        edgeY = y - rectHalfHeight;
      }
    }

    RectangleMath.checkForNaN({ x: edgeX, y: edgeY });
    return { x: edgeX, y: edgeY };
  }

  static getCircleEdge(circle, angle) {
    if (!(circle instanceof Circle)) return;
    const edgeX = circle.x - Math.cos(angle) * circle.radius;
    const edgeY = circle.y - Math.sin(angle) * circle.radius;

    RectangleMath.checkForNaN({ x: edgeX, y: edgeY });
    return { x: edgeX, y: edgeY };
  }

  static calculateRectangleToCircleConnection(sourceRectangle, targetCircle) {
    if (!(sourceRectangle instanceof Rectangle)) return;
    if (!(targetCircle instanceof Circle)) return;

    const dx = targetCircle.x - sourceRectangle.x;
    const dy = targetCircle.y - sourceRectangle.y;
    const angle = Math.atan2(dy, dx);

    const rectEdge = RectangleMath.getRectangleMiddleSide(
      dx,
      dy,
      sourceRectangle.actualWidth,
      sourceRectangle.height,
      sourceRectangle.x,
      sourceRectangle.y
    );

    const circleEdge = RectangleMath.getCircleEdge(targetCircle, angle);

    return {
      startX: rectEdge.x,
      startY: rectEdge.y,
      endX: circleEdge.x,
      endY: circleEdge.y,
    };
  }

  static calculateRectangleToRectangleConnection(
    sourceRectangle,
    targetRectangle
  ) {
    if (!(sourceRectangle instanceof Rectangle)) return;
    if (!(targetRectangle instanceof Rectangle)) return;

    const dx = targetRectangle.x - sourceRectangle.x;
    const dy = targetRectangle.y - sourceRectangle.y;

    const startEdge = RectangleMath.getRectangleMiddleSide(
      dx,
      dy,
      sourceRectangle.actualWidth,
      sourceRectangle.height,
      sourceRectangle.x,
      sourceRectangle.y
    );

    const endEdge = RectangleMath.getRectangleMiddleSide(
      -dx,
      -dy,
      targetRectangle.actualWidth,
      targetRectangle.height,
      targetRectangle.x,
      targetRectangle.y
    );

    return {
      startX: startEdge.x,
      startY: startEdge.y,
      endX: endEdge.x,
      endY: endEdge.y,
    };
  }

  static checkForNaN(point) {
    if (isNaN(point.x) || isNaN(point.y)) {
      throw new Error(
        `Calculated point contains NaN values: x=${point.x}, y=${point.y}`
      );
    }
  }
}
