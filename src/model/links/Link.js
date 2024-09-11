export default class Link {
  constructor() {
    this.label = "Link";
    if (new.target === Link) {
      throw new Error("Cannot instantiate an abstract class.");
    }
  }

  getType() {
    throw new Error("Method 'getType()' must be implemented.");
  }

  getLabel() {
    return this.label;
  }

  setLabel(newLabel) {
    this.label = newLabel;
  }

  toJSON() {
    return {
      label: this.label,
      type: this.getType(),
    };
  }

  static fromJSON(json) {
    throw new Error(
      "Static method 'fromJSON()' must be implemented in derived classes."
    );
  }
}
