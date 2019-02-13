import EventEmitter from "../lib/EventEmitter";
import { EventName } from "../../constants/Events";
import SceneSetter from "../WorldObjectStore/SceneSetter";

class SceneGraph {
  // Initialize all nides. Set scene updater and extract a list of
  // Scene setters from the nodes
  static initializeNodes(nodeList) {
    // We should find all scene setters
    const sceneUpdater = () => EventEmitter.emit(EventName.UpdateScene);
    const sceneSetters = [];
    const processNode = node => {
      // Check if it is a scene setter
      if (node instanceof SceneSetter && node.sceneSetterType) {
        sceneSetters.push(node);
      }
      // set SceneUpdater Callback
      node.setSceneUpdater(sceneUpdater);

      // process nodes down the tree
      const { children } = node;
      if (children.length > 0) {
        children.forEach(childNode => processNode(childNode));
      }
    };

    nodeList.forEach(node => processNode(node));

    return {
      sceneSetters,
      nodeList
    };
  }
}

// Singleton class
export default new SceneGraph();
