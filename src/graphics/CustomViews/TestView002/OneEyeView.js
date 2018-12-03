import Scene from "./../../SceneBuilder/Scene";
import SingleCanvasView from "../../SceneBuilder/CustomCanvasViews/SingleCanvasView";
import EventEmitter from "../../lib/EventEmitter";
import { EventName } from "../../../constants/Events";

// OneEyeView Layer
export default class OneEyeView extends SingleCanvasView {
  constructor(canvas, preRender) {
    super(canvas, preRender);
    this.canvas = canvas;
  }

  onEnter() {
    EventEmitter.emit(EventName.ToggleControlEnableFlag, {
      id: this.oneEye.Id,
      flag: true
    });
  }

  onExit() {
    EventEmitter.emit(EventName.ToggleControlEnableFlag, {
      id: this.oneEye.Id,
      flag: false
    });
  }

  setNodeObj(nodeObj) {
    const { nodes, oneEye, initScene } = nodeObj;
    this.nodes = nodes;
    this.oneEye = oneEye;
    this.initScene = initScene;
  }

  createScene() {
    // Define scene
    const scene = new Scene("ONE_EYE_SCENE");
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
