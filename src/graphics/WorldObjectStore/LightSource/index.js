import { m4, Matrix4 } from "../../lib/m4";
import { SHADER_VARS } from "../../ShaderFactory/constants";
import WorldObject from "../../WorldObject";
import config from "./config";
import OBJ0 from "../../ObjectGroup3D/objects";
import { Utils } from "../../AppUtils";

export default class LightSource extends WorldObject {
  constructor(objRenderer, keyControl, configList = []) {
    super(objRenderer, keyControl, [config, ...configList]);

    this.setPropertyGetter("light_color", () => {
      if (this.getProperty("isON")) return config.lightColor;
      return [0, 0, 0];
    });

    this.setPropertyGetter("model_matrix", () => {
      const translation = this.getProperty("translation");
      this.modelMatrix.identity();
      this.modelMatrix.translate(...translation);
      return this.modelMatrix.matrix();
    });

    this.setPropertyGetter("light_position", () => {
      const origin = [0, 0, 0, 1];
      const worldMatrix = this.getProperty("world_matrix");
      const lightPosInWorld = m4.vectorMultiply(origin, worldMatrix);
      return lightPosInWorld.splice(0, 3);
    });

    this.setPropertyGetter("emissive_color", () =>
      this.getProperty("light_color")
    );

    this.lightIndex = 0;

    if (this.init) this.init();
  }

  setupScene(objRenderer) {
    objRenderer.setUniformGetter(
      SHADER_VARS.u_LightColor(this.lightIndex),
      () => this.getProperty("light_color")
    );

    objRenderer.setUniformGetter(
      SHADER_VARS.u_LightPosition(this.lightIndex),
      () => {
        const lightPosInWorld = this.getProperty("light_position");
        // console.log(lightPosInWorld);
        return lightPosInWorld;
      }
    );
  }

  defineGeometry() {
    this.enableNormals = true;

    const shape = new OBJ0.Sphere3D(0.5, [0.9, 0.9, 0.9], 20, 20);

    return [shape];
  }

  init() {
    const getXAt = t => Utils.interpolate(0, 20, t);
    const getZAt = t => Utils.interpolate(0, 20, t);

    const modeNameDisplay = "Light";
    const changeX = t => {
      const translation = this.getProperty("translation");
      translation[0] = getXAt(t);
      this.setProperty("translation", translation);
      return [modeNameDisplay, `X: ${translation[0]}`];
    };
    const changeZ = t => {
      const translation = this.getProperty("translation");
      translation[2] = getZAt(t);
      this.setProperty("translation", translation);
      return [modeNameDisplay, `Z: ${translation[0]}`];
    };
    const summary = () => {
      const translation = this.getProperty("translation");
      return [
        "Control Mode: Light Position",
        `Translation: (X: ${translation[0]}, y: ${translation[2]})`
      ];
    };
    const keyControlObject = {
      modeName: "LightPos",
      ControlArrowLeftRight: {
        t: 0,
        dt: 0.01,
        cb: changeX
      },
      ControlArrowUpDown: {
        t: 0,
        dt: 0.01,
        cb: changeZ
      },
      summary
    };
    this.keyboardControl.createControlMode("l", keyControlObject);

    // initialize the keyboardControl Init values
    this.setProperty("translation", [getXAt(0), 10, getZAt(0)]);
  }
}
