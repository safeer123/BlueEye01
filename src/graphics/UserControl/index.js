import ControlModeManager from "./ControlModeManager";
import DeviceOrientationFeed from "./DeviceOrientation";
import GamepadControl from "./GamepadController";

import configGP from "./CustomGamepadConfig/VRSHINECON";

export default class KeyboardControl {
  constructor(sceneUpdater) {
    this.sceneUpdater = sceneUpdater;
    this.controlModeMngr = new ControlModeManager();
    this.orientationFeed = new DeviceOrientationFeed();
    // this.displayDeviceOrientation();
    this.listenToKeys();
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
      const displayOutList = controlModeMngr.onKeyDown(e.key);
      this.sceneUpdater(displayOutList);
    });
    GamepadControl.onButtonUp(e => {
      // console.log("GP Button Up: ", e);
      controlModeMngr.onKeyUp(e.key);
    });
    GamepadControl.onAxisValueChanged(e => {
      // console.log("GP Axis: ", e);
      const { axisName, value } = e;
      controlModeMngr.onAxisValueChanged(axisName, value);
    });
  }

  listenToDeviceOrientation(listenerObj) {
    this.orientationFeed.addListener(listenerObj);
  }

  registerControlMode(key, controlModeObj) {
    const { controlModeMngr } = this;
    controlModeMngr.createControlMode(key, controlModeObj);
  }

  clearControlModes() {
    const { controlModeMngr } = this;
    controlModeMngr.clearControlModes();
  }

  listenToKeys() {
    const { controlModeMngr } = this;
    document.addEventListener("keydown", event => {
      event.preventDefault();
      event.stopPropagation();

      const keyName = this.getKeyName(event);
      // console.log(`KeyDown: ${keyName}`);

      // handleControlModes
      const displayOutList = controlModeMngr.onKeyDown(keyName);
      this.sceneUpdater(displayOutList);
    });

    document.addEventListener("keyup", event => {
      event.preventDefault();
      event.stopPropagation();

      const keyName = this.getKeyName(event);
      // console.log(`KeyUp: ${keyName}`);

      controlModeMngr.onKeyUp(keyName);
    });

    // listen to Gamepad controller
    this.gamepadControllerSetup();
  }

  getKeyName = event => {
    let keyName = event.key;

    if (event.altKey) keyName = `Alt${keyName}`;
    if (event.ctrlKey) keyName = `Control${keyName}`;
    if (event.shiftKey) keyName = `Shift${keyName}`;

    return keyName;
  };

  displayDeviceOrientation() {
    this.orientationFeed.addListener({
      name: "MyName",
      cb: obj => {
        if (obj) {
          const displayOutList = Object.entries(obj).map(
            a => `${a[0]}: ${a[1].toFixed(0)}`
          );
          this.sceneUpdater(displayOutList);
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
}