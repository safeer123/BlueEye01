import SingleNodeView from "./SingleNodeView";
import OneEyeView from "./OneEyeView";
import TwoEyesView from "./TwoEyesView";

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
    id: 0,
    name: "One Eye View",
    short: "OEV",
    canvasViewClass: OneEyeView
  }
];

export { ViewList };
