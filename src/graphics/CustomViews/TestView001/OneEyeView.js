import SingleCanvasView from "../../SceneBuilder/CustomCanvasViews/SingleCanvasView";
import Scene from "./../../SceneBuilder/Scene";

export default class OneEyeView extends SingleCanvasView {
  constructor(canvas, preRender) {
    super(canvas, preRender);
    this.canvas = canvas;
    this.viewUpdater = this.getSceneUpdater();
  }

  updater = () => {
    if (this.viewUpdater) this.viewUpdater();
  };

  setNodeObj(nodeObj) {
    const { nodes, oneEyeCam, initScene } = nodeObj;
    this.nodes = nodes;
    this.oneEyeCam = oneEyeCam;
    this.initScene = initScene;
  }

  createScene() {
    // Define scene and right scene
    const scene = new Scene("MAIN_SCENE", this.updater);
    scene.setNodeList(this.nodes);

    // Set active camera Ids
    const mainCamId = this.oneEyeCam.getCamId();
    scene.setActiveCameraId(mainCamId);

    // Set scenes in CanvasView
    const { canvas } = this;
    this.setSingleScene(scene, canvas);

    this.initScene();
  }
}
