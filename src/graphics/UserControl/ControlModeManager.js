import { MasterPrimaryKeys, PrimaryKeys, SecondaryKeys } from "./constants";
import EventEmitter from "../lib/EventEmitter";
import { EventName } from "../../constants/Events";
import { ControlTypes } from "../../constants";

export default class ControlModeManager {
  constructor() {
    this.controlModes = {};
    this.currentModeKey = "default";

    this.registeredControls = {
      [ControlTypes.GlobalControl]: {},
      [ControlTypes.ObjectControl]: {}
    };
    this.controlsById = {
      [ControlTypes.GlobalControl]: {},
      [ControlTypes.ObjectControl]: {}
    };
    EventEmitter.on(EventName.RegisterControls, this.registerControl);
    EventEmitter.on(EventName.UnregisterControls, this.unregisterControl);
    EventEmitter.on(EventName.ClearControls, this.clearControls);
  }

  registerControl = controlObj => {
    const { id, type, controls } = controlObj;

    // We have already registered controls for this object
    if (this.controlsById[type][id]) return;

    this.controlsById[type][id] = controlObj;
    if (controls && controls.length > 0) {
      const controlList = controls.map(c => ({ ...c, id, type }));
      controlList.forEach(c => {
        const { input } = c;
        if (input && input.length > 0) {
          input.forEach(inputKeys => {
            const sortedKeys = inputKeys
              .split("+")
              .sort()
              .join("+");
            const registeredControls = this.registeredControls[type];
            if (!registeredControls[sortedKeys])
              registeredControls[sortedKeys] = [];
            registeredControls[sortedKeys].push(c);
          });
        }
      });
    }
  };

  unregisterControl = controlObjId => {};

  clearControls = controlType => {
    this.registeredControls[controlType] = {};
    this.controlsById[controlType] = {};
  };

  fireAction(inputKeys, value) {
    Object.values(this.registeredControls).forEach(registeredControls => {
      if (
        registeredControls[inputKeys] &&
        registeredControls[inputKeys].length > 0
      ) {
        registeredControls[inputKeys].forEach(c => {
          if (c.action) c.action(value);
        });
      }
    });
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
  isMasterPrimaryKey = key => key in MasterPrimaryKeys;

  onKeyDown(keyName) {
    if (this.isPrimaryKey(keyName)) {
      return this.handlePrimaryKey(keyName);
    }
    return this.handleSecondaryKey(keyName);
  }

  onKeyUp(keyName) {
    // console.log(keyName);
    if (this.isPrimaryKey(keyName)) {
      this.currentModeKey = "default";
    }
  }

  onGesture(gestureType, e) {
    if (this.isPrimaryKey(gestureType)) {
      return this.handlePrimaryKey(gestureType);
    }
    return this.handleSecondaryKey(gestureType, e);
  }

  handlePrimaryKey(keyName) {
    const { controlModes } = this;
    if (keyName in controlModes && this.isPrimaryKey(keyName)) {
      if (!this.isMasterPrimaryKey(keyName)) {
        this.currentModeKey = keyName;
      }
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
    }
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
