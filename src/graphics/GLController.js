import TestView001 from "./CustomViews/TestView001";

export default class GLController {
  constructor(wrapperDiv) {
    // List of views we are going to build
    this.viewList = [];
    this.viewList.push(new TestView001(wrapperDiv));
  }

  init(dataObj) {
    if (!dataObj) return;

    // window.onwheel = function(){ return false; }

    this.dataObject = dataObj;

    this.viewList.forEach(view => {
      // set params
      view.dataObject = this.dataObject;
      // view.renderAll = this.renderAll.bind(this);
      view.createScene();
    });

    this.renderAll();
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
    if (done) done();
  }

  setStateUpdateHandler(stateUpdateHandler) {
    this.viewList.forEach(view => {
      view.stateUpdateHandler = stateUpdateHandler;
    });
  }

  handleGesture(gestureType, event) {
    this.viewList.forEach(view => {
      if (view.handleGesture) {
        view.handleGesture(gestureType, event);
      }
    });
  }
}
