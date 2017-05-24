var parse = require('csv-parse');
var fs = require('fs');

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
    var parser = parse({
        delimiter : ',',
        auto_parse : true
    }, function (err, data) {
        if (err) {
            console.log("Caused error: " + err);
        }
    });
    return parser;
}

var readCsvAsync = function (path, callback) {
    var parser = csvParser();
    var csvRows = [];
    fs.createReadStream(path)
        .pipe(parser)
        .on('data', function (csvrow) {
            csvRows.push(csvrow);
        })
        .on('end', function () {
            console.log("Reading csv done");
            callback(csvRows);
        });
}

module.exports = {
    distanceBetweenPoints,
    powerFunc,
    maxCoords,
    readCsvAsync
}