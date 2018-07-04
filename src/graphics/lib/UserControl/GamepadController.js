class GamepadController {
  constructor() {
    this.connectedGamepads = [];
    this.gpConfig = null;
    this.buttonHandlerList = {};
    this.JoystickHandlerList = {};

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
  idMatchingWithGamepadConnected() {
    return this.gpConfig;
  }

  loop() {
    if (navigator.getGamepads().length > 0) {
      const gamepadList = navigator.getGamepads();
      const gamepads = Object.values(gamepadList).filter(g => g);
      gamepads.forEach(gamepad => {
        const { index, id } = gamepad;

        if (this.idMatchingWithGamepadConnected(id)) {
          Object.entries(this.buttonHandlerList).forEach(btn => {
            const key = btn[0];
            const handlerObj = btn[1];
            const btnIndex = this.gpConfig.mapping.buttonMapping[key];
            if (btnIndex !== undefined) {
              const buttonState = gamepad.buttons[btnIndex];
              const isPressed = buttonState.pressed;
              if (isPressed) {
                if (handlerObj.down) handlerObj.down(buttonState);
                handlerObj.isPressed = true;
              } else if (handlerObj.isPressed) {
                if (handlerObj.up) handlerObj.up(buttonState);
                handlerObj.isPressed = false;
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

  registerGamepadConfig(config) {
    this.gpConfig = config;
  }

  onButtonDown(key, cb) {
    this.buttonHandlerList[key] = {
      ...this.buttonHandlerList[key],
      down: cb
    };
  }

  onButtonUp(key, cb) {
    this.buttonHandlerList[key] = {
      ...this.buttonHandlerList[key],
      up: cb
    };
  }

  onJoystickChanged(key, cb) {
    this.JoystickHandlerList[key] = {
      ...this.JoystickHandlerList[key],
      valueChanged: cb
    };
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
