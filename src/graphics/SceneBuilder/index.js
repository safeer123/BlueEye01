import renderConfigNoLight from "../ObjectGroup3D/renderConfig";
import renderConfigLight from "../ObjectGroup3D/renderConfigLight";
import GraphicsLayer from "../lib/GraphicsLayer";
import ObjectRenderer from "../lib/ObjectRenderer";
import UserControl from "../lib/UserControl";
import Utils from "../AppUtils";

// Import World Objects
import CompositeShape from "../WorldObjectStore/CompositeShapes0";
import Camera from "../WorldObjectStore/CameraAbstract";
import CamThetaPhi from "../WorldObjectStore/CamThetaPhi";
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

    this.prevTimeStamp = -1;

    // Back ground color
    this.gl.clearColor(0, 0, 0, 1);

    const sceneUpdater = displayOutList => {
      if (this.stateUpdateHandler) {
        this.stateUpdateHandler(displayOutList, 5);
      }
      this.renderOnce = true;
    };

    this.userControl = new UserControl(sceneUpdater);
  }

  createScene() {
    this.worldObjectList.length = 0;

    const shapes = new CompositeShape(
      new ObjectRenderer(
        this.gl,
        this.shaderFac.shaderPrograms,
        renderConfigLight
      ),
      this.userControl
    );

    this.sunObj = new Sun(
      this.gl,
      this.shaderFac.shaderPrograms,
      this.userControl
    );

    this.lightObj0 = new LightSource(
      new ObjectRenderer(
        this.gl,
        this.shaderFac.shaderPrograms,
        renderConfigLight
      ),
      this.userControl
    );
    shapes.addChildren([this.lightObj0]);

    this.worldObjectList.push(this.sunObj, shapes);

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
          this.userControl
        );
        cam.setProperty("camera_position", camera.position);
        cam.setProperty("target_position", camera.target);
        cam.setProperty("up_vector", camera.up);
        this.cameras[camera.name] = cam;
        this.worldObjectList.push(cam);
      } else if (camera.type === "ThetaPhi") {
        const cam = new CamThetaPhi(
          new ObjectRenderer(
            this.gl,
            this.shaderFac.shaderPrograms,
            renderConfigNoLight
          ),
          this.userControl
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

    this.theta = 0;
    this.shapes = shapes;
    Utils.startRenderingLoop(this.renderLoop.bind(this));
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

  renderLoop(timeStamp) {
    // console.log(timeStamp);

    // Optimize the rendering call based on checking
    // significant update in the time stamp value
    if (Math.abs(this.prevTimeStamp - timeStamp) < 20) {
      return;
    }
    this.prevTimeStamp = timeStamp;

    if (this.renderOnce) {
      this.renderScene();
      this.renderOnce = false;
      // console.log("Rendered Once...");

      if (this.theta > Math.PI * 2) {
        this.theta = 0.0;
      }
      this.theta += 0.005;
      this.shapes.setProperty("theta", this.theta);
      this.renderOnce = true;
    }
  }
}
