export default class DeviceOrientationFeed {
  constructor() {
    if (window.DeviceOrientationEvent) {
      // Our browser supports DeviceOrientation
      console.log("Browser supports Device Orientation");
      window.addEventListener(
        "deviceorientation",
        this.deviceOrientationListener.bind(this)
      );
    } else {
      console.log("Sorry, your browser doesn't support Device Orientation");
    }

    this.listenerList = {};
  }

  // Axes on device
  deviceOrientationListener(event) {
    Object.values(this.listenerList).forEach(listener => {
      listener.cb({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
      });
    });
  }

  addListener(id, l) {
    this.listenerList[id] = l;
  }

  removeListener(id) {
    delete this.listenerList[id];
  }

  clearListeners() {
    this.listenerList = [];
  }
}
