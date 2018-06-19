import ObjectRenderer from "../../../lib/ObjectRenderer";

// Import World Objects
import CompositeShape from "../../../WorldObjectStore/CompositeShapes0";
import Camera from "../../../WorldObjectStore/CameraAbstract";
import Sun from "../../../WorldObjectStore/Sun";
import LightSource from "../../../WorldObjectStore/LightSource";

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

  const shapes = new CompositeShape(
    new ObjectRenderer(gl, shaderPrograms, renderConfigLight),
    userControl
  );

  const sunObj = new Sun(gl, shaderPrograms, userControl);

  const lightObj0 = new LightSource(
    new ObjectRenderer(gl, shaderPrograms, renderConfigLight),
    userControl
  );
  shapes.addChildren([lightObj0]);

  const leftCamPos = [pupillaryDistance * 0.5, 20, -40];
  const rightCamPos = [-pupillaryDistance * 0.5, 20, -40];
  const targetPos = [0, 0, 0];
  const upVec = [0, 1, 0];

  const camLeft = new Camera(
    new ObjectRenderer(gl, shaderPrograms, renderConfigNoLight),
    userControl
  );
  camLeft.setId("LEFT_CAM");
  camLeft.setProperty("camera_position", leftCamPos);
  camLeft.setProperty("target_position", targetPos);
  camLeft.setProperty("up_vector", upVec);

  const camRight = new Camera(
    new ObjectRenderer(gl, shaderPrograms, renderConfigNoLight),
    userControl
  );
  camRight.setId("RIGHT_CAM");
  camRight.setProperty("camera_position", rightCamPos);
  camRight.setProperty("target_position", targetPos);
  camRight.setProperty("up_vector", upVec);

  // return all root nodes
  return {
    nodes: [sunObj, shapes, camLeft, camRight],
    camLeft,
    camRight
  };
}
