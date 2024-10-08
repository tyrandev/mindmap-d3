import MindmapState from "../../state/MindmapState.js";

export default class JsonExporter {
  constructor(jsonMindmapSaver) {
    this.jsonMindmapSaver = jsonMindmapSaver;
  }

  exportToJson() {
    const filename = this._getFilenameForExport();
    if (!filename) return;
    const blob = this.jsonMindmapSaver.createJsonBlob();
    this._saveJsonToFile(filename, blob);
  }

  _getFilenameForExport() {
    const suggestedName = MindmapState.currentFilename || "";
    return prompt("Enter the name to export the mind map:", suggestedName);
  }

  _saveJsonToFile(filename, blob) {
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
