import Rectangle from "../rectangle/Rectangle.js";
import Node from "../node/Node.js";

export default class BorderlessRectangle extends Rectangle {
  constructor(x = 0, y = 0) {
    super(x, y);
    this.makeInvisible();
  }

  clone() {
    const clone = new BorderlessRectangle(this.x, this.y);
    clone.width = this.width;
    clone.height = this.height;
    clone.text = this.text;
    clone.cornerRadii = this.cornerRadii;
    clone.id = this.id;
    clone.collapsed = this.collapsed;
    clone.link = this.link;
    clone.setDimensions(this.width, this.height);
    this.children.forEach((child) => {
      const childClone = child.clone();
      clone.addChildNode(childClone);
    });
    clone.makeInvisible();
    return clone;
  }

  makeInvisible() {
    this.fillColor = "#ffffff";
    this.borderColor = "#ffffff";
    this.borderWidth = 0;
  }

  setFillColor(color) {
    console.log("Fill color cannot be set.");
  }

  getClassName() {
    return "BorderlessRectangle";
  }

  toJSON() {
    return {
      ...super.toJSON(),
    };
  }

  static fromJSON(data) {
    const borderlessRectangle = new BorderlessRectangle(data.x, data.y);
    Node.fromJSON(data, borderlessRectangle);
    borderlessRectangle.width = data.width;
    borderlessRectangle.height = data.height;
    borderlessRectangle.cornerRadii = data.cornerRadii;
    borderlessRectangle.makeInvisible();
    return borderlessRectangle;
  }
}
