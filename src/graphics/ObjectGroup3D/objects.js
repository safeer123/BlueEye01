import { m4, addVectors, subtractVectors, multVector, cross } from "../lib/m4";
import { Utils } from "../AppUtils";

// Defines a Trangle based mesh structure
let TrMeshObject = class {
  constructor() {
    this.enableNormals = false; // default
    this.enableTexture = false; // default
    this.childList = [];
  }

  toArrayBuffer() {
    if (this.generateChildItems) {
      this.generateChildItems();
    }

    let arrayBuffer = new OBJ0.VertexData();
    if (this.childList.length > 0) {
      this.childList.forEach(child => {
        // pass model matrix to children
        if (this.modelMatrix) {
          child.modelMatrix = this.modelMatrix;
        }
        // pass normals
        if (this.enableNormals) {
          child.enableNormals = true;
          if (this.normal) {
            child.normal = this.normal;
          }
          if (this.normalSameAsVertex) {
            child.normalSameAsVertex = this.normalSameAsVertex;
          }
        }

        // pass texture flag
        child.enableTexture = this.enableTexture;

        // Concat all child vertex data
        arrayBuffer.concat(child.toArrayBuffer());
      });
    }
    return arrayBuffer;
  }
};

const OBJ0 = {
  //====== Customizable Basic Objects =====================================//
  //====== These objects can be re-used, can be used to create complex objects

  Triangle3D: class {
    constructor(p1, p2, p3, t1 = [], t2 = [], t3 = []) {
      this.p1 = p1;
      this.p2 = p2;
      this.p3 = p3;
      this.t1 = t1;
      this.t2 = t2;
      this.t3 = t3;
      this.color = [72 / 256, 162 / 256, 219 / 256, 1];
    }

    surfaceNormal(p1, p2, p3) {
      let a = subtractVectors(p1, p2);
      let b = subtractVectors(p3, p2);
      return cross(a, b);
    }

    toArrayBuffer() {
      function toVertices(p1, p2, p3, n1, n2, n3, t1, t2, t3, color) {
        var dataObj = new OBJ0.VertexData();
        var vertexData = [
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

        var vertexNum = 3; // 3 vertices here
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
          let normal = this.surfaceNormal(p1_, p2_, p3_);
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
  },

  Quad3D: class extends TrMeshObject {
    constructor(p1, p2, p3, p4, t1 = [], t2 = [], t3 = [], t4 = []) {
      super();
      this.triangle1 = new OBJ0.Triangle3D(p1, p2, p3, t1, t2, t3);
      this.triangle2 = new OBJ0.Triangle3D(p1, p3, p4, t1, t3, t4);
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
  },

  RectSurface3D: class extends TrMeshObject {
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
        let { p1, p2, p3, p4, numRows, numCols, color } = this;
        let alpha = 0.0;
        let alphaStepSize = 1.0 / numRows;
        let beta = 0.0;
        let betaStepSize = 1.0 / numCols;

        for (
          alpha = 0.0;
          alpha + alphaStepSize <= 1.0+alphaStepSize/100;
          alpha += alphaStepSize
        ) {
          let p_1 = addVectors(
            multVector(1 - alpha, p1),
            multVector(alpha, p4)
          );

          let p_2 = addVectors(
            multVector(1 - alpha, p2),
            multVector(alpha, p3)
          );

          let p_3 = addVectors(
            multVector(1 - alpha - alphaStepSize, p2),
            multVector(alpha + alphaStepSize, p3)
          );

          let p_4 = addVectors(
            multVector(1 - alpha - alphaStepSize, p1),
            multVector(alpha + alphaStepSize, p4)
          );

          for (beta = 0.0; beta + betaStepSize <= 1.0+betaStepSize/100; beta += betaStepSize) {
            let p_11 = addVectors(
              multVector(1 - beta, p_1),
              multVector(beta, p_2)
            );

            let p_22 = addVectors(
              multVector(1 - beta - betaStepSize, p_1),
              multVector(beta + betaStepSize, p_2)
            );

            let p_33 = addVectors(
              multVector(1 - beta - betaStepSize, p_4),
              multVector(beta + betaStepSize, p_3)
            );

            let p_44 = addVectors(
              multVector(1 - beta, p_4),
              multVector(beta, p_3)
            );

            let quad = new OBJ0.Quad3D(p_11, p_22, p_33, p_44);
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
  },

  Sphere3D: class extends TrMeshObject {
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
        let thetaMin = 0;
        let thetaMax = Math.PI;
        let dTheta = (thetaMax - thetaMin) / this.numDTheta;
        let phiMin = 0;
        let phiMax = 2 * Math.PI;
        let dPhi = (phiMax - phiMin) / this.numDPhi;
        let r = this.radius;
        for (let theta = thetaMin; theta < thetaMax; theta += dTheta) {
          for (let phi = phiMin; phi < phiMax; phi += dPhi) {
            let p1 = Utils.rThetaPhiToXYZ(r, theta, phi + dPhi);
            let p2 = Utils.rThetaPhiToXYZ(r, theta + dTheta, phi + dPhi);
            let p3 = Utils.rThetaPhiToXYZ(r, theta + dTheta, phi);
            let p4 = Utils.rThetaPhiToXYZ(r, theta, phi);
            let quad = new OBJ0.Quad3D(p1, p2, p3, p4);

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
  },

  Box3D: class extends TrMeshObject {
    constructor(
      zNear,
      zFar,
      xLeft,
      xRight,
      yBottom,
      yTop,
      xDivisions = 10,
      yDivisions = 10,
      zDivisions = 10
    ) {
      super();
      this.zNear = zNear;
      this.zFar = zFar;
      this.xLeft = xLeft;
      this.xRight = xRight;
      this.yTop = yTop;
      this.yBottom = yBottom;
      this.color = [200 / 256, 50 / 256, 50 / 256, 1];
      this.xDivisions = xDivisions;
      this.yDivisions = yDivisions;
      this.zDivisions = zDivisions;
      this.faceXY1 = new OBJ0.RectSurface3D(
        [xLeft, yBottom, zNear],
        [xLeft, yTop, zNear],
        [xRight, yTop, zNear],
        [xRight, yBottom, zNear],
        this.xDivisions,
        this.yDivisions
      );
      this.faceXY2 = new OBJ0.RectSurface3D(
        [xRight, yBottom, zFar],
        [xRight, yTop, zFar],
        [xLeft, yTop, zFar],
        [xLeft, yBottom, zFar],
        this.xDivisions,
        this.yDivisions
      );
      this.faceZY1 = new OBJ0.RectSurface3D(
        [xRight, yBottom, zNear],
        [xRight, yTop, zNear],
        [xRight, yTop, zFar],
        [xRight, yBottom, zFar],
        this.zDivisions,
        this.yDivisions
      );
      this.faceZY2 = new OBJ0.RectSurface3D(
        [xLeft, yBottom, zFar],
        [xLeft, yTop, zFar],
        [xLeft, yTop, zNear],
        [xLeft, yBottom, zNear],
        this.zDivisions,
        this.yDivisions
      );
      this.faceXZ1 = new OBJ0.RectSurface3D(
        [xLeft, yTop, zNear],
        [xLeft, yTop, zFar],
        [xRight, yTop, zFar],
        [xRight, yTop, zNear],
        this.xDivisions,
        this.zDivisions
      );
      this.faceXZ2 = new OBJ0.RectSurface3D(
        [xRight, yBottom, zNear],
        [xRight, yBottom, zFar],
        [xLeft, yBottom, zFar],
        [xLeft, yBottom, zNear],
        this.xDivisions,
        this.zDivisions
      );
    }

    setPartitionCounts() {}

    generateChildItems() {
      if (this.childList.length === 0) {
        this.faceXY1.color = this.color;
        this.faceXY2.color = this.color;
        this.faceXZ1.color = this.color;
        this.faceXZ2.color = this.color;
        this.faceZY1.color = this.color;
        this.faceZY2.color = this.color;
        this.childList.push(
          this.faceXY1,
          this.faceXY2,
          this.faceXZ1,
          this.faceXZ2,
          this.faceZY1,
          this.faceZY2
        );
      }
    }
  },

  VertexData: class {
    constructor() {
      this.lineData = [];
      this.trglData = [];
      this.lineItems = 0;
      this.trglItems = 0;
    }

    concat(vertexData2) {
      this.lineData = this.lineData.concat(vertexData2.lineData);
      this.trglData = this.trglData.concat(vertexData2.trglData);
      this.lineItems += vertexData2.lineItems;
      this.trglItems += vertexData2.trglItems;
      return this;
    }
  }
};

export default OBJ0;
