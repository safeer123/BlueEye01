import { TrMeshObject, VertexData } from "./Base";
import { surfaceNormal } from "./Utils";
import Utils from "../../AppUtils";

// p(position): list of 3 vec3
// t(textureCoord): list of 3 vec2
class Triangle3D {
  constructor(p, t = [[], [], []]) {
    if (p.length !== 3 || t.length !== 3) {
      console.error("Triangle3D: we expect 3 values from each vertex data");
    }
    this.p = p;
    this.t = t;
    this.color = [0.5, 0.5, 0.5, 1];
  }

  toArrayBuffer() {
    function toVertices(p, n, t, color) {
      const dataObj = new VertexData();
      const vertexData = [];
      for (let i = 0; i < 3; i += 1) {
        vertexData.push(...p[i], ...color, ...n[i], ...t[i]);
      }
      const vertexNum = 3; // 3 vertices here
      dataObj.trglItems = vertexNum;
      dataObj.trglData = vertexData;
      return dataObj;
    }
    let n = [[], [], []];
    let p;
    if (this.enableNormals) {
      if (this.normal) {
        n = n.map(() => this.normal);
      } else if (this.getNormal) {
        n = this.p.map(vec => this.getNormal(vec));
      } else {
        const normal = surfaceNormal(this.p);
        n = n.map(() => normal);
      }
    }
    if (this.modelMatrix) {
      p = this.p.map(vec => this.modelMatrix.apply(vec));
      if (this.enableNormals) {
        n = n.map(vec => this.modelMatrix.applyInverseTransposeMatrix(vec));
      }
    } else {
      p = this.p;
    }
    return toVertices(p, n, this.t, this.color);
  }
}

// p(position): list of 4 vec3
// t(textureCoord): list of 4 vec2
class Quad3D extends TrMeshObject {
  constructor(p, t = [[], [], [], []]) {
    super();
    if (p.length !== 4 || t.length !== 4) {
      console.error("Quad3D: we expect 4 values from each vertex data");
    }
    this.triangle1 = new Triangle3D([p[0], p[1], p[2]], [t[0], t[1], t[2]]);
    this.triangle2 = new Triangle3D([p[0], p[2], p[3]], [t[0], t[2], t[3]]);
    this.color = [72 / 256, 162 / 256, 219 / 256, 1]; // default
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      this.triangle1.color = this.color;
      this.triangle2.color = this.color;
      this.childList.push(this.triangle1);
      this.childList.push(this.triangle2);
    }
  }
}

const defaultOptionsSector3D = {
  dPhiCount: 20,
  dRCount: 1,
  startPhi: 0,
  endPhi: 2 * Math.PI,
  color: [0.4, 0.4, 0.4, 1],
  deltaColor: 0.02
};

class Sector3D extends TrMeshObject {
  constructor(radius = 1, options) {
    super(defaultOptionsSector3D);
    this.radius = radius;
    this.setOptions(options);
    this.normal = [0, 1, 0];
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const { radius } = this;
      const {
        dPhiCount,
        dRCount,
        startPhi,
        endPhi,
        color,
        deltaColor
      } = this.options;
      const dPhi = (endPhi - startPhi) / dPhiCount;
      const dR = radius / dRCount;
      const colorList = [color, color.map(c => c + deltaColor)];

      const phi = i => startPhi + i * dPhi;
      const r = i => 0 + i * dR;

      for (let i = 0; i < dPhiCount; i += 1) {
        for (let j = 0; j < dRCount; j += 1) {
          const HalfPi = 0.5 * Math.PI;
          const p1 = Utils.rThetaPhiToXYZ(r(j + 1), HalfPi, phi(i + 1));
          const p2 = Utils.rThetaPhiToXYZ(r(j), HalfPi, phi(i + 1));
          const p3 = Utils.rThetaPhiToXYZ(r(j), HalfPi, phi(i));
          const p4 = Utils.rThetaPhiToXYZ(r(j + 1), HalfPi, phi(i));
          const quad = new Quad3D([p1, p2, p3, p4]);
          const colorKey = (i + j) % colorList.length;
          quad.color = colorList[colorKey];
          this.childList.push(quad);
        }
      }
    }
  }
}

const defaultOptionsRectSurface3D = {
  divCount1: 10,
  divCount2: 10,
  color: [0.4, 0.4, 0.4, 1],
  deltaColor: 0.2
};

class RectSurface3D extends TrMeshObject {
  constructor(p1, p2, p3, p4, options) {
    super(defaultOptionsRectSurface3D);
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
    this.setOptions(options);
    this.normal = surfaceNormal([p1, p2, p3]);
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const { p1, p2, p3, p4 } = this;
      const { divCount1, divCount2, color, deltaColor } = this.options;
      const dAlpha = 1.0 / divCount1;
      const dBeta = 1.0 / divCount2;
      const colorList = [color, color.map(c => c + deltaColor)];

      const grid = [];
      for (let i = 0; i <= divCount1; i += 1) {
        const t = i * dAlpha;
        const p1to4 = Utils.interpolate(p1, p4, t);
        const p2to3 = Utils.interpolate(p2, p3, t);
        grid[i] = [];
        for (let j = 0; j <= divCount2; j += 1) {
          const k = j * dBeta;
          grid[i].push(Utils.interpolate(p1to4, p2to3, k));
        }
      }

      for (let i = 0; i < divCount1; i += 1) {
        for (let j = 0; j < divCount2; j += 1) {
          const quad = new Quad3D([
            grid[i][j],
            grid[i][j + 1],
            grid[i + 1][j + 1],
            grid[i + 1][j]
          ]);
          const colorKey = (i + j) % colorList.length;
          quad.color = colorList[colorKey];
          this.childList.push(quad);
        }
      }
    }
  }
}

export { Triangle3D, Quad3D, RectSurface3D, Sector3D };
