import { TrMeshObject } from "./Base";
import Utils from "../../AppUtils";
import { Quad3D, Sector3D } from "./Planar";

const defaultOptions = {
  color: [0.5, 0.5, 0.5, 1],
  dPhiCount: 64,
  dYCount: 10,
  phiMin: 0,
  phiMax: 2 * Math.PI,
  deltaColor: 0.02
};
// Define Cylindrical objects
// Y axis is the cylinder axis and stays in y>0
class CylinderSurface3D extends TrMeshObject {
  constructor(radius, height, options = null) {
    super(defaultOptions);
    this.radius = radius;
    this.height = height;
    this.setOptions(options);
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const {
        dPhiCount,
        dYCount,
        phiMin,
        phiMax,
        color,
        deltaColor
      } = this.options;
      const dPhi = (phiMax - phiMin) / dPhiCount;
      const yMin = 0;
      const yMax = this.height;
      const dy = (yMax - yMin) / dYCount;
      const r = this.radius;
      const colorList = [color, color.map(c => c + deltaColor)];
      const phi = i => phiMin + i * dPhi;
      const y = i => 0 + i * dy;
      for (let i = 0; i < dPhiCount; i += 1) {
        for (let j = 0; j < dYCount; j += 1) {
          const p1 = Utils.rPhiYtoXYZ(r, phi(i), y(j + 1));
          const p2 = Utils.rPhiYtoXYZ(r, phi(i), y(j));
          const p3 = Utils.rPhiYtoXYZ(r, phi(i + 1), y(j));
          const p4 = Utils.rPhiYtoXYZ(r, phi(i + 1), y(j + 1));
          const quad = new Quad3D([p1, p2, p3, p4]);

          // hack! TODO: change this logic
          // support adding normal per vertex for quad3d
          quad.getNormal = v => [v[0], 0, v[2]];

          const colorKey = (i + j) % colorList.length;
          quad.color = colorList[colorKey];
          this.childList.push(quad);
        }
      }
    }
  }
}

// Define Closed cylinder object
class ClosedCylinder3D extends TrMeshObject {
  constructor(radius, height, options = null) {
    super(defaultOptions);
    this.radius = radius;
    this.height = height;
    this.setOptions(options);
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const cylSurface3D = new CylinderSurface3D(
        this.radius,
        this.height,
        this.options
      );
      const { dPhiCount, color, deltaColor } = this.options;
      const faceOptions = { dPhiCount, color, deltaColor };
      const face1 = new Sector3D(this.radius, faceOptions);
      const face2 = new Sector3D(this.radius, faceOptions);
      face2.model().translate(0, this.height, 0);
      this.childList.push(cylSurface3D, face1, face2);
    }
  }
}

export { CylinderSurface3D, ClosedCylinder3D };
