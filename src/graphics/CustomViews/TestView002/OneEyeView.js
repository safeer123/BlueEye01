import getNodes from "./nodes";
import Scene from "./../../SceneBuilder/Scene";
import SingleCanvasView from "../../SceneBuilder/CustomCanvasViews/SingleCanvasView";

// OneEyeView Layer
export default class OneEyeView extends SingleCanvasView {
  constructor(canvas, preRender, inObj) {
    super(canvas, preRender);
    this.inObj = inObj;
    this.canvas = canvas;
    this.viewUpdater = this.getSceneUpdater();
    this.setName("OneEyeView");
  }

  updater = () => {
    if (this.viewUpdater) this.viewUpdater();
  };

  rebuildNodes() {
    const { nodes, oneEye, initScene } = getNodes(this.inObj);

    this.nodes = nodes;
    this.oneEye = oneEye;
    this.initScene = initScene;
  }

  createScene() {
    // Reconstruct nodes every time this methode is called
    this.rebuildNodes();

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
