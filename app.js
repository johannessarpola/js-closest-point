var quadtree = require("quadtree-lib")
var functions = require ("functions")

function Station(x, y, reach) {
    this.x = x;
    this.y = y;
    this.reach = reach;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Station.prototype.inReach = function (point) {
    // todo error handling if point malformed
    var distance = functions.distanceBetweenPoints(this.x, point.x, this.y, point.y);
    if (distance > this.reach) {
        return false;
    } else {
        return true;
    }
}

Station.prototype.transmitPower = function (point) {
    if (this.inReach(point)) {
        // todo we have power

    } else {
        return 0;
    }
}

function Network(stations) {
    this.stations = stations;
    this.networkQuad = quadtree();
}

Network.prototype.highestPowerStation = function() {
    // todo
}
