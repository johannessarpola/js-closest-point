var functions = require("./functions");
var Network = require("./objects").Network;
var UI = require("./cli_ui").UI;

/*
    Holds the main runnable to be used with Nodejs runtime
*/

function main() {
    // should have stations in args
    var args = process.argv.slice(2);
    console.log("Starting app with stations from: " + args[0]);
    if (typeof args[0] === 'undefined') {
        console.log("Please pass a path to csv file for input stations");
        console.log("Using default stations.csv in root");
        args[0] = "stations.csv";
    }
    functions.readStations(args[0], function (stations) {
        var cli = new UI();
        var network = new Network(stations);
        if (args[1] === '-kd') {
            network.toggleKdtree();
        }
        cli.attachNetwork(network);
        cli.open();
    })
}

main();