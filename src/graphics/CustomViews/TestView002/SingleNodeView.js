import SingleCanvasView from "../../SceneBuilder/CustomCanvasViews/SingleCanvasView";
import Scene from "./../../SceneBuilder/Scene";
import EventEmitter from "../../lib/EventEmitter";
import { EventName } from "../../../constants/Events";

export default class SingleNodeView extends SingleCanvasView {
  constructor(canvas, preRender) {
    super(canvas, preRender);
    this.canvas = canvas;
  }

  onEnter() {
    EventEmitter.emit(EventName.ToggleControlEnableFlag, {
      id: this.camThetaPhi.Id,
      flag: true
    });
  }

  onExit() {
    EventEmitter.emit(EventName.ToggleControlEnableFlag, {
      id: this.camThetaPhi.Id,
      flag: false
    });
  }

  setNodeObj(nodeObj) {
    const { nodes, camThetaPhi, initScene } = nodeObj;
    this.nodes = nodes;
    this.camThetaPhi = camThetaPhi;
    this.initScene = initScene;
  }

  createScene() {
    // Define scene and right scene
    const scene = new Scene("MAIN_SCENE");
    scene.setNodeList(this.nodes);

    // Set active camera Ids
    const mainCamId = this.camThetaPhi.getId();
    scene.setActiveCameraId(mainCamId);

    // Set scenes in CanvasView
    const { canvas } = this;
    this.setSingleScene(scene, canvas);

    this.initScene();
  }
}
