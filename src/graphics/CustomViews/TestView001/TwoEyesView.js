import getNodes from "./nodes";
import Scene from "./../../SceneBuilder/Scene";
import SplitScreenCanvasView from "../../SceneBuilder/CustomCanvasViews/SplitScreenCanvasView";

// TwoEyesView Layer
export default class TwoEyesView extends SplitScreenCanvasView {
  constructor(canvas, preRender, inObj) {
    super(canvas, preRender);
    this.inObj = inObj;
    this.canvas = canvas;
    this.viewUpdater = this.getSceneUpdater();
    this.setName("TwoEyesView");
  }

  updater = () => {
    if (this.viewUpdater) this.viewUpdater();
  };

  rebuildNodes() {
    const { nodes, twoEyes, initScene } = getNodes(this.inObj);

    this.nodes = nodes;
    this.twoEyes = twoEyes;
    this.initScene = initScene;
  }

  createScene() {
    // Reconstruct nodes every time this methode is called
    this.rebuildNodes();

    // Define left scene and right scene
    const leftScene = new Scene("LEFT_EYE_SCENE", this.updater);
    leftScene.setNodeList(this.nodes);
    const rightScene = leftScene.clone("RIGHT_EYE_SCENE");

    // Set active camera Ids
    const leftCamId = this.twoEyes.getLeftCamId();
    const rightCamId = this.twoEyes.getRightCamId();
    leftScene.setActiveCameraId(leftCamId);
    rightScene.setActiveCameraId(rightCamId);

    // Set scenes in CanvasView
    const { canvas } = this;
    this.setLeftRightScenes(leftScene, rightScene, canvas);

    this.initScene();
  }
}
