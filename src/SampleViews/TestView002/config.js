import SingleNodeView from "./SingleNodeView";
import OneEyeView from "./OneEyeView";
import TwoEyesView from "./TwoEyesView";
import FourByFourView from "./FourByFourView";

const ViewList = [
  {
    id: 2,
    name: "Single Node View",
    short: "SNV",
    canvasViewClass: SingleNodeView
  },
  {
    id: 1,
    name: "VR View",
    short: "VR",
    canvasViewClass: TwoEyesView
  },
  {
    id: 3,
    name: "One Eye View",
    short: "OEV",
    canvasViewClass: OneEyeView
  },
  {
    id: 0,
    name: "Four By Four",
    short: "4X4",
    canvasViewClass: FourByFourView
  }
];

export { ViewList };
