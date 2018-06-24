import ControlModeManager from "./ControlModeManager";
import DeviceOrientationFeed from "./DeviceOrientation";

export default class KeyboardControl {
  constructor(sceneUpdater) {
    this.sceneUpdater = sceneUpdater;
    this.controlModeMngr = new ControlModeManager();

    this.listenToKeys();

    this.orientationFeed = new DeviceOrientationFeed();
    // this.displayDeviceOrientation();

    this.gameControllerSetup();
  }

  listenToDeviceOrientation(listenerObj) {
    this.orientationFeed.addListener(listenerObj);
  }

  gameControllerSetup = () => {
    window.addEventListener("gamepadconnected", e => {
      console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length
      );
    });

    window.addEventListener("gamepaddisconnected", e => {
      console.log(
        "Gamepad disconnected from index %d: %s",
        e.gamepad.index,
        e.gamepad.id
      );
    });
  };

  registerControlMode(key, controlModeObj) {
    const { controlModeMngr } = this;
    controlModeMngr.createControlMode(key, controlModeObj);
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
}
