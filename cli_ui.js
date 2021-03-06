var functions = require("./functions");
var Network = require("./objects").Network;
var Point = require("./objects").Point;
var readline = require('readline');

/*
    Holds the cli-interface for js-closest-point and it's methods
*/

function UI() {
    this.initUI();
}

UI.prototype.attachNetwork = function (network) {
    this.network = network;
}

UI.prototype.invalidArgs = function () {
    this.out("Please pass a path to csv file for input stations");
    this.out("Using default stations.csv in root");
}
UI.prototype.initUI = function () {
    this.cli = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'js-closest-point> '
    });
}

UI.prototype.out = function (msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    this.cli.prompt(true);
}

UI.prototype.interactiveIntro = function () {
    this.out("Please input points in format x,y to search for best station for it");
}

UI.prototype.otherStations = function (coverageResult, point) {
    if (coverageResult.inRangeStations.length > 0) {
        this.out("---------");
        this.out("Other stations in range of point: ");
        coverageResult.inRangeStations.forEach(function (otherStation) {
            this.out("- " + otherStation.toString() + " with power of " + otherStation.powerToPoint(point));
        }, this);
    } else {
        this.out("No other stations in range for point");
    }
}

UI.prototype.bestMatch = function (station, point) {
    this.out("Best station for the point is: " + station.toString());
    10, this.out("With power of: " + station.powerToPoint(point));
}
UI.prototype.nonInteractiveIntro = function () {
    this.out("Finding best matches for points in the csv file");
}

UI.prototype.nonInteractive = function (points) {
    this.nonInteractiveIntro();
    points.forEach(function (point) {
        if (point.isValid()) {
            this.coverageReport(point);
        } else {
            this.out("Point: " + point.toString() + " was invalid");
        }
        this.out("-------");
    }, this);
}

UI.prototype.coverageReport = function (point) {
    this.out("Looking with point: " + point);
    var coverageResult = this.network.highestPowerStation(point);
    var station = coverageResult.bestStation;
    if (typeof station === 'undefined') {
        this.out("No station in range found for point :(");
    } else {
        this.bestMatch(station, point);
        this.otherStations(coverageResult, point);
    }
}

UI.prototype.interactive = function () {
    this.interactiveIntro();
    this.cli.on('line', (line) => {
        this.cli.pause();
        var point = functions.parsePointFromInput(line);
        if (point.isValid()) {
            this.coverageReport(point);
        } else {
            this.out("Point was not valid, please enter numbers with  format x,y")
        }
        this.cli.resume();
    }).on('close', () => {
        this.out('Thanks for using the app and have a great day!');
        process.exit(0);
    });
}

module.exports = {
    UI
}