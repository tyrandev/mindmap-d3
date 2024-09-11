import Link from "./Link.js";

export default class MindmapLink extends Link {
  constructor(label, nodeId) {
    super(label, `node://${nodeId}`);
    this.nodeId = nodeId;
  }

  getType() {
    return "MindmapLink";
  }

  toJSON() {
    return {
      ...super.toJSON(),
      nodeId: this.nodeId,
    };
  }

  static fromJSON(json) {
    return new MindmapLink(json.label, json.nodeId);
  }
}
