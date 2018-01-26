import { m4, Matrix4 } from "../../lib/m4";
import { SHADER_VARS } from "../../ShaderFactory/constants";
import WorldObject from "../../WorldObject";
import config from "./config";
import OBJ0 from "../../ObjectGroup3D/objects";

export default class LightSource extends WorldObject {
  constructor(objRenderer, keyControl, configList = []) {
    super(objRenderer, keyControl, [config, ...configList]);

    this.setPropertyGetter("light_color", () => {
      if (this.getProperty("isON")) return config.lightColor;
      else return [0, 0, 0];
    });

    const lightPos = this.getProperty("light_position");
    this.modelMatrix.translate(lightPos[0], lightPos[1], lightPos[2]);

    this.setPropertyGetter("model_matrix", () => {
      return this.modelMatrix.matrix();
    });

    this.setPropertyGetter("emissive_color", () => {
      return this.getProperty("light_color");
    });

    this.lightIndex = 0;
  }

  setupScene(objRenderer) {
    objRenderer.setUniformGetter(
      SHADER_VARS.u_LightColor(this.lightIndex),
      () => {
        return this.getProperty("light_color");
      }
    );

    objRenderer.setUniformGetter(
      SHADER_VARS.u_LightPosition(this.lightIndex),
      () => {
        return this.getProperty("light_position");
      }
    );
  }

  defineGeometry() {
    this.enableNormals = true;

    const shape = new OBJ0.Sphere3D(0.5, [0.9, 0.9, 0.9], 20, 20);

    return [shape];
  }
}
