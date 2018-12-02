import React from "react";
import CustomPopover from "../../../Common/CustomPopover";
import EventEmitter from "../../../../graphics/lib/EventEmitter";
import { EventName } from "../../../../constants/Events";
import "./index.css";

class MessagePane extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pairMode: true,
      padding: 50,
      overlayState: {
        visible: false,
        expiryTime: new Date(),
        displayItemList: []
      }
    };

    EventEmitter.on(
      EventName.DisplayOutRequest,
      ({ displayOutList, duration }) =>
        this.stateUpdateHandler(displayOutList, duration)
    );

    EventEmitter.on(EventName.TogglePairMode, this.togglePairMode);
  }

  togglePairMode = obj => {
    if (obj && obj.mode) {
      this.setState({ pairMode: obj.mode });
    } else {
      this.setState({ pairMode: !this.state.pairMode });
    }
  };

  // State update handler
  stateUpdateHandler(displayOutList, duration = 2) {
    const now = new Date();
    const expiryTime = now.setSeconds(now.getSeconds() + duration);
    const overlayState = {
      visible: true,
      expiryTime,
      displayItemList: []
    };
    if (displayOutList && displayOutList.length > 0) {
      displayOutList.forEach((str, index) => {
        overlayState.displayItemList.push({ text: str, key: index });
      });
    }
    this.setState({ overlayState });
    setTimeout(() => {
      const expTime = this.state.overlayState.expiryTime;
      if (new Date() > expTime) {
        this.setState({
          overlayState: {
            visible: false,
            displayItemList: [],
            expiryTime: expTime
          }
        });
      }
    }, (duration + 1) * 1000);
  }

  customPopover = (className = "") => (
    <CustomPopover
      visible={this.state.overlayState.visible}
      displayItemList={this.state.overlayState.displayItemList}
      className={className}
    />
  );

  render() {
    const { pairMode, padding } = this.state;

    if (pairMode) {
      return (
        <React.Fragment>
          <div className="half-area" style={{ paddingLeft: `${padding}px` }}>
            {this.customPopover("msg-center")}
          </div>
          <div className="half-area" style={{ paddingRight: `${padding}px` }}>
            {this.customPopover("msg-center")}
          </div>
        </React.Fragment>
      );
    }
    return this.customPopover("msg-default");
  }
}

export default MessagePane;
