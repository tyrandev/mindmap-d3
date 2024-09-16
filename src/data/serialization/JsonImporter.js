import fileInputManager from "../../util/file/FileInputManager.js";

export default class JsonImporter {
  constructor(jsonMindmapLoader) {
    this.jsonMindmapLoader = jsonMindmapLoader;
    this.setupFileInput();
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
    if (file) {
      this.importFromFile(file);
    }
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
}
