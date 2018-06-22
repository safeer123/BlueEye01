import ControlModeManager from "./ControlModeManager";

export default class KeyboardControl {
  constructor(sceneUpdater) {
    this.sceneUpdater = sceneUpdater;
    this.controlModeMngr = new ControlModeManager();

    this.listenToKeys();

    this.gameControllerSetup();
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
    controlModeMngr.createControlMode(key, controlModeObj)
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
}
