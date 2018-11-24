import React from "react";
import "./index.css";
import EventEmitter from "../../../graphics/lib/EventEmitter";
import { EventName } from "../../../constants/Events";
import BTN from "../../../constants/Buttons";

class SpeakButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
    EventEmitter.on(EventName.SpeakingEnded, () => this.speakingEnded());
  }

  speakingEnded = () => {
    this.setState({ active: false });
  };

  speakNow = () => {
    this.setState({ active: true });
    EventEmitter.emit(EventName.UserTalking);
  };

  render() {
    const { active } = this.state;
    const microphoneBTN = BTN.Microphone(active);
    return (
      <div className="speak-btn">
        <i className={microphoneBTN} onClick={this.speakNow} />
      </div>
    );
  }
}

export default SpeakButton;
