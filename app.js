var functions = require("./functions");
var Network = require("./objects").Network;
var UI = require("./cli_ui").UI;

/*
    Holds the main runnable to be used with Nodejs runtime
*/

function main() {
    // should have stations in args
    var args = process.argv.slice(2);
    var cli = new UI();
    if(args[0] === '-help' || args[0] === '-h') {
        cli.help();
        process.exit(0);
    }
    console.log("Starting app with stations from: " + args[0]);
    if (typeof args[0] === 'undefined') {
        cli.invalidArgs();
        args[0] = "stations.csv";
    }
    functions.readStations(args[0], function (stations) {
        var network = new Network(stations);
        if (args[1] === '-kd') {
            network.toggleKdtree();
        }
        cli.attachNetwork(network);
        cli.open();
    })
}

main();