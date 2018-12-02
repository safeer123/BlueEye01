import renderConfigNoLight from "../../Geometry/Objects3D/renderConfig";
import renderConfigLight from "../../Geometry/Objects3D/renderConfigLight";
import ViewHolder from "../../SceneBuilder/ViewHolder";

import SplitScreenView from "./SplitScreenView";
import SingleNodeView from "./SingleNodeView";
import OneEyeView from "./OneEyeView";
import TwoEyesView from "./TwoEyesView";

import getNodes from "./nodes";

// TestView001 ViewHolder (Smart Graphics Layer)
export default class TestView001 extends ViewHolder {
  // Construct canvas and webgl context
  constructor(wrapperElem) {
    super(wrapperElem);
    const {
      gl,
      shaderFac: { shaderPrograms }
    } = this;
    const inObj = {
      gl,
      programs: shaderPrograms,
      renderConfigLight,
      renderConfigNoLight
    };
    this.nodeObj = getNodes(inObj);
    super.init();
  }

  createScene() {
    // This should be How we rebuild the scene
    if (this.currentView) {
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
      name: "Split Screen View",
      short: "SSV",
      canvasViewClass: SplitScreenView
    },
    {
      id: 3,
      name: "One Eye View",
      short: "OEV",
      canvasViewClass: OneEyeView
    }
  ];
}
  /* eslint-enable */

  preRender = () => this.clear(); // Find a good logic for clearing screen

  createCanvasView(CustomCanvasView) {
    const canvasView = new CustomCanvasView(this.canvas, this.preRender);
    canvasView.setNodeObj(this.nodeObj);
    return canvasView;
  }
}
