var functions = require("./functions")

function Station(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Station.prototype.pointInReach = function (point) {
    // todo error handling if point malformed
    var distance = functions.distanceBetweenPoints(this.x, point.x, this.y, point.y);
    if (distance > this.r) {
        return false;
    } else {
        return true;
    }
}

Station.prototype.powerToPoint = function (point) {
    if (this.pointInReach(point)) {
        var distance = functions.distanceBetweenPoints(this.x, pointx, this.y, point.y);
        return functions.powerFunc(this.r, distance);
    } else {
        return 0;
    }
}

function Network(stations) {
    this.stations = stations;
    this.buildSpace();
    this.addStationsToSpace();
}


Network.prototype.highestPowerStation = function () {
    // TODO
}

Network.prototype.nearestNeighbor = function(coord) {
    // TODO make sure coord has x and y
}

Network.prototype.buildSpace = function () {
    var maxCoords = functions.maxCoords(this.stations);

}

Network.prototype.addStationsToSpace = function () {
    this.stations.forEach(function (station) {
    }, this)
}

Network.prototype.toString = function() {
    // todo
}

module.exports = {
    Station, Point, Network
}