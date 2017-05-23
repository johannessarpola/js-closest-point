distanceBetweenPoints = function (x1, x2, y1, y2) {
    return Math.sqrt((x1 - x2) + (y1, y2));
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
    coords.forEach(function (coord) {
        if (coord.x > mX) {
            mX = coord.x;
        }
        if (coord.y > mY) {
            mY = coord.y;
        }
    }, this);
    return { x: mX, y: mY }
}

module.exports = {
    distanceBetweenPoints,
    powerFunc,
    maxCoords
}