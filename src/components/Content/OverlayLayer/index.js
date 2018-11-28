import React from "react";
import MessagePane from "./MessagePane";
import ViewButtonsPanel from "./ViewButtonsPanel";
import "./index.css";
import ControlSettings from "./ControlSettings";
import SpeakButton from "./SpeakButton";
import HideLayerButton from "./HideLayerButton";
import EventEmitter from "../../../graphics/lib/EventEmitter";
import { EventName } from "../../../constants/Events";

class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };

    EventEmitter.on(
      EventName.SwitchControlLayerVisibility,
      this.switchVisibility
    );
  }

  switchVisibility = obj => {
    if (obj && obj.show) {
      this.setState({ show: obj.show });
    } else {
      this.setState({ show: !this.state.show });
    }
  };

  displayLoader() {
    const displayMsg = "Building it...";
    return (
      <div className="loader">
        {this.props.loading ? (
          <span>
            <i className="fa fa-spinner fa-spin" />
            {displayMsg}
          </span>
        ) : null}
      </div>
    );
  }

  render() {
    const { show } = this.state;
    return (
      <div className="overlay-layer unselectable">
        <HideLayerButton active={show} />
        <ControlSettings show={show} />
        <MessagePane />
        <ViewButtonsPanel show={show} />
        {show && <SpeakButton />}
        {this.displayLoader()}
      </div>
    );
  }
}

export default Overlay;
