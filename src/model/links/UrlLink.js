import Link from "./Link.js";

export default class UrlLink extends Link {
  constructor(url) {
    super();
    this.url = url;
    this.label = "Url Link";
  }

  getType() {
    return "UrlLink";
  }

  setUrl(url) {
    this.url = url;
  }

  getUrl() {
    return this.url;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      url: this.url,
    };
  }

  static fromJSON(json) {
    const urlLink = new UrlLink(json.url);
    urlLink.setLabel(json.label);
    return urlLink;
  }
}
