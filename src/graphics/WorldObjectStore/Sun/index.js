import { m4, Matrix4, dot, addVectors, multVector } from "../../lib/m4";
import { SHADER_VARS } from "../../ShaderFactory/constants";
import SceneSetter from "../SceneSetter";
import config from "./config";
import Utils from "../../AppUtils";
import OBJ2D from "../../Geometry/Objects2D/objects";
import SceneSetterTypes from "../constants/SceneSetterTypes";
import { PrimaryKeys, SecondaryKeys } from "../../UserControl/constants";

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

    this.setPropertyGetter("isDay", () => {
      const theta = this.getProperty("theta");
      return theta > Math.PI * 0.5 || theta < -Math.PI * 0.5;
    });

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

  enableDefaultUserControls() {
    const modeName = "Sun Direction";
    const DTHETA = 0.01;
    const changeDirection = dt => {
      const newTheta = this.getProperty("theta") + dt;
      this.setProperty("theta", newTheta);
    };
    const summary = () => {
      const sunAngle = Utils.radToDeg(this.getProperty("theta"));
      return [`Sun Orientation: (θ: ${sunAngle}°)`];
    };
    const keyControlObject = {
      modeName,
      [SecondaryKeys.ArrowLeft]: () => changeDirection(-DTHETA),
      [SecondaryKeys.ArrowRight]: () => changeDirection(DTHETA),
      summary
    };
    this.userControl.registerControlMode(PrimaryKeys.s, keyControlObject);
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
