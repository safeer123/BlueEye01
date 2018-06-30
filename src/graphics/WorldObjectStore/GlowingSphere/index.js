import config from "./config";
import OBJ0 from "../../ObjectGroup3D/objects";
import Utils from "../../AppUtils";
import WOFACTORY from "../Factory";
import NodeTypes from "../constants/NodeTypes";
import WorldObject from "../../WorldObject";

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

    if (this.init) this.init();
  }

  defineGeometry() {
    this.enableNormals = true;
    const radius = this.getProperty("radius");
    const shape = new OBJ0.Sphere3D(radius, [0.9, 0.9, 0.9], 20, 20);
    return [shape];
  }

  init() {
    const getXAt = t => Utils.interpolate(0, 20, t);
    const getZAt = t => Utils.interpolate(0, 20, t);

    const modeNameDisplay = "GlowingSphere";
    const changeX = t => {
      const translation = this.getProperty("translation");
      translation[0] = getXAt(t).toFixed(2);
      this.setProperty("translation", translation);
      return [`X: ${translation[0]}`];
    };
    const changeZ = t => {
      const translation = this.getProperty("translation");
      translation[2] = getZAt(t).toFixed(2);
      this.setProperty("translation", translation);
      return [`Z: ${translation[2]}`];
    };
    const summary = () => {
      const translation = this.getProperty("translation");
      return [
        `${modeNameDisplay}: (X: ${translation[0]}, Z: ${translation[2]})`
      ];
    };
    const keyControlObject = {
      modeName: "GlowingSpherePosition",
      ArrowLeftRight: {
        t: 0,
        dt: 0.01,
        cb: changeX
      },
      ArrowUpDown: {
        t: 0,
        dt: 0.01,
        cb: changeZ
      },
      summary
    };
    this.userControl.registerControlMode("l", keyControlObject);

    // initialize the userControl Init values
    this.setProperty("translation", [getXAt(0.5), 10, getZAt(0)]);
  }
}
