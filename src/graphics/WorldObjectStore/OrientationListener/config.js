const config = {
  PropertyList: [
    {
      name: "position",
      type: "vec3",
      value: [0, 0, -40]
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
      name: "theta",
      type: "float",
      value: Math.PI / 3,
      min: 0,
      max: Math.PI
    },
    {
      name: "phi",
      type: "float",
      value: 0,
      min: 0,
      max: 2 * Math.PI
    },
    {
      name: "radius",
      type: "float",
      value: 45,
      min: 1,
      max: 200
    },
    {
      name: "initial_phi",
      type: "float",
      value: 0.5 * Math.PI
    }
  ]
};

export default config;
