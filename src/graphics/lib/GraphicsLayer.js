import { Canvas2D } from '../ShaderFactory/Canvas'

// GraphicsLayer Layer
export default class GraphicsLayer {

    // Construct canvas and webgl context
    constructor(wrapperElem, canvasObj) {
        if (!wrapperElem) console.error("Canvas Wrapper Element is unset");

        this.wrapperElem = wrapperElem;

        this.canvas = canvasObj.canvas;
        this.gl = canvasObj.gl;
        this.shaderFac = canvasObj.shaderFac;
    }

    clear() {
        var gl = this.gl;
        if (gl) {
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        }
        if (this.canvas2D) {
            this.canvas2D.ctx.clearRect(0, 0, this.canvas2D.canvas.width, this.canvas2D.canvas.height);
        }
    }

    onResize()
    {
        this.clear();
        this.canvas.width = this.wrapperElem.clientWidth;
        this.canvas.height = this.wrapperElem.clientHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        if(this.canvas2D) {
            this.canvas2D.canvas.width = this.wrapperElem.clientWidth;
            this.canvas2D.canvas.height = this.wrapperElem.clientHeight;
        }
    }

    addCanvas2D() {
        this.canvas2D = new Canvas2D(this.wrapperElem);
    }
}
