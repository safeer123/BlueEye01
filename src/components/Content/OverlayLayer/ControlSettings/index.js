import React from "react";
import { connect } from "react-redux";
import { Row, Col, Grid, SplitButton, MenuItem } from "react-bootstrap";
import { objControlList } from "./sampleControls";
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
    this.setState({ selectedControl: objControlList[e] });
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
                title={
                  selectedControl ? selectedControl.objectId : "Select Control"
                }
                id="controls-dropdown"
                onSelect={e => this.handleDropdown(e)}
              >
                <MenuItem header>View Controls</MenuItem>
                <MenuItem divider />
                <MenuItem header>Object Controls</MenuItem>
                {Object.values(objControlList).map(obj => {
                  const { objectId } = obj;
                  return (
                    <MenuItem key={objectId} eventKey={objectId}>
                      {objectId}
                    </MenuItem>
                  );
                })}
              </SplitButton>
            </Col>
          </Row>
          {selectedControl && (
            <Row>
              <Col md={12}>
                <div className="control-title">{selectedControl.objectId}</div>
                <div className="control-type">{selectedControl.type}</div>
                {selectedControl.controls.map(obj => {
                  const { controlButton } = obj;
                  return <div key={controlButton}>{controlButton}</div>;
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
