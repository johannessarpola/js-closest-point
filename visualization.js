var functions = require("./functions");
var program = require('commander');
var d3 = require('d3');
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

    var windowSide = 720


    var whiteSpaceFactor = 1.2;
    var padding = 35;
    var maxCoords = functions.maxCoords(stations);

    var padding = 35;
    var side = (windowSide) - (padding * 2);

    var stationColors = d3.schemeCategory10;

    var x = d3.scaleLinear()
        .domain([-1, maxCoords.x + 1])
        .range([0, side]);

    var y = d3.scaleLinear()
        .domain([-1, maxCoords.y + 1])
        .range([side, 0]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(maxCoords.x + 1);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(maxCoords.y + 1);


    var svg = d3.select(body)
        .append("svg")
        .attr("version", "1.1")
        .attr("xmlns", d3.namespaces.svg)
        .attr("xmlns:xlink", d3.namespaces.xlink)
        .attr("width", windowSide)
        .attr("height", windowSide)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding + ")")
    //.attr("viewBox", "0 0 " + (width * whiteSpaceFactor) + " " + (height * whiteSpaceFactor));

    svg.selectAll("circle")
        .data(stations)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x(d.x);
        })
        .attr("cy", function (d) {
            return y(d.y);
        })
        .attr("r", function (d) {
            return x(d.r) // problem is with maxCoords that there should be only one coord
        })
        .style("fill", function (d) {
            return stationColors[(d.x + d.y + d.r) / stationColors.length | 0]
        });


    svg.append('g')
        .attr('transform', 'translate(0,' + side + ')')
        .call(xAxis);

    svg.append('g')
        .attr('transform', 'translate(0,0)')
        .call(yAxis);

    svg.selectAll("labels")
        .data(stations)
        .enter()
        .append("text")
        .text(function (d) {
            return d.id + ": " + d.x + "," + d.y;
        })
        .attr("x", function (d) {
            return x(d.x) + d.r + 5;
        })
        .attr("y", function (d) {
            return y(d.y) + d.r + 5;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "black");

    fs.writeFileSync('graph.svg', body.innerHTML);

}

start();