import MindmapLink from "../../model/links/MindmapLink.js";

export default class LinkController {
  constructor(mindmapLocalStorage) {
    if (!mindmapLocalStorage) {
      throw new Error("MindmapLocalStorage instance is required");
    }
    this.mindmapLocalStorage = mindmapLocalStorage;
  }

  setMindmapLink(node, mindmapName) {
    const savedMindmaps = this.mindmapLocalStorage.listSavedMindMaps();
    if (!savedMindmaps.includes(mindmapName)) {
      throw new Error(`Mindmap with the name "${mindmapName}" does not exist.`);
    }
    const mindmapLink = new MindmapLink(mindmapName);
    node.setLink(mindmapLink);
  }

  removeMindmapLink(node) {
    node.setLink(null);
  }
}
