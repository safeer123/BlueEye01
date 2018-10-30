import React from "react";
import { connect } from "react-redux";
import Fullscreen from "react-full-screen";
import GLController from "../../graphics/GLController";
import Utils from "../../graphics/AppUtils";
import { GestureTypeList, GestureType } from "../../constants/Gesture";
import OverlayLayer from "./OverlayLayer";
import EventEmitter from "../../graphics/lib/EventEmitter";
import { EventName } from "../../constants/Events";
import "./index.css";

const MouseWheel = require("mouse-wheel");
const Hammer = require("hammerjs");

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isFullscreenMode: false
    };
    this.resizeHandler = this.resizeHandler.bind(this);
  }

  componentDidMount() {
    console.log("Initializing graphics controller..");
    this.glController = new GLController(this.canvasWrapper);

    window.addEventListener("resize", this.resizeHandler);
    this.resizeHandler();

    this.setupGestureHandlers();
  }

  componentWillReceiveProps(nextProps) {
    // console.log("Component: componentWillReceiveProps------");
    // console.log(nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }

  setupGestureHandlers = () => {
    console.log("setup Gesture Handlers...");
    const hammer = new Hammer(this.canvasWrapper);
    hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });
    hammer.get("pinch").set({
      enable: true
    });
    // Subscribe to a quick start event: press, tap, or doubletap.
    // These are quick start events.
    GestureTypeList.forEach(gesture => {
      hammer.on(gesture, e => {
        if (gesture === GestureType.DoubleTap) {
          this.handleFullscreenSwitch();
        } else if (this.glController && this.state.isFullscreenMode) {
          this.glController.handleGesture(gesture, e);
        } else if (
          !this.state.isFullscreenMode &&
          gesture === GestureType.Swipe
        ) {
          const step = e.direction === Hammer.DIRECTION_LEFT ? 1 : -1;
          EventEmitter.emit(EventName.SwitchView, { step });
        }
      });
    });

    MouseWheel(this.canvasWrapper, (dx, dy) => {
      if (this.glController && this.state.isFullscreenMode) {
        this.glController.handleGesture(GestureType.Wheel, { dx, dy });
      }
    });
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

  onFullscreenChange = isFullscreen => {
    if (isFullscreen) Utils.lockScreenOrientationAsLandscape();
  };

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
        <div className="obj-settings">
          <i className="fa fa-cog" />
        </div>
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
