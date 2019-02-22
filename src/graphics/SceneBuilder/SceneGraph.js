import EventEmitter from "../lib/EventEmitter";
import { EventName } from "../../constants/Events";
import SceneSetter from "../WorldObjectStore/SceneSetter";
import { ControlTypes } from "../../constants";

class SceneGraph {
  // Initialize all nides. Set scene updater and extract a list of
  // Scene setters from the nodes
  initializeNodes(nodeList) {
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
      sceneSetters
    };
  }

  onTickNode = (node, t) => {
    if (node.onTick) node.onTick(t);
    // process nodes down the tree
    const { children } = node;
    if (children.length > 0) {
      children.forEach(childNode => this.onTickNode(childNode, t));
    }
  };

  onTick(nodes, timestamp) {
    nodes.forEach(node => this.onTickNode(node, timestamp));
  }

  registerObjectControls(nodes) {
    if (nodes) {
      // How to register one node
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
      // Do this for all nodes
      nodes.forEach(node => registerNodeControls(node));
    }
  }
}

// Singleton class
export default new SceneGraph();