import ObjectRenderer from "../../../lib/ObjectRenderer";

// Using factory we will create WOs
import WOFACTORY from "../../../WorldObjectStore/Factory";
import NodeTypes from "../../../WorldObjectStore/constants/NodeTypes";

const pupillaryDistance = 2;

// Scene0 Layer
export default function getNodes(inObj) {
  const {
    gl,
    shaderPrograms,
    renderConfigLight,
    renderConfigNoLight,
    userControl
  } = inObj;

  const newRenderer = (config = renderConfigLight) =>
    new ObjectRenderer(gl, shaderPrograms, config);

  const shapes = WOFACTORY.create(NodeTypes.COMPOSITE_CUSTOM_SHAPES, [
    newRenderer(),
    userControl
  ]);

  const sunObj = WOFACTORY.create(NodeTypes.SUN_OBJECT, [
    gl,
    shaderPrograms,
    userControl
  ]);

  const lightObj0 = WOFACTORY.create(NodeTypes.ABSTRACT_LIGHT, [
    newRenderer(),
    userControl
  ]);
  shapes.addChildren([lightObj0]);

  const leftCamPos = [pupillaryDistance * 0.5, 20, -40];
  const rightCamPos = [-pupillaryDistance * 0.5, 20, -40];
  const targetPos = [0, 0, 0];
  const upVec = [0, 1, 0];

  const camLeft = WOFACTORY.create(NodeTypes.ABSTRACT_CAMERA, [
    newRenderer(renderConfigNoLight),
    userControl
  ]);
  camLeft.setProperty("camera_position", leftCamPos);
  camLeft.setProperty("target_position", targetPos);
  camLeft.setProperty("up_vector", upVec);

  const camRight = WOFACTORY.create(NodeTypes.ABSTRACT_CAMERA, [
    newRenderer(renderConfigNoLight),
    userControl
  ]);
  camRight.setProperty("camera_position", rightCamPos);
  camRight.setProperty("target_position", targetPos);
  camRight.setProperty("up_vector", upVec);

  const camThetaPhi = WOFACTORY.create(NodeTypes.CAMERA_SPHERICAL_PATH, [
    newRenderer(renderConfigNoLight),
    userControl
  ]);
  camThetaPhi.setProperty("target_position", [0, 0, 0]);
  camThetaPhi.setProperty("radius", 40);
  shapes.addChildren([camThetaPhi]);

  // Animation
  let theta = 0;
  const deltaTheta = 0.005;
  let animationRef = null;
  const initAnimation = () => {
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
    nodes: [sunObj, shapes, camLeft, camRight],
    camLeft,
    camRight,
    camThetaPhi,
    initAnimation
  };
}
