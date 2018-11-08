const objControlList = {
  "12_Camera_Normal": {
    id: "12_Camera_Normal",
    type: "ObjectControl",
    enabled: true,
    controls: [
      {
        name: "ON-OFF",
        keys: ["a"],
        controlButton: "btn0",
        do: () => console.log("do1 for 12_Camera_Normal")
      },
      {
        name: "Angle Phi minus",
        keys: ["a+ArrowLeft"],
        controlButton: "btnLeft",
        do: () => console.log("do2 for 12_Camera_Normal")
      },
      {
        name: "Angle Phi plus",
        keys: ["a+ArrowRight"],
        controlButton: "btnRight",
        do: () => console.log("do3 for 12_Camera_Normal")
      }
    ],
    summary: () => ["12_Camera_Normal", "Test (1.2, 2.6, 5.7)"]
  },
  "13_TowerLight": {
    id: "13_TowerLight",
    type: "ObjectControl",
    enabled: true,
    controls: [
      {
        name: "ON-OFF",
        keys: ["1"],
        controlButton: "btn0",
        do: () => console.log("do1 for 13_TowerLight")
      },
      {
        name: "Brightness minus",
        keys: ["1+ArrowLeft"],
        controlButton: "btnMinus",
        do: () => console.log("do2 for 13_TowerLight")
      },
      {
        name: "Brightness plus",
        keys: ["1+ArrowRight"],
        controlButton: "btnPlus",
        do: () => console.log("do3 for 13_TowerLight")
      }
    ],
    summary: () => ["13_TowerLight", "Light is on", "color (r:10, g:21, b:34)"]
  },
  "14_TowerLight": {
    id: "14_TowerLight",
    type: "ObjectControl",
    enabled: true,
    controls: [
      {
        name: "ON-OFF",
        keys: ["2"],
        controlButton: "btn0",
        do: () => console.log("do1 for 14_TowerLight")
      },
      {
        name: "Brightness minus",
        keys: ["2+ArrowLeft"],
        controlButton: "btnMinus",
        do: () => console.log("do2 for 14_TowerLight")
      },
      {
        name: "Brightness plus",
        keys: ["2+ArrowRight"],
        controlButton: "btnPlus",
        do: () => console.log("do3 for 14_TowerLight")
      }
    ],
    summary: () => ["14_TowerLight", "Light is off", "color (r:10, g:21, b:34)"]
  }
};

const globalControlList = {
  ViewControls: {
    id: "ViewControls",
    type: "GlobalControl",
    enabled: true,
    controls: [
      {
        name: "Fullscreen switch",
        keys: ["Ctrl+f"],
        controlButton: "btnFullscreen",
        do: () => console.log("do1 for Fullscreen")
      },
      {
        name: "Switch views",
        keys: ["Ctrl+v"],
        controlButton: "btnPicture",
        do: () => console.log("do2 for SwitchView")
      }
    ],
    summary: () => ["abc", "xyz"]
  }
};

export { objControlList, globalControlList };
