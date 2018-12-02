import SceneSetter from "../WorldObjectStore/SceneSetter";
import SceneSetterTypes from "../WorldObjectStore/constants/SceneSetterTypes";
import EventEmitter from "../lib/EventEmitter";
import { EventName } from "../../constants/Events";
import { ControlTypes } from "../../constants";

/** *****************************
Define Scene class
- nodeList for rendering
- Scene setters
- render method
********************************** */
export default class Scene {
  constructor(name) {
    this.name = name;
    this.nodeList = [];
    this.sceneSetters = [];
    this.relevantSceneSetters = null;
    this.activeCameraId = null;
  }

  sceneUpdater = () => {
    EventEmitter.emit(EventName.UpdateScene);
  };

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

  processNodeList() {
    // We should find all scene setters
    const { sceneUpdater } = this;
    this.sceneSetters = [];
    const processNode = node => {
      // Check if it is a scene setter
      if (node instanceof SceneSetter && node.sceneSetterType) {
        this.sceneSetters.push(node);
      }
      // set SceneUpdater Callback
      node.setSceneUpdater(sceneUpdater);

      // process nodes down the tree
      const { children } = node;
      if (children.length > 0) {
        children.forEach(childNode => processNode(childNode));
      }
    };

    this.nodeList.forEach(node => processNode(node));
  }

  registerControls() {
    const registerNodeControls = node => {
      // register controls here
      if (node.getUserControls) {
        const controlObj = node.getUserControls();
        if (controlObj) {
          controlObj.type = ControlTypes.ObjectControl;
          controlObj.id = node.Id;
          EventEmitter.emit(EventName.RegisterControls, controlObj);
        }
      }

      // process nodes down the tree
      const { children } = node;
      if (children.length > 0) {
        children.forEach(childNode => registerNodeControls(childNode));
      }
    };

    this.nodeList.forEach(node => registerNodeControls(node));
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

  clone(cloneName) {
    this.processNodeList();
    // returns a duplicate scene
    // with same nodeList and sceneSetters
    // activeCamera should ideally differ
    const cloneScene = new Scene(cloneName);
    cloneScene.setNodeList(this.nodeList);
    cloneScene.setSceneSetters(this.sceneSetters);
    cloneScene.setActiveCameraId(this.activeCameraId);
    return cloneScene;
  }

  setActiveCameraId(id) {
    this.activeCameraId = id;

    // Recalculation needed for relevantSceneSetters
    this.relevantSceneSetters = null;
  }

  render(viewport) {
    // Process nodes if needed
    if (this.sceneSetters.length === 0) {
      this.processNodeList();
    }

    const { nodeList, sceneSetters, relevantSceneSetters } = this;
    if (nodeList.length > 0 && sceneSetters.length > 0) {
      // We need relevantSceneSetters for producing the scene
      if (!relevantSceneSetters) {
        this.relevantSceneSetters = this.getRelevantSceneSetters();
      }

      if (this.relevantSceneSetters.length > 0) {
        // Create Scene config
        const { name } = this;
        const sceneConfig = {
          name,
          viewport,
          sceneSetters: this.relevantSceneSetters
        };

        // Rendering the scene
        nodeList.forEach(node => node.setSceneConfig(sceneConfig));
        nodeList.forEach(node => {
          node.render();
        });
      }
    }
  }
}
