export default class NodeSvg {
  constructor(svg) {
    if (!svg) {
      throw new Error("SVG element is required");
    }
    this.svg = svg;
  }

  getSvgNode(node) {
    return this.createSvgShapeWithText(node);
  }

  createSvgShapeWithText(node) {
    throw new Error("Method 'createSvgShapeWithText()' must be implemented.");
  }

  drawNodeText(node) {
    this.computeTextLines(node);
  }

  computeTextLines(node) {
    throw new Error("Method 'computeTextLines()' must be implemented.");
  }
}
