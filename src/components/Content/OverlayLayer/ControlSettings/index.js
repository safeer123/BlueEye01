import React from "react";
import { Row, Col, Grid, SplitButton, MenuItem } from "react-bootstrap";
import {
  objControlListForTest,
  globalControlListForTest
} from "./sampleControls";
import { EventName } from "../../../../constants/Events";
import { ControlTypes } from "../../../../constants";
import EventEmitter from "../../../../graphics/lib/EventEmitter";
import ControlGroup from "./ControlGroup";
import BTN from "../../../../constants/Buttons";
import "./index.css";

const UseTestControls = false;

class ControlSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedControls: [],
      globalControls: {},
      objectControls: {}
    };
    if (UseTestControls) {
      this.state.globalControls = globalControlListForTest;
      this.state.objectControls = objControlListForTest;
    } else {
      EventEmitter.on(EventName.RegisterControls, this.registerControl);
      EventEmitter.on(EventName.UnregisterControls, this.unregisterControl);
      EventEmitter.on(EventName.ClearControls, this.clearControls);
      EventEmitter.on(EventName.ViewChanged, () => this.viewChanged());
      EventEmitter.on(EventName.ToggleControlEnableFlag, this.toggleEnable);
    }
  }

  unregisterControl = controlObjId => {};

  clearControls = controlType => {
    setTimeout(() => {
      if (controlType === ControlTypes.GlobalControl) {
        this.setState({ globalControls: {} });
      } else if (controlType === ControlTypes.ObjectControl) {
        this.setState({ objectControls: {} });
      }
    }, 0);
  };

  toggleEnable = ({ id, flag }) => {
    if (id) {
      const { globalControls, objectControls } = this.state;
      const controlObj = globalControls[id]
        ? globalControls[id]
        : objectControls[id];
      if (controlObj) {
        if (typeof flag !== "undefined") {
          controlObj.enabled = flag;
        } else {
          controlObj.enabled = !controlObj.enabled;
        }
        EventEmitter.emit(EventName.ControlObjectModified, controlObj.id);
      }
    }
  };

  duplicateControlSelected(id) {
    return this.state.selectedControls.some(c => c.id === id);
  }

  handleDropdown(id) {
    // console.log(id);
    if (this.duplicateControlSelected(id)) return;
    const { globalControls, objectControls } = this.state;
    if (objectControls[id]) {
      this.setState({
        selectedControls: [...this.state.selectedControls, objectControls[id]]
      });
    } else if (globalControls[id]) {
      this.setState({
        selectedControls: [...this.state.selectedControls, globalControls[id]]
      });
    }
  }

  getMenuItems(controlObjList) {
    return controlObjList.map((obj, i) => {
      const { id } = obj;
      const elemKey = `${id}_${i}`;
      return (
        <MenuItem key={elemKey} eventKey={id}>
          {this.idToLabel(id)}
        </MenuItem>
      );
    });
  }

  registerControl = controlObj => {
    setTimeout(() => {
      const { id, type } = controlObj;
      if (type === ControlTypes.GlobalControl) {
        const globalControls = {
          ...this.state.globalControls,
          [id]: controlObj
        };
        this.setState({ globalControls });
      } else if (type === ControlTypes.ObjectControl) {
        const objectControls = {
          ...this.state.objectControls,
          [id]: controlObj
        };
        this.setState({ objectControls });
      }
    }, 0);
  };

  viewChanged() {
    const { selectedControls } = this.state;
    if (selectedControls.length > 0) {
      this.setState({ selectedControls: [] });
      setTimeout(() => {
        selectedControls.forEach(control => {
          this.handleDropdown(control.id);
        });
      }, 20);
    }
  }

  handleClose(selectedControl) {
    const { selectedControls } = this.state;
    const index = selectedControls.indexOf(selectedControl);
    if (index > -1) {
      selectedControls.splice(index, 1);
      this.setState({ selectedControls });
    }
  }

  idToLabel = id => id.replace(new RegExp("_", "g"), " ");

  render() {
    const { selectedControls, globalControls, objectControls } = this.state;
    const { show } = this.props;
    const hidden = show ? "" : "hidden";
    const settingsBTN = BTN.Settings(true);
    return (
      <React.Fragment>
        <div className={`obj-settings ${hidden}`}>
          <div>
            <i className={settingsBTN} />
            <SplitButton
              className="control-item-select"
              bsStyle="primary"
              title="Select Control"
              id="controls-dropdown"
              onSelect={e => this.handleDropdown(e)}
            >
              <MenuItem header>Global Controls</MenuItem>
              {this.getMenuItems(Object.values(globalControls))}
              <MenuItem divider />
              <MenuItem header>Object Controls</MenuItem>
              {this.getMenuItems(Object.values(objectControls))}
            </SplitButton>
          </div>
        </div>
        {selectedControls &&
          selectedControls.length > 0 && (
            <div className={`control-items-container ${hidden}`}>
              {selectedControls.map(selectedControl => (
                <ControlGroup
                  selectedControl={selectedControl}
                  handleClose={() => this.handleClose(selectedControl)}
                />
              ))}
            </div>
          )}
      </React.Fragment>
    );
  }
}

export default ControlSettings;
