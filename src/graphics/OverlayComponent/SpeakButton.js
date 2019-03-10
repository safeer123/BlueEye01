import React from "react";
import "./index.css";
import { EventEmitter, EventName, BTN } from "../";

class SpeakButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      active: false
    };
    EventEmitter.on(EventName.SoundStart, () => this.talking(true));
    EventEmitter.on(EventName.SoundEnd, () => this.talking(false));
  }

  talking = flag => {
    if (this.state.enabled) {
      this.setState({ active: flag });
    }
  };

  toggleSpeechDetection = () => {
    const newValue = !this.state.enabled;
    this.setState({ enabled: newValue });
    if (!newValue) {
      this.setState({ active: false });
    }
    EventEmitter.emit(EventName.ToggleSpeechDetection, newValue);
  };

  render() {
    const { enabled, active } = this.state;
    let microphoneBTN = BTN.Microphone.disabled;
    if (enabled) {
      microphoneBTN = active ? BTN.Microphone.active : BTN.Microphone.idle;
    }
    return (
      <div className="speak-btn">
        <i className={microphoneBTN} onClick={this.toggleSpeechDetection} />
      </div>
    );
  }
}

export default SpeakButton;
