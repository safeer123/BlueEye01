import { m4, addVectors, subtractVectors, multVector } from "../../lib/m4";
import config from "./config";
import OrientationListener from "../OrientationListener";
import WOFACTORY from "../Factory";
import NodeTypes from "../constants/NodeTypes";
import Utils from "../../AppUtils";
import { PrimaryKeys, SecondaryKeys } from "../../lib/UserControl/constants";

// Define Two Eyes
// Two cameras attached to OrientationListener
export default class TwoEyes extends OrientationListener {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

    const inObjForCam = { ...inObj, renderConfig: null };
    this.leftCamera = WOFACTORY.create(NodeTypes.ABSTRACT_CAMERA, [
      inObjForCam
    ]);
    this.rightCamera = WOFACTORY.create(NodeTypes.ABSTRACT_CAMERA, [
      inObjForCam
    ]);

    this.leftCamera.setPropertyGetter("camera_position", () => {
      const pupillaryDist = this.getProperty("pupillary_distance");
      return [-pupillaryDist * 0.5, 0, 0];
    });
    this.leftCamera.setPropertyGetter(
      "target_position",
      () => [0, 0, -this.getProperty("radius")]
      // this.getProperty("relative_target_position")
    );
    this.leftCamera.setProperty("up_vector", [0, 1, 0]);

    this.rightCamera.setPropertyGetter("camera_position", () => {
      const pupillaryDist = this.getProperty("pupillary_distance");
      return [pupillaryDist * 0.5, 0, 0];
    });
    this.rightCamera.setPropertyGetter(
      "target_position",
      () => [0, 0, -this.getProperty("radius")]
      // this.getProperty("relative_target_position")
    );
    this.rightCamera.setProperty("up_vector", [0, 1, 0]);

    this.addChildren([this.leftCamera, this.rightCamera]);

    super.listentToOrientationChange();
  }

  getLeftCamId() {
    return this.leftCamera.getId();
  }

  getRightCamId() {
    return this.rightCamera.getId();
  }

  enableDefaultUserControls() {
    const orientationControlName = "TwoEyes Look-at";
    const walkControlName = "TwoEyes Walk";

    const DPHI = 0.03;
    const DTHETA = 0.03;
    const STEPDIST = 1;

    const phiPlus = dPhi => {
      const basePhi = (this.getProperty("base_phi") + dPhi) % (2 * Math.PI);
      this.setProperty("base_phi", basePhi);
    };
    const thetaPlus = dTheta => {
      const baseTheta = (this.getProperty("base_theta") + dTheta) % Math.PI;
      this.setProperty("base_theta", baseTheta);
    };
    const walk = d => {
      const position = this.getProperty("position");
      const targetDrection = this.getProperty("target_direction");
      const dv = multVector(d, targetDrection);
      // console.log(targetDrection);
      const newPosition = addVectors(position, dv);
      const fixed2 = n => n.toFixed(2);
      /*
      console.log(
        fixed2(position[0]),
        fixed2(position[1]),
        fixed2(position[2]),
        " -------> ",
        fixed2(newPosition[0]),
        fixed2(newPosition[1]),
        fixed2(newPosition[2]),
        "(",
        fixed2(dv[0]),
        fixed2(dv[1]),
        fixed2(dv[2]),
        ")"
      );
      */
      this.setProperty("position", newPosition);
    };
    const summaryAngles = () => {
      const phiInDeg = Utils.radToDeg(this.getProperty("base_phi"));
      const thetaInDeg = Utils.radToDeg(this.getProperty("base_theta"));
      return [orientationControlName, `(φ: ${phiInDeg}°, θ: ${thetaInDeg}°)`];
    };
    const summaryPosition = () => {
      const position = this.getProperty("position");
      return [
        walkControlName,
        `(X: ${position[0]}, Y: ${position[1]}, Z: ${position[2]})`
      ];
    };
    const orientationControlObject = {
      modeName: orientationControlName,
      [SecondaryKeys.AxisX]: v => phiPlus(DPHI * v),
      [SecondaryKeys.AxisY]: v => thetaPlus(DTHETA * v),
      summary: summaryAngles
    };
    const walkControlObject = {
      modeName: walkControlName,
      [SecondaryKeys.AxisY]: v => walk(-STEPDIST * v),
      [SecondaryKeys.AxisX]: v => (Math.abs(v) > 0.3 ? phiPlus(DPHI * v) : 0),
      summary: summaryPosition
    };
    this.userControl.registerControlMode(
      PrimaryKeys.y,
      orientationControlObject
    );
    this.userControl.registerControlMode("default", walkControlObject);
  }
}
