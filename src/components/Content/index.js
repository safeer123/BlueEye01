import React from "react";
import { connect } from "react-redux";
import Fullscreen from "react-full-screen";
import NoSleep from "nosleep.js";
import GLController from "../../graphics/GLController";
import CustomPopover from "../Overlay/CustomPopover";
import Utils from "../../graphics/AppUtils";
import { GestureTypeList, GestureType } from "../../constants/Gesture";

const Hammer = require("hammerjs");

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isFullscreenMode: false,
      modeOverlayState: {
        visible: false,
        expiryTime: new Date(),
        displayItemList: []
      }
    };

    this.noSleepObj = new NoSleep();

    this.resizeHandler = this.resizeHandler.bind(this);
  }

  componentDidMount() {
    console.log("Initializing graphics controller..");
    this.glController = new GLController(this.canvasWrapper);
    this.glController.setStateUpdateHandler(this.stateUpdateHandler.bind(this));

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
          this.glController.switchView(step);
        }
      });
    });
  };

  displayLoaderOnNeed() {
    const displayMsg = "Wait.. We are building it...";
    return (
      <div className="loader">
        {this.state.loading ? <span> {displayMsg} </span> : null}
      </div>
    );
  }

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
    this.setState({ modeOverlayState: overlayState });
    setTimeout(() => {
      const { expiryTime } = this.state.modeOverlayState;
      if (new Date() > expiryTime) {
        this.setState({
          modeOverlayState: {
            visible: false,
            displayItemList: [],
            expiryTime
          }
        });
      }
    }, (duration + 1) * 1000);
  }

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
    // If we are fullscreen, then we restrict device going to sleep mode
    if (this.state.isFullscreenMode) {
      this.noSleepObj.enable();
    } else {
      this.noSleepObj.disable();
    }

    return (
      <div
        className="main-content"
        style={{ opacity: this.state.loading ? "0.5" : "1" }}
      >
        <Fullscreen
          enabled={this.state.isFullscreenMode}
          onChange={isFullscreenMode => {
            if (isFullscreenMode) Utils.lockScreenOrientationAsLandscape();
          }}
          ref={elm => {
            this.canvasContainer = elm;
          }}
        >
          <div
            className="canvas-wrapper"
            ref={elm => {
              this.canvasWrapper = elm;
            }}
          >
            {this.displayLoaderOnNeed()}
          </div>
        </Fullscreen>
        <CustomPopover
          visible={this.state.modeOverlayState.visible}
          displayItemList={this.state.modeOverlayState.displayItemList}
        />
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
