const Buttons = {
  x: "x",
  y: "y",
  a: "a",
  b: "b",
  SELECT: "SELECT",
  ESC: "ESC"
};

const Axes = {
  AxisX: "AxisX",
  AxisY: "AxisY"
};

const mapping = {
  gpid: "VRSHINECON",
  buttonMapping: {
    0: Buttons.a,
    1: Buttons.b,
    2: Buttons.x,
    3: Buttons.y,
    4: Buttons.SELECT,
    5: Buttons.ESC
  },
  axesMapping: {
    0: Axes.AxisX,
    1: Axes.AxisY
  }
};

export default { Buttons, Axes, mapping };
