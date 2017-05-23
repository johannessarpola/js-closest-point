var quadtree = require("quadtree-lib")
var functions = require("functions")

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
    this.buildQuad();
    this.addStationsToQuad();
}


Network.prototype.highestPowerStation = function () {
    // TODO
}

Network.prototype.nearestNeighbor = function(coord) {
    // TODO make sure coord has x and y
    var colliding = quadtree.colliding({
        x: coord.x,
        y: coord.y
    });
    console.log(colliding);
}

Network.prototype.buildQuad = function () {
    var maxCoords = functions.maxCoords(this.stations);
    this.networkQuad = quadtree({
        x: maxCoords.x,
        y: maxCoords.y
    });
}

Network.prototype.addStationsToQuad = function () {
    this.stations.forEach(function (station) {
        this.networkQuad.push({
            x: station.x,
            y: station.y,
            width: station.reach
        })
    }, this)
}