import getNodes from "./nodes";
import Scene from "./../../SceneBuilder/Scene";
import SplitScreenCanvasView from "./../../SceneBuilder/SplitScreenCanvasView";

// WorldScene0 Layer
export default class TestView001 extends SplitScreenCanvasView {
  constructor(canvas, preRender, inObj) {
    super(canvas, preRender);
    this.inObj = inObj;
    this.canvas = canvas;
    this.viewUpdater = this.getSceneUpdater();
  }

  updater = () => {
    if (this.viewUpdater) this.viewUpdater();
  };

  rebuildNodes() {
    const { nodes, camLeft, camRight, initAnimation } = getNodes(this.inObj);

    this.nodes = nodes;
    this.camLeft = camLeft;
    this.camRight = camRight;
    this.initAnimation = initAnimation;
  }

  createScene() {
    // Reconstruct nodes every time this methode is called
    this.rebuildNodes();

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

    // init render loop
    this.initLoop();

    this.initAnimation();
  }
}
