import { m4, Matrix4 } from "../../lib/m4";
import { SHADER_VARS } from "../../ShaderFactory/constants";
import WorldObject from "../../WorldObject";
import OBJ0 from "../../ObjectGroup3D/objects";
import config from "./config";

export default class RoomObject extends WorldObject {
  constructor(objRenderer, keyControl, configList = []) {
    super(objRenderer, keyControl, [config, ...configList]);
  }

  defineGeometry() {
    this.enableNormals = true;

    // constants
    const greenishColor = [100 / 256, 200 / 256, 80 / 256, 1];
    const floorWidth = 30;
    const floorBreadth = 30;
    const floorHeight = 2;
    const pillarWidth = 1;
    const pillarHeight = 10;

    this.floor = new OBJ0.Box3D(
      floorWidth / 2,
      -floorWidth / 2,
      -floorBreadth / 2,
      floorBreadth / 2,
      -floorHeight,
      0,
      20,
      3,
      20
    );
    this.floor.color = greenishColor;

    this.pillar1 = new OBJ0.Box3D(
      pillarWidth / 2,
      -pillarWidth / 2,
      -pillarWidth / 2,
      pillarWidth / 2,
      0,
      pillarHeight,
      4,
      20,
      4
    );
    this.pillar1.color = greenishColor;
    this.pillar1.modelMatrix = new Matrix4().translate(
      -floorWidth / 2 + pillarWidth / 2,
      0,
      -floorBreadth / 2 + pillarWidth / 2
    );

    this.pillar2 = new OBJ0.Box3D(
      pillarWidth / 2,
      -pillarWidth / 2,
      -pillarWidth / 2,
      pillarWidth / 2,
      0,
      pillarHeight,
      4,
      20,
      4
    );
    this.pillar2.color = greenishColor;
    this.pillar2.modelMatrix = new Matrix4().translate(
      floorWidth / 2 - pillarWidth / 2,
      0,
      -floorBreadth / 2 + pillarWidth / 2
    );

    this.sideWall = new OBJ0.Box3D(
      pillarWidth / 2,
      -pillarWidth / 2,
      -floorWidth / 2,
      floorWidth / 2,
      0,
      pillarHeight,
      20,
      20,
      4
    );
    this.sideWall.color = greenishColor;
    this.sideWall.modelMatrix = new Matrix4().translate(
      0,
      0,
      floorBreadth / 2 - pillarWidth / 2
    );

    this.ball1 = new OBJ0.Sphere3D(3, [0.6, 0.8, 0.6], 20, 20);
    this.ball1.modelMatrix = new Matrix4().translate(0, 3, 0);
    this.ball1.color = [200 / 256, 80 / 256, 110 / 256, 1];

    this.ball2 = new OBJ0.Sphere3D(1, [0.5, 0.5, 0.5], 20, 20);
    this.ball2.modelMatrix = new Matrix4().translate(-5, 1, 5);

    this.box1 = new OBJ0.Box3D(1, -1, -1, 1, -1, 1);
    this.box1.modelMatrix = new Matrix4()
      .yRotate(-Math.PI / 4)
      .xRotate(1)
      .translate(5, 5, 5);

    return [
      // this.floor,
      // this.sideWall,
      // this.pillar1,
      // this.pillar2,
      this.ball1,
      this.ball2,
      this.box1
    ];
  }
}
