import renderConfigNoLight from "../ObjectGroup3D/renderConfig";
import renderConfigLight from "../ObjectGroup3D/renderConfigLight";
import GraphicsLayer from "../lib/GraphicsLayer";
import ObjectRenderer from "../lib/ObjectRenderer";
import KeyboardControl from "./KeyboardControl";

// Import World Objects
import RoomObject from "./Room";
import RoomObject_WithLight from "./Room_Light";
import Camera from "./Camera";
import Cam_ThetaPhi from "./Cam_ThetaPhi";
import Sun from "./Sun";
import LightSource from "./LightSource";
import { LayoutConfig1 } from "./config";

// WorldScene0 Layer
export default class WorldScene0 extends GraphicsLayer {
  // Construct canvas and webgl context
  constructor(wrapperElem, canvas) {
    super(wrapperElem, canvas);

    this.worldObjectList = [];

    // Back ground color
    this.gl.clearColor(0, 0, 0, 1);

    const sceneUpdater = (displayOutList) => {
      if (this.stateUpdateHandler) {
        this.stateUpdateHandler(displayOutList, 5);
      }
      this.renderScene();
    };

    this.keyboardControl = new KeyboardControl(sceneUpdater);
  }

  createScene() {
    this.worldObjectList.length = 0;

    const roomObj = new RoomObject_WithLight(
      new ObjectRenderer(
        this.gl,
        this.shaderFac.shaderPrograms,
        renderConfigLight
      ),
      this.keyboardControl
    );

    this.sunObj = new Sun(
      this.gl,
      this.shaderFac.shaderPrograms,
      this.keyboardControl
    );

    this.lightObj0 = new LightSource(
      new ObjectRenderer(
        this.gl,
        this.shaderFac.shaderPrograms,
        renderConfigLight
      ),
      this.keyboardControl
    );

    this.worldObjectList.push(this.sunObj, roomObj, this.lightObj0);

    const { Cameras, SceneConfigs } = LayoutConfig1;
    this.cameras = {};

    Cameras.forEach(camera => {
      if (camera.type === "default") {
        let cam = new Camera(
          new ObjectRenderer(
            this.gl,
            this.shaderFac.shaderPrograms,
            renderConfigNoLight
          ),
          this.keyboardControl
        );
        cam.setProperty("camera_position", camera.position);
        cam.setProperty("target_position", camera.target);
        cam.setProperty("up_vector", camera.up);
        this.cameras[camera.name] = cam;
        this.worldObjectList.push(cam);
      } else if (camera.type === "ThetaPhi") {
        let cam = new Cam_ThetaPhi(
          new ObjectRenderer(
            this.gl,
            this.shaderFac.shaderPrograms,
            renderConfigNoLight
          ),
          this.keyboardControl
        );
        this.cameras[camera.name] = cam;
        this.worldObjectList.push(cam);
      }
    });

    this.sceneConfigs = [];
    SceneConfigs.forEach(sceneConfig => {
      this.sceneConfigs.push({
        name: sceneConfig.name,
        viewport: sceneConfig.viewport,
        sceneSetters: [
          this.cameras[sceneConfig.camera],
          this.sunObj,
          this.lightObj0
        ]
      });
    });
  }

  renderScene() {
    this.clear();
    if (this.sceneConfigs) {
      this.sceneConfigs.forEach(sceneConfig => this.render(sceneConfig));
    }
  }

  render(sceneConfig) {
    this.worldObjectList.forEach(wo => {
      wo.setSceneConfig(sceneConfig);
      wo.render();
    });
  }
}
