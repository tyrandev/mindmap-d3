import LocalStorageUIHandler from "../../gui/storage/LocalStorageUIHandler.js";
import LocalStorage from "./LocalStorage.js";
import MindmapState from "../../state/MindmapState.js";

const LOCAL_STORAGE_KEY = "mindmaps";

export default class MindmapLocalStorage {
  constructor(jsonMindmapLoader, jsonMindmapSaver) {
    this.localStorage = new LocalStorage(LOCAL_STORAGE_KEY);
    this.uiHandler = new LocalStorageUIHandler(this);
    this.jsonMindmapLoader = jsonMindmapLoader;
    this.jsonMindmapSaver = jsonMindmapSaver;
  }

  saveToLocalStorage() {
    const name = this._getFilenameForSave();
    if (!name) return;
    const json = this.jsonMindmapSaver.getSerializedJson();
    this.localStorage.saveItem(name, json);
    MindmapState.setCurrentMindmap(name, json);
    this.uiHandler.createLocalStorageList();
  }

  loadFromLocalStorage(filename) {
    const json = this.localStorage.getItem(filename);
    if (!json) throw new Error("Mindmap does not exist!");
    this.jsonMindmapLoader.importFromJsonString(json, filename);
  }

  deleteFromLocalStorage(name) {
    if (!this.localStorage.getItem(name)) {
      throw new Error("Mindmap does not exist!");
    }
    this.localStorage.deleteItem(name);
    MindmapState.clearCurrentMindmap();
    this.uiHandler.createLocalStorageList();
  }

  renameInLocalStorage(oldName, newName) {
    if (!this.localStorage.getItem(oldName)) {
      throw new Error("Mindmap does not exist!");
    }
    if (this.localStorage.getItem(newName)) {
      alert(`A mindmap with the name "${newName}" already exists.`);
      return;
    }
    this.localStorage.renameItem(oldName, newName);
    this._updateCurrentMindmapState(oldName, newName);
    this.uiHandler.createLocalStorageList();
  }

  listSavedMindMaps() {
    return this.localStorage.listItems();
  }

  _getFilenameForSave() {
    const suggestedName = MindmapState.currentFilename || "";
    return prompt("Enter the filename for the JSON file:", suggestedName);
  }

  _updateCurrentMindmapState(oldName, newName) {
    if (oldName === MindmapState.currentMindmapJson) {
      MindmapState.setCurrentMindmap(newName, MindmapState.currentMindmapJson);
    }
  }
}
