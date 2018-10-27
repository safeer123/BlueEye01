import WorldObject from "../../../../WorldObject";
import OBJ0 from "../../../../Geometry/Objects3D/objects";
import WOFACTORY from "../../../../WorldObjectStore/Factory";
import NodeTypes from "../../../../WorldObjectStore/constants/NodeTypes";
import config from "./config";
import GlowingHemiSphereType from "../GlowingHemisphere";

const LightTowerType = "LightTowerType";

class LightTower extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);
    this.model().translate(60, 0, 0);

    const glowingObj = WOFACTORY.create(GlowingHemiSphereType, [inObj]);
    this.addChildren([glowingObj]);
    glowingObj.model().translate(0, 5, 0);
  }

  defineGeometry() {
    const cylinder3D = new OBJ0.Cylinder3D(3, 5, { deltaColor: 0.1 });
    // cylinder3D.model().translate(0, 2.5, 0);
    this.geometryList = [cylinder3D];
    return this.geometryList;
  }
}

WOFACTORY.registerType(LightTowerType, LightTower);

export default LightTowerType;
