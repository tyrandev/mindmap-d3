import NodeSerializer from "../serialization/NodeSerializer.js";

export default class JsonMindmapLoader {
  constructor(rootNodeController) {
    this.rootNodeController = rootNodeController;
  }

  importFromJsonString(jsonString, filename = null) {
    try {
      this.loadFromJson(jsonString, filename);
    } catch (error) {
      throw new Error("Invalid JSON string");
    }
  }

  loadFromJson(json) {
    const rootNode = NodeSerializer.deserialize(json);
    this.rootNodeController.loadMindMap(rootNode.clone());
  }
}
