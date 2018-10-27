import WorldObject from "../../../../WorldObject";
import OBJ0 from "../../../../Geometry/Objects3D/objects";
import WOFACTORY from "../../../../WorldObjectStore/Factory";
import NodeTypes from "../../../../WorldObjectStore/constants/NodeTypes";
import config from "./config";

const GlowingHemiSphereType = "GlowingHemiSphereType";

class GlowingHemiSphere extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);

    const inObjForLight = { ...inObj, renderConfig: null };
    const lightSource = WOFACTORY.create(NodeTypes.ABSTRACT_LIGHT, [
      inObjForLight
    ]);
    this.addChildren([lightSource]);

    lightSource.setPropertyGetter("light_color", () => config.LightColor);
    lightSource.setPropertyGetter("isActive", () => this.getProperty("isON"));

    this.setPropertyGetter("emissive_color", () => {
      if (lightSource.getProperty("isActive")) {
        return lightSource.getProperty("light_color");
      }
      return [0, 0, 0];
    });
  }

  defineGeometry() {
    const color = [0.6, 0.8, 0.45, 1];
    const radius = 3;
    const hemiSphere1 = new OBJ0.Hemisphere3D(radius, {
      dThetaCount: 10,
      deltaColor: 0.1,
      color
    });

    this.geometryList = [hemiSphere1];
    return this.geometryList;
  }
}

WOFACTORY.registerType(GlowingHemiSphereType, GlowingHemiSphere);

export default GlowingHemiSphereType;
