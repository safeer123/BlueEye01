import { m4, Matrix4 } from "../lib/m4";
import { SHADER_VARS } from "../ShaderFactory/constants";
import config from "./config";
import { Utils } from "../AppUtils";

export default class WorldObject {
  constructor(objRenderer, keyboardControl, configList = []) {
    this.objRenderer = objRenderer;
    this.keyboardControl = keyboardControl;
    this.propertyBucket = {};
    this.modelMatrix = new Matrix4();

    // We combine self configuration with inherited configuration
    // Each one is a configObject having PropertyList/InitList of its own
    this.completeConfigList = [config, ...configList];
    this.completeConfigList.forEach(cnf => {
      // Apply each config object
      if (cnf.PropertyList) this.defineProperties(cnf.PropertyList);
      if (cnf.InitList) this.initProperties(cnf.InitList);
    });

    // Flag that is responsible for recalculating properties once again
    // Defaulting this to true
    // Once we render, we should set this flag false
    this.rebuildProperties = true;

    // default getters
    this.setPropertyGetter("model_matrix", () => this.modelMatrix.matrix());

    this.setPropertyGetter("viewport", () => this.getValue("viewport"));

    this.createObjects(this.defineGeometry());
  }

  defineProperty(propertyObj) {
    this.propertyBucket[propertyObj.name] = Utils.clone(propertyObj);
  }

  defineProperties(propertyObjList = []) {
    if (propertyObjList.length > 0) {
      propertyObjList.forEach(propertyObj => {
        this.defineProperty(propertyObj);
      });
    }
  }

  initProperties(initList = []) {
    if (initList.length > 0) {
      initList.forEach(initObj => {
        this.setProperty(initObj.name, initObj.value);
      });
    }
  }

  setProperty(propertyName, value) {
    const propertyObj = this.propertyBucket[propertyName];
    if (!propertyObj) {
      console.error(`WorldObject:setProperty(): ${propertyName} not defined.`);
    }
    if (propertyObj.min && value < propertyObj.min) {
      propertyObj.value = propertyObj.min;
    } else if (propertyObj.max && value > propertyObj.max) {
      propertyObj.value = propertyObj.max;
    } else {
      propertyObj.value = value;
    }
    // This will imply that we should recompute all properties
    this.rebuildProperties = true;
  }

  setPropertyGetter(propertyName, getter) {
    if (!this.propertyBucket[propertyName]) {
      console.error(`WorldObject:setProperty(): ${propertyName} not defined.`);
    }
    this.propertyBucket[propertyName].getter = getter;
    // This will imply that we should recompute all properties
    this.rebuildProperties = true;
  }

  getProperty(propertyName) {
    const { rebuildProperties } = this;
    const propertyObj = this.propertyBucket[propertyName];
    if (!propertyObj) {
      console.error(`WorldObject:getProperty(): ${propertyName} not defined.`);
    }
    // If rebuildProperties=true and there is a getter then we compute it
    if (rebuildProperties && propertyObj.getter) {
      const computedValue = propertyObj.getter();
      this.setProperty(propertyName, computedValue);
    }
    // if no getter, return the value
    return this.getValue(propertyName);
  }

  getValue(propertyName) {
    if (!this.propertyBucket[propertyName]) {
      console.error(`WorldObject:getValue(): ${propertyName} not defined.`);
    }
    return this.propertyBucket[propertyName].value;
  }

  createObjects(objList) {
    objList.forEach(obj => {
      obj.enableNormals = this.enableNormals;
    });

    const { objRenderer } = this;
    objRenderer.clearObjects();
    objRenderer.addObjects(objList);
    objRenderer.createBuffers();

    objRenderer.setUniformGetter(SHADER_VARS.u_world, () => {
      const modelMatrix = this.getProperty("model_matrix");
      return modelMatrix;
    });

    // TODO: Remove this if not needed anymore
    objRenderer.setUniformGetter(SHADER_VARS.u_worldViewProjection, () => {
      const projectionViewMatrix = this.getProperty("projection_view_matrix");
      const modelMatrix = this.getProperty("model_matrix");
      const matrix = m4.multiply(projectionViewMatrix, modelMatrix);
      return matrix;
    });

    objRenderer.setUniformGetter(SHADER_VARS.u_worldInverseTranspose, () => {
      const matrix = this.modelMatrix.getInverseTransposeMatrix();
      return matrix;
    });

    objRenderer.setUniformGetter(SHADER_VARS.u_reverseLightDirection, () => {
      const vec3 = [1, 1, 1];
      return vec3;
    });

    objRenderer.setUniformGetter(SHADER_VARS.u_emissiveColor, () =>
      this.getProperty("emissive_color")
    );

    objRenderer.setUniformGetter(SHADER_VARS.u_Ka, () =>
      this.getValue("k_ambient")
    );

    objRenderer.setUniformGetter(SHADER_VARS.u_Kd, () =>
      this.getValue("k_diffuse")
    );

    objRenderer.setUniformGetter(SHADER_VARS.u_Ks, () =>
      this.getProperty("k_specular")
    );

    // For 2D
    objRenderer.setUniformGetter(SHADER_VARS.u_resolution, () => {
      const { width, height } = objRenderer.gl.canvas;
      return [width, height];
    });

    objRenderer.setUniformGetter(SHADER_VARS.u_matrix, () => [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ]);
  }

  setSceneConfig(sceneConfig) {
    this.setPropertyGetter("viewport", () => sceneConfig.viewport);

    this.sceneManager = sceneConfig;
  }

  render() {
    // Todo: do this only once when we keep a unique sceneManager
    // check sceneManager has changed, only then do this
    // (eventually this will go inside sceneManager class)
    if (this.sceneManager) {
      this.sceneManager.sceneSetters.forEach(sceneSetter => {
        sceneSetter.setupScene(this.objRenderer);
      });
    }
    const viewport = this.getProperty("viewport");
    this.objRenderer.render(viewport);

    // By this time we have already rebuilt all properties
    this.rebuildProperties = false;
  }

  // override this method to add geometry
  defineGeometry() {
    // return a list of geometry objects to render
    return [];
  }
}
