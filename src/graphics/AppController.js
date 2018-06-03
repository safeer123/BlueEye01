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

    this.layers.forEach(layer => {
      // set params
      layer.dataObject = this.dataObject;
      layer.renderAll = this.renderAll.bind(this);
      layer.createScene();
    });

    this.renderAll();
  }

  renderAll() {
    this.layers.forEach(layer => {
      layer.renderScene();
    });
  }

  clearAll() {
    this.layers.forEach(layer => {
      layer.clear();
    });
  }

  onResize(done) {
    this.layers.forEach(layer => {
      layer.onResize();
      layer.createScene();
    });
    this.renderAll();
    if (done) done();
  }

  setStateUpdateHandler(stateUpdateHandler) {
    this.layers[1].stateUpdateHandler = stateUpdateHandler;
  }
}
