export default class JsonMindmapSaver {
  constructor(rootNodeController) {
    this.rootNodeController = rootNodeController;
  }

  getSerializedJson() {
    return this.rootNodeController.serializeRootNode();
  }

  createJsonBlob() {
    const json = this.getSerializedJson();
    return new Blob([json], { type: "application/json" });
  }
}
