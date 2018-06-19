import CanvasView from "./CanvasView";
import LayoutGenerator from "./LayoutGenerator";

export default class SplitScreenCanvasView extends CanvasView {
  constructor(canvas) {
    super();
    this.updateViewports(canvas);
  }

  updateViewports(canvas) {
    const { width, height } = canvas;
    const layoutGenerator = new LayoutGenerator();
    const splitLayout = layoutGenerator.getGridLayout({
      width,
      height,
      rows: 1,
      cols: 2,
      splitterWidth: 3
    });
    this.viewportLeft = splitLayout.viewports["0-0"];
    this.viewportRight = splitLayout.viewports["0-1"];
  }

  setLeftScene(scene) {
    super.addScene(scene, this.viewportLeft);
  }

  setRightScene(scene) {
    super.addScene(scene, this.viewportRight);
  }
}
