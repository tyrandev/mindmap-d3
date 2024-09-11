export default class Link {
  constructor(label, url) {
    if (new.target === Link) {
      throw new Error("Cannot instantiate an abstract class.");
    }
    this.label = label || "Link";
    this.url = url || "";
  }

  setLabel(label) {
    this.label = label;
  }

  getLabel() {
    return this.label;
  }

  setUrl(url) {
    this.url = url;
  }

  getUrl() {
    return this.url;
  }

  // Abstract method for specific link type
  getType() {
    throw new Error("Method 'getType()' must be implemented.");
  }

  toJSON() {
    return {
      label: this.label,
      url: this.url,
      type: this.getType(),
    };
  }

  static fromJSON(json) {
    throw new Error(
      "Static method 'fromJSON()' must be implemented in derived classes."
    );
  }
}
