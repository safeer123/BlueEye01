// Using factory we will create WOs
import WOFACTORY from "../../../WorldObjectStore/Factory";
import NodeTypes from "../../../WorldObjectStore/constants/NodeTypes";

import PlatformType from "./Platform";
import Obj1Type from "./Object1";
import Obj2Type from "./Object2";
import Obj3Type from "./Object3";
import Obj4Type from "./Object4";
import Obj5Type from "./Object5";
import LightTowerType from "./Object6";

// Scene0 Layer
export default function getNodes(inpObj) {
  const {
    gl,
    programs,
    renderConfigLight,
    renderConfig2D,
    userControl
  } = inpObj;

  const inObj = (config = renderConfigLight) => ({
    gl,
    programs,
    renderConfig: config,
    userControl
  });

  WOFACTORY.reset();

  const platform = WOFACTORY.create(PlatformType, [inObj()]);

  const shape1 = WOFACTORY.create(Obj1Type, [inObj()]);
  platform.addChildren([shape1]);

  const shape2 = WOFACTORY.create(Obj2Type, [inObj()]);
  platform.addChildren([shape2]);

  const shape3 = WOFACTORY.create(Obj3Type, [inObj()]);
  platform.addChildren([shape3]);

  const shape4 = WOFACTORY.create(Obj4Type, [inObj()]);
  platform.addChildren([shape4]);

  const shape5 = WOFACTORY.create(Obj5Type, [inObj()]);
  platform.addChildren([shape5]);

  const light01 = WOFACTORY.create(LightTowerType, [inObj()]);
  platform.addChildren([light01]);

  const globalLightObj = WOFACTORY.create(NodeTypes.GLOBAL_LIGHTING, [
    inObj(renderConfig2D)
  ]);
  globalLightObj.setProperty("theta", 0.1 * Math.PI);

  const centralLightObj = WOFACTORY.create(NodeTypes.GLOWING_SPHERE, [inObj()]);
  centralLightObj.setProperty("isON", true);
  centralLightObj.setProperty("translation", [0, 5, 0]);
  platform.addChildren([centralLightObj]);

  const camThetaPhi = WOFACTORY.create(NodeTypes.CAMERA_SPHERICAL_PATH, [
    inObj()
  ]);
  camThetaPhi.setProperty("target_position", [0, 0, 0]);
  camThetaPhi.setProperty("radius", 30);
  light01.addChildren([camThetaPhi]);

  const oneEye = WOFACTORY.create(NodeTypes.ONE_EYE_CAMERA, [inObj()]);
  oneEye.setProperty("position", [70, 5, 0]);
  oneEye.setProperty("radius", 150);
  oneEye.setProperty("base_phi", Math.PI);

  const twoEyes = WOFACTORY.create(NodeTypes.TWO_EYES, [inObj()]);
  twoEyes.setProperty("position", [-10, 5, 0]);
  twoEyes.setProperty("radius", 150);
  twoEyes.setProperty("base_phi", Math.PI);
  // Animation
  const initScene = () => {
    setTimeout(() => {
      shape1.trySceneUpdate();
    }, 100);
  };

  // return all root nodes
  return {
    nodes: [globalLightObj, platform, twoEyes, oneEye],
    camThetaPhi,
    twoEyes,
    oneEye,
    initScene
  };
}
