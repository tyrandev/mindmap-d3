import NodeSerializer from "../serialization/NodeSerializer.js";

export default class JsonMindmapLoader {
  constructor(rootNodeController) {
    this.rootNodeController = rootNodeController;
  }

  loadFromJson(json) {
    const rootNode = NodeSerializer.deserialize(json);
    this.rootNodeController.loadMindMap(rootNode);
  }
}
