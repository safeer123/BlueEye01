import { MasterPrimaryKeys, PrimaryKeys, SecondaryKeys } from "./constants";

export default class ControlModeManager {
  constructor() {
    this.controlModes = {};
    this.currentModeKey = "default";
  }

  // Register a Control Mode
  // key: What key should be bound to use this control
  // controlModeObj: object having details what to perform when this control is selected
  // controlModeObj { modeName: "ModeX", main: () => {}, ArrowLeft: () => {} }
  createControlMode(key, controlModeObj) {
    if (!this.controlModes[key]) this.controlModes[key] = [];
    this.controlModes[key].push(controlModeObj);
  }

  clearControlModes() {
    // Clear all Primary key modes
    Object.keys(this.controlModes).forEach(key => {
      if (key in PrimaryKeys) this.controlModes[key] = undefined;
    });
    this.controlModes.default = undefined;
  }

  isSecondaryKey = key => key in SecondaryKeys;
  isPrimaryKey = key => key in MasterPrimaryKeys || key in PrimaryKeys;

  onKeyDown(keyName) {
    const { controlModes } = this;
    if (this.isPrimaryKey(keyName) && keyName in controlModes) {
      this.currentModeKey = keyName;
      // Execute a main function if exists
      const displayOutList = [];
      controlModes[keyName].forEach(mode => {
        if (mode.main) {
          const mainOut = mode.main();
          if (mainOut) {
            // console.log(mainOut);
            displayOutList.push(...mainOut);
          }
        }
      });
      return displayOutList;
    }

    return this.handleSecondaryKey(keyName);
  }

  onKeyUp(keyName) {
    // console.log(keyName);
    const { controlModes } = this;
    if (this.isPrimaryKey(keyName)) {
      this.currentModeKey = "default";
    }
  }

  onGesture(gestureType, e) {
    return this.handleSecondaryKey(gestureType, e);
  }

  handleSecondaryKey(key, value) {
    const { controlModes } = this;
    if (this.isSecondaryKey(key)) {
      const modes = controlModes[this.currentModeKey];
      if (modes) {
        const displayOutList = [];
        modes.forEach(mode => {
          if (mode[key]) {
            mode[key](value);
            if (mode.summary) {
              const summaryOut = mode.summary();
              if (summaryOut) displayOutList.push(...summaryOut);
            }
          }
        });
        return displayOutList;
      }
    }
    return null;
  }

  onAxisValueChanged(axisName, value) {
    return this.handleSecondaryKey(axisName, value);
  }
}
