import { m4, addVectors, subtractVectors, normalize } from "../../lib/m4";
import config from "./config";
import Camera from "../CameraAbstract";
import Utils from "../../AppUtils";

// Single camera acting like a single eye vision.
// Here we listen to device orientation changes and updates look at direction
export default class OneEye extends Camera {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

    // we should be setting target_postion based on orientation
    this.setPropertyGetter("target_position", () => {
      // r, theta, phi to target position
      const cameraPos = this.getProperty("camera_position");
      const sphericalPos = Utils.rThetaPhiToXYZ(
        this.getProperty("radius"),
        this.getProperty("theta"),
        this.getProperty("phi")
      );
      return addVectors(cameraPos, sphericalPos);
    });

    if (this.init) {
      this.init();
    }
  }

  init() {
    const initialPhi = this.getProperty("initial_phi");
    let phiRef;

    const toPhiInDeg = (gamma, alpha) =>
      360 - (gamma > 0 ? alpha + 180 : alpha) % 360;

    const handleChange = obj => {
      const { alpha, beta, gamma } = obj;
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
      name: "OneEyeListener",
      cb: handleChange
    };
    this.userControl.listenToDeviceOrientation(listenerObj);
  }
}
