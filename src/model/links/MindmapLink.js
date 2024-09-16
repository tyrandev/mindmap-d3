import Link from "./Link.js";

export default class MindmapLink extends Link {
  constructor(mindmapName) {
    super();
    this.label = "Mindmap Link";
    this.mindmapName = mindmapName || "";
  }

  getType() {
    return "MindmapLink";
  }

  setMindmapName(newMindmapName) {
    this.mindmapName = newMindmapName;
  }

  getMindmapName() {
    return this.mindmapName;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      mindmapName: this.mindmapName,
    };
  }

  static fromJSON(json) {
    // Ensure the instance is created using 'new'
    const mindmapLink = new MindmapLink(json.mindmapName);
    mindmapLink.setLabel(json.label);
    return mindmapLink;
  }
}
