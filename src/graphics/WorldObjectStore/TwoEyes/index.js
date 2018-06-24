import config from "./config";
import OrientationListener from "../OrientationListener";
import WOFACTORY from "../Factory";
import NodeTypes from "../constants/NodeTypes";

// Define Two Eyes
// Two cameras attached to OrientationListener
export default class TwoEyes extends OrientationListener {
  constructor(objRenderer, keyControl, configList = []) {
    super(objRenderer, keyControl, [config, ...configList]);

    this.leftCamera = WOFACTORY.create(NodeTypes.ABSTRACT_CAMERA, [
      objRenderer,
      keyControl
    ]);
    this.rightCamera = WOFACTORY.create(NodeTypes.ABSTRACT_CAMERA, [
      objRenderer,
      keyControl
    ]);

    this.leftCamera.setPropertyGetter("camera_position", () => {
      const pupillaryDist = this.getProperty("pupillary_distance");
      return [pupillaryDist * 0.5, 0, 0];
    });
    this.leftCamera.setProperty("target_position", [0, 0, 1]);
    this.leftCamera.setProperty("up_vector", [0, 1, 0]);

    this.rightCamera.setPropertyGetter("camera_position", () => {
      const pupillaryDist = this.getProperty("pupillary_distance");
      return [-pupillaryDist * 0.5, 0, 0];
    });
    this.rightCamera.setProperty("target_position", [0, 0, 1]);
    this.rightCamera.setProperty("up_vector", [0, 1, 0]);

    this.addChildren([this.leftCamera, this.rightCamera]);
  }

  getLeftCamId() {
    return this.leftCamera.getId();
  }

  getRightCamId() {
    return this.rightCamera.getId();
  }
}
