import GraphicsLayer from "../lib/GraphicsLayer";
import UserControl from "../lib/UserControl";
import { GestureType } from "../../constants/Gesture";

const Hammer = require("hammerjs");

// ViewHolder (Smart Graphics Layer)
// List of CanvasViews having viewports and respective scenes
// Switch View option based on swipe gesture or Control+v
export default class ViewHolder extends GraphicsLayer {
  // Construct canvas and webgl context
  constructor(wrapperElem) {
    super(wrapperElem);
    this.userControl = new UserControl(this.displayOutHandler);
    this.registerViewSwitchControl();
    // Derived class should set viewList
    this.viewList = [];
    if (this.getViewList) {
      this.viewList = this.getViewList();
    }

    if (this.viewList.length > 0) {
      this.setCurrentView(0);
      this.currentViewIndex = 0;
    }
  }

  // This is the main animation loop which gets invoked at screen refresh time
  animationLoop(timestamp) {
    if (this.userControl) this.userControl.loop(timestamp);
  }

  switchView = (step = 1) => {
    let nextIndex = (this.currentViewIndex + step) % this.viewList.length;
    if (nextIndex < 0) nextIndex += this.viewList.length;
    this.setCurrentView(nextIndex);
  };

  registerViewSwitchControl() {
    const { userControl } = this;
    const main = this.switchView;
    const keyControlObject = {
      modeName: "Switch Views",
      main
    };
    userControl.registerControlMode("Controlv", keyControlObject);
  }

  displayOutHandler = displayOutList => {
    if (
      displayOutList &&
      displayOutList.length > 0 &&
      this.stateUpdateHandler
    ) {
      this.stateUpdateHandler(displayOutList, 2);
    }
  };

  handleGesture(gestureType, event) {
    const step = event.direction === Hammer.DIRECTION_LEFT ? 1 : -1;
    console.log(gestureType, event);
    switch (gestureType) {
      case GestureType.Swipe:
        this.switchView(step);
        break;
      default:
        this.displayOutHandler([gestureType]);
        break;
    }
  }

  setCurrentView(index) {
    if (this.currentView) {
      this.currentView.stop();
      this.userControl.clearControlModes();
    }
    const CustomCanvasView = this.viewList[index];
    if (this.createCanvasView) {
      this.currentView = this.createCanvasView(CustomCanvasView);
      if (this.currentView) {
        this.currentView.registerAnimationLoop(this.animationLoop.bind(this));
        this.currentViewIndex = index;
        // Concrete class must define createScene method
        if (this.createScene) {
          this.createScene();
        }
        // If there is a name for the view, show it
        if (this.currentView.name) {
          this.displayOutHandler([`Switched to ${this.currentView.name}`]);
        }
      }
    }
  }

  /* *** Methods expected from concrete implementation *******
  createCanvasView(CustomCanvasView) { 
    return new CustomCanvasView();
  } // Should be overridden by concrete classes

  getViewList() {
    return [];
  } // Should be overridden by concrete classes

  createScene() {
    // Reconstruct the scene and get the current view update with all changes
    // Should be overridden by concrete classes
  }
  */
}
