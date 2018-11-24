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
      selectedControl: null,
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
    }
  }

  viewChanged() {
    const { selectedControl } = this.state;
    if (selectedControl) {
      setTimeout(() => {
        this.handleDropdown(selectedControl.id);
      }, 10);
    }
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

  handleDropdown(e) {
    // console.log(e);
    const { globalControls, objectControls } = this.state;
    if (objectControls[e]) {
      this.setState({ selectedControl: objectControls[e] });
    } else if (globalControls[e]) {
      this.setState({ selectedControl: globalControls[e] });
    } else {
      this.setState({ selectedControl: null });
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

  idToLabel = id => id.replace(new RegExp("_", "g"), " ");

  render() {
    const { selectedControl, globalControls, objectControls } = this.state;
    const { show } = this.props;
    const hidden = show ? "" : "hidden";
    const settingsBTN = BTN.Settings(true);
    return (
      <div className={`obj-settings ${hidden}`}>
        <Grid>
          <Row>
            <Col md={12}>
              <i className={settingsBTN} />
              <SplitButton
                className="control-item-select"
                bsStyle="primary"
                title={
                  selectedControl
                    ? this.idToLabel(selectedControl.id)
                    : "Select Control"
                }
                id="controls-dropdown"
                onSelect={e => this.handleDropdown(e)}
              >
                <MenuItem header>Global Controls</MenuItem>
                {this.getMenuItems(Object.values(globalControls))}
                <MenuItem divider />
                <MenuItem header>Object Controls</MenuItem>
                {this.getMenuItems(Object.values(objectControls))}
              </SplitButton>
            </Col>
          </Row>
          {selectedControl && (
            <ControlGroup selectedControl={selectedControl} />
          )}
        </Grid>
      </div>
    );
  }
}

export default ControlSettings;
