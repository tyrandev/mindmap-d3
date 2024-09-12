export default class NodeSvg {
  constructor(svg) {
    if (!svg) {
      throw new Error("SVG element is required");
    }
    this.svg = svg;
  }

  render(node) {
    return this.drawShapeWithText(node);
  }

  drawShapeWithText(node) {
    throw new Error("Method 'drawShapeWithText()' must be implemented.");
  }

  drawNodeText(node) {
    this.computeTextLines(node);
  }

  computeTextLines(node) {
    throw new Error("Method 'computeTextLines()' must be implemented.");
  }
}
