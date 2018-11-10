import ControlModeManager from "./ControlModeManager";
import DeviceOrientationFeed from "./DeviceOrientation";
import GamepadControl from "./GamepadController";
import GestureController from "./GestureController";
import KeyboardListener from "./KeyboardListener";

import configGP from "./CustomGamepadConfig/VRSHINECON";

export default class UserControl {
  constructor(canvasWrapper, sceneUpdater) {
    this.sceneUpdater = sceneUpdater;
    this.controlModeMngr = new ControlModeManager();
    this.orientationFeed = new DeviceOrientationFeed();

    // ----- Use below line for reading device orientation
    // this.displayDeviceOrientation();

    // Listen to keyboard events
    this.keyboardEventSetup();
    // Listen to Gamepad controller events
    this.gamepadControllerSetup();
    // Listen to Gesture input events
    this.gestureInputSetup(canvasWrapper);
  }

  listenToDeviceOrientation(id, listenerObj) {
    this.orientationFeed.addListener(id, listenerObj);
  }

  stopListeningToDeviceOrientation(id) {
    this.orientationFeed.removeListener(id);
  }

  registerControlMode(key, controlModeObj) {
    const { controlModeMngr } = this;
    controlModeMngr.createControlMode(key, controlModeObj);
  }

  clearControlModes() {
    const { controlModeMngr } = this;
    controlModeMngr.clearControlModes();
  }

  displayDeviceOrientation() {
    this.orientationFeed.addListener({
      name: "MyName",
      cb: obj => {
        if (obj) {
          const displayOutList = Object.entries(obj).map(
            a => `${a[0]}: ${a[1].toFixed(0)}`
          );
          this.displayOut(displayOutList);
        }
      }
    });
  }

  displayOut(displayOutList) {
    this.sceneUpdater(displayOutList);
  }

  // Main loop for user control
  loop(timestamp) {
    GamepadControl.loop();
  }

  getKeyName = event => {
    let keyName = event.key;

    if (event.altKey) keyName = `Alt${keyName}`;
    if (event.ctrlKey) keyName = `Control${keyName}`;
    if (event.shiftKey) keyName = `Shift${keyName}`;

    return keyName;
  };

  keyboardEventSetup() {
    const { controlModeMngr } = this;

    KeyboardListener.setKeyListener(keys => {
      console.log(keys);
      const inputKeys = keys.sort().join("+");
      controlModeMngr.fireAction(inputKeys);
    });

    document.addEventListener("keydown", event => {
      event.preventDefault();
      event.stopPropagation();

      const keyName = this.getKeyName(event);
      // console.log(`KeyDown: ${keyName}`);

      // handleControlModes
      this.displayOut(controlModeMngr.onKeyDown(keyName));
    });

    document.addEventListener("keyup", event => {
      event.preventDefault();
      event.stopPropagation();

      const keyName = this.getKeyName(event);
      // console.log(`KeyUp: ${keyName}`);

      controlModeMngr.onKeyUp(keyName);
    });
  }

  gamepadControllerSetup() {
    GamepadControl.onConnected(e => this.displayOut(["Connected", e.name]));
    GamepadControl.onDisconnected(e =>
      this.displayOut(["Disconnected", e.name])
    );
    GamepadControl.registerGamepadConfig(configGP);

    const { controlModeMngr } = this;
    GamepadControl.onButtonDown(e => {
      // console.log("GP Button Down: ", e);
      this.displayOut(controlModeMngr.onKeyDown(e.key));
    });
    GamepadControl.onButtonUp(e => {
      // console.log("GP Button Up: ", e);
      controlModeMngr.onKeyUp(e.key);
    });
    GamepadControl.onAxisValueChanged(e => {
      // console.log("GP Axis: ", e);
      const { axisName, value } = e;
      this.displayOut(controlModeMngr.onAxisValueChanged(axisName, value));
    });
  }

  gestureInputSetup(domElement) {
    this.gestureControl = new GestureController(domElement);
    this.gestureControl.onGestureInput((gestureType, e) => {
      const { controlModeMngr } = this;
      this.displayOut(controlModeMngr.onGesture(gestureType, e));
    });
  }
}
