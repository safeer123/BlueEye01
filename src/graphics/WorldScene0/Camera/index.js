import { m4, Matrix4 } from "../../lib/m4";
import { SHADER_VARS } from "../../ShaderFactory/constants";
import WorldObject from "../../WorldObject";
import OBJ0 from "../../ObjectGroup3D/objects";
import config from "./config";

export default class Camera extends WorldObject {
  constructor(objRenderer, keyControl, configList = []) {
    super(objRenderer, keyControl, [config, ...configList]);

    if (config.CamConfig) {
      this.camConfig = config.CamConfig;
    }

    // Here the model matrix is exactly the lookAt matrix
    this.setPropertyGetter("model_matrix", () => {
      const cameraPosition = this.getProperty("camera_position");
      const targetPosition = this.getProperty("target_position");
      const upVector = this.getProperty("up_vector");
      const lookAtMatrix = m4.lookAt(cameraPosition, targetPosition, upVector);
      this.modelMatrix.setMatrix(lookAtMatrix);
      return this.modelMatrix.matrix();
    });

    this.setPropertyGetter(
      "projection_view_matrix",
      this.getProjectionViewMatrix.bind(this)
    );
  }

  defineGeometry() {
    this.enableNormals = false;
    // Build an object to represent the camera in the world
    // TODO: Create some way to add camera objects
    this.camShape = new OBJ0.Sphere3D(0.5, [0.2, 0.3, 0.3], 10, 4);
    this.camShape.modelMatrix = new Matrix4().scale(0.7, 0.7, 1);
    return [this.camShape];
  }

  setupScene(objRenderer) {
    objRenderer.setUniformGetter(SHADER_VARS.u_viewProjection, () => {
      return this.getProperty("projection_view_matrix");
    });
  }

  // Needed for only camera objects
  getProjectionViewMatrix() {
    const { fieldOfViewRadians, zNear, zFar } = this.camConfig;
    const viewportObj = this.getProperty("viewport");
    const aspect =
      this.objRenderer.getCanvasAspect() *
      viewportObj.width /
      viewportObj.height;

    const projectionMatrix = m4.perspective(
      fieldOfViewRadians,
      aspect,
      zNear,
      zFar
    );

    const cameraMatrix = this.getProperty("model_matrix");
    const viewMatrix = m4.inverse(cameraMatrix);

    // Compute a view projection matrix
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    return viewProjectionMatrix;
  }
}
