import SvgCreator from "./renderer/SvgCreator.js";
import AnimationController from "./animation/AnimationController.js";
import svgManager from "../view/SvgManager.js";

export default class GraphicsEngine {
  constructor(nodeContainer, nodeController) {
    this.nodeController = nodeController;
    this.svgCreator = new SvgCreator(nodeContainer, nodeController);
    this.animationController = new AnimationController(
      this.onAnimate.bind(this)
    );
    this.start();
  }

  start() {
    this.animationController.start();
  }

  stop() {
    this.animationController.stop();
  }

  onAnimate() {
    this.clearAndRenderSvg();
  }

  clearAndRenderSvg() {
    svgManager.getSvg().selectAll("*").remove();
    this.svgCreator.drawNodes();
  }
}
