import { m4, addVectors, subtractVectors, normalize } from "../../lib/m4";
import config from "./config";
import OrientationListener from "../OrientationListener";
import WOFACTORY from "../Factory";
import NodeTypes from "../constants/NodeTypes";

// Single camera acting like a single eye vision.
// One camera attached to OrientationListener
export default class OneEye extends OrientationListener {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

    const getTargetPos = cam => {
      const relativeTargetPos = this.getProperty("relative_target_position");
      const camPos = cam.getProperty("camera_position");
      return subtractVectors(relativeTargetPos, camPos);
    };

    const inObjForCam = { ...inObj, renderConfig: null };
    this.camera = WOFACTORY.create(NodeTypes.ABSTRACT_CAMERA, [inObjForCam]);

    this.camera.setPropertyGetter("camera_position", () => [0, 0, 0]);
    this.camera.setPropertyGetter("target_position", () =>
      getTargetPos(this.camera)
    );
    this.camera.setProperty("up_vector", [0, 1, 0]);

    this.addChildren([this.camera]);

    super.listentToOrientationChange();
  }

  getCamId() {
    return this.camera.getId();
  }
}
