import fileInputManager from "../../util/file/FileInputManager.js";
import JsonMindmapLoader from "./JsonMindmapLoader.js";

export default class JsonImporter {
  constructor(rootNodeController) {
    this.rootNodeController = rootNodeController;
    this.jsonMindmapLoader = new JsonMindmapLoader(rootNodeController);
    this.setupFileInput();
    this._initializeEventListeners();
  }

  setupFileInput() {
    this.fileInput = fileInputManager.getFileInput();
    this.fileInput.addEventListener(
      "change",
      this.handleFileInputChange.bind(this)
    );
  }

  handleFileInputChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    this.importFromFile(file).catch((error) => {
      console.error("Error loading JSON:", error);
    });
  }

  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target.result;
          this.jsonMindmapLoader.loadFromJson(json, file.name);
          resolve({ json, filename: file.name });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  _initializeEventListeners() {
    document.addEventListener("fileLoaded", (event) => {
      const { json, filename } = event.detail;
      this.jsonMindmapLoader.importFromJsonString(json, filename);
    });
  }
}
