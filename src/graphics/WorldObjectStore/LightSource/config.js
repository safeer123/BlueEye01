const config = {
  lightColor: [1.0, 1.0, 1.0],

  PropertyList: [
    {
      name: "light_position",
      type: "vec3",
      value: [0, 0, 0]
    },
    {
      name: "translation",
      type: "vec3",
      value: [3, 10, 10]
    },
    {
      name: "light_color",
      type: "vec3",
      value: [1.0, 1.0, 1.0]
    },
    {
      name: "isON",
      type: "bool",
      value: true
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
