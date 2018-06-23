import Utils from "./../AppUtils";

// Define CanvasView
// This class holds multiple scene objects
// Renders all scenes into their respective viewports inside the canvas
export default class CanvasView {
  constructor(preRender) {
    this.scenes = [];
    this.name = "unnamed";
    // Flag that will ensure a render in the next iteration of renderLoop
    this.renderOnce = true;

    // Time at previous renderLoop was hit
    this.prevTimeStamp = -1;

    // render loop initialization flag
    this.loopStarted = false;

    this.preRender = preRender;
  }

  setName(name) {
    this.name = name;
  }

  addScene(scene, viewport) {
    this.scenes.push({
      scene,
      viewport
    });
  }

  clearScenes() {
    this.scenes = [];
  }

  sceneUpdater() {
    this.renderOnce = true;
  }

  getSceneUpdater() {
    return this.sceneUpdater.bind(this);
  }

  render() {
    const { renderOnce, scenes } = this;
    if (renderOnce) {
      if (this.preRender) {
        this.preRender();
      }
      // console.log(`rendering ${this.name}..`);
      scenes.forEach(obj => obj.scene.render(obj.viewport));
      this.renderOnce = false;
    }
  }

  renderLoop(timeStamp) {
    // console.log(timeStamp);

    // Optimize the rendering call based on checking
    // significant update in the time stamp value
    if (Math.abs(this.prevTimeStamp - timeStamp) < 20) {
      return;
    }
    this.prevTimeStamp = timeStamp;
    this.render();
  }

  start() {
    if (!this.loopStarted) {
      Utils.startRenderingLoop(this.renderLoop.bind(this));
      this.loopStarted = true;
    }
  }

  stop() {
    Utils.stopRenderingLoop();
    this.loopStarted = false;
    this.renderOnce = true;
  }
}
