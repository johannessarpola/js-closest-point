var functions = require("./functions")
var kdTreeCreator = require("static-kdtree")

function Station(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Station.prototype.coordsToArr = function(){
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
        if(station.pointInReach(point)) {
            var power = station.powerToPoint(point);
            if(power > highestPower){
                bestMatch = station;
            }
        }
    }, this)
    return bestMatch;
}

Network.prototype.nearestNeighbors = function(point) {
    var neighbors = this.kdTree.knn([point.x, point.y], this.stations.length, this.maxReach);
    console.log(neighbors);
}


Network.prototype.buildSpace = function () {
    var maxCoords = functions.maxCoords(this.stations);
    var stationProjections = [];
    this.stations.forEach(function (station) {
        if(station.r > this.maxReach) {
            // store the max reach for kdtree
            this.maxReach = station.r;
            stationProjections.push(station.coordsToArr());
        }
    }, this)
    this.kdTree = kdTreeCreator(stationProjections);
}


Network.prototype.toString = function() {
    // todo
}

module.exports = {
    Station, Point, Network
}