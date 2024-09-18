import * as rc from "../../../constants/RectangleConstants.js";
import RectangleTextUtil from "../../../util/text/RectangleTextUtil.js";
import Node from "../node/Node.js";

export default class Rectangle extends Node {
  constructor(x = 0, y = 0) {
    super(x, y);
    this.additionalWidth = 0;
    this.width = rc.BASE_RECTANGLE_WIDTH;
    this.height = rc.BASE_RECTANGLE_HEIGHT;
    this.originalWidth = this.width;
    this.cornerRadii = [2];
    this.setDimensions(this.width, this.height);
  }

  clone() {
    const clone = new Rectangle(this.x, this.y);
    clone.width = this.width;
    clone.height = this.height;
    clone.text = this.text;
    clone.fillColor = this.fillColor;
    clone.borderColor = this.borderColor;
    clone.textColor = this.textColor;
    clone.borderWidth = this.borderWidth;
    clone.cornerRadii = this.cornerRadii;
    clone.id = this.id;
    clone.collapsed = this.collapsed;
    clone.link = this.link;
    clone.setDimensions(this.width, this.height);
    this.children.forEach((child) => {
      const childClone = child.clone();
      clone.addChildNode(childClone);
    });
    return clone;
  }

  get width() {
    return this.originalWidth;
  }

  set width(value) {
    this.originalWidth = value;
  }

  get actualWidth() {
    return this.originalWidth + this.additionalWidth;
  }

  validateDimensions(newWidth, newHeight) {
    const validWidth = Math.max(newWidth, rc.MIN_RECTANGLE_WIDTH);
    const validHeight = Math.max(newHeight, rc.MIN_RECTANGLE_HEIGHT);
    if (
      isNaN(validWidth) ||
      validWidth <= 0 ||
      isNaN(validHeight) ||
      validHeight <= 0
    ) {
      throw new Error("Invalid dimensions of Rectangle");
    }
    return { validWidth, validHeight };
  }

  setDimensions(newWidth, newHeight) {
    const dimensions = this.validateDimensions(newWidth, newHeight);
    if (!dimensions) return;
    this.originalWidth = dimensions.validWidth;
    this.height = dimensions.validHeight;
    this.calculateFontSize();
    this.addWidthBasedOnTextLength();
  }

  calculateFontSize() {
    let baseFontSize = this.height / 2.45;
    const k = 0.004;
    this.fontSize = baseFontSize / (1 + k * this.width);
    return this.fontSize;
  }

  setText(newText) {
    if (newText.length > rc.RECTANGLE_MAX_CHARACTERS) {
      newText = newText.substring(0, rc.RECTANGLE_MAX_CHARACTERS);
    }
    this.text = newText;
    this.addWidthBasedOnTextLength();
  }

  // TODO: this should be in svg layer
  addWidthBasedOnTextLength() {
    const numberOfLetters = RectangleTextUtil.countLettersAndNumbers(this.text);
    if (numberOfLetters < 12) {
      this.additionalWidth = 0;
    }
    this.additionalWidth = Math.max(
      0,
      (numberOfLetters - 12) * rc.PIXELS_PER_CHARACTER
    );
  }

  isPointInsideOfNode(x, y) {
    return (
      x >= this.x - this.actualWidth / 2 &&
      x <= this.x + this.actualWidth / 2 &&
      y >= this.y - this.height / 2 &&
      y <= this.y + this.height / 2
    );
  }

  getClassName() {
    return "Rectangle";
  }

  toJSON() {
    return {
      ...super.toJSON(),
      width: this.width,
      height: this.height,
      cornerRadii: this.cornerRadii,
    };
  }

  static fromJSON(data) {
    const rectangle = new Rectangle(data.x, data.y);
    Node.fromJSON(data, rectangle);
    rectangle.width = data.width;
    rectangle.height = data.height;
    rectangle.cornerRadii = data.cornerRadii;
    return rectangle;
  }

  equals(other) {
    if (!(other instanceof Rectangle)) return false;
    return (
      super.equals(other) &&
      this.width === other.width &&
      this.height === other.height
    );
  }
}
