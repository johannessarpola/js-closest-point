var quadtree = require("quadtree-lib")
var functions = require("./functions")

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

Station.prototype.powerToPoint = function (point) {
    if (this.inReach(point)) {
        var distance = functions.distanceBetweenPoints(this.x, pointx, this.y, point.y);
        return functions.powerFunc(this.reach, distance);
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
    var colliding = this.networkQuad.colliding({
        x: coord.x,
        y: coord.y
    }, function(point, leaf){
        if(leaf.station.inReach(point)) {
            return true;
        }
    });
    return colliding;
}

Network.prototype.buildQuad = function () {
    var maxCoords = functions.maxCoords(this.stations);
    this.networkQuad = new quadtree({
        width: maxCoords.x + 1,
        height: maxCoords.y + 1
    });
}

Network.prototype.addStationsToQuad = function () {
    this.stations.forEach(function (station) {
        this.networkQuad.push({
            x: station.x,
            y: station.y,
            station: station
        });
    }, this)
    console.log(this.networkQuad.pretty())
}

Network.prototype.toString = function() {
    return this.networkQuad.pretty();
}

module.exports = {
    Station, Point, Network
}