import { TrMeshObject } from "./Base";
import Utils from "../AppUtils";
import { Quad3D } from "./Planar";

// Define Spherical objects
class Sphere3D extends TrMeshObject {
  constructor(radius, color, numDTheta, numDPhi) {
    super();
    this.color = color; // default
    this.radius = radius;
    this.numDTheta = numDTheta;
    this.numDPhi = numDPhi;
    this.deltaColor = 0.2;
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const thetaMin = 0;
      const thetaMax = Math.PI;
      const dTheta = (thetaMax - thetaMin) / this.numDTheta;
      const phiMin = 0;
      const phiMax = 2 * Math.PI;
      const dPhi = (phiMax - phiMin) / this.numDPhi;
      const r = this.radius;
      for (let theta = thetaMin; theta < thetaMax; theta += dTheta) {
        for (let phi = phiMin; phi < phiMax; phi += dPhi) {
          const p1 = Utils.rThetaPhiToXYZ(r, theta, phi + dPhi);
          const p2 = Utils.rThetaPhiToXYZ(r, theta + dTheta, phi + dPhi);
          const p3 = Utils.rThetaPhiToXYZ(r, theta + dTheta, phi);
          const p4 = Utils.rThetaPhiToXYZ(r, theta, phi);
          const quad = new Quad3D(p1, p2, p3, p4);

          // hack! TODO: change this logic
          // support adding normal per vertex for quad3d
          quad.normalSameAsVertex = true;

          quad.color = [
            this.color[0] + Math.random() * this.deltaColor,
            this.color[1] + Math.random() * this.deltaColor,
            this.color[2] + Math.random() * this.deltaColor,
            1
          ];
          this.childList.push(quad);
        }
      }
    }
  }
}

export { Sphere3D };
