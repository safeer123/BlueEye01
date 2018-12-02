import getNodes from "./nodes";
import SingleCanvasView from "../../SceneBuilder/CustomCanvasViews/SingleCanvasView";
import Scene from "./../../SceneBuilder/Scene";

export default class SingleNodeView extends SingleCanvasView {
  constructor(canvas, preRender, inObj) {
    super(canvas, preRender);
    this.inObj = inObj;
    this.canvas = canvas;
    this.viewUpdater = this.getSceneUpdater();
  }

  updater = () => {
    if (this.viewUpdater) this.viewUpdater();
  };

  setNodeObj(nodeObj) {
    const { nodes, camThetaPhi, initScene } = nodeObj;
    this.nodes = nodes;
    this.camThetaPhi = camThetaPhi;
    this.initScene = initScene;
  }

  rebuildNodes() {
    this.viewUpdater = this.getSceneUpdater();
    const { nodes, camThetaPhi, initScene } = getNodes(this.inObj);

    this.nodes = nodes;
    this.camThetaPhi = camThetaPhi;
    this.initScene = initScene;
  }

  createScene() {
    // Reconstruct nodes every time this methode is called
    // this.rebuildNodes();

    // Define scene and right scene
    const scene = new Scene("MAIN_SCENE", this.updater);
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
