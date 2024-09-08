import MindmapState from "../../model/mindmap/MindmapState.js";

export default class JsonExporter {
  constructor(rootNodeController) {
    this.rootNodeController = rootNodeController;
  }

  exportToJson() {
    const filename = this._getFilenameForExport();
    if (!filename) return;

    const json = this._getSerializedJson();
    this._downloadFile(filename, json);
  }

  _getFilenameForExport() {
    const suggestedName = MindmapState.currentFilename || "";
    return prompt("Enter the name to export the mind map:", suggestedName);
  }

  _getSerializedJson() {
    return this.rootNodeController.serializeRootNode();
  }

  _downloadFile(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
