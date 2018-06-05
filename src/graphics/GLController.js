import SceneBuilder from "./SceneBuilder";

export default class GLController {
  constructor(wrapperDiv) {
    // List of views we are going to build
    this.viewList = [];
    this.viewList.push(new SceneBuilder(wrapperDiv));
  }

  init(dataObj) {
    if (!dataObj) return;

    // window.onwheel = function(){ return false; }

    this.dataObject = dataObj;

    this.viewList.forEach(view => {
      // set params
      view.dataObject = this.dataObject;
      view.renderAll = this.renderAll.bind(this);
      view.createScene();
    });

    this.renderAll();
  }

  renderAll() {
    this.viewList.forEach(view => {
      view.renderScene();
    });
  }

  clearAll() {
    this.viewList.forEach(view => {
      view.clear();
    });
  }

  onResize(done) {
    this.viewList.forEach(view => {
      view.onResize();
      view.createScene();
    });
    this.renderAll();
    if (done) done();
  }

  setStateUpdateHandler(stateUpdateHandler) {
    this.viewList.forEach(view => {
      view.stateUpdateHandler = stateUpdateHandler;
    });
  }
}
