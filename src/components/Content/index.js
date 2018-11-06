import React from "react";
import { connect } from "react-redux";
import Fullscreen from "react-full-screen";
import GLController from "../../graphics/GLController";
import Utils from "../../graphics/AppUtils";
import OverlayLayer from "./OverlayLayer";
import EventEmitter from "../../graphics/lib/EventEmitter";
import { EventName } from "../../constants/Events";
import "./index.css";

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isFullscreenMode: false
    };
    this.resizeHandler = this.resizeHandler.bind(this);
    EventEmitter.on(EventName.FullscreenSwitch, () =>
      this.handleFullscreenSwitch()
    );
  }

  componentDidMount() {
    console.log("Initializing graphics controller..");
    this.glController = new GLController(this.canvasWrapper);

    window.addEventListener("resize", this.resizeHandler);
    this.resizeHandler();
  }

  componentWillReceiveProps(nextProps) {
    // console.log("Component: componentWillReceiveProps------");
    // console.log(nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }

  onFullscreenChange = isFullscreen => {
    if (isFullscreen) Utils.lockScreenOrientationAsLandscape();
  };

  resizeHandler() {
    // console.log(this.canvasWrapper.clientWidth, this.canvasWrapper.clientHeight);
    if (this.glController) {
      this.setState({ loading: true });
      setTimeout(
        () =>
          this.glController.onResize(() => {
            this.setState({ loading: false });
          }),
        0
      );
    }
  }

  handleFullscreenSwitch() {
    const invertedMode = !this.state.isFullscreenMode;
    this.setState({ isFullscreenMode: invertedMode });
  }

  render() {
    return (
      <div
        className="main-content"
        style={{ opacity: this.state.loading ? "0.5" : "1" }}
      >
        <Fullscreen
          enabled={this.state.isFullscreenMode}
          onChange={this.onFullscreenChange}
        >
          <div
            className="canvas-wrapper"
            ref={r => {
              this.canvasWrapper = r;
            }}
          />
          <OverlayLayer />
        </Fullscreen>
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

export default connect(mapStateToProps)(Content);
