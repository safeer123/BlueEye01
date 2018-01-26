const config = {
  dayColor: [0.9, 0.7, 0.7],
  nightColor: [0.1, 0.1, 0.1],

  PropertyList: [
    {
      name: "sun_direction",
      type: "vec3",
      value: [-2, 1, -1]
    },
    {
      name: "sun_light_color",
      type: "vec3",
      value: [0.9, 0.7, 0.7]
    },
    {
      name: "isDay",
      type: "bool",
      value: true
    },
    {
      name: "theta",
      type: "float",
      value: 0
    }
  ]
};

export default config;
