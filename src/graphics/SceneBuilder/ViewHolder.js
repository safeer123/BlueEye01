import GraphicsLayer from "../lib/GraphicsLayer";
import UserControl from "../UserControl";
import { EventName } from "../../constants/Events";
import EventEmitter from "../lib/EventEmitter";

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
      this.viewList.sort((a, b) => a.id - b.id);
      EventEmitter.emit(EventName.SetViewList, this.viewList);
    }

    if (this.viewList.length > 0) {
      this.setCurrentViewByIndex(0);
      this.currentViewIndex = 0;
    }

    EventEmitter.on(EventName.SwitchView, this.switchView.bind(this));
  }

  // This is the main animation loop which gets invoked at screen refresh time
  animationLoop(timestamp) {
    if (this.userControl) this.userControl.loop(timestamp);
  }

  switchView = ({ step, index }) => {
    if (step) {
      let nextIndex = (this.currentViewIndex + step) % this.viewList.length;
      if (nextIndex < 0) nextIndex += this.viewList.length;
      this.setCurrentViewByIndex(nextIndex);
    } else {
      this.setCurrentViewByIndex(index);
    }
  };

  registerViewSwitchControl() {
    const { userControl } = this;
    const main = () => this.switchView({ step: 1 });
    const keyControlObject = {
      modeName: "Switch Views",
      main
    };
    userControl.registerControlMode("Controlv", keyControlObject);
  }

  displayOutHandler = displayOutList => {
    if (displayOutList && displayOutList.length > 0) {
      EventEmitter.emit(EventName.DisplayOutRequest, {
        displayOutList,
        duration: 2
      });
    }
  };

  handleGesture(gestureType, event) {
    // console.log(gestureType, event);
    this.userControl.handleGesture(gestureType, event);
    switch (gestureType) {
      default:
        // this.displayOutHandler([gestureType]);
        break;
    }
  }

  setCurrentViewByIndex(index) {
    this.setCurrentView(this.viewList[index]);
    this.currentViewIndex = index;
    EventEmitter.emit(EventName.SetCurrentView, index);
  }

  setCurrentView(view) {
    if (this.currentView) {
      this.currentView.stop();
      this.userControl.clearControlModes();
    }
    if (this.createCanvasView) {
      this.currentView = this.createCanvasView(view.canvasViewClass);
      if (this.currentView) {
        this.currentView.registerAnimationLoop(this.animationLoop.bind(this));
        // Concrete class must define createScene method
        if (this.createScene) {
          this.createScene();
        }
        // If there is a name for the view, show it
        if (this.currentView.name) {
          this.displayOutHandler([`Switched to ${view.name}`]);
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
