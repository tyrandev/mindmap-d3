import svgManager from "../view/SvgManager.js";
import OSUtil from "../util/os/OSUtil.js";
import BrowserUtil from "../util/browser/BrowserUtil.js";
import NodeContainer from "../model/geometric/node/NodeContainer.js";
import GraphicsEngine from "../engine/GraphicsEngine.js";
import NodeController from "../controller/NodeController.js";
import DragAndDropHandler from "../util/file/DragAndDropHandler.js";
import MindmapLocalStorage from "../data/persistence/MindmapLocalStorage.js";
import KeyboardHandler from "../input/keyboard/KeyboardHandler.js";
import TopMenuHandler from "../gui/topmenu/TopMenuHandler.js";
import SvgEventAttacher from "../services/event/SvgEventAttacher.js";
import NodeEventAttacher from "../services/event/NodeEventAttacher.js";

export default class SystemCore {
  startApplication() {
    console.log(OSUtil.getOS());
    console.log(BrowserUtil.getBrowser());
    console.log(svgManager.getSvg());
    this.initializeControllers();
    this.initilizeEventAttachers();
    this.initializeEngine();
    this.initializeHandlers();
  }

  initializeControllers() {
    this.nodeContainer = new NodeContainer();
    this.nodeController = new NodeController(this.nodeContainer);
    this.mindmapLocalStorage = new MindmapLocalStorage(this.nodeController);
  }

  initializeHandlers() {
    this.dragAndDropHandler = new DragAndDropHandler();
    this.keyboardHandler = new KeyboardHandler(this);
    this.topMenuHandler = new TopMenuHandler(this);
  }

  initializeEngine() {
    this.graphicsEngine = new GraphicsEngine(
      this.nodeContainer,
      this.nodeEventAttacher
    );
  }

  initilizeEventAttachers() {
    const svg = svgManager.getSvg();
    console.log("SVG found, attaching event listeners.");
    this.svgEventAttacher = new SvgEventAttacher(svg, this.nodeController);
    this.svgEventAttacher.attachEventListeners();
    this.nodeEventAttacher = new NodeEventAttacher(svg, this.nodeController);
  }
}
