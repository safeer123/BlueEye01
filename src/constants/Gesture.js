// Gesture type definition
const GestureType = {
  Swipe: "swipe",
  Press: "press",
  // Tap: "tap",
  Pan: "pan",
  DoubleTap: "doubletap",
  Pinch: "pinch",
  Wheel: "wheel"
};

const GestureTypeList = [
  GestureType.Press,
  GestureType.Swipe,
  // GestureType.Tap,
  GestureType.DoubleTap,
  GestureType.Pan,
  GestureType.Pinch
];

export { GestureType, GestureTypeList };
