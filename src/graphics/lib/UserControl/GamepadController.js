class GamepadController {
  constructor() {
    this.connectedGamepads = [];
    this.gpConfig = null;

    // Previous state of buttons and axes
    this.prevState = {};

    // If we gave gamepad API
    if ("getGamepads" in navigator) {
      console.log("GamepadController: Waiting for any gamepad to connect...");
      this.gamepadDetected = false;

      window.addEventListener("gamepadconnected", this.handleNewConnection);
      window.addEventListener("gamepaddisconnected", this.handleDisconnection);

      // setup an interval for Chrome
      window.setInterval(() => {
        if (navigator.getGamepads()[0]) {
          if (!this.gamepadDetected) {
            console.log("GAMEPAD DETECTED INSIDE SET INTERVAL LOOP...");
            this.handleNewConnection({ gamepad: navigator.getGamepads()[0] });
          }
        }
      }, 2000);
    }
  }

  // TODO: check if the config id matching with this gamepad
  getGpConfig(id) {
    // For now just retun the existing configuration
    // Ideally we should compare id and return the correct config if we have
    return this.gpConfig;
  }

  loop() {
    if (navigator.getGamepads().length > 0) {
      const gamepadList = navigator.getGamepads();
      const gamepads = Object.values(gamepadList).filter(g => g);
      gamepads.forEach(gamepad => {
        const { index, id } = gamepad;

        const config = this.getGpConfig(id);
        if (config) {
          const { gpid, buttonMapping, axesMapping } = config.mapping;

          if (!this.prevState[gpid])
            this.defineState(
              gpid,
              Object.keys(buttonMapping),
              Object.keys(axesMapping)
            );

          Object.keys(buttonMapping).forEach(bi => {
            if (bi in gamepad.buttons) {
              const { pressed } = gamepad.buttons[bi];
              // If previous state is defined
              const pressedBefore = this.prevState[gpid].btn[bi].pressed;
              if (pressed !== pressedBefore) {
                const key = buttonMapping[bi];
                const e = { pressed, index: bi, key };
                if (pressed && this.buttonDown) this.buttonDown(e);
                if (!pressed && this.buttonUp) this.buttonUp(e);

                this.prevState[gpid].btn[bi].pressed = pressed;
              }
            }
          });
        }
      });
    }

    /*
    let gp = navigator.getGamepads()[0];
    let html = "";
    html += "id: " + gp.id + "<br/>";

    for (var i = 0; i < gp.buttons.length; i++) {
      html += "Button " + (i + 1) + ": ";
      if (gp.buttons[i].pressed) html += " pressed";
      html += "<br/>";
    }

    for (var i = 0; i < gp.axes.length; i += 2) {
      html +=
        "Stick " +
        (Math.ceil(i / 2) + 1) +
        ": " +
        gp.axes[i] +
        "," +
        gp.axes[i + 1] +
        "<br/>";
    }
    */
  }

  defineState(id, btns, axes) {
    const stateObj = { btn: {}, axs: {} };
    btns.forEach(bi => {
      stateObj.btn[bi] = { pressed: false };
    });
    axes.forEach(ai => {
      stateObj.axs[ai] = { value: 0.0 };
    });
    this.prevState[id] = stateObj;
  }

  registerGamepadConfig(config) {
    this.gpConfig = config;
  }

  onButtonDown(cb) {
    this.buttonDown = cb;
  }

  onButtonUp(cb) {
    this.buttonUp = cb;
  }

  onAxisValueChanged(cb) {
    this.axisValueChanged = cb;
  }

  onConnected(cb) {
    this.handleConnected = cb;
  }

  onDisconnected(cb) {
    this.handleDisconnected = cb;
  }

  handleDisconnection = e => {
    this.gamepadDetected = false;
    console.log("gamepad disconnected.");
    if (this.handleDisconnected && e && e.gamepad) {
      const name = e.gamepad.id;
      const index = e.gamepad.index;
      this.handleDisconnected({ name, index });
    }
    // window.clearInterval(repGP);
  };

  handleNewConnection = e => {
    this.gamepadDetected = true;
    console.log("gamepad connected.");
    if (this.handleConnected && e && e.gamepad) {
      const name = e.gamepad.id;
      const index = e.gamepad.index;
      this.handleConnected({ name, index });
      this.connectedGamepads[index] = e.gamepad;
    }
    // repGP = window.setInterval(reportOnGamepad, 100);
  };
}

const GamepadControl = new GamepadController();

export default GamepadControl;
