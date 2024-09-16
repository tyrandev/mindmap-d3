import NodeSerializer from "../serialization/NodeSerializer.js";
import MindmapState from "../../state/MindmapState";

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

  loadFromJson(json, filename) {
    const rootNode = NodeSerializer.deserialize(json);
    this.rootNodeController.loadMindMap(rootNode.clone());
    MindmapState.setCurrentMindmap(filename, json);
  }
}
