var kdTreeCreator = require("static-kdtree")
var functions = require("./functions")

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Station(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
}

Station.prototype.coordsToArr = function () {
    return [this.x, this.y];
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
        var distance = functions.distanceBetweenPoints(this.x, point.x, this.y, point.y);
        return functions.powerFunc(this.r, distance);
    } else {
        return 0;
    }
}

function Network(stations) {
    this.stations = stations;
    this.maxReach = 0;
    this.buildSpace();
}

Network.prototype.highestPowerStation = function (point) {
    var bestMatch;
    var highestPower = 0;
    this.stations.forEach(function (station) {
        if (station.pointInReach(point)) {
            var power = station.powerToPoint(point);
            if (power > highestPower) {
                bestMatch = station;
            }
        }
    }, this)
    return bestMatch;
}

Network.prototype.nearestNeighbors = function (point) {
    var neighborsIndex = this.kdTree.knn([point.x, point.y], this.stations.length, this.maxReach);
    var neighboringStations = [];
    var self = this;
    neighborsIndex.forEach(function(index) {
        var station = self.stations[index];
        neighboringStations.push(station);
    });
    return neighboringStations;
}

Network.prototype.buildSpace = function () {
    var maxCoords = functions.maxCoords(this.stations);
    var stationProjections = [];
    this.stations.forEach(function (station) {
        if (station.r > this.maxReach) {
            // store the max reach for kdtree nearest-neighbor search
            this.maxReach = station.r;
        }
        stationProjections.push(station.coordsToArr());
    }, this)
    this.kdTree = kdTreeCreator(stationProjections);
}

Network.prototype.toString = function () {
    // todo
}

Network.prototype.dispose = function () {
    this.stations = [];
    this.kdTree.dispose();
    this.maxReach = 0;
}

module.exports = {
    Station,
    Point,
    Network
}