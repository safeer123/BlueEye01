// Using factory we will create WOs
import WOFACTORY from "../../../WorldObjectStore/Factory";
import NodeTypes from "../../../WorldObjectStore/constants/NodeTypes";

import CarpetType from "./Carpet1";
import CylinderType from "./CylinderObject";

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

  const carpet = WOFACTORY.create(CarpetType, [inObj()]);

  const cylinderShape = WOFACTORY.create(CylinderType, [inObj()]);
  carpet.addChildren([cylinderShape]);

  const sunObj = WOFACTORY.create(NodeTypes.SUN_OBJECT, [
    inObj(renderConfig2D)
  ]);

  const lightObj0 = WOFACTORY.create(NodeTypes.GLOWING_SPHERE, [inObj()]);
  lightObj0.setProperty("isON", true);
  lightObj0.setProperty("translation", [0, 5, 0]);
  carpet.addChildren([lightObj0]);

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
  camThetaPhi.setProperty("radius", 20);
  cylinderShape.addChildren([camThetaPhi]);

  const twoEyes = WOFACTORY.create(NodeTypes.TWO_EYES, [inObj()]);
  twoEyes.setProperty("position", [0, 5, 40]);
  twoEyes.setProperty("radius", 150);
  twoEyes.setProperty("base_phi", 1.5 * Math.PI);

  // Animation
  const initAnimation = () => {
    setTimeout(() => {
      cylinderShape.setProperty("height", 5);
    }, 2);
  };

  // return all root nodes
  return {
    nodes: [sunObj, carpet, camLeft, camRight, twoEyes],
    camLeft,
    camRight,
    camThetaPhi,
    twoEyes,
    initAnimation
  };
}
