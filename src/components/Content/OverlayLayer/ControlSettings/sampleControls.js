const objControlListForTest = {
  "12_Camera_Normal": {
    id: "12_Camera_Normal",
    type: "ObjectControl",
    enabled: true,
    controls: [
      {
        name: "ON-OFF",
        input: ["a"],
        controlButton: () => "btn0",
        action: () => console.log("do1 for 12_Camera_Normal"),
        summary: () => ["12_Camera_Normal", "Test (1.2, 2.6, 5.7)"]
      },
      {
        name: "Angle Phi minus",
        input: ["a+ArrowLeft"],
        controlButton: () => "btnLeft",
        action: () => console.log("do2 for 12_Camera_Normal"),
        summary: () => ["12_Camera_Normal", "Test (1.2, 2.6, 5.7)"]
      },
      {
        name: "Angle Phi plus",
        input: ["a+ArrowRight"],
        controlButton: () => "btnRight",
        action: () => console.log("do3 for 12_Camera_Normal"),
        summary: () => ["12_Camera_Normal", "Test (1.2, 2.6, 5.7)"]
      }
    ]
  },
  "13_TowerLight": {
    id: "13_TowerLight",
    type: "ObjectControl",
    enabled: true,
    controls: [
      {
        name: "ON-OFF",
        input: ["1"],
        controlButton: () => "btn0",
        action: () => console.log("do1 for 13_TowerLight"),
        summary: () => ["12_Camera_Normal", "Test (1.2, 2.6, 5.7)"]
      },
      {
        name: "Brightness minus",
        input: ["1+ArrowLeft"],
        controlButton: () => "btnMinus",
        action: () => console.log("do2 for 13_TowerLight"),
        summary: () => ["12_Camera_Normal", "Test (1.2, 2.6, 5.7)"]
      },
      {
        name: "Brightness plus",
        input: ["1+ArrowRight"],
        controlButton: () => "btnPlus",
        action: () => console.log("do3 for 13_TowerLight"),
        summary: () => ["12_Camera_Normal", "Test (1.2, 2.6, 5.7)"]
      }
    ]
  },
  "14_TowerLight": {
    id: "14_TowerLight",
    type: "ObjectControl",
    enabled: true,
    controls: [
      {
        name: "ON-OFF",
        input: ["2"],
        controlButton: () => "btn0",
        action: () => console.log("do1 for 14_TowerLight"),
        summary: () => [
          "14_TowerLight",
          "Light is off",
          "color (r:10, g:21, b:34)"
        ]
      },
      {
        name: "Brightness minus",
        input: ["2+ArrowLeft"],
        controlButton: () => "btnMinus",
        action: () => console.log("do2 for 14_TowerLight"),
        summary: () => [
          "14_TowerLight",
          "Light is off",
          "color (r:10, g:21, b:34)"
        ]
      },
      {
        name: "Brightness plus",
        input: ["2+ArrowRight"],
        controlButton: () => "btnPlus",
        action: () => console.log("do3 for 14_TowerLight"),
        summary: () => [
          "14_TowerLight",
          "Light is off",
          "color (r:10, g:21, b:34)"
        ]
      }
    ]
  }
};

const globalControlListForTest = {
  ViewControls: {
    id: "ViewControls",
    type: "GlobalControl",
    enabled: true,
    controls: [
      {
        name: "Fullscreen switch",
        input: ["Control+f"],
        controlButton: () => "btnFullscreenOn",
        action: () => console.log("do1 for Fullscreen"),
        summary: () => ["abc", "xyz"]
      },
      {
        name: "Switch views",
        input: ["Control+v"],
        controlButton: () => "btnPicture",
        action: () => console.log("do2 for SwitchView"),
        summary: () => ["abc", "xyz"]
      }
    ]
  }
};

export { objControlListForTest, globalControlListForTest };
