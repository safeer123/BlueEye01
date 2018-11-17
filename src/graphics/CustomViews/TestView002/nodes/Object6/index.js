import WorldObject from "../../../../WorldObject";
import OBJ0 from "../../../../Geometry/Objects3D/objects";
import WOFACTORY from "../../../../WorldObjectStore/Factory";
import config from "./config";
import GlowingHemiSphereType from "../GlowingHemisphere";
import BTN from "./../../../../../constants/Buttons";

const LightTowerType = "LIGHT_TOWER";

class LightTower extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);
    this.model().translate(60, 0, 0);

    this.glowingObj = WOFACTORY.create(GlowingHemiSphereType, [inObj]);
    this.addChildren([this.glowingObj]);
    this.glowingObj.model().translate(0, 5, 0);
    this.setControls();
  }

  defineGeometry() {
    const cylinder3D = new OBJ0.Cylinder3D(3, 5, { deltaColor: 0.1 });
    // cylinder3D.model().translate(0, 2.5, 0);
    this.geometryList = [cylinder3D];
    return this.geometryList;
  }

  setControls() {
    const powerSwitch = () => {
      const isON = this.glowingObj.getProperty("isON");
      this.glowingObj.setProperty("isON", !isON);
    };
    this.controlObject = {
      enabled: true,
      controls: [
        {
          name: "Power",
          input: ["1"],
          controlButton: () => BTN.Circle,
          action: () => powerSwitch()
        }
      ]
    };
  }
}

WOFACTORY.registerType(LightTowerType, LightTower);

export default LightTowerType;
