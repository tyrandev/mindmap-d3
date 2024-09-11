import ColorHandler from "../../../util/color/ColorHandler.js";

export default class Node {
  constructor(x = 0, y = 0) {
    if (new.target === Node) {
      throw new Error("Cannot instantiate an abstract class.");
    }
    this.id = 0;
    this.x = x;
    this.y = y;
    this.text = "New Node";
    this.fillColor = "#FFFFE0";
    this.borderColor = "black";
    this.lineColor = "black";
    this.textColor = "black";
    this.fontSize = 12;
    this.borderWidth = 1;
    this.collapsed = null;
    this.children = [];
    this.parent = null;
    this.setColorsBasedOnFillColor(this.fillColor);
  }

  clone() {
    throw new Error("Method 'clone()' must be implemented.");
  }

  setId(newId) {
    this.id = newId;
  }

  async toggleCollapse() {
    if (!this.hasChildren()) return;
    const { default: CollapseIndicator } = await import(
      "../../indicators/CollapseIndicator.js"
    );
    if (!this.collapsed) {
      this.collapsed = new CollapseIndicator();
    } else {
      this.collapsed = null;
    }
  }

  isCollapsed() {
    return this.collapsed;
  }

  hasChildren() {
    return this.children.length > 0;
  }

  getText() {
    return this.text;
  }

  setLineColor(newColor) {
    this.lineColor = newColor;
  }

  getLineColor() {
    return this.lineColor;
  }

  setBorderColor(newColor) {
    this.borderColor = newColor;
  }

  getBorderColor() {
    return this.borderColor;
  }

  getFillColor() {
    return this.fillColor;
  }

  setFillColor(newColor) {
    this.fillColor = newColor;
    this.setColorsBasedOnFillColor(newColor);
  }

  setColorsBasedOnFillColor(newColor) {
    const darkenedColor = ColorHandler.darkenColor(newColor, 40);
    this.setBorderColor(darkenedColor);
    this.setLineColor(darkenedColor);
  }

  hasCollapsedAncestor() {
    let currentNode = this;
    while (currentNode.parent) {
      if (currentNode.parent.collapsed) {
        return true;
      }
      currentNode = currentNode.parent;
    }
    return false;
  }

  actualiseText() {
    this.setText(this.text);
  }

  setText(newText) {
    throw new Error("Method 'setText()' must be implemented.");
  }

  addChildNode(child) {
    this.children.push(child);
    child.parent = this;
  }

  removeChildNode(child) {
    this.children = this.children.filter((node) => node !== child);
    child.parent = null;
  }

  isPointInsideOfNode(x, y) {
    throw new Error("Method 'isPointInsideOfNode()' must be implemented.");
  }

  getClassName() {
    // return this.constructor.name;
    return "Node";
  }

  toJSON() {
    return {
      type: this.getClassName(),
      id: this.id,
      x: this.x,
      y: this.y,
      text: this.text,
      fillColor: this.fillColor,
      borderColor: this.borderColor,
      lineColor: this.lineColor,
      textColor: this.textColor,
      borderWidth: this.borderWidth,
      collapsed: this.collapsed ? this.collapsed.toJSON() : null,
      children: this.children.map((child) => child.toJSON()),
    };
  }

  static fromJSON(data, nodeInstance) {
    nodeInstance.id = data.id;
    nodeInstance.x = data.x;
    nodeInstance.y = data.y;
    nodeInstance.text = data.text;
    nodeInstance.fillColor = data.fillColor;
    nodeInstance.borderColor = data.borderColor;
    nodeInstance.lineColor = data.lineColor;
    nodeInstance.textColor = data.textColor;
    nodeInstance.borderWidth = data.borderWidth;

    return nodeInstance;
  }

  equals(other) {
    if (!(other instanceof Node)) return false;
    return (
      this.x === other.x &&
      this.y === other.y &&
      this.text === other.text &&
      this.fillColor === other.fillColor &&
      this.collapsed === other.collapsed &&
      (this.parent === other.parent ||
        (this.parent && other.parent && this.parent.id === other.parent.id))
    );
  }
}
