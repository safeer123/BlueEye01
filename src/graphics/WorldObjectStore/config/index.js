import NodeTypes from "../constants/NodeTypes";

import Node from "../../WorldObject/Node";
import WorldObject from "../../WorldObject";
import CameraAbstract from "../CameraAbstract";
import CamThetaPhi from "../CamThetaPhi";
import OneEye from "../OneEye";
import CompositeShapes0 from "../CompositeShapes0";
import LightSource from "../LightSource";
import Sun from "../Sun";
import TwoEyes from "../TwoEyes";

const TypeNodeMapping = [
  { type: NodeTypes.ABSTRACT_NODE, Class: Node },
  { type: NodeTypes.ABSTRACT_WORLD_OBJECT, Class: WorldObject },
  { type: NodeTypes.ABSTRACT_CAMERA, Class: CameraAbstract },
  { type: NodeTypes.CAMERA_SPHERICAL_PATH, Class: CamThetaPhi },
  { type: NodeTypes.ONE_EYE_CAMERA, Class: OneEye },
  { type: NodeTypes.COMPOSITE_CUSTOM_SHAPES, Class: CompositeShapes0 },
  { type: NodeTypes.ABSTRACT_LIGHT, Class: LightSource },
  { type: NodeTypes.SUN_OBJECT, Class: Sun },
  { type: NodeTypes.TWO_EYES, Class: TwoEyes }
];

export { TypeNodeMapping };
