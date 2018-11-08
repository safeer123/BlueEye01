import React from "react";
import { connect } from "react-redux";
import { Row, Col, Grid, SplitButton, MenuItem } from "react-bootstrap";
import { objControlList, globalControlList } from "./sampleControls";
import { getIconClass } from "./constants";
import "./index.css";

class ControlSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedControl: null
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    // console.log("Component: componentWillReceiveProps------");
    // console.log(nextProps);
  }

  handleDropdown(e) {
    // console.log(e);
    if (objControlList[e]) {
      this.setState({ selectedControl: objControlList[e] });
    } else if (globalControlList[e]) {
      this.setState({ selectedControl: globalControlList[e] });
    }
  }

  render() {
    const { selectedControl } = this.state;
    return (
      <div className="obj-settings">
        <Grid>
          <Row>
            <Col md={12}>
              <i className="fa fa-cog" />
              <SplitButton
                className="control-item-select"
                bsStyle="primary"
                title={selectedControl ? selectedControl.id : "Select Control"}
                id="controls-dropdown"
                onSelect={e => this.handleDropdown(e)}
              >
                <MenuItem header>Global Controls</MenuItem>
                {Object.values(globalControlList).map(obj => {
                  const { id } = obj;
                  return (
                    <MenuItem key={id} eventKey={id}>
                      {id}
                    </MenuItem>
                  );
                })}
                <MenuItem divider />
                <MenuItem header>Object Controls</MenuItem>
                {Object.values(objControlList).map(obj => {
                  const { id } = obj;
                  return (
                    <MenuItem key={id} eventKey={id}>
                      {id}
                    </MenuItem>
                  );
                })}
              </SplitButton>
            </Col>
          </Row>
          {selectedControl && (
            <Row>
              <Col md={12} className="control-items-wrapper">
                <div className="control-title">
                  {selectedControl.id}
                  <hr />
                </div>
                <div className="control-type">{selectedControl.type}</div>
                {selectedControl.controls.map(obj => {
                  const { controlButton, name, keys } = obj;
                  const keysDisplay = keys ? keys.join(", ") : "";
                  const iconClass = controlButton
                    ? getIconClass(controlButton)
                    : "";
                  return (
                    <div key={name} className="control-item">
                      <div className="control-name">{name}</div>
                      {keys && (
                        <div className="control-keys">{keysDisplay}</div>
                      )}
                      {controlButton && (
                        <div className="control-btn">
                          <i className={iconClass} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </Col>
            </Row>
          )}
        </Grid>
      </div>
    );
  }
}

function mapStateToProps({ activeScenario, scenarioData }) {
  return {
    activeScenario,
    scenarioData
  };
}

export default connect(mapStateToProps)(ControlSettings);
