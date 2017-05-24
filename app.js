var functions = require("./functions");
var Station = require("./objects").Station;
var Network = require("./objects").Network;

// todo csv dep
var createStations = function (path, callback) {
    functions.readCsvAsync(path, function (csvRows) {
        var stations = [];
        csvRows.forEach(function (row) {
            var station = new Station(row[0], row[1], row[2]);
            stations.push(station);
        }, this);
        callback(stations);
    });
}

// todo read points from somewhere
// todo output results for best points

function start() {
    // should have stations in args
    var args = process.argv.slice(2);
    console.log("Starting app with stations from: " + args[0]);
    createStations(args[0], function (stations) {
        var network = new Network(stations);
        main(network);
    })
}

function main(network) {
    // todo scan input
    // todo check highest power station
}

start();