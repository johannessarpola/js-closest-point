require('babel-register');  
var functions = require("./functions");
var Network = require("./objects").Network;
var UI = require("./cli_ui").UI;
var program = require('commander');

/*
    Holds the main runnable to be used with Nodejs runtime
*/

program
    .version('1.0')
    .usage('-s [stations csv] -p [points csv] -k 1 (1 or 0 depending on to use kdtree or not)')
    .option('-k, --kdtree <n>', 'Use kdtree for stations', parseInt)
    .option('-s, --stations [value]', 'File to load stations from')
    .option('-p, --points [value]', 'File to load points from')
    .parse(process.argv);


function main() {
    var cli = new UI();
    var stationsPath;
    var pointsPath;

    if (program.stations) {
        stationsPath = program.stations;
    }
    if (program.points) {
        pointsPath = program.points;
    }
    if (stationsPath == undefined) {
        cli.invalidArgs();
        stationsPath = "stations.csv";
    }
    functions.readStations(stationsPath, function (stations) {
        cli.out("Starting app with stations from: " + stationsPath);
        var network = new Network(stations);
        if (program.kdtree == 0) {
            network.toggleKdtree();
        }
        cli.attachNetwork(network);
        if (pointsPath == undefined) {
            // use interactive shell
            cli.interactive();
        } else {
            functions.readPoints(pointsPath, function (points) {
                cli.out("Using predefined points from file: " + pointsPath);
                cli.nonInteractive(points);
                process.exit(0);
            });
        }
    })
}

main();