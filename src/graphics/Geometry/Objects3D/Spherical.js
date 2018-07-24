import { TrMeshObject } from "./Base";
import Utils from "../../AppUtils";
import { Quad3D, Sector3D } from "./Planar";

const defaultOptionsSphere3D = {
  dThetaCount: 20,
  dPhiCount: 20,
  deltaColor: 0.2,
  color: [0.6, 0.6, 0.6, 1],
  startTheta: 0,
  endTheta: Math.PI,
  startPhi: 0,
  endPhi: 2 * Math.PI
};

// Define Spherical objects
class Sphere3D extends TrMeshObject {
  constructor(radius = 1, options) {
    super(defaultOptionsSphere3D);
    this.radius = radius;
    this.setOptions(options);
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const {
        dThetaCount,
        dPhiCount,
        color,
        deltaColor,
        startTheta,
        endTheta,
        startPhi,
        endPhi
      } = this.options;
      const dTheta = (endTheta - startTheta) / dThetaCount;
      const dPhi = (endPhi - startPhi) / dPhiCount;
      const r = this.radius;
      const colorList = [color, color.map(c => c + deltaColor)];

      const theta = i => startTheta + i * dTheta;
      const phi = i => startPhi + i * dPhi;

      for (let i = 0; i < dThetaCount; i += 1) {
        for (let j = 0; j < dPhiCount; j += 1) {
          const p1 = Utils.rThetaPhiToXYZ(r, theta(i), phi(j));
          const p2 = Utils.rThetaPhiToXYZ(r, theta(i + 1), phi(j));
          const p3 = Utils.rThetaPhiToXYZ(r, theta(i + 1), phi(j + 1));
          const p4 = Utils.rThetaPhiToXYZ(r, theta(i), phi(j + 1));
          const quad = new Quad3D([p1, p2, p3, p4]);

          quad.getNormal = v => v;

          const colorKey = (i + j) % colorList.length;
          quad.color = colorList[colorKey];
          this.childList.push(quad);
        }
      }
    }
  }
}

const defaultOptionsHemisphere3D = {
  startTheta: 0,
  endTheta: 0.5 * Math.PI
};

// Define Hemisphere3D object
class Hemisphere3D extends TrMeshObject {
  constructor(radius, options = null) {
    super(defaultOptionsSphere3D);
    this.radius = radius;
    this.setOptions({ ...options, ...defaultOptionsHemisphere3D });
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const HemisphereSurface3D = new Sphere3D(this.radius, this.options);
      const { dPhiCount, color, deltaColor } = this.options;
      const faceOptions = { dPhiCount, color, deltaColor };
      const base = new Sector3D(this.radius, faceOptions);
      this.childList.push(HemisphereSurface3D, base);
    }
  }
}

const defaultOptionsInvertedHemisphere3D = {
  startTheta: 0.5 * Math.PI,
  endTheta: Math.PI
};

// Define InvertedHemisphere3D object
class InvertedHemisphere3D extends Hemisphere3D {
  constructor(radius, options = null) {
    super(radius, options);
    this.setOptions(defaultOptionsInvertedHemisphere3D);
    this.model().translate(0, this.radius, 0);
  }
}

export { Sphere3D, Hemisphere3D, InvertedHemisphere3D };
