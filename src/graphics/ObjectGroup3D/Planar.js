import { addVectors, multVector } from "../lib/m4";
import { TrMeshObject, VertexData } from "./Base";
import { surfaceNormal } from "./Utils";

class Triangle3D {
  constructor(p1, p2, p3, t1 = [], t2 = [], t3 = []) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.t1 = t1;
    this.t2 = t2;
    this.t3 = t3;
    this.color = [72 / 256, 162 / 256, 219 / 256, 1];
  }

  toArrayBuffer() {
    function toVertices(p1, p2, p3, n1, n2, n3, t1, t2, t3, color) {
      const dataObj = new VertexData();
      const vertexData = [
        ...p1,
        ...color,
        ...n1,
        ...t1,
        ...p2,
        ...color,
        ...n2,
        ...t2,
        ...p3,
        ...color,
        ...n3,
        ...t3
      ];

      const vertexNum = 3; // 3 vertices here
      dataObj.trglItems = vertexNum;
      dataObj.trglData = vertexData;
      return dataObj;
    }
    let p1_ = this.p1;
    let p2_ = this.p2;
    let p3_ = this.p3;
    let n1_ = [];
    let n2_ = [];
    let n3_ = [];
    if (this.enableNormals) {
      if (this.normal) {
        n1_ = this.normal;
        n2_ = this.normal;
        n3_ = this.normal;
      } else if (this.normalSameAsVertex) {
        n1_ = p1_;
        n2_ = p2_;
        n3_ = p3_;
      } else {
        const normal = surfaceNormal(p1_, p2_, p3_);
        n1_ = normal;
        n2_ = normal;
        n3_ = normal;
      }
    }
    if (this.modelMatrix) {
      p1_ = this.modelMatrix.apply(this.p1);
      p2_ = this.modelMatrix.apply(this.p2);
      p3_ = this.modelMatrix.apply(this.p3);
      if (this.enableNormals) {
        n1_ = this.modelMatrix.applyInverseTransposeMatrix(n1_);
        n2_ = this.modelMatrix.applyInverseTransposeMatrix(n2_);
        n3_ = this.modelMatrix.applyInverseTransposeMatrix(n3_);
      }
    }
    return toVertices(
      p1_,
      p2_,
      p3_,
      n1_,
      n2_,
      n3_,
      this.t1,
      this.t2,
      this.t3,
      this.color
    );
  }
}

class Quad3D extends TrMeshObject {
  constructor(p1, p2, p3, p4, t1 = [], t2 = [], t3 = [], t4 = []) {
    super();
    this.triangle1 = new Triangle3D(p1, p2, p3, t1, t2, t3);
    this.triangle2 = new Triangle3D(p1, p3, p4, t1, t3, t4);
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

class RectSurface3D extends TrMeshObject {
  constructor(p1, p2, p3, p4, numRows = 10, numCols = 10) {
    super();
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
    this.numRows = numRows;
    this.numCols = numCols;
    this.color = [72 / 256, 162 / 256, 219 / 256, 1]; // default
    this.deltaColor = 0.2;
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const { p1, p2, p3, p4, numRows, numCols, color } = this;
      let alpha = 0.0;
      const alphaStepSize = 1.0 / numRows;
      let beta = 0.0;
      const betaStepSize = 1.0 / numCols;

      for (
        alpha = 0.0;
        alpha + alphaStepSize <= 1.0 + alphaStepSize / 100;
        alpha += alphaStepSize
      ) {
        const p_1 = addVectors(
          multVector(1 - alpha, p1),
          multVector(alpha, p4)
        );

        const p_2 = addVectors(
          multVector(1 - alpha, p2),
          multVector(alpha, p3)
        );

        const p_3 = addVectors(
          multVector(1 - alpha - alphaStepSize, p2),
          multVector(alpha + alphaStepSize, p3)
        );

        const p_4 = addVectors(
          multVector(1 - alpha - alphaStepSize, p1),
          multVector(alpha + alphaStepSize, p4)
        );

        for (
          beta = 0.0;
          beta + betaStepSize <= 1.0 + betaStepSize / 100;
          beta += betaStepSize
        ) {
          const p_11 = addVectors(
            multVector(1 - beta, p_1),
            multVector(beta, p_2)
          );

          const p_22 = addVectors(
            multVector(1 - beta - betaStepSize, p_1),
            multVector(beta + betaStepSize, p_2)
          );

          const p_33 = addVectors(
            multVector(1 - beta - betaStepSize, p_4),
            multVector(beta + betaStepSize, p_3)
          );

          const p_44 = addVectors(
            multVector(1 - beta, p_4),
            multVector(beta, p_3)
          );

          const quad = new Quad3D(p_11, p_22, p_33, p_44);
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

export { Triangle3D, Quad3D, RectSurface3D };
