import { m4, Matrix4, dot, addVectors, multVector } from "../../lib/m4";
import { SHADER_VARS } from "../../ShaderFactory/constants";
import SceneSetter from "../SceneSetter";
import config from "./config";
import Utils from "../../AppUtils";
import OBJ2D from "../../ObjectGroup2D/objects";
import SceneSetterTypes from "../constants/SceneSetterTypes";

export default class Sun extends SceneSetter {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);
    this.setSceneSetterType(SceneSetterTypes.SUN_SCENE_SETTER);

    this.setPropertyGetter("sun_light_color", () => {
      if (this.getProperty("isDay")) return config.dayColor;
      return config.nightColor;
    });

    this.setPropertyGetter("sun_direction", () => {
      const theta = this.getProperty("theta");
      return Utils.rThetaPhiToXYZ(1, theta, Math.PI / 2);
    });
    this.init();
  }

  init() {
    const changeDirection = t => {
      const newTheta = Utils.interpolate(-Math.PI, Math.PI, t);
      this.setProperty("theta", newTheta);
      if (newTheta > Math.PI / 2 || newTheta < -Math.PI / 2) {
        this.setProperty("isDay", false);
      } else {
        this.setProperty("isDay", true);
      }
      const sunAngle = Utils.radToDeg(this.getProperty("theta"));
      return [`θ: ${sunAngle}°`];
    };
    const summary = () => {
      const sunAngle = Utils.radToDeg(this.getProperty("theta"));
      return [`Sun Orientation: (θ: ${sunAngle}°)`];
    };
    const keyControlObject = {
      ArrowLeftRight: {
        t: 0,
        dt: 0.02,
        cb: changeDirection
      },
      summary
    };
    this.userControl.registerControlMode("s", keyControlObject);

    // Create sky color for background
    this.objRenderer.setUniformGetter(SHADER_VARS.u_color, () => {
      const ambient = [0.1, 0.1, 0.1];
      const diffuseI = dot([0, 1, 0], this.getProperty("sun_direction"));
      const netColor = addVectors(
        ambient,
        multVector(diffuseI, [0.1, 0.1, 0.1])
      );
      return [...netColor, 1.0];
    });
  }

  defineGeometry() {
    const { drawingBufferWidth, drawingBufferHeight } = this.objRenderer.gl;
    const bgRect = new OBJ2D.Rectangle2D(
      0,
      0,
      drawingBufferWidth,
      drawingBufferHeight
    );
    bgRect.color = [0.0, 0.0, 0.0, 0.0];
    return [bgRect];
  }

  setupScene(objRenderer) {
    objRenderer.setUniformGetter(SHADER_VARS.u_sunDirection, () =>
      this.getProperty("sun_direction")
    );

    objRenderer.setUniformGetter(SHADER_VARS.u_sunLightColor, () =>
      this.getProperty("sun_light_color")
    );
  }
}
