import { m4, addVectors, subtractVectors, normalize } from "../../lib/m4";
import OBJ0 from "../../ObjectGroup3D/objects";
import config from "./config";
import Camera from "../CameraAbstract";
import Utils from "../../AppUtils";

export default class CamThetaPhi extends Camera {
  constructor(objRenderer, keyControl, configList = []) {
    super(objRenderer, keyControl, [config, ...configList]);

    // Here the model matrix is exactly the lookAt matrix
    this.setPropertyGetter("camera_position", () => {
      // r, theta, phi to camera position
      const targetPos = this.getProperty("target_position");
      const sphericalPos = Utils.rThetaPhiToXYZ(
        this.getProperty("radius"),
        this.getProperty("theta"),
        this.getProperty("phi")
      );
      return addVectors(targetPos, sphericalPos);
    });

    this.setPropertyGetter("up_vector", () => {
      // (r, theta, phi) to (r, theta-dtheta, phi)
      const sphericalPosDown = Utils.rThetaPhiToXYZ(
        this.getProperty("radius"),
        this.getProperty("theta"),
        this.getProperty("phi")
      );
      const sphericalPosUp = Utils.rThetaPhiToXYZ(
        this.getProperty("radius"),
        this.getProperty("theta") - 0.01,
        this.getProperty("phi")
      );
      return normalize(subtractVectors(sphericalPosUp, sphericalPosDown));
    });

    if (this.init) {
      this.init();
    }
  }

  init() {
    const getThetaAt = t => Utils.interpolate(0, Math.PI, t);
    const getPhiAt = t => Utils.interpolate(2 * Math.PI, 0, t);

    const modeName = "Camera-1";
    const changePhi = t => {
      this.setProperty("phi", getPhiAt(t));
      const phiInDeg = Utils.radToDegree(this.getProperty("phi"));
      return [modeName, `Phi: ${phiInDeg} deg`];
    };
    const changeTheta = t => {
      this.setProperty("theta", getThetaAt(t));
      const thetaInDeg = Utils.radToDegree(this.getProperty("theta"));
      return [modeName, `Theta: ${thetaInDeg} deg`];
    };
    const keyControlObject = {
      modeName: "Camera-ThetaPhi",
      ArrowLeftRight: {
        t: 0,
        dt: 0.01,
        cb: changePhi
      },
      ArrowUpDown: {
        t: 0.4,
        dt: 0.01,
        cb: changeTheta
      }
    };
    this.keyboardControl.createControlMode("default", keyControlObject);

    // initialize the keyboardControl Init values
    this.setProperty("theta", getThetaAt(0.4));
    this.setProperty("phi", getThetaAt(0));
  }
}
