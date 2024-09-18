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
import JsonMindmapSaver from "../data/serialization/JsonMindmapSaver";
import JsonMindmapLoader from "../data/serialization/JsonMindmapLoader.js";
import JsonExporter from "../data/serialization/JsonExporter.js";
import JsonImporter from "../data/serialization/JsonImporter.js";
import SvgCreator from "../engine/renderer/SvgCreator.js";

export default class SystemCore {
  startApplication() {
    this.initializeControllers();
    this.initializeJson();
    this.initializeStorage();
    this.initializeEventAttachers();
    this.initializeEngine();
    Session.initialize();
    this.initializeHandlers();
  }

  initializeControllers() {
    this.nodeContainer = new NodeContainer();
    this.controllerCore = new ControllerCore(this.nodeContainer);
  }

  initializeJson() {
    const rootController = this.controllerCore.getRootNodeController();
    this.jsonMindmapLoader = new JsonMindmapLoader(rootController);
    this.jsonMindmapSaver = new JsonMindmapSaver(rootController);
    this.jsonImporter = new JsonImporter(this.jsonMindmapLoader);
    this.jsonExporter = new JsonExporter(this.jsonMindmapSaver);
  }

  initializeStorage() {
    this.mindmapLocalStorage = new MindmapLocalStorage(
      this.jsonMindmapLoader,
      this.jsonMindmapSaver
    );
    this.linkController = new LinkController(this.mindmapLocalStorage);
  }

  initializeEventAttachers() {
    const svg = svgManager.getSvg();
    this.nodeEventAttacher = new NodeEventAttacher(
      svg,
      this.controllerCore,
      this.linkController
    );
    this.svgEventAttacher = new SvgEventAttacher(svg, this.controllerCore);
    this.svgEventAttacher.attachEventListeners();
  }

  initializeEngine() {
    this.svgCreator = new SvgCreator(
      this.nodeContainer,
      this.nodeEventAttacher
    );
    this.graphicsEngine = new GraphicsEngine(
      this.nodeContainer,
      this.svgCreator
    );
  }

  initializeHandlers() {
    this.dragAndDropHandler = new DragAndDropHandler();
    this.keyboardHandler = new KeyboardHandler(
      this.controllerCore,
      this.mindmapLocalStorage
    );
    this.topMenuHandler = new TopMenuHandler(
      this.jsonExporter,
      this.jsonImporter,
      this.mindmapLocalStorage,
      this.rootNodeController
    );
  }
}
