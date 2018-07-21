import { addVectors, Matrix4 } from "../../lib/m4";
import config from "./config";
import Camera from "../AbstractCamera";
import Utils from "../../AppUtils";
import { SecondaryKeys } from "../../lib/UserControl/constants";

export default class CamThetaPhi extends Camera {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

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
      const upVec = [0, 1, 0];
      const theta = this.getProperty("theta");
      const phi = this.getProperty("phi");
      const mtx4 = new Matrix4().zRotate(0.5 * Math.PI - theta).yRotate(-phi);
      return mtx4.apply(upVec);
    });

    this.setupControls();
  }

  setupControls() {
    const modeName = "Camera-θφ";
    const DPHI = 0.01;
    const DTHETA = 0.01;
    const phiPlus = dPhi => {
      const phi = (this.getProperty("phi") + dPhi) % (2 * Math.PI);
      this.setProperty("phi", phi);
    };
    const thetaPlus = dTheta => {
      const theta = (this.getProperty("theta") + dTheta) % Math.PI;
      this.setProperty("theta", theta);
    };
    const summary = () => {
      const phiInDeg = Utils.radToDeg(this.getProperty("phi"));
      const thetaInDeg = Utils.radToDeg(this.getProperty("theta"));
      return [modeName, `(φ: ${phiInDeg}°, θ: ${thetaInDeg}°)`];
    };
    const keyControlObject = {
      modeName,
      [SecondaryKeys.ArrowLeft]: () => phiPlus(-DPHI),
      [SecondaryKeys.ArrowRight]: () => phiPlus(DPHI),
      [SecondaryKeys.ArrowUp]: () => thetaPlus(-DTHETA),
      [SecondaryKeys.ArrowDown]: () => thetaPlus(DTHETA),
      summary
    };
    this.userControl.registerControlMode("default", keyControlObject);
  }
}
