const Utils = {}

Utils.clone = (obj) => {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = Utils.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = Utils.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};

Utils.createBufferObj = () => {
    return {
        data: [],
        numItems: 0,
        buffer: null,
    }
};

Utils.packColorArray = (color) => {
    var buffer = new ArrayBuffer(4);
    var byteView = new Uint8Array(buffer);
    byteView[0] = color[0];
    byteView[1] = color[1];
    byteView[2] = color[2];
    byteView[3] = color[3];
    return new Float32Array(buffer)[0];
};

Utils.TimeWindow = class TimeWindow {
    constructor(startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.offset = 0;
    }

    getPositionOnTimeScale(inputTime) {
        var result = NaN;
        if (inputTime >= this.startTime && inputTime <= this.endTime) {
            result = (inputTime - this.startTime) / (this.endTime - this.startTime);
        }
        return this.offset + (1 - this.offset) * result;
    }

    setOffset(offset) {
        this.offset = offset;
    }
}

Utils.convertDateTime = (dateString) => {
    var strList = dateString.split(" ");
    var year = strList[0].split("/");
    return year[2] + "/" + year[1] + "/" + year[0] + " " + strList[1];
};

Utils.strToDate = (dateStr) => {
    dateStr = dateStr.replace("T", " ");
    dateStr = dateStr.replace("-", "/");
    dateStr = dateStr.replace("Z", "");
    return new Date(dateStr);
};

Utils.toClockTime = (dateStr) => {
    return dateStr.split("T")[1].split(":").splice(0, 2).join(":");
};

Utils.getTimeDiffInMin = (date1, date2) => {
    return (date2.getTime() - date1.getTime()) / 60000;
};

Utils.isInsideBox = (boundingBox, point) => {
    if (point.x >= boundingBox.left &&
        point.x <= boundingBox.right &&
        point.y >= boundingBox.top &&
        point.y <= boundingBox.bottom) {
        return true;
    }
    return false;
};

Utils.cumulativeOffset = (element) => {
    var top = 0, left = 0;
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);

    return {
        top: top,
        left: left
    };
};

Utils.FCache = new class {
    constructor() {
        this.cached = [];
    }

    sin(theta) {
        let key = "sin" + theta.toString();
        if (! (key in this.cached)) {
            this.cached[key] = Math.sin(theta);
        }
        return this.cached[key];
    }

    cos(theta) {
        let key = "cos" + theta.toString();
        if (! (key in this.cached)) {
            this.cached[key] = Math.cos(theta);
        }
        return this.cached[key];
    }
};

Utils.rThetaPhiToXYZ = (r, theta, phi) => {
    return [
        r * Utils.FCache.sin(theta) * Utils.FCache.cos(phi),
        r * Utils.FCache.cos(theta),
        r * Utils.FCache.sin(theta) * Utils.FCache.sin(phi),
    ];
};

Utils.interpolate = (a, b, t) => {
    if(Number.isFinite(a) && Number.isFinite(b)) {
        return a*(1-t)+b*t;
    }
    else if(Array.isArray(a) && Array.isArray(b)) {
        let out = [];
        a.forEach( (k, i) => out.push(interpolate(a[i], b[i], t)));
        return out;
    }
};

Utils.radToDegree = (rad) => {
    return (180 * rad / Math.PI).toFixed(2);
};

export { Utils };