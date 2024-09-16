class FileInputManager {
  constructor() {
    if (!FileInputManager.instance) {
      this.fileInput = document.createElement("input");
      this.fileInput.type = "file";
      this.fileInput.accept = ".json";
      this.fileInput.style.display = "none";
      document.body.appendChild(this.fileInput);
      FileInputManager.instance = this;
    }
    return FileInputManager.instance;
  }

  getFileInput() {
    return this.fileInput;
  }

  clickFileInput() {
    const fileInput = this.getFileInput();
    if (!fileInput) throw new Error("File input element not found");
    fileInput.click();
  }
}

const instance = new FileInputManager();
Object.freeze(instance);

export default instance;
