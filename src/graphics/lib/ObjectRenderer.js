export default class ObjectRenderer {
  // we need gl, list<program>,
  constructor(gl, programs, config) {
    // Required stuffs for me
    this.gl = gl;
    this.program = programs[config.programId];
    this.config = config;
    this.uniformGetter = {}; // { uniform: uniformGetter }

    if (!this.gl || !this.program) {
      console.error("ObjectRenderer(): Invalid init values provided.");
    }

    this.objects = [];

    this.buffers = {
      trgl: {
        numItems: 0,
        buffer: null
      },
      line: {
        numItems: 0,
        buffer: null
      }
    };
  }

  addObject(obj) {
    this.objects.push(obj);
  }

  addObjects(objList) {
    this.objects.push.apply(this.objects, objList);
  }

  clearObjects() {
    // Clear object list
    this.objects.length = 0;

    // Clear buffers
    if (this.buffers.trgl.buffer)
      this.gl.deleteBuffer(this.buffers.trgl.buffer);
    if (this.buffers.line.buffer)
      this.gl.deleteBuffer(this.buffers.line.buffer);

    this.buffers.trgl.numItems = 0;
    this.buffers.line.numItems = 0;
  }

  createBuffers() {
    let gl = this.gl;
    if (this.objects.length > 0) {
      let trglBuffer = this.buffers.trgl;
      let trglData = [];
      let lineBuffer = this.buffers.line;
      let lineData = [];

      // Create array of data from all objects
      this.objects.forEach(object => {
        var arrayObj = object.toArrayBuffer();

        // Gather all traingle data
        trglData.push.apply(trglData, arrayObj.trglData);
        trglBuffer.numItems += arrayObj.trglItems;

        // Gather all line data
        lineData.push.apply(lineData, arrayObj.lineData);
        lineBuffer.numItems += arrayObj.lineItems;
      });

      // Send data to GPU
      if (trglBuffer.numItems > 0) {
        trglBuffer.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trglBuffer.buffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(trglData),
          gl.STATIC_DRAW
        );
      }

      if (lineBuffer.numItems > 0) {
        lineBuffer.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer.buffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(lineData),
          gl.STATIC_DRAW
        );
      }
    }
  }

  render(viewport) {
    let gl = this.gl;

    if (viewport) {
      gl.viewport(
        viewport.x * gl.canvas.width,
        viewport.y * gl.canvas.height,
        viewport.width * gl.canvas.width,
        viewport.height * gl.canvas.height
      );
    } else {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    var trglBuffer = this.buffers.trgl;
    var lineBuffer = this.buffers.line;
    let { triangleBfrPtrConfig, lineBfrPtrConfig } = this.config.bufferDetails;

    if (trglBuffer.numItems > 0) {
      this.drawItems(gl.TRIANGLES, trglBuffer, triangleBfrPtrConfig);
    }
    if (lineBuffer.numItems > 0) {
      this.drawItems(gl.LINES, lineBuffer, lineBfrPtrConfig);
    }
  }

  drawItems(primitiveType, bufferObj, bufferPtrConfig) {
    let gl = this.gl;
    let { enableDepthTest, enableCulling } = this.config;

    gl.useProgram(this.program);

    // Bind the buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferObj.buffer);

    bufferPtrConfig.forEach(bufferPtr => {
      let attribLocation = this.program.attribs[bufferPtr.attribName].location;

      gl.enableVertexAttribArray(attribLocation);

      gl.vertexAttribPointer(
        attribLocation,
        bufferPtr.size,
        bufferPtr.type,
        bufferPtr.normalize,
        bufferPtr.stride,
        bufferPtr.offset
      );
    });

    Object.values(this.program.uniforms).forEach(uniformObj => {
      const { uniformName, location, type } = uniformObj;

      if (!this.uniformGetter[uniformName]) return;

      const value = this.uniformGetter[uniformName]();
      switch (type) {
        case "mat4":
          gl.uniformMatrix4fv(location, false, value);
          break;
        case "mat3":
          gl.uniformMatrix3fv(location, false, value);
          break;
        case "vec2":
          gl.uniform2fv(location, value);
          break;
        case "vec3":
          gl.uniform3fv(location, value);
          break;
        case "vec4":
          gl.uniform4fv(location, value);
          break;
        case "float":
          gl.uniform1f(location, value);
          break;
      }
    });

    if (enableDepthTest) {
      gl.enable(gl.DEPTH_TEST);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }

    if (enableCulling) {
      gl.enable(gl.CULL_FACE);
    } else {
      gl.disable(gl.CULL_FACE);
    }
    
    // Draw the primitives.
    gl.drawArrays(primitiveType, 0, bufferObj.numItems);
  }

  setUniformGetter(uniformName, getUniform) {
    this.uniformGetter[uniformName] = getUniform;
  }

  getCanvasAspect() {
    let { width, height } = this.gl.canvas;
    return width / height;
  }
}
