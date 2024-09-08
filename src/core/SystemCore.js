import svgManager from "../view/SvgManager.js";
import NodeContainer from "../model/geometric/node/NodeContainer.js";
import GraphicsEngine from "../engine/GraphicsEngine.js";
import NodeController from "../controller/node/NodeController.js";
import DragAndDropHandler from "../util/file/DragAndDropHandler.js";
import MindmapLocalStorage from "../data/persistence/MindmapLocalStorage.js";
import KeyboardHandler from "../input/keyboard/KeyboardHandler.js";
import TopMenuHandler from "../gui/topmenu/TopMenuHandler.js";
import SvgEventAttacher from "../services/event/attacher/SvgEventAttacher.js";
import NodeEventAttacher from "../services/event/attacher/NodeEventAttacher.js";
import Session from "../state/Session.js";

export default class SystemCore {
  startApplication() {
    this.initializeControllers();
    this.initializeEventAttachers();
    this.initializeEngine();
    this.initializeHandlers();
    Session.initialize();
  }

  initializeControllers() {
    this.nodeContainer = new NodeContainer();
    this.nodeController = new NodeController(this.nodeContainer);
    this.mindmapLocalStorage = new MindmapLocalStorage(this.nodeController);
  }

  initializeEventAttachers() {
    const svg = svgManager.getSvg();
    this.nodeEventAttacher = new NodeEventAttacher(svg, this.nodeController);
    this.svgEventAttacher = new SvgEventAttacher(svg, this.nodeController);
    this.svgEventAttacher.attachEventListeners();
  }

  initializeEngine() {
    this.graphicsEngine = new GraphicsEngine(
      this.nodeContainer,
      this.nodeEventAttacher
    );
  }

  initializeHandlers() {
    this.dragAndDropHandler = new DragAndDropHandler();
    this.keyboardHandler = new KeyboardHandler(
      this.nodeController,
      this.mindmapLocalStorage
    );
    this.topMenuHandler = new TopMenuHandler(
      this.nodeController,
      this.mindmapLocalStorage
    );
  }
}
