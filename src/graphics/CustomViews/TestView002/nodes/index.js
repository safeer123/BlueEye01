// Using factory we will create WOs
import WOFACTORY from "../../../WorldObjectStore/Factory";
import NodeTypes from "../../../WorldObjectStore/constants/NodeTypes";

import PlatformType from "./Platform";
import Obj1Type from "./Object1";
import Obj2Type from "./Object2";
import Obj3Type from "./Object3";

const pupillaryDistance = 2;

// Scene0 Layer
export default function getNodes(inpObj) {
  const {
    gl,
    programs,
    renderConfigLight,
    renderConfig2D,
    userControl
  } = inpObj;

  const inObj = (config = renderConfigLight) => ({
    gl,
    programs,
    renderConfig: config,
    userControl
  });

  const platform = WOFACTORY.create(PlatformType, [inObj()]);

  const shape1 = WOFACTORY.create(Obj1Type, [inObj()]);
  platform.addChildren([shape1]);

  const shape2 = WOFACTORY.create(Obj2Type, [inObj()]);
  platform.addChildren([shape2]);

  const shape3 = WOFACTORY.create(Obj3Type, [inObj()]);
  platform.addChildren([shape3]);

  const sunObj = WOFACTORY.create(NodeTypes.SUN_OBJECT, [
    inObj(renderConfig2D)
  ]);

  const lightObj0 = WOFACTORY.create(NodeTypes.GLOWING_SPHERE, [inObj()]);
  lightObj0.setProperty("isON", true);
  lightObj0.setProperty("translation", [0, 5, 0]);
  platform.addChildren([lightObj0]);

  const leftCamPos = [pupillaryDistance * 0.5, 20, -40];
  const rightCamPos = [-pupillaryDistance * 0.5, 20, -40];
  const targetPos = [0, 0, 0];
  const upVec = [0, 1, 0];

  const camLeft = WOFACTORY.create(NodeTypes.ABSTRACT_CAMERA, [inObj(null)]);
  camLeft.setProperty("camera_position", leftCamPos);
  camLeft.setProperty("target_position", targetPos);
  camLeft.setProperty("up_vector", upVec);

  const camRight = WOFACTORY.create(NodeTypes.ABSTRACT_CAMERA, [inObj(null)]);
  camRight.setProperty("camera_position", rightCamPos);
  camRight.setProperty("target_position", targetPos);
  camRight.setProperty("up_vector", upVec);

  const camThetaPhi = WOFACTORY.create(NodeTypes.CAMERA_SPHERICAL_PATH, [
    inObj()
  ]);
  camThetaPhi.setProperty("target_position", [0, 0, 0]);
  camThetaPhi.setProperty("radius", 30);
  camThetaPhi.enableDefaultUserControls();
  shape3.addChildren([camThetaPhi]);

  const twoEyes = WOFACTORY.create(NodeTypes.TWO_EYES, [inObj()]);
  twoEyes.setProperty("position", [80, 5, 0]);
  twoEyes.setProperty("radius", 150);
  twoEyes.setProperty("base_phi", Math.PI);
  twoEyes.enableDefaultUserControls();
  // Animation
  const initAnimation = () => {
    setTimeout(() => {
      shape1.setProperty("height", 5);
    }, 2);
  };

  // return all root nodes
  return {
    nodes: [sunObj, platform, camLeft, camRight, twoEyes],
    camLeft,
    camRight,
    camThetaPhi,
    twoEyes,
    initAnimation
  };
}
