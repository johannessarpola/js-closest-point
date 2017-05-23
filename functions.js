distanceBetweenPoints = function (x1, x2, y1, y2) {
    return Math.sqrt(
        Math.pow(x1 - x2, 2) +
        Math.pow(y1 - y2, 2)
    );
}

powerFunc = function (reach, distance) {
    if (distance > reach) {
        // You should never reach this code
        throw "Distance was longer than reach";
    } else {
        return Math.pow(reach - distance, 2);
    }
}

maxCoords = function (coords) {
    var mX = 0;
    var mY = 0;
    var mR = 0;
    coords.forEach(function (coord) {
        if (coord.x > mX) {
            mX = coord.x;
        }
        if (coord.y > mY) {
            mY = coord.y;
        }
        if(coord.r > mR) {
            mR = coord.r;
        }
    }, this);
    return {
        x: mX,
        y: mY,
        r: mR
    }
}

module.exports = {
    distanceBetweenPoints,
    powerFunc,
    maxCoords
}