import WorldObject from "../../WorldObject";
import config from "./config";

// Defines a scene setter
// This contributes to form the entire scene
export default class SceneSetter extends WorldObject {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);
    this.sceneSetterType = null; // to be defined by derived class
    this.sceneSettingProps = [];
  }

  addSceneSettingProps(propNameList) {
    if (propNameList && propNameList.length > 0) {
      this.sceneSettingProps.push(...propNameList);
    }
  }

  setSceneSetterType(type) {
    this.sceneSetterType = type;
  }

  // Mandatory method
  // This gets invoked at runtime while rendering each object
  setupScene(objRenderer) {
    // To be overridden by the derived class
    throw Error(
      `${
        this.sceneSetterType
      }: Scene setter does not have mandatory setupScene method.`
    );
  }

  // Override render
  render() {
    if (this.rebuildProperties && this.sceneSettingProps.length > 0) {
      this.sceneSettingProps.forEach(propName => {
        // We just recompute the properties once
        this.getProperty(propName);
      });
    }
    // call WO render method
    super.render();
  }
}
