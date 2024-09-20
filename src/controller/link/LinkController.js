import MindmapLink from "../../model/links/MindmapLink.js";
import UrlLink from "../../model/links/UrlLink.js";
import UrlTextUtil from "../../util/text/UrlTextUtil.js";

export default class LinkController {
  constructor(mindmapLocalStorage) {
    if (!mindmapLocalStorage) {
      throw new Error("MindmapLocalStorage instance is required");
    }
    this.mindmapLocalStorage = mindmapLocalStorage;
  }

  setMindmapLink(node, mindmapName) {
    if (!node) return;
    const savedMindmaps = this.mindmapLocalStorage.listSavedMindMaps();
    if (!savedMindmaps.includes(mindmapName)) {
      throw new Error(`Mindmap with the name "${mindmapName}" does not exist.`);
    }
    const mindmapLink = new MindmapLink(mindmapName);
    node.setLink(mindmapLink);
  }

  setUrlLink(node, url) {
    if (!node) return;
    if (!UrlTextUtil.isValidUrl(url)) {
      throw new Error(
        `Invalid URL: "${url}". Please provide a valid URL. It must start with https`
      );
    }
    const urlLink = new UrlLink(url);
    node.setLink(urlLink);
  }

  removeLink(node) {
    node.setLink(null);
  }
}
