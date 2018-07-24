import WorldObject from "../../../../WorldObject";
import OBJ0 from "../../../../Geometry/Objects3D/objects";
import WOFACTORY from "../../../../WorldObjectStore/Factory";
import config from "./config";

const Obj3Type = "Obj3Type";

class Shape3 extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);
    this.modelMatrix.translate(-40, 0, 2);
  }

  defineGeometry() {
    this.enableNormals = true;
    const color = [0.6, 0.8, 0.45, 1];
    const radius = 3;
    const hemiSphere1 = new OBJ0.Hemisphere3D(radius, {
      dThetaCount: 10,
      deltaColor: 0.1,
      color
    });
    hemiSphere1.model().translate(0, radius, radius * 0.7);

    const hemiSphere2 = new OBJ0.InvertedHemisphere3D(radius, {
      dThetaCount: 10,
      deltaColor: 0.1,
      color
    });
    hemiSphere2.model().translate(0, 0, -radius * 0.7);

    return [hemiSphere1, hemiSphere2];
  }
}

WOFACTORY.registerType(Obj3Type, Shape3);

export default Obj3Type;
