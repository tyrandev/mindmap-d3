import LocalStorageUIHandler from "../../gui/storage/LocalStorageUIHandler.js";
import LocalStorage from "./LocalStorage.js";
import MindmapState from "../../state/MindmapState.js";
import JsonMindmapLoader from "../serialization/JsonMindmapLoader.js";

const LOCAL_STORAGE_KEY = "mindmaps";

export default class MindmapLocalStorage {
  constructor(rootNodeController) {
    this.rootNodeController = rootNodeController;
    this.localStorage = new LocalStorage(LOCAL_STORAGE_KEY);
    this.uiHandler = new LocalStorageUIHandler(this);
    this.jsonMindmapLoader = new JsonMindmapLoader(this.rootNodeController);
  }

  saveToLocalStorage() {
    const name = this._getFilenameForSave();
    if (!name) return;
    const json = this._getSerializedJson();
    this.localStorage.saveItem(name, json);
    // MindmapState.setCurrentMindmap(name, json);
    this.uiHandler.createLocalStorageList();
    console.log(json);
  }

  loadFromLocalStorage(name) {
    const json = this.localStorage.getItem(name);
    if (!json) {
      throw new Error("Mindmap does not exist!");
    }
    console.log(json);
    this.jsonMindmapLoader.importFromJsonString(json);
    // MindmapState.setCurrentMindmap(name, json);
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
    // if (oldName == MindmapState.currentMindmapJson) {
    //   MindmapState.setCurrentMindmap(newName, MindmapState.currentMindmapJson);
    // }
    this.uiHandler.createLocalStorageList();
  }

  listSavedMindMaps() {
    return this.localStorage.listItems();
  }

  _getSerializedJson() {
    return this.rootNodeController.serializeRootNode();
  }

  _getFilenameForSave() {
    // const suggestedName = MindmapState.currentFilename || "";
    const suggestedName = "mindmap";
    return prompt("Enter the filename for the JSON file:", suggestedName);
  }
}
