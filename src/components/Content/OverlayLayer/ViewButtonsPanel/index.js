import React from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import EventEmitter from "../../../../graphics/lib/EventEmitter";
import { EventName } from "../../../../constants/Events";
import "./index.css";

class ViewButtonsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedViewIndex: 0,
      viewList: []
    };

    EventEmitter.on(EventName.SetViewList, this.handleViewList.bind(this));
    EventEmitter.on(EventName.ViewChanged, index =>
      this.setState({ selectedViewIndex: index })
    );
  }

  handleViewList(viewList) {
    this.setState({ viewList });
  }

  handleChange = index => {
    // console.log(index);
    EventEmitter.emit(EventName.SwitchView, {
      index
    });
  };

  render() {
    const { viewList, selectedViewIndex } = this.state;
    const { show } = this.props;
    const hidden = show ? "" : "hidden";
    if (viewList.length === 0) return null;
    const viewName = viewList[selectedViewIndex].name;
    return (
      <div className={`view-buttons-panel-wrapper ${hidden}`}>
        <div className="view-buttons-panel">
          <span className="view-name-title">{viewName}</span>
          <ToggleButtonGroup
            type="radio"
            name="options"
            value={selectedViewIndex}
            onChange={i => this.handleChange(i)}
            bsClass="btn-group"
          >
            {viewList.map((view, index) => {
              const { id, short } = view;
              return (
                <ToggleButton bsStyle="primary" key={id} value={index}>
                  {short}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </div>
      </div>
    );
  }
}

export default ViewButtonsPanel;
