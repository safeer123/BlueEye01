import WorldObject from "../../../../WorldObject";
import OBJ0 from "../../../../Geometry/Objects3D/objects";
import WOFACTORY from "../../../../WorldObjectStore/Factory";
import config from "./config";

const CylinderType = "CylinderType";

class CylinderShape extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);
    this.modelMatrix.translate(-80, 0, 0);
  }

  defineGeometry() {
    this.enableNormals = true;
    this.cylinder3D = new OBJ0.ClosedCylinder3D(2, 5, { deltaColor: 0.1 });
    this.cylinder3D.model().translate(0, 2.5, 0);
    this.axis = new OBJ0.ClosedCylinder3D(0.3, 10, {
      deltaColor: 0.01,
      color: [0.3, 0.3, 0.3, 1]
    });
    return [this.cylinder3D, this.axis];
  }
}

WOFACTORY.registerType(CylinderType, CylinderShape);

export default CylinderType;
