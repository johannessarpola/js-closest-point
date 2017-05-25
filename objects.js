var functions = require("./functions");
var kdTreeCreator = require("./lib/kdtree/kdtree");

/*
    Holds the objects used in js-closed-points
*/

// Is a coordinate which has x and y
function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.isValid = function () {
    return !(isNaN(this.x) || isNaN(this.y));
}

Point.prototype.toString = function () {
    return JSON.stringify(this);
}

// Is a station defined somewhere which as coords (x,y) and reach (r)
function Station(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
}

Station.prototype.coordsToArr = function () {
    return [this.x, this.y];
}

Station.prototype.pointInReach = function (point) {
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

Station.prototype.toString = function () {
    return JSON.stringify(this);
}

// Wraps the best match from Network
function CoverageResult(bestStation, otherStations){
    this.bestStation = bestStation;
    this.inRangeStations = otherStations;
}

// Has multiple stations which form a 'network' and can look up a best match for a point
function Network(stations) {
    this.stations = stations;
    this.maxReach = 0;
    this.buildSpace();
}

Network.prototype.highestPowerStation = function (point) {
    var bestMatch;
    var bestMatchIndex;
    var highestPower = 0;
    var neighboringStations = this.nearestNeighbors(point);
    var iter = 0;
    neighboringStations.forEach(function (station) {
        if (station.pointInReach(point)) {
            var power = station.powerToPoint(point);
            if (power > highestPower) {
                highestPower = power;
                bestMatch = station;
                bestMatchIndex = iter;
            }
        }
        iter+=1;
    }, this);
    neighboringStations.splice(bestMatchIndex, 1); // remove best match from stations
    return new CoverageResult(bestMatch, neighboringStations);
}

Network.prototype.nearestNeighbors = function (point) {
    var neighborsIndex = this.kdTree.knn([point.x, point.y], this.stations.length, this.maxReach);
    var neighboringStations = [];
    var self = this;
    neighborsIndex.forEach(function (index) {
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
    }, this);
    this.kdTree = kdTreeCreator(stationProjections);
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