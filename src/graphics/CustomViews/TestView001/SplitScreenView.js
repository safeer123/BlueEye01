import Scene from "./../../SceneBuilder/Scene";
import SplitScreenCanvasView from "../../SceneBuilder/CustomCanvasViews/SplitScreenCanvasView";

// SplitScreenView Layer
export default class SplitScreenView extends SplitScreenCanvasView {
  constructor(canvas, preRender) {
    super(canvas, preRender);
    this.canvas = canvas;
    this.viewUpdater = this.getSceneUpdater();
  }

  updater = () => {
    if (this.viewUpdater) this.viewUpdater();
  };

  setNodeObj(nodeObj) {
    const { nodes, camLeft, camRight, initScene } = nodeObj;
    this.nodes = nodes;
    this.camLeft = camLeft;
    this.camRight = camRight;
    this.initScene = initScene;
  }

  createScene() {
    // Define left scene and right scene
    const leftScene = new Scene("LEFT_SCENE", this.updater);
    leftScene.setNodeList(this.nodes);
    const rightScene = leftScene.clone("RIGHT_SCENE");

    // Set active camera Ids
    const leftCamId = this.camLeft.getId();
    const rightCamId = this.camRight.getId();
    leftScene.setActiveCameraId(leftCamId);
    rightScene.setActiveCameraId(rightCamId);

    // Set scenes in CanvasView
    const { canvas } = this;
    this.setLeftRightScenes(leftScene, rightScene, canvas);

    this.initScene();
  }
}
