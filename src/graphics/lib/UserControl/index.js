export default class KeyboardControl {
  constructor(sceneUpdater) {
    this.sceneUpdater = sceneUpdater;
    this.controlModes = {};
    this.currentMode = null;
    this.defaultMode = {};

    this.listenToKeys();

    this.gameControllerSetup();
  }

  gameControllerSetup = () => {
    window.addEventListener("gamepadconnected", function(e) {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    });

    window.addEventListener("gamepaddisconnected", function(e) {
      console.log("Gamepad disconnected from index %d: %s",
        e.gamepad.index, e.gamepad.id);
    });
  };

  createControlMode(key, controlModeObj) {
    this.controlModes[key] = controlModeObj;
    if (key === "default") {
      this.defaultMode = controlModeObj;
    }
  }

  stepChange(controlObj, dir) {
    if (!controlObj) return;
    if (dir > 0) controlObj.t = Math.min(1, controlObj.t + controlObj.dt);
    else controlObj.t = Math.max(0, controlObj.t - controlObj.dt);
    return controlObj.cb(controlObj.t);
  }

  listenToKeys() {
    document.addEventListener("keydown", event => {
      event.preventDefault();
      event.stopPropagation();

      let { controlModes } = this;
      let keyName = event.key;
      // console.log(keyName, event.ctrlKey, event.shiftKey);

      if (keyName in controlModes) {
        this.currentMode = controlModes[keyName];
        if (this.currentMode.summary) {
          this.sceneUpdater(this.currentMode.summary());
        }
        return;
      }

      const { stepChange } = this;

      if (event.ctrlKey) keyName = `Control${keyName}`;
      if (event.shiftKey) keyName = `Shift${keyName}`;

      let displayOutList = [];

      switch (keyName) {
        case "ArrowLeft": {
          displayOutList = stepChange(this.defaultMode.ArrowLeftRight, -1);
          break;
        }
        case "ArrowRight": {
          displayOutList = stepChange(this.defaultMode.ArrowLeftRight, 1);
          break;
        }
        case "ArrowUp": {
          displayOutList = stepChange(this.defaultMode.ArrowUpDown, -1);
          break;
        }
        case "ArrowDown": {
          displayOutList = stepChange(this.defaultMode.ArrowUpDown, 1);
          break;
        }
        case "ControlArrowLeft": {
          displayOutList = stepChange(
            this.currentMode.ControlArrowLeftRight,
            -1
          );
          break;
        }
        case "ControlArrowRight": {
          displayOutList = stepChange(
            this.currentMode.ControlArrowLeftRight,
            1
          );
          break;
        }
        case "ControlArrowUp": {
          displayOutList = stepChange(this.currentMode.ControlArrowUpDown, -1);
          break;
        }
        case "ControlArrowDown": {
          displayOutList = stepChange(this.currentMode.ControlArrowUpDown, 1);
          break;
        }
        default:
          return;
      }
      this.sceneUpdater(displayOutList);
    });
  }
}
