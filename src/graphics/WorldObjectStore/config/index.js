import NodeTypes from "../constants/NodeTypes";

import Node from "../../WorldObject/Node";
import WorldObject from "../../WorldObject";
import CameraAbstract from "../CameraAbstract";
import CamThetaPhi from "../CamThetaPhi";
import CompositeShapes0 from "../CompositeShapes0";
import LightSource from "../LightSource";
import Sun from "../Sun";

const TypeNodeMapping = [
  { type: NodeTypes.ABSTRACT_NODE, Class: Node },
  { type: NodeTypes.ABSTRACT_WORLD_OBJECT, Class: WorldObject },
  { type: NodeTypes.ABSTRACT_CAMERA, Class: CameraAbstract },
  { type: NodeTypes.CAMERA_SPHERICAL_PATH, Class: CamThetaPhi },
  { type: NodeTypes.COMPOSITE_CUSTOM_SHAPES, Class: CompositeShapes0 },
  { type: NodeTypes.ABSTRACT_LIGHT, Class: LightSource },
  { type: NodeTypes.SUN_OBJECT, Class: Sun }
];

export { TypeNodeMapping };
