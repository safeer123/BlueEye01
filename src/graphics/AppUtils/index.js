const Utils = {};

Utils.clone = obj => {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== "object") return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = Utils.clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = Utils.clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

Utils.createBufferObj = () => ({
  data: [],
  numItems: 0,
  buffer: null
});

Utils.isInsideBox = (boundingBox, point) => {
  if (
    point.x >= boundingBox.left &&
    point.x <= boundingBox.right &&
    point.y >= boundingBox.top &&
    point.y <= boundingBox.bottom
  ) {
    return true;
  }
  return false;
};

Utils.FCache = new class {
  constructor() {
    this.cached = [];
  }

  sin(theta) {
    const key = `sin${theta.toString()}`;
    if (!(key in this.cached)) {
      this.cached[key] = Math.sin(theta);
    }
    return this.cached[key];
  }

  cos(theta) {
    const key = `cos${theta.toString()}`;
    if (!(key in this.cached)) {
      this.cached[key] = Math.cos(theta);
    }
    return this.cached[key];
  }
}();

Utils.rThetaPhiToXYZ = (r, theta, phi) => [
  r * Utils.FCache.sin(theta) * Utils.FCache.cos(phi),
  r * Utils.FCache.cos(theta),
  r * Utils.FCache.sin(theta) * Utils.FCache.sin(phi)
];

Utils.interpolate = (a, b, t) => {
  if (Number.isFinite(a) && Number.isFinite(b)) {
    return a * (1 - t) + b * t;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    const out = [];
    a.forEach((k, i) => out.push(Utils.interpolate(a[i], b[i], t)));
    return out;
  }
};

Utils.radToDegree = rad => (180 * rad / Math.PI).toFixed(2);

Utils.canvasResize = (canvas, wrapperDiv) => {
  if (canvas && wrapperDiv) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = wrapperDiv.clientWidth * devicePixelRatio;
    canvas.height = wrapperDiv.clientHeight * devicePixelRatio;
    canvas.style.width = `${wrapperDiv.clientWidth}px`;
    canvas.style.height = `${wrapperDiv.clientHeight}px`;
  }
};

export { Utils };
