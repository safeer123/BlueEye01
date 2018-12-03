import renderConfigNoLight from "../../Geometry/Objects3D/renderConfig";
import renderConfigLight from "../../Geometry/Objects3D/renderConfigLight";
import ViewHolder from "../../SceneBuilder/ViewHolder";

import getNodes from "./nodes";
import { ViewList } from "./config";

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
    const nodeObj = getNodes(inObj);
    super.init(nodeObj, ViewList);
  }
}
