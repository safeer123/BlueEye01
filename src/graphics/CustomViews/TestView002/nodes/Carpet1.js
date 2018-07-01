import WorldObject from "../../../WorldObject";
import OBJ0 from "../../../ObjectGroup3D/objects";
import WOFACTORY from "../../../WorldObjectStore/Factory";

const CarpetType = "CarpetType";

class Carpet extends WorldObject {
  constructor(inObj) {
    super(inObj, []);
  }

  defineGeometry() {
    this.enableNormals = true;
    const p1 = [-100, 0, 10];
    const p2 = [-100, 0, -10];
    const p3 = [100, 0, -10];
    const p4 = [100, 0, 10];
    this.planeSurface = new OBJ0.RectSurface3D(p1, p2, p3, p4, {
      divCount1: 20,
      divCount2: 4
    });
    return [this.planeSurface];
  }
}

WOFACTORY.registerType(CarpetType, Carpet);

export default CarpetType;
