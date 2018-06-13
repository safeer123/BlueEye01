import SceneSetter from "../WorldObjectStore/SceneSetter";
import SceneSetterTypes from "../WorldObjectStore/constants/SceneSetterTypes";

/** *****************************
Define Scene class
- NodeList for rendering
- Scene setters
- Viewport (W.R.T Canvas coordinates and NOT normalized)
- render method
********************************** */
export default class Scene {
  constructor(name) {
    this.name = name;
    this.nodeList = [];
    this.sceneSetters = [];
    this.relevantSceneSetters = null;
    this.viewport = null;
    this.activeCameraId = null;
  }

  setNodeList(nodeList) {
    this.nodeList = nodeList;

    // Recalculation needed for relevantSceneSetters
    this.relevantSceneSetters = null;
  }

  setSceneSetters(sceneSetters) {
    this.sceneSetters = sceneSetters;

    // Recalculation needed for relevantSceneSetters
    this.relevantSceneSetters = null;
  }

  createSceneSettersFromNodeList() {
    this.sceneSetters = [];
    const pullSceneSetters = node => {
      if (node instanceof SceneSetter && node.sceneSetterType) {
        this.sceneSetters.push(node);
      }
      const { children } = node;
      if (children.length > 0) {
        children.forEach(childNode => pullSceneSetters(childNode));
      }
    };

    this.nodeList.forEach(node => pullSceneSetters(node));
  }

  getRelevantSceneSetters() {
    const { sceneSetters } = this;
    const relevantSceneSetters = sceneSetters.filter(sceneSetter => {
      const { sceneSetterType, Id } = sceneSetter;
      const isActive = sceneSetter.getProperty("isActive");
      if (isActive) {
        if (sceneSetterType === SceneSetterTypes.CAMERA_SCENE_SETTER) {
          return Id === this.activeCameraId;
        }
        return true;
      }
      return false;
    });
    return relevantSceneSetters;
  }

  setViewport(viewport) {
    this.viewport = viewport;
  }

  clone(cloneName) {
    // returns a duplicate scene
    // with same nodeList and sceneSetters
    // viewport and activeCamera should ideally differ
    const cloneScene = new Scene(cloneName);
    cloneScene.setNodeList(this.nodeList);
    cloneScene.setSceneSetters(this.sceneSetters);
    cloneScene.setViewport(this.viewport);
    cloneScene.setActiveCameraId(this.activeCameraId);
    return cloneScene;
  }

  setActiveCameraId(id) {
    this.activeCameraId = id;

    // Recalculation needed for relevantSceneSetters
    this.relevantSceneSetters = null;
  }

  render() {
    const {
      nodeList,
      sceneSetters,
      relevantSceneSetters,
      getRelevantSceneSetters
    } = this;
    if (nodeList.length > 0 && sceneSetters.length > 0) {
      // We need relevantSceneSetters for producing the scene
      if (!relevantSceneSetters) {
        this.relevantSceneSetters = getRelevantSceneSetters();
      }

      if (this.relevantSceneSetters.length > 0) {
        // Create Scene config
        const { name, viewport } = this;
        const sceneConfig = {
          name,
          viewport,
          sceneSetters: this.relevantSceneSetters
        };

        // Rendering the scene
        nodeList.forEach(node => node.setSceneConfig(sceneConfig));
        nodeList.forEach(node => node.render());
      }
    }
  }
}
