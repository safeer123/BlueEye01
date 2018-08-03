import { addVectors, multVector } from "../../lib/m4";
import config from "./config";
import OrientationListener from "../OrientationListener";
import Utils from "../../AppUtils";
import { PrimaryKeys, SecondaryKeys } from "../../UserControl/constants";

// Define Space3DWalker
// This is an orientation listener capable of walking in 3D space
// using control keys.
// To enable these controls it is necessary to call enableDefaultUserControls method
export default class Space3DWalker extends OrientationListener {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);
  }

  enableDefaultUserControls() {
    const orientationControlName = "3DWalker Look-at";
    const walkControlName = "3DWalker Walk";

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
      [SecondaryKeys.pan]: e => {
        phiPlus(-DPHI * e.velocityX);
        thetaPlus(-DTHETA * e.velocityY);
      },
      [SecondaryKeys.pinch]: e => {
        walk(STEPDIST * (e.scale > 1 ? 1 : -1) * 0.4);
      },
      [SecondaryKeys.wheel]: e => {
        walk(STEPDIST * (e.dy > 0 ? -1 : 1) * 1);
      },
      summary: summaryPosition
    };
    this.userControl.registerControlMode(
      PrimaryKeys.y,
      orientationControlObject
    );
    this.userControl.registerControlMode("default", walkControlObject);
  }
}
