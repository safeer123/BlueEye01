import { m4 } from "../../lib/m4";

const config = {
  PropertyList: [
    {
      name: "camera_position",
      type: "vec3",
      value: [13, 13, 13]
    },
    {
      name: "target_position",
      type: "vec3",
      value: [0, 0, 0]
    },
    {
      name: "up_vector",
      type: "vec3",
      value: [0, 1, 0]
    },
    {
      name: "projection_view_matrix",
      type: "mat4",
      value: m4.identity()
    },
  ],

  CamConfig: {
    fieldOfViewRadians: Math.PI / 4,
    zNear: 1,
    zFar: 1000
  }
};

export default config;
