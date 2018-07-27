import WorldObject from "../../../../WorldObject";
import OBJ0 from "../../../../Geometry/Objects3D/objects";
import WOFACTORY from "../../../../WorldObjectStore/Factory";
import config from "./config";

const Obj5Type = "Obj5Type";

class Shape5 extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);
    this.model().translate(20, 0, 2);
  }

  defineGeometry() {
    const radius = 2;
    const sphere = new OBJ0.Sphere3D(radius);
    sphere.model().translate(0, radius, 0);

    this.geometryList = [sphere];
    return this.geometryList;
  }
}

WOFACTORY.registerType(Obj5Type, Shape5);

export default Obj5Type;
