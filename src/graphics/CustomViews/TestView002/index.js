import renderConfigNoLight from "../../Geometry/Objects3D/renderConfig";
import renderConfigLight from "../../Geometry/Objects3D/renderConfigLight";
import renderConfig2D from "../../Geometry/Objects2D/renderConfig";
import ViewHolder from "../../SceneBuilder/ViewHolder";

import SingleNodeView from "./SingleNodeView";
import TwoEyesView from "./TwoEyesView";
import OneEyeView from "./OneEyeView";

// TestView001 ViewHolder (Smart Graphics Layer)
export default class TestView001 extends ViewHolder {
  // Construct canvas and webgl context
  constructor(wrapperElem) {
    super(wrapperElem);
    // this.mainScene
  }

  createScene() {
    this.userControl.clearControlModes();
    // This should be How we rebuild the scene
    if (this.currentView) {
      this.currentView.stop();
      this.currentView.createScene();
      this.currentView.start();
    }
  }
/* eslint-disable */
  getViewList() {
    return[
    {
      id: 1,
      name: "Single Node View",
      short: "SNV",
      canvasViewClass: SingleNodeView
    },
    {
      id: 0,
      name: "VR View",
      short: "VR",
      canvasViewClass: TwoEyesView
    },
    {
      id: 2,
      name: "One Eye View",
      short: "OEV",
      canvasViewClass: OneEyeView
    }
  ];
  }
  /* eslint-enable */
  createCanvasView(CustomCanvasView) {
    const {
      gl,
      shaderFac: { shaderPrograms },
      userControl,
      canvas
    } = this;
    const inObj = {
      gl,
      programs: shaderPrograms,
      renderConfigLight,
      renderConfigNoLight,
      renderConfig2D,
      userControl
    };
    const preRender = () => this.clear(); // Find a good logic for clearing screen
    return new CustomCanvasView(canvas, preRender, inObj);
  }
}
