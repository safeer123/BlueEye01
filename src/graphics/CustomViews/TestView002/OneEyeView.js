import Scene from "./../../SceneBuilder/Scene";
import SingleCanvasView from "../../SceneBuilder/CustomCanvasViews/SingleCanvasView";

// OneEyeView Layer
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
    const { nodes, oneEye, initScene } = nodeObj;
    this.nodes = nodes;
    this.oneEye = oneEye;
    this.initScene = initScene;
  }

  createScene() {
    // Define scene
    const scene = new Scene("ONE_EYE_SCENE", this.updater);
    scene.setNodeList(this.nodes);

    // Set active camera Ids
    const camId = this.oneEye.getCamId();
    scene.setActiveCameraId(camId);

    // Set scenes in CanvasView
    const { canvas } = this;
    this.setSingleScene(scene, canvas);

    this.initScene();
  }
}
