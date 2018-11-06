const objControlList = {
  "12_Camera_Normal": {
    objectId: "12_Camera_Normal",
    type: "ObjectControl",
    enabled: true,
    controls: [
      {
        keys: ["a"],
        controlButton: "btn0",
        do: () => console.log("do1 for 12_Camera_Normal")
      },
      {
        keys: ["a+ArrowLeft"],
        controlButton: "btnLeft",
        do: () => console.log("do2 for 12_Camera_Normal")
      },
      {
        keys: ["a+ArrowRight"],
        controlButton: "btnRight",
        do: () => console.log("do3 for 12_Camera_Normal")
      }
    ],
    summary: () => ["12_Camera_Normal", "Test (1.2, 2.6, 5.7)"]
  },
  "13_TowerLight": {
    objectId: "13_TowerLight",
    type: "ObjectControl",
    enabled: true,
    controls: [
      {
        keys: ["1"],
        controlButton: "btn0",
        do: () => console.log("do1 for 13_TowerLight")
      },
      {
        keys: ["1+ArrowLeft"],
        controlButton: "btnLeft",
        do: () => console.log("do2 for 13_TowerLight")
      },
      {
        keys: ["1+ArrowRight"],
        controlButton: "btnRight",
        do: () => console.log("do3 for 13_TowerLight")
      }
    ],
    summary: () => ["13_TowerLight", "Light is on", "color (r:10, g:21, b:34)"]
  },
  "14_TowerLight": {
    objectId: "14_TowerLight",
    type: "ObjectControl",
    enabled: true,
    controls: [
      {
        keys: ["2"],
        controlButton: "btn0",
        do: () => console.log("do1 for 14_TowerLight")
      },
      {
        keys: ["2+ArrowLeft"],
        controlButton: "btnLeft",
        do: () => console.log("do2 for 14_TowerLight")
      },
      {
        keys: ["2+ArrowRight"],
        controlButton: "btnRight",
        do: () => console.log("do3 for 14_TowerLight")
      }
    ],
    summary: () => ["14_TowerLight", "Light is off", "color (r:10, g:21, b:34)"]
  }
};

export { objControlList };
