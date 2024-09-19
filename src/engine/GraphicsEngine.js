import AnimationController from "./animation/AnimationController.js";
import svgView from "../view/SvgView.js";

export default class GraphicsEngine {
  constructor(nodeContainer, svgCreator) {
    this.nodeContainer = nodeContainer;
    this.svgCreator = svgCreator;
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
    this.svgCreator.drawNodes();
  }
}
