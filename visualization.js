var functions = require("./functions");
var program = require('commander');
var d3 = require('d3');
var xmldom = require('xmldom');
var jsdom = require('jsdom');
var fs = require("fs");

program
    .version('1.0')
    .usage('-s [stations csv] -p [points csv] -k 1 (1 or 0 depending on to use kdtree or not)')
    .option('-k, --kdtree <n>', 'Use kdtree for stations', parseInt)
    .option('-s, --stations [value]', 'File to load stations from')
    .option('-p, --points [value]', 'File to load points from')
    .parse(process.argv);


function start() {
    var stationsPath;
    var pointsPath;

    if (program.stations) {
        stationsPath = program.stations;
    }
    if (program.points) {
        pointsPath = program.points;
    }
    if (stationsPath == undefined) {
        stationsPath = "stations.csv";
    }

    functions.readStations(stationsPath, function (stations) {
        if (pointsPath == undefined) {
            console.log("points undefined")
        } else {
            functions.readPoints(pointsPath, function (points) {
                generateVisualization(stations, points)
                process.exit(0);
            });
        }
    })
}

function generateVisualization(stations, points) {
    var dom = new jsdom.JSDOM("<!DOCTYPE html><body></body></html>");
    var document = dom.window.document;
    var body = document.body;

    var width = 460,
        height = 300,
        radius = Math.min(width, height) / 2;

    var svg = d3.select(body)
        .append("svg")
        .attr("version", "1.1")
        .attr("xmlns", d3.namespaces.svg)
        .attr("xmlns:xlink", d3.namespaces.xlink)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + 25 + "," + 25 + ")")
        .attr("viewBox", "0 0 " + width + " " + height);

    svg.selectAll("circle")
        .data(stations)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", function (d) {
            return d.r
        });
    //var svgGraph = svg.attr('xmlns', 'http://www.w3.org/2000/svg'); 
    console.log( body.innerHTML);
    fs.writeFileSync('graph.svg', body.innerHTML);

}

start();