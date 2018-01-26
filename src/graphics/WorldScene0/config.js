let LayoutConfig1 = {
    SceneConfigs: [
        {
            name: "scene1",
            viewport: {x: 0, y: 0.3, width: 0.7-0.005, height: 0.7-0.005},
            camera: "Cam1"
        },
        {
            name: "scene2",
            viewport: {x: 0.7, y: 0.7, width: 0.3-0.005, height: 0.3-0.005},
            camera: "Cam2"
        },
        ,
        {
            name: "scene3",
            viewport: {x: 0, y: 0, width: 0.3-0.005, height: 0.3-0.005},
            camera: "Cam3"
        }
    ],

    Cameras: [
        {
            name: "Cam1",
            type: "ThetaPhi",
            position: [13, 13, 13],
            target: [0, 0, 0],
            up: [0, 1, 0]
        },
        {
            name: "Cam2",
            type: "default",
            position: [0, 30, 0],
            target: [0, 0, 0],
            up: [0, 0, 1]
        },
        {
            name: "Cam3",
            type: "default",
            position: [0, 2, -20],
            target: [0, 0, 0],
            up: [0, 1, 0]
        }
    ]
}

export {LayoutConfig1};