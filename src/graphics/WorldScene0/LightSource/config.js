const config = {
  lightColor: [1.0, 1.0, 1.0],

  PropertyList: [
    {
      name: "light_position",
      type: "vec3",
      value: [5, 7, 8]
    },
    {
      name: "light_color",
      type: "vec3",
      value: [1.0, 1.0, 1.0]
    },
    {
      name: "isON",
      type: "bool",
      value: false
    }
  ],

  InitList: [
    {
      name: "emissive_color",
      value: [1, 1, 1]
    }
  ]
};

export default config;
