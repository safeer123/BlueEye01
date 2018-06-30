// Defines Vertex Data structure we are going to build for objects
class VertexData {
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

// Defines a Trangle based mesh structure
class TrMeshObject {
  constructor() {
    this.enableNormals = false; // default
    this.enableTexture = false; // default
    this.childList = [];
  }

  toArrayBuffer() {
    // We expect this method in concrete classes
    if (this.generateChildItems) {
      this.generateChildItems();
    }

    const arrayBuffer = new VertexData();
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
}

export { VertexData, TrMeshObject };
