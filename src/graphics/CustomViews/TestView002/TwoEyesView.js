import Scene from "./../../SceneBuilder/Scene";
import SplitScreenCanvasView from "../../SceneBuilder/CustomCanvasViews/SplitScreenCanvasView";
import EventEmitter from "../../lib/EventEmitter";
import { EventName } from "../../../constants/Events";

// TwoEyesView Layer
export default class TwoEyesView extends SplitScreenCanvasView {
  constructor(canvas, preRender) {
    super(canvas, preRender);
    this.canvas = canvas;
  }

  setNodeObj(nodeObj) {
    const { nodes, twoEyes, initScene } = nodeObj;
    this.nodes = nodes;
    this.twoEyes = twoEyes;
    this.initScene = initScene;
  }

  switchPairMode = mode => {
    EventEmitter.emit(EventName.TogglePairMode, { mode });
  };

  onEnter() {
    this.switchPairMode(true);
  }

  onExit() {
    this.switchPairMode(false);
  }

  createScene() {
    // Define left scene and right scene
    const leftScene = new Scene("LEFT_EYE_SCENE");
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
