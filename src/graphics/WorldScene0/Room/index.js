import { m4, Matrix4 } from "../../lib/m4";
import { SHADER_VARS } from "../../ShaderFactory/constants";
import WorldObject from "../../WorldObject";
import OBJ0 from "../../ObjectGroup3D/objects";

export default class RoomObject extends WorldObject {
  constructor(objRenderer, keyControl) {
    super(objRenderer, keyControl);
  }

  defineGeometry() {
    this.enableNormals = false;
    // Build the object
    this.floor = new OBJ0.RectSurface3D(
      [15, 0, -15],
      [15, 0, 15],
      [-15, 0, 15],
      [-15, 0, -15],
      30,
      30
    );

    this.ball1 = new OBJ0.Sphere3D(3, [0.6, 0.8, 0.6], 20, 20);
    this.ball1.modelMatrix = new Matrix4().translate(0, 3, 0);

    this.ball2 = new OBJ0.Sphere3D(1, [0.5, 0.5, 0.5], 20, 20);
    this.ball2.modelMatrix = new Matrix4().translate(4, 1, 5);

    return [this.floor, this.ball1, this.ball2];
  }
}
