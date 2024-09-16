import ColorHandler from "../../../util/color/ColorHandler.js";
import Link from "../../links/Link.js";

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
    this.link = null;
    this.setColorsBasedOnFillColor(this.fillColor);
  }

  getLink() {
    return this.link;
  }

  setLink(link) {
    // Ensure the link is an instance of the base Link class
    if (!(link instanceof Link)) {
      throw new Error("Expected an instance of Link.");
    }

    // If the link is a MindmapLink, handle specific attributes
    if (link instanceof MindmapLink) {
      console.log(
        "Setting a MindmapLink with attributes: ",
        link.getMindmapName()
      );
      // Set MindmapLink specific properties (if any)
      this.mindmapLinkName = link.getMindmapName(); // Example of setting mindmap name
    }

    // Handle other types of links if necessary (e.g., UrlLink)
    if (link instanceof UrlLink) {
      console.log("Setting a UrlLink with URL: ", link.getUrl());
      // Set UrlLink specific properties (if any)
      this.urlLinkUrl = link.getUrl(); // Example of setting the URL
    }

    // Finally, set the link to this node
    console.log("Link is set to: ", link);
    this.link = link;
  }

  clone() {
    throw new Error("Method 'clone()' must be implemented.");
  }

  setId(newId) {
    this.id = newId;
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
    return "Node";
  }

  toJSON() {
    console.log(`link to json:${this.link}`);
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
      link: this.link ? this.link.toJSON() : null,
    };
  }

  static fromJSON(data, node) {
    node.id = data.id;
    node.x = data.x;
    node.y = data.y;
    node.text = data.text;
    node.fillColor = data.fillColor;
    node.borderColor = data.borderColor;
    node.lineColor = data.lineColor;
    node.textColor = data.textColor;
    node.borderWidth = data.borderWidth;
    node.link = data.link;
    return node;
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
        (this.parent && other.parent && this.parent.id === other.parent.id)) &&
      (this.link === other.link ||
        (this.link && other.link && this.link.equals(other.link)))
    );
  }
}
