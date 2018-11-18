import React from "react";
import { Row, Col } from "react-bootstrap";
import { EventName } from "../../../../constants/Events";
import EventEmitter from "../../../../graphics/lib/EventEmitter";
import { shortenKeys } from "./constants";
import "./index.css";

class ControlGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    EventEmitter.on(EventName.ControlObjectModified, this.onControlModified);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    // console.log("Component: componentWillReceiveProps------");
    // console.log(nextProps);
  }

  onControlModified = id => {
    const { selectedControl } = this.props;
    if (selectedControl && selectedControl.id === id) {
      this.forceUpdate();
    }
  };

  fireAction = obj => {
    if (obj.action) obj.action();
    this.forceUpdate();
  };

  idToLabel = id => id.replace(new RegExp("_", "g"), " ");

  render() {
    const { selectedControl } = this.props;
    return (
      <Row>
        <Col md={12} className="control-items-wrapper">
          <div className="control-title">
            {this.idToLabel(selectedControl.id)}
            <hr />
          </div>
          <div className="control-type">{selectedControl.type}</div>
          {selectedControl.controls.map((obj, i) => {
            const { controlButton, name, input } = obj;
            const inputDisplay = input ? shortenKeys(input.join(", ")) : "";
            const elemKey = `${name}_${i}`;
            const iconClass = controlButton ? controlButton() : "";
            return (
              <div key={elemKey} className="control-item">
                <div className="control-name">{name}</div>
                {input && <div className="control-keys">{inputDisplay}</div>}
                {controlButton && (
                  <div className="control-btn">
                    <i
                      className={iconClass}
                      onClick={() => this.fireAction(obj)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </Col>
      </Row>
    );
  }
}

export default ControlGroup;
