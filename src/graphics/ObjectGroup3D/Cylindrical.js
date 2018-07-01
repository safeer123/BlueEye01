import { TrMeshObject } from "./Base";
import Utils from "../AppUtils";
import { Quad3D } from "./Planar";

const defaultOptions = {
  color: [0.5, 0.5, 0.5],
  dPhiCount: 64,
  dYCount: 10
};
// Define Cylindrical objects
// Y axis is the cylinder axis and stays in y>0
class CylinderSurface3D extends TrMeshObject {
  constructor(radius, height, options = null) {
    super(defaultOptions);
    this.radius = radius;
    this.height = height;
    this.setOptions(options);

    this.deltaColor = 0.2;
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const { dPhiCount, dYCount, color } = this.options;
      const phiMin = 0;
      const phiMax = 2 * Math.PI;
      const dPhi = (phiMax - phiMin) / dPhiCount;
      const yMin = 0;
      const yMax = this.height;
      const dy = (yMax - yMin) / dYCount;
      const r = this.radius;
      for (let phi = phiMin; phi < phiMax; phi += dPhi) {
        for (let y = yMin; y < yMax; y += dy) {
          const p1 = Utils.rPhiYtoXYZ(r, phi, y + dy);
          const p2 = Utils.rPhiYtoXYZ(r, phi, y);
          const p3 = Utils.rPhiYtoXYZ(r, phi + dPhi, y);
          const p4 = Utils.rPhiYtoXYZ(r, phi + dPhi, y + dy);
          const quad = new Quad3D([p1, p2, p3, p4]);

          // hack! TODO: change this logic
          // support adding normal per vertex for quad3d
          quad.getNormal = v => [v[0], 0, v[2]];

          quad.color = [
            color[0] + Math.random() * this.deltaColor,
            color[1] + Math.random() * this.deltaColor,
            color[2] + Math.random() * this.deltaColor,
            1
          ];
          this.childList.push(quad);
        }
      }
    }
  }
}

export { CylinderSurface3D };
