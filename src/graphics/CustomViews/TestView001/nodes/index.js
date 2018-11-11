// Using factory we will create WOs
import WOFACTORY from "../../../WorldObjectStore/Factory";
import NodeTypes from "../../../WorldObjectStore/constants/NodeTypes";

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

  const shapes = WOFACTORY.create(NodeTypes.COMPOSITE_CUSTOM_SHAPES, [inObj()]);

  const globalLightObj = WOFACTORY.create(NodeTypes.GLOBAL_LIGHTING, [
    inObj(renderConfig2D)
  ]);

  const lightObj0 = WOFACTORY.create(NodeTypes.GLOWING_SPHERE, [inObj()]);
  lightObj0.setProperty("isON", true);
  lightObj0.setProperty("translation", [10, 5, 0]);
  shapes.addChildren([lightObj0]);

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
  camThetaPhi.setProperty("radius", 40);
  shapes.addChildren([camThetaPhi]);

  const oneEyeCam = WOFACTORY.create(NodeTypes.ONE_EYE_CAMERA, [inObj()]);
  oneEyeCam.setProperty("position", [0, 0, 40]);
  oneEyeCam.setProperty("radius", 40);
  oneEyeCam.setProperty("base_phi", 1.5 * Math.PI);

  const twoEyes = WOFACTORY.create(NodeTypes.TWO_EYES, [inObj()]);
  twoEyes.setProperty("position", [0, 0, -40]);
  twoEyes.setProperty("radius", 40);
  twoEyes.setProperty("base_phi", 0.5 * Math.PI);

  // Animation
  let theta = 0;
  const deltaTheta = 0.005;
  let animationRef = null;
  const initScene = () => {
    if (animationRef) {
      clearInterval(animationRef);
    }
    animationRef = setInterval(() => {
      if (theta > Math.PI * 2) {
        theta %= Math.PI * 2;
      }
      theta += deltaTheta;
      shapes.setProperty("theta", theta);
    }, 50);
  };

  // return all root nodes
  return {
    nodes: [globalLightObj, shapes, camLeft, camRight, oneEyeCam, twoEyes],
    camLeft,
    camRight,
    camThetaPhi,
    oneEyeCam,
    twoEyes,
    initScene
  };
}
