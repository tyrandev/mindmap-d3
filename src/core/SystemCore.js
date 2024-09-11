import svgManager from "../view/SvgManager.js";
import NodeContainer from "../model/geometric/node/NodeContainer.js";
import GraphicsEngine from "../engine/GraphicsEngine.js";
import ControllerCore from "./controller/ControllerCore.js";
import DragAndDropHandler from "../util/file/DragAndDropHandler.js";
import MindmapLocalStorage from "../data/persistence/MindmapLocalStorage.js";
import KeyboardHandler from "../input/keyboard/KeyboardHandler.js";
import TopMenuHandler from "../gui/topmenu/TopMenuHandler.js";
import SvgEventAttacher from "../services/event/attacher/SvgEventAttacher.js";
import NodeEventAttacher from "../services/event/attacher/NodeEventAttacher.js";
import Session from "../state/Session.js";
import LinkController from "../controller/link/LinkController.js";

export default class SystemCore {
  startApplication() {
    this.initializeControllers();
    this.initializeEventAttachers();
    this.initializeEngine();
    Session.initialize();
    this.initializeHandlers();
  }

  initializeControllers() {
    this.nodeContainer = new NodeContainer();
    this.controllerCore = new ControllerCore(this.nodeContainer);
    this.mindmapLocalStorage = new MindmapLocalStorage(
      this.controllerCore.getRootNodeController()
    );
    this.linkController = new LinkController(this.mindmapLocalStorage);
  }

  initializeEventAttachers() {
    const svg = svgManager.getSvg();
    this.nodeEventAttacher = new NodeEventAttacher(svg, this.controllerCore);
    this.svgEventAttacher = new SvgEventAttacher(svg, this.controllerCore);
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
      this.controllerCore,
      this.mindmapLocalStorage
    );
    this.topMenuHandler = new TopMenuHandler(
      this.controllerCore,
      this.mindmapLocalStorage
    );
  }
}
