import { m4, Matrix4 } from "../../lib/m4";
import WorldObject from "../../WorldObject";
import OBJ0 from "../../ObjectGroup3D/objects";
import config from "./config";
import Utils from "../../AppUtils";

export default class CompositeShape extends WorldObject {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

    this.setPropertyGetter("model_matrix", () => {
      const phi = this.getProperty("phi");
      const theta = this.getProperty("theta");
      this.modelMatrix.identity();
      this.modelMatrix.yRotate(theta);
      this.modelMatrix.xRotate(phi);
      return this.modelMatrix.matrix();
    });

    this.setupControls();
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

  setupControls() {
    const getThetaAt = t => Utils.interpolate(0, Math.PI, t);
    const getPhiAt = t => Utils.interpolate(2 * Math.PI, 0, t);

    const modeNameDisplay = "Composite Shapes";
    const changePhi = t => {
      this.setProperty("phi", getPhiAt(t));
      const phiInDeg = Utils.radToDeg(this.getProperty("phi"));
      return [`φ: ${phiInDeg}°`];
    };
    const changeTheta = t => {
      this.setProperty("theta", getThetaAt(t));
      const thetaInDeg = Utils.radToDeg(this.getProperty("theta"));
      return [`θ: ${thetaInDeg}°`];
    };
    const summary = () => {
      const theta = Utils.radToDeg(this.getProperty("theta"));
      const phi = Utils.radToDeg(this.getProperty("phi"));
      return [`${modeNameDisplay} (φ: ${phi}°, θ: ${theta})°`];
    };
    const keyControlObject = {
      modeName: "CompositeObjs",
      ArrowLeftRight: {
        t: 0,
        dt: 0.01,
        cb: changePhi
      },
      ArrowUpDown: {
        t: 0.4,
        dt: 0.01,
        cb: changeTheta
      },
      summary
    };
    this.userControl.registerControlMode("c", keyControlObject);

    // initialize the userControl Init values
    this.setProperty("theta", getThetaAt(0.4));
    this.setProperty("phi", getThetaAt(0));
  }
}
