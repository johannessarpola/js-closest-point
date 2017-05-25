
/*
    Holds the functionality which could be separated from objects (objects.js)
*/

var distanceBetweenPoints = function (x1, x2, y1, y2) {
    return Math.sqrt(
        Math.pow(x1 - x2, 2) +
        Math.pow(y1 - y2, 2)
    );
}

var powerFunc = function (reach, distance) {
    if (distance > reach) {
        // You should never reach this code
        throw "Distance was longer than reach";
    } else {
        return Math.pow(reach - distance, 2);
    }
}

var maxCoords = function (coords) {
    var mX = 0;
    var mY = 0;
    var mR = 0;
    coords.forEach(function (coord) {
        if (coord.x > mX) {
            mX = coord.x;
        }
        if (coord.y > mY) {
            mY = coord.y;
        }
        if (coord.r > mR) {
            mR = coord.r;
        }
    }, this);
    return {
        x: mX,
        y: mY,
        r: mR
    }
}

function csvParser() {
    var parse = require('csv-parse');
    var parser = parse({
        delimiter: ',',
        auto_parse: true
    }, function (err, data) {
        if (err) {
            console.log("Caused error: " + err);
        }
    });
    return parser;
}

var readCsvAsync = function (path, callback) {
    var fs = require('fs');
    var parser = csvParser();
    var csvRows = [];
    fs.createReadStream(path)
        .pipe(parser)
        .on('data', function (csvrow) {
            csvRows.push(csvrow);
        })
        .on('end', function () {
            callback(csvRows);
        });
}

var readStations = function (path, callback) {
    var Station = require("./objects").Station;
    readCsvAsync(path, function (csvRows) {
        var stations = [];
        csvRows.forEach(function (row) {
            var station = new Station(row[0], row[1], row[2]);
            stations.push(station);
        }, this);
        callback(stations);
    });
}

var parsePointFromInput = function(input) {
    var Point = require("./objects").Point;
    var coords = input.split(',');
    // will be nan if invalid
    var point = new Point(parseFloat(coords[0]), parseFloat(coords[1]));
    return point;
}

module.exports = {
    distanceBetweenPoints,
    powerFunc,
    maxCoords,
    readStations,
    parsePointFromInput
}