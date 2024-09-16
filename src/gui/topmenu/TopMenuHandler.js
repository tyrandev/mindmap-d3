import PdfConverter from "../../services/converter/media/PdfConverter.js";
import ImgConverter from "../../services/converter/media/ImgConverter.js";
import NodeOutlineText from "../../services/converter/text/NodeOutlineText.js";
import FileInputManager from "../../util/file/FileInputManager.js";
import MouseModeState from "../../state/MouseModeState.js";
import * as mc from "../../constants/MouseConstants.js";
import svgManager from "../../view/SvgManager.js";
import GuiDisplayUtil from "../../util/display/GuiDisplayUtil.js";
import StackEventEmitter from "../../services/event/emitter/StackEventEmitter.js";

export default class TopMenuHandler {
  constructor(
    jsonExporter,
    jsonImporter,
    mindmapLocalStorage,
    rootNodeController
  ) {
    this.rootNodeController = rootNodeController;
    this.mindmapLocalStorage = mindmapLocalStorage;
    this.modeManager = MouseModeState;
    this.jsonExporter = jsonExporter;
    this.jsonImporter = jsonImporter;
    this.initEventListeners();
  }

  initEventListeners() {
    document
      .getElementById("undo-button")
      .addEventListener("click", this.handleUndo.bind(this));
    document
      .getElementById("redo-button")
      .addEventListener("click", this.handleRedo.bind(this));
    document
      .getElementById("save-button")
      .addEventListener("click", this.handleSave.bind(this));
    document
      .getElementById("import-button")
      .addEventListener("click", this.handleImport.bind(this));
    document
      .getElementById("export-button")
      .addEventListener("click", this.handleExport.bind(this));
    document
      .getElementById("pdf-button")
      .addEventListener("click", this.handlePdfConversion.bind(this));
    document
      .getElementById("image-button")
      .addEventListener("click", this.handleImgConversion.bind(this));
    document
      .getElementById("text-button")
      .addEventListener("click", this.handleTextConversion.bind(this));
    document
      .getElementById("color-button")
      .addEventListener("click", this.handleColorMode.bind(this));
    document
      .getElementById("resize-button")
      .addEventListener("click", this.handleResizeMode.bind(this));
    document
      .getElementById("rename-button")
      .addEventListener("click", this.handleRenameMode.bind(this));
    document
      .getElementById("delete-node-button")
      .addEventListener("click", this.handleDeleteMode.bind(this));
    document
      .getElementById("normal-cursor-mode")
      .addEventListener("click", this.handleNormalMode.bind(this));
    document
      .getElementById("copy-color-button")
      .addEventListener("click", this.handleCopyColorMode.bind(this));
    document
      .getElementById("zoom-in-button")
      .addEventListener("click", this.handleZoomIn.bind(this));
    document
      .getElementById("zoom-out-button")
      .addEventListener("click", this.handleZoomOut.bind(this));
    document
      .getElementById("local-storage-button")
      .addEventListener("click", this.toggleLocalStorage.bind(this));
    document
      .getElementById("recenter-button")
      .addEventListener("click", this.handleRecenter.bind(this));
  }

  handleUndo() {
    StackEventEmitter.emit("undo");
  }

  handleRedo() {
    StackEventEmitter.emit("redo");
  }

  handleSave() {
    this.mindmapLocalStorage.saveToLocalStorage();
  }

  handleImport() {
    FileInputManager.clickFileInput();
  }

  handleExport() {
    this.jsonExporter.exportToJson();
  }

  handlePdfConversion() {
    PdfConverter.convertDivToPdf();
  }

  handleImgConversion() {
    ImgConverter.convertDivToImage();
  }

  handleTextConversion() {
    NodeOutlineText.downloadTextOutline(this.rootNodeController.getRootNode());
  }

  handleColorMode() {
    this.modeManager.setMode(mc.MOUSE_MODES.CHANGE_COLOR);
  }

  handleResizeMode() {
    this.modeManager.setMode(mc.MOUSE_MODES.RESIZE);
  }

  handleRenameMode() {
    this.modeManager.setMode(mc.MOUSE_MODES.RENAME);
  }

  handleDeleteMode() {
    this.modeManager.setMode(mc.MOUSE_MODES.DELETE);
  }

  handleNormalMode() {
    this.modeManager.setMode(mc.MOUSE_MODES.NORMAL);
  }

  handleCopyColorMode() {
    this.modeManager.setMode(mc.MOUSE_MODES.COPY_COLOR);
  }

  handleZoomIn() {
    svgManager.zoomIn();
  }

  handleZoomOut() {
    svgManager.zoomOut();
  }

  toggleLocalStorage() {
    GuiDisplayUtil.toggleStorageContainerDisplay();
  }

  handleRecenter() {
    this.rootNodeController.moveRootNodeToCenter();
  }
}
