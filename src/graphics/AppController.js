import { Utils } from "./AppUtils";

import WorldScene0 from "./WorldScene0";

import { Canvas } from "./ShaderFactory/Canvas";

export default class AppController {
  constructor(baseDiv, wrapperDiv) {
    this.canvasObj2 = new Canvas(wrapperDiv);

    this.layers = [];

    this.layers[1] = new WorldScene0(wrapperDiv, this.canvasObj2);
  }

  init(dataObj) {
    if (!dataObj) return;

    // window.onwheel = function(){ return false; }

    this.dataObject = dataObj;

    for (let i in this.layers) {
      // set params
      this.layers[i].dataObject = this.dataObject;

      this.layers[i].renderAll = this.renderAll.bind(this);
      this.layers[i].createScene();
    }

    this.renderAll();
  }

  renderAll() {
    for (let i in this.layers) {
      this.layers[i].renderScene();
    }
  }

  clearAll() {
    this.layers.forEach(layer => {
      layer.clear();
    });
  }

  onResize() {
    this.layers.forEach(layer => {
      layer.onResize();
    });
  }

  setStateUpdateHandler(stateUpdateHandler) {
    this.layers[1].stateUpdateHandler = stateUpdateHandler;
  }
}
