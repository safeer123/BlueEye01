import NodeTypesWO from "../../WorldObject/constants";

const NodeTypes = {
  ABSTRACT_CAMERA: "ABSTRACT_CAMERA",
  CAMERA_SPHERICAL_PATH: "CAMERA_SPHERICAL_PATH",
  ABSTRACT_LIGHT: "ABSTRACT_LIGHT",
  SUN_OBJECT: "SUN_OBJECT",
  COMPOSITE_CUSTOM_SHAPES: "COMPOSITE_CUSTOM_SHAPES"
};

export default { ...NodeTypesWO, ...NodeTypes };
