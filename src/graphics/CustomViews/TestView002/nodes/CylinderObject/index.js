import WorldObject from "../../../../WorldObject";
import OBJ0 from "../../../../ObjectGroup3D/objects";
import WOFACTORY from "../../../../WorldObjectStore/Factory";
import config from "./config";

const CylinderType = "CylinderType";

class CylinderShape extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);
    this.modelMatrix.translate(-80, 3, 0);
  }

  defineGeometry() {
    this.enableNormals = true;
    this.cylinderSurface = new OBJ0.CylinderSurface3D(2, 5);
    return [this.cylinderSurface];
  }
}

WOFACTORY.registerType(CylinderType, CylinderShape);

export default CylinderType;
