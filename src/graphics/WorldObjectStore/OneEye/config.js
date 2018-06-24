const config = {
  PropertyList: [
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
