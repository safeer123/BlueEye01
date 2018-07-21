import { m4, addVectors, subtractVectors, normalize } from "../../lib/m4";
import config from "./config";
import WorldObject from "../../WorldObject";
import Utils from "../../AppUtils";

// We neglect changes less than angle error
// This helps very small orientational change not to disturb the view
const AngleError = 0.001;

// Define OrientationListener
// Here we listen to device orientation changes and updates look at direction
export default class OrientationListener extends WorldObject {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

    // Here the model matrix is exactly the lookAt matrix
    this.setPropertyGetter("model_matrix", () => {
      const position = this.getProperty("position");
      const targetPosition = this.getProperty("target_position");
      const upVector = this.getProperty("up_vector");
      const lookAtMatrix = m4.lookAt(position, targetPosition, upVector);
      this.modelMatrix.setMatrix(lookAtMatrix);
      return this.modelMatrix.matrix();
    });

    // we should be setting relative_target_position based on orientation
    this.setPropertyGetter("relative_target_position", () => {
      // r, theta, phi to relative target position
      const sphericalPos = Utils.rThetaPhiToXYZ(
        this.getProperty("radius"),
        this.getProperty("theta"),
        this.getProperty("phi")
      );
      return sphericalPos;
    });

    // base_target_direction based on base angles
    // we can turn our head to get new orientation w.r.t this direction.
    this.setPropertyGetter("target_direction", () => {
      // r, theta, phi to relative target position
      const sphericalPos = Utils.rThetaPhiToXYZ(
        1,
        this.getProperty("theta"),
        this.getProperty("phi")
      );
      return sphericalPos;
    });

    // we should be setting target_postion based on relative_target_position
    this.setPropertyGetter("target_position", () => {
      // relativeTargetPos to target position
      const position = this.getProperty("position");
      const relativeTargetPos = this.getProperty("relative_target_position");
      return addVectors(position, relativeTargetPos);
    });

    this.setPropertyGetter("phi", () =>
      Utils.clampTo0And2PI(
        this.getProperty("base_phi") + this.getProperty("relative_phi")
      )
    );

    this.setPropertyGetter(
      "theta",
      () => this.getProperty("base_theta") + this.getProperty("relative_theta")
    );
  }

  listentToOrientationChange() {
    const initialPhi = this.getProperty("base_phi");
    this.setProperty("phi", initialPhi);
    let phiRef;

    const toPhiInDeg = (gamma, alpha) =>
      360 - (gamma > 0 ? alpha + 180 : alpha) % 360;

    const handleChange = e => {
      const { alpha, beta, gamma } = e;
      if (!alpha || !beta || !gamma) return;

      // calculate relative phi from alpha value
      const phiInDeg = toPhiInDeg(gamma, alpha);
      const phiNew = Utils.degToRad(phiInDeg);
      if (phiRef === undefined) phiRef = phiNew; // Initialize phiRef
      const relativePhi = parseFloat(phiNew - phiRef);

      // Calculate relative theta from gamma value
      const thetaInDeg = gamma > 0 ? gamma : 180 + gamma;
      const relativeTheta = parseFloat(
        Utils.degToRad(thetaInDeg) - Math.PI * 0.5
      );

      const prevRelativePhi = this.getProperty("relative_phi");
      const prevRelativeTheta = this.getProperty("relative_theta");
      if (Math.abs(relativePhi - prevRelativePhi) > AngleError) {
        this.setProperty("relative_phi", relativePhi);
      }
      if (Math.abs(relativeTheta - prevRelativeTheta) > AngleError) {
        this.setProperty("relative_theta", relativeTheta);
      }
      this.setProperty("up_vector", [0, 1, 0]);

      /*
      const displayOutList = [
        `alpha: ${parseFloat(alpha).toFixed(2)}`,
        `gamma: ${parseFloat(gamma).toFixed(2)}`,
        `phiNew: ${parseFloat(phiNew).toFixed(2)}`,
        `relativePhi: ${relativePhi.toFixed(2)}`,
        `relativeTheta: ${relativeTheta.toFixed(2)}`
      ];
      this.userControl.displayOut(displayOutList);
      */
    };
    const listenerObj = {
      name: "TwoEyesListener",
      cb: handleChange
    };
    this.userControl.listenToDeviceOrientation(listenerObj);
  }
}
