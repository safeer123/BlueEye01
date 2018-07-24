import { TrMeshObject } from "./Base";
import { QuadSurface3D } from "./Planar";

// Defines Box object using rectangle surfaces
class Box3D extends TrMeshObject {
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
    this.faceXY1 = new QuadSurface3D(
      [xLeft, yBottom, zNear],
      [xLeft, yTop, zNear],
      [xRight, yTop, zNear],
      [xRight, yBottom, zNear],
      this.xDivisions,
      this.yDivisions
    );
    this.faceXY2 = new QuadSurface3D(
      [xRight, yBottom, zFar],
      [xRight, yTop, zFar],
      [xLeft, yTop, zFar],
      [xLeft, yBottom, zFar],
      this.xDivisions,
      this.yDivisions
    );
    this.faceZY1 = new QuadSurface3D(
      [xRight, yBottom, zNear],
      [xRight, yTop, zNear],
      [xRight, yTop, zFar],
      [xRight, yBottom, zFar],
      this.zDivisions,
      this.yDivisions
    );
    this.faceZY2 = new QuadSurface3D(
      [xLeft, yBottom, zFar],
      [xLeft, yTop, zFar],
      [xLeft, yTop, zNear],
      [xLeft, yBottom, zNear],
      this.zDivisions,
      this.yDivisions
    );
    this.faceXZ1 = new QuadSurface3D(
      [xLeft, yTop, zNear],
      [xLeft, yTop, zFar],
      [xRight, yTop, zFar],
      [xRight, yTop, zNear],
      this.xDivisions,
      this.zDivisions
    );
    this.faceXZ2 = new QuadSurface3D(
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
}

export { Box3D };
