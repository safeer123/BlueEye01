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
    const {
      nodeObj: { oneEye }
    } = this.sceneData;
    EventEmitter.emit(EventName.ToggleControlEnableFlag, {
      id: oneEye.Id,
      flag: true
    });
  }

  onExit() {
    const {
      nodeObj: { oneEye }
    } = this.sceneData;
    EventEmitter.emit(EventName.ToggleControlEnableFlag, {
      id: oneEye.Id,
      flag: false
    });
  }

  createScene() {
    const {
      nodeObj: { nodes, oneEye, initScene },
      sceneSetters
    } = this.sceneData;
    // Define scene
    const scene = new Scene("ONE_EYE_SCENE");
    scene.setNodeList(nodes);
    scene.setSceneSetters(sceneSetters);

    // Set active camera Ids
    const camId = oneEye.getCamId();
    scene.setActiveCameraId(camId);

    // Set scenes in CanvasView
    const { canvas } = this;
    this.setSingleScene(scene, canvas);

    initScene();
  }
}
