import config from "./config";
import OrientationListener from "../OrientationListener";
import WOFACTORY from "../Factory";
import NodeTypes from "../constants/NodeTypes";

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
    this.leftCamera.setPropertyGetter("target_position", () =>
      this.getProperty("relative_target_position")
    );
    this.leftCamera.setProperty("up_vector", [0, 1, 0]);

    this.rightCamera.setPropertyGetter("camera_position", () => {
      const pupillaryDist = this.getProperty("pupillary_distance");
      return [pupillaryDist * 0.5, 0, 0];
    });
    this.rightCamera.setPropertyGetter("target_position", () =>
      this.getProperty("relative_target_position")
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
}
