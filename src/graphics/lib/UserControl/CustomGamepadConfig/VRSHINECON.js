const Buttons = {
  X: "X",
  Y: "Y",
  A: "A",
  B: "B",
  SELECT: "SELECT",
  ESC: "ESC"
};

const Joysticks = {
  JSTICK: "JSTICK"
};

const mapping = {
  id: "XYZ",
  buttonMapping: {
    [Buttons.X]: 2,
    [Buttons.Y]: 3,
    [Buttons.A]: 0,
    [Buttons.B]: 1,
    [Buttons.SELECT]: 4,
    [Buttons.ESC]: 5
  },
  JoystickMapping: {
    [Joysticks.JSTICK]: 0
  }
};

export default { Buttons, Joysticks, mapping };
