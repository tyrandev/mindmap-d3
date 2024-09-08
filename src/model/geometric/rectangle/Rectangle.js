import Node from "../node/Node.js";
import * as rc from "../../../constants/RectangleConstants.js";

export default class Rectangle extends Node {
  constructor(x = 0, y = 0) {
    super(x, y);
    this.additionalWidth = 0;
    this.width = rc.BASE_RECTANGLE_WIDTH;
    this.height = rc.BASE_RECTANGLE_HEIGHT;
    this.originalWidth = this.width;
    this.cornerRadii = [2, 2, 2, 2]; // [top-left, top-right, bottom-right, bottom-left]
    this.setText(this.text);
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
    clone.borderWidth = 1;
    clone.cornerRadii = this.cornerRadii;
    clone.id = this.id;
    clone.collapsed = this.collapsed;
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
    this.addWidthBasedOnTextLength();
    this.calculateFontSize();
  }

  get actualWidth() {
    return this.originalWidth + this.additionalWidth;
  }

  setDimensions(newWidth, newHeight) {
    this.originalWidth = newWidth;
    this.height = newHeight;
    this.addWidthBasedOnTextLength();
    this.calculateFontSize();
  }

  addWidthBasedOnTextLength() {
    const countLettersAndNumbers = this.text.replace(
      /[^a-zA-Z0-9]/g,
      ""
    ).length;
    if (countLettersAndNumbers > 12) {
      this.additionalWidth = Math.max(
        0,
        (countLettersAndNumbers - 12) * rc.PIXELS_PER_CHARACTER
      );
      console.log("additional width: ", this.additionalWidth);
    } else {
      this.additionalWidth = 0;
    }
  }

  calculateFontSize() {
    let baseFontSize = this.height / 2.45;
    const k = 0.004;
    this.fontSize = baseFontSize / (1 + k * this.width);
    return this.fontSize;
  }

  isPointInsideOfNode(x, y) {
    return (
      x >= this.x - this.actualWidth / 2 &&
      x <= this.x + this.actualWidth / 2 &&
      y >= this.y - this.height / 2 &&
      y <= this.y + this.height / 2
    );
  }

  setText(newText) {
    if (newText.length > rc.RECTANGLE_MAX_CHARACTERS) {
      newText = newText.substring(0, rc.RECTANGLE_MAX_CHARACTERS);
    }
    this.text = newText;
    this.addWidthBasedOnTextLength();
    this.calculateFontSize();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      width: this.width,
      height: this.height,
      cornerRadii: this.cornerRadii,
    };
  }

  equals(other) {
    if (!(other instanceof Rectangle)) {
      return false;
    }

    return (
      super.equals(other) &&
      this.width === other.width &&
      this.height === other.height &&
      this.cornerRadii.every((r, i) => r === other.cornerRadii[i])
    );
  }
}
