import React from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import EventEmitter from "../../graphics/lib/EventEmitter";
import { EventName } from "../../constants/Events";

class ViewButtonsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedViewIndex: 0,
      viewList: []
    };

    EventEmitter.on(EventName.SetViewList, this.handleViewList.bind(this));
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  handleViewList(viewList) {
    this.setState({ viewList });
  }

  handleChange(index) {
    // console.log(index);
    EventEmitter.emit(EventName.SwitchView, {
      index
    });
    this.setState({ selectedViewIndex: index });
  }

  render() {
    return (
      <div className="view-buttons-panel">
        <ToggleButtonGroup
          type="radio"
          name="options"
          value={this.state.selectedViewIndex}
          onChange={e => this.handleChange(e)}
        >
          {this.state.viewList.map((view, index) => {
            const { id, short } = view;
            return (
              <ToggleButton bsStyle="primary" key={id} value={index}>
                {short}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </div>
    );
  }
}

export default ViewButtonsPanel;
