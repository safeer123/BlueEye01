import { m4, Matrix4, dot, addVectors, multVector } from "../../lib/m4";
import { SHADER_VARS } from "../../ShaderFactory/constants";
import WorldObject from "../../WorldObject";
import config from "./config";
import Utils from "../../AppUtils";
import OBJ2D from "../../ObjectGroup2D/objects";
import renderConfig2D from "../../ObjectGroup2D/renderConfig";
import ObjectRenderer from "../../lib/ObjectRenderer";

export default class Sun extends WorldObject {
  constructor(gl, programs, keyControl, configList = []) {
    super(new ObjectRenderer(gl, programs, renderConfig2D), keyControl, [
      config,
      ...configList
    ]);

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
      const sunAngle = Utils.radToDegree(this.getProperty("theta"));
      return ["Sun", `Sun Orientation: ${sunAngle} deg`];
    };
    const summary = () => {
      const sunAngle = Utils.radToDegree(this.getProperty("theta"));
      return ["Control Mode: Sun", `Sun Orientation: ${sunAngle} deg`];
    };
    const keyControlObject = {
      ControlArrowLeftRight: {
        t: 0,
        dt: 0.02,
        cb: changeDirection
      },
      summary
    };
    this.keyboardControl.createControlMode("s", keyControlObject);

    // Create sky color for background
    this.objRenderer.setUniformGetter(SHADER_VARS.u_color, () => {
      const ambient = [0.1, 0.1, 0.1];
      const diffuse_I = dot([0, 1, 0], this.getProperty("sun_direction"));
      const netColor = addVectors(
        ambient,
        multVector(diffuse_I, [0.1, 0.1, 0.1])
      );
      return [...netColor, 1.0];
    });
  }

  defineGeometry() {
    const { width, height } = this.objRenderer.gl.canvas;
    const bgRect = new OBJ2D.Rectangle2D(0, 0, width, height);
    bgRect.color = [0.0, 0.0, 0.0, 0.0];
    return [bgRect];
  }

  setupScene(objRenderer) {
    objRenderer.setUniformGetter(SHADER_VARS.u_sunDirection, () => this.getProperty("sun_direction"));

    objRenderer.setUniformGetter(SHADER_VARS.u_sunLightColor, () => this.getProperty("sun_light_color"));
  }
}
