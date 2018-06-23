export default class ControlModeManager {
  constructor() {
    this.controlModes = {};
    this.currentMode = null;
    this.defaultMode = {};
  }

  createControlMode(key, controlModeObj) {
    this.controlModes[key] = controlModeObj;
    if (key === "default") {
      this.defaultMode = controlModeObj;
      this.currentMode = this.defaultMode;
    }
  }

  stepChange = (controlObj, dir) => {
    if (!controlObj) return null;
    if (dir > 0) controlObj.t = Math.min(1, controlObj.t + controlObj.dt);
    else controlObj.t = Math.max(0, controlObj.t - controlObj.dt);
    return controlObj.cb(controlObj.t);
  };

  onKeyDown(keyName) {
    const { controlModes, stepChange } = this;
    if (keyName in controlModes) {
      this.currentMode = controlModes[keyName];
      // Execute a main function if exists
      if (this.currentMode.main) {
        return this.currentMode.main();
      }
      return null;
    }

    const mode = this.currentMode;

    if (mode) {
      let displayOutList = [];

      switch (keyName) {
        case "ArrowLeft": {
          displayOutList = stepChange(mode.ArrowLeftRight, -1);
          break;
        }
        case "ArrowRight": {
          displayOutList = stepChange(mode.ArrowLeftRight, 1);
          break;
        }
        case "ArrowUp": {
          displayOutList = stepChange(mode.ArrowUpDown, -1);
          break;
        }
        case "ArrowDown": {
          displayOutList = stepChange(mode.ArrowUpDown, 1);
          break;
        }
        default:
          return null;
      }
      if (mode.summary) {
        displayOutList.push(...mode.summary());
      }
      return displayOutList;
    }
    return null;
  }

  onKeyUp(keyName) {
    const { controlModes } = this;
    if (keyName in controlModes && this.currentMode === controlModes[keyName]) {
      this.currentMode = this.defaultMode;
    }
  }
}
