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

    var windowWidth = 720
    var windowHeight = 720


    var whiteSpaceFactor = 1.2;
    var padding = 25;
    var maxCoords = functions.maxCoords(stations);

    var xFactor = windowWidth / maxCoords.x / whiteSpaceFactor
    var yFactor = windowHeight / maxCoords.y / whiteSpaceFactor

    var width = (windowWidth),
        height = (windowHeight),
        padding = 50;

    var x = d3.scaleLinear()
        .domain([0, maxCoords.x])
        .range([0, maxCoords.x * xFactor]);

    var y = d3.scaleLinear()
        .domain([0, maxCoords.y])
        .range([maxCoords.y * yFactor, 0]);

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
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding + ")")
        .attr("viewBox", "0 0 " + (width * whiteSpaceFactor + padding) + " " + (height * whiteSpaceFactor + padding));


    svg.append('g')
        .attr('transform', 'translate(0,'+maxCoords.y * yFactor+')')
        .call(xAxis);

    svg.append('g')
        .attr('transform', 'translate(0,0)')
        .call(yAxis);

    svg.selectAll("circle")
        .data(stations)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return d.x * xFactor;
        })
        .attr("cy", function (d) {
            return d.y * yFactor;
        })
        .attr("r", function (d) {
            return d.r
        });

    svg.selectAll("text")
        .data(stations)
        .enter()
        .append("text")
        .text(function (d) {
            return d.id + ": " + d.x + "," + d.y;
        })
        .attr("x", function (d) {
            return d.x * xFactor;
        })
        .attr("y", function (d) {
            return d.y * yFactor;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "red");

    fs.writeFileSync('graph.svg', body.innerHTML);

}

start();