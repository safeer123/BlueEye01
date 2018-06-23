import renderConfigNoLight from "../../ObjectGroup3D/renderConfig";
import renderConfigLight from "../../ObjectGroup3D/renderConfigLight";
import GraphicsLayer from "../../lib/GraphicsLayer";
import UserControl from "../../lib/UserControl";

import SplitScreenView from "./SplitScreenView";
import SingleNodeView from "./SingleNodeView";

// WorldScene0 Layer
export default class TestView001 extends GraphicsLayer {
  // Construct canvas and webgl context
  constructor(wrapperElem) {
    super(wrapperElem);
    this.userControl = new UserControl(this.displayOutHandler);

    this.viewList = [SplitScreenView, SingleNodeView];
    this.currentViewIndex = 0;
    this.setCurrentView(0);

    this.registerViewSwitchControl();
  }

  registerViewSwitchControl() {
    const { userControl, viewList } = this;
    const main = () => {
      const nextIndex = (this.currentViewIndex + 1) % viewList.length;
      this.setCurrentView(nextIndex);
    };
    const keyControlObject = {
      modeName: "Switch Views",
      main
    };
    userControl.registerControlMode("Controlv", keyControlObject);
  }

  displayOutHandler = displayOutList => {
    if (
      displayOutList &&
      displayOutList.length > 0 &&
      this.stateUpdateHandler
    ) {
      this.stateUpdateHandler(displayOutList, 2);
    }
  };

  setCurrentView(index) {
    if (this.currentView) {
      this.currentView.stop();
    }
    const { gl, shaderFac: { shaderPrograms }, userControl, canvas } = this;
    const inObj = {
      gl,
      shaderPrograms,
      renderConfigLight,
      renderConfigNoLight,
      userControl
    };
    const preRender = () => this.clear(); // Find a good logic for clearing screen
    const CustomCanvasView = this.viewList[index];
    this.currentView = new CustomCanvasView(canvas, preRender, inObj);
    this.currentViewIndex = index;
    this.createScene();
    this.displayOutHandler([this.currentView.name]);
  }

  createScene() {
    // Reconstruct nodes every time this methode is called
    if (this.currentView) {
      this.currentView.createScene();
      this.currentView.start();
    }
  }
}
