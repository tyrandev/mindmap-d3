import MindmapLink from "../../model/links/MindmapLink.js";
import UrlLink from "../../model/links/UrlLink.js";

export default class LinkFactory {
  // Create links from JSON by instantiating the proper link based on type
  static createLinkFromJson(data) {
    switch (data.type) {
      case "MindmapLink":
        // Use the 'new' operator to create a MindmapLink and set properties
        const mindmapLink = new MindmapLink(data.mindmapName);
        mindmapLink.setLabel(data.label || "Mindmap Link");
        return mindmapLink;
      case "UrlLink":
        // Use the 'new' operator to create a UrlLink and set properties
        const urlLink = new UrlLink(data.url);
        urlLink.setLabel(data.label || "URL Link");
        return urlLink;

      default:
        throw new Error(`Unknown link type: ${data.type}`);
    }
  }

  // New method to create a MindmapLink using the 'new' operator
  static createMindmapLink(mindmapName, label = "Mindmap Link") {
    const mindmapLink = new MindmapLink(mindmapName);
    mindmapLink.setLabel(label);
    return mindmapLink;
  }

  // New method to create a UrlLink using the 'new' operator
  static createUrlLink(url, label = "URL Link") {
    const urlLink = new UrlLink(url);
    urlLink.setLabel(label);
    return urlLink;
  }
}
