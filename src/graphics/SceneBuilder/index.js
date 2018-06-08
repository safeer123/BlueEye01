import renderConfigNoLight from "../ObjectGroup3D/renderConfig";
import renderConfigLight from "../ObjectGroup3D/renderConfigLight";
import GraphicsLayer from "../lib/GraphicsLayer";
import ObjectRenderer from "../lib/ObjectRenderer";
import KeyboardControl from "../WorldObjectStore/KeyboardControl";

// Import World Objects
import RoomObject_WithLight from "../WorldObjectStore/Room_Light";
import CompositeShape from "../WorldObjectStore/CompositeShapes0";
import Camera from "../WorldObjectStore/Camera";
import Cam_ThetaPhi from "../WorldObjectStore/Cam_ThetaPhi";
import Sun from "../WorldObjectStore/Sun";
import LightSource from "../WorldObjectStore/LightSource";
import { LayoutConfig1 } from "./config";

// WorldScene0 Layer
export default class SceneBuilder extends GraphicsLayer {
  // Construct canvas and webgl context
  constructor(wrapperElem, canvas) {
    super(wrapperElem, canvas);

    this.worldObjectList = [];

    this.renderOnce = true;
    this.refreshTimeOut = 25;

    // Back ground color
    this.gl.clearColor(0, 0, 0, 1);

    const sceneUpdater = displayOutList => {
      if (this.stateUpdateHandler) {
        this.stateUpdateHandler(displayOutList, 5);
      }
      this.renderOnce = true;
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

    const shapes = new CompositeShape(
      new ObjectRenderer(
        this.gl,
        this.shaderFac.shaderPrograms,
        renderConfigLight
      ),
      this.keyboardControl
    );
    roomObj.addChildren([shapes]);

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
        const cam = new Camera(
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
        const cam = new Cam_ThetaPhi(
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

    const renderLoopHandler = setInterval(
      this.renderLoop.bind(this),
      this.refreshTimeOut
    );
  }

  renderScene() {
    this.clear();
    if (this.sceneConfigs) {
      this.sceneConfigs.forEach(sceneConfig => this.render(sceneConfig));
    }
  }

  render(sceneConfig) {
    this.worldObjectList.forEach(wo => wo.setSceneConfig(sceneConfig));
    this.worldObjectList.forEach(wo => wo.render());
  }

  renderLoop() {
    if (this.renderOnce) {
      this.renderScene();
      this.renderOnce = false;
      // console.log("Rendered Once...");
    }
  }
}
