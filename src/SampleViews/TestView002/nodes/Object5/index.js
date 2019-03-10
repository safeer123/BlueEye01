import { WorldObject, OBJ0, WOFACTORY } from "../../../../graphics";
import config from "./config";

const Obj5Type = "Obj5Type";

class Shape5 extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);
    this.model().translate(20, 0, 2);
  }

  defineGeometry() {
    const radius = 4;
    const sphere = new OBJ0.Sphere3D(radius);
    sphere.model().translate(0, radius, 0);

    const planeSide = 4;
    const getColor = (i, j, options) => {
      const { color, deltaColor, divCount1, divCount2 } = options;
      const colorPlus = color.map(c => c + deltaColor);
      const highlight =
        i <= divCount1 - 2 &&
        i >= 1 &&
        j <= divCount2 - 2 &&
        j >= 1 &&
        (i === divCount1 - 2 || j === divCount2 - 2 || i === 1 || j === 1);
      return highlight ? color : colorPlus;
    };
    const plane = new OBJ0.QuadSurface3D(
      [0, planeSide, planeSide * 0.5],
      [0, 0, planeSide * 0.5],
      [0, 0, -planeSide * 0.5],
      [0, planeSide, -planeSide * 0.5],
      {
        color: [0.5, 0.3, 0.2, 1],
        deltaColor: 0.2,
        colorPerVertex: false,
        getColor
      }
    );
    plane.model().translate(20, 0, 0);

    this.geometryList = [sphere, plane];
    return this.geometryList;
  }
}

WOFACTORY.registerType(Obj5Type, Shape5);

export default Obj5Type;
