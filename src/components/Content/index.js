import React from "react";
import { connect } from "react-redux";
import Fullscreen from "react-full-screen";
import AppController from "../../graphics/AppController";
import CustomPopover from "../Overlay/CustomPopover";

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

    this.resizeHandler = this.resizeHandler.bind(this);
  }

  componentDidMount() {
    console.log("Initialize graphics controller..");
    const rootDiv = document.getElementById("root");
    this.appController = new AppController(rootDiv, this.canvasWrapper);
    this.appController.setStateUpdateHandler(
      this.stateUpdateHandler.bind(this)
    );

    window.addEventListener("resize", this.resizeHandler);
    this.resizeHandler();
  }

  componentWillReceiveProps(nextProps) {
    // console.log("Component: componentWillReceiveProps------");
    // console.log(nextProps);
    if (nextProps.scenarioData.status === "pending") {
      this.appController.clearAll();
    } else if (nextProps.scenarioData.status === "fulfilled") {
      // Update buffer and rerender
      // Gather required data for rendering
      const data = {
        plan: nextProps.scenarioData.data,
        scenario: nextProps.activeScenario
      };

      // init with data and integrate
      setTimeout(() => {
        this.appController.init(data);
      }, 0);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }

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
    if (this.appController) {
      this.setState({ loading: true });
      setTimeout(
        () =>
          this.appController.onResize(() => {
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
        onDoubleClick={e => {
          this.handleFullscreenSwitch();
        }}
        onKeyDown={e => {
          this.handleFullscreenSwitch();
        }}
        className="main-content"
        role="button"
        tabIndex="0"
      >
        <Fullscreen
          enabled={this.state.isFullscreenMode}
          onChange={isFullscreenMode => this.setState({ isFullscreenMode })}
          style={{ visibility: this.state.loading ? "hidden" : "visible" }}
        >
          <div
            className="canvas-wrapper"
            ref={elm => {
              this.canvasWrapper = elm;
            }}
            // style={{ visibility: this.state.loading ? "hidden" : "visible" }}
          />
          {this.displayLoaderOnNeed()}
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
