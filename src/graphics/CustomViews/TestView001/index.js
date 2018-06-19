import renderConfigNoLight from "../../ObjectGroup3D/renderConfig";
import renderConfigLight from "../../ObjectGroup3D/renderConfigLight";
import GraphicsLayer from "../../lib/GraphicsLayer";
import UserControl from "../../lib/UserControl";

import Scene from "./../../SceneBuilder/Scene";
import SplitScreenCanvasView from "./../../SceneBuilder/SplitScreenCanvasView";

import getNodes from "./nodes";

// WorldScene0 Layer
export default class TestView001 extends GraphicsLayer {
  // Construct canvas and webgl context
  constructor(wrapperElem) {
    super(wrapperElem);
    const { canvas } = this;
    this.userControl = new UserControl(this.sceneUpdater);
    this.view = new SplitScreenCanvasView(canvas);
  }

  sceneUpdater = displayOutList => {
    if (
      displayOutList &&
      displayOutList.length > 0 &&
      this.stateUpdateHandler
    ) {
      this.stateUpdateHandler(displayOutList, 5);
    }
    if (this.viewUpdater) this.viewUpdater();
  };

  rebuildNodes() {
    const { gl, shaderFac: { shaderPrograms }, userControl } = this;
    this.viewUpdater = this.view.getSceneUpdater();
    const inObj = {
      gl,
      shaderPrograms,
      renderConfigLight,
      renderConfigNoLight,
      userControl
    };
    const { nodes, camLeft, camRight } = getNodes(inObj);

    this.nodes = nodes;
    this.camLeft = camLeft;
    this.camRight = camRight;
  }

  createScene() {
    // Reconstruct nodes every time this methode is called
    this.rebuildNodes();

    // Define left scene and right scene
    const leftScene = new Scene("LEFT_SCENE", this.sceneUpdater);
    leftScene.setNodeList(this.nodes);
    const rightScene = leftScene.clone("RIGHT_SCENE");

    // Set active camera Ids
    const leftCamId = this.camLeft.getId();
    const rightCamId = this.camRight.getId();
    leftScene.setActiveCameraId(leftCamId);
    rightScene.setActiveCameraId(rightCamId);

    // Set scenes in CanvasView
    const { view, canvas } = this;
    view.updateViewports(canvas);
    view.setLeftScene(leftScene);
    view.setRightScene(rightScene);

    // init render loop
    view.initLoop();
  }
}
