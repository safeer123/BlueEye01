import config from "./config";
import OBJ0 from "../../Geometry/Objects3D/objects";
import WOFACTORY from "../Factory";
import NodeTypes from "../constants/NodeTypes";
import WorldObject from "../../WorldObject";
import BTN from "../../../constants/Buttons";

export default class GlowingSphere extends WorldObject {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

    const inObjForLight = { ...inObj, renderConfig: null };
    const lightSource = WOFACTORY.create(NodeTypes.ABSTRACT_LIGHT, [
      inObjForLight
    ]);
    this.addChildren([lightSource]);

    lightSource.setPropertyGetter("isActive", () => this.getProperty("isON"));

    this.setPropertyGetter("model_matrix", () => {
      const translation = this.getProperty("translation");
      this.model().identity();
      this.model().translate(...translation);
      return this.model().matrix();
    });

    this.setPropertyGetter("emissive_color", () =>
      lightSource.getProperty("light_color")
    );
    this.setControls();
  }

  defineGeometry() {
    const radius = this.getProperty("radius");
    const shape = new OBJ0.Sphere3D(radius, { color: [0.8, 0.8, 0.8, 1] });
    return [shape];
  }

  setControls() {
    const powerSwitch = () => {
      const isON = this.getProperty("isON");
      this.setProperty("isON", !isON);
    };
    const controls = [
      {
        name: "Power",
        input: ["0"],
        controlButton: () => BTN.Power(this.getProperty("isON")),
        action: () => powerSwitch()
      }
    ];
    this.addControls(controls);
  }
}
