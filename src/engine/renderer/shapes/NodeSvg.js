export default class NodeSvg {
  constructor(svg) {
    if (!svg) {
      throw new Error("SVG element is required");
    }
    this.svg = svg;
  }

  createSvgShapeWithText(node) {
    throw new Error("Method 'createSvgShapeWithText()' must be implemented.");
  }

  drawText(node) {
    throw new Error("Method 'drawText()' must be implemented.");
  }
}
