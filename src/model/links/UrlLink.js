import Link from "./Link.js";

export default class UrlLink extends Link {
  constructor(label, url) {
    super(label, url);
  }

  getType() {
    return "UrlLink";
  }

  static fromJSON(json) {
    return new UrlLink(json.label, json.url);
  }
}
