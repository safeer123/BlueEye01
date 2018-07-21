import config from "./config";
import OBJ0 from "../../ObjectGroup3D/objects";
import WOFACTORY from "../Factory";
import NodeTypes from "../constants/NodeTypes";
import WorldObject from "../../WorldObject";
import { PrimaryKeys, SecondaryKeys } from "../../lib/UserControl/constants";

export default class GlowingSphere extends WorldObject {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

    const inObjForLight = { ...inObj, renderConfig: null };
    const lightSource = WOFACTORY.create(NodeTypes.ABSTRACT_LIGHT, [
      inObjForLight
    ]);
    this.addChildren([lightSource]);

    lightSource.setPropertyGetter("light_color", () => config.LightColor);
    lightSource.setPropertyGetter("isActive", () => this.getProperty("isON"));

    this.setPropertyGetter("model_matrix", () => {
      const translation = this.getProperty("translation");
      this.modelMatrix.identity();
      this.modelMatrix.translate(...translation);
      return this.modelMatrix.matrix();
    });

    this.setPropertyGetter("emissive_color", () => {
      if (lightSource.getProperty("isActive")) {
        return lightSource.getProperty("light_color");
      }
      return [0, 0, 0];
    });

    this.setupControls();
  }

  defineGeometry() {
    this.enableNormals = true;
    const radius = this.getProperty("radius");
    const shape = new OBJ0.Sphere3D(radius, [0.9, 0.9, 0.9], 20, 20);
    return [shape];
  }

  setupControls() {
    const modeName = "GlowingSphere Position";
    const DX = 0.5;
    const DZ = 0.5;
    const xPlus = dx => {
      const translation = this.getProperty("translation");
      translation[0] += dx;
      this.setProperty("translation", translation);
    };
    const zPlus = dz => {
      const translation = this.getProperty("translation");
      translation[2] += dz;
      this.setProperty("translation", translation);
    };
    const summary = () => {
      const translation = this.getProperty("translation");
      return [
        `${modeName}:`,
        `(X: ${translation[0].toFixed(2)}, Z: ${translation[2].toFixed(2)})`
      ];
    };
    const keyControlObject = {
      modeName,
      main: () => [modeName],
      [SecondaryKeys.ArrowLeft]: () => xPlus(-DX),
      [SecondaryKeys.ArrowRight]: () => xPlus(DX),
      [SecondaryKeys.ArrowUp]: () => zPlus(DZ),
      [SecondaryKeys.ArrowDown]: () => zPlus(-DZ),
      summary
    };
    this.userControl.registerControlMode(PrimaryKeys.a, keyControlObject);
  }
}
