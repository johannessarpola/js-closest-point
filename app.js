var functions = require("./functions");
var objects = require("./objects");
var kdTreeCreator = require("static-kdtree");
// todo csv dep
var fs = require("fs");

function Input(stations, points) {
    this.stationsPath = stations;
    this.pointsPath = points;
}

Input.prototype.readStations = function() {

}

function Ouptut(out) {
    this.outPath = out;
}


// todo read stations from somewhere
// todo read points from somewhere
// todo output results for best points