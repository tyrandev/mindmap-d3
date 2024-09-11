import MindmapLink from "../../model/links/MindmapLink.js";
import UrlLink from "../../model/links/UrlLink.js";
// Import other link types as needed

export default class LinkFactory {
  static createLinkFromJson(data) {
    switch (data.type) {
      case "MindmapLink":
        return MindmapLink.fromJSON(data);
      case "UrlLink":
        return UrlLink.fromJSON(data);
      default:
        throw new Error(`Unknown link type: ${data.type}`);
    }
  }
}
