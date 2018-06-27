import { m4, addVectors, subtractVectors, normalize } from "../../lib/m4";
import config from "./config";
import WorldObject from "../../WorldObject";
import Utils from "../../AppUtils";

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

    // we should be setting target_postion based on relative_target_position
    this.setPropertyGetter("target_position", () => {
      // relativeTargetPos to target position
      const position = this.getProperty("position");
      const relativeTargetPos = this.getProperty("relative_target_position");
      return addVectors(position, relativeTargetPos);
    });
  }

  listentToOrientationChange() {
    const initialPhi = this.getProperty("initial_phi");
    this.setProperty("phi", initialPhi);
    let phiRef;

    const toPhiInDeg = (gamma, alpha) =>
      360 - (gamma > 0 ? alpha + 180 : alpha) % 360;

    const handleChange = obj => {
      const { alpha, beta, gamma } = obj;
      if (!alpha || !beta || !gamma) return;

      // calculate phi from alpha value
      // We consider relative phi around initial phi that we set as property
      const phiInDeg = toPhiInDeg(gamma, alpha);
      const phiNew = Utils.degToRad(phiInDeg);
      if (phiRef === undefined) phiRef = phiNew; // Initialize phiRef
      const phi = Utils.clampTo0And2PI(initialPhi + (phiNew - phiRef));

      // Calculate theta from gamma value
      const thetaInDeg = gamma > 0 ? gamma : 180 + gamma;
      const theta = Utils.degToRad(thetaInDeg);

      this.setProperty("phi", phi);
      this.setProperty("theta", theta);
      this.setProperty("up_vector", [0, 1, 0]);

      const displayOutList = [
        `alpha: ${parseFloat(alpha).toFixed(2)}`,
        `gamma: ${parseFloat(gamma).toFixed(2)}`,
        `phiNew: ${parseFloat(phiNew).toFixed(2)}`,
        `phi: ${parseFloat(phi).toFixed(2)}`,
        `theta: ${parseFloat(theta).toFixed(2)}`
      ];
      this.userControl.displayOut(displayOutList);
    };
    const listenerObj = {
      name: "TwoEyesListener",
      cb: handleChange
    };
    this.userControl.listenToDeviceOrientation(listenerObj);
  }
}
