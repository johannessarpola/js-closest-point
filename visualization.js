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

function radialGradientFix(svg) {
    return svg.replace(/radialgradient/g, "radialGradient")
}

function stationColoringFunc(station) {
    var scheme = d3.schemeCategory10;
    return scheme[(station.x + station.y + station.r) / scheme.length | 0];
}

function generateVisualization(stations, points) {
    var dom = new jsdom.JSDOM("<!DOCTYPE html><body></body></html>");
    var document = dom.window.document;
    var body = document.body;

    var windowSide = 720


    var padding = 35;
    var maxCoords = functions.maxCoords(stations);

    var padding = 35;
    var side = (windowSide) - (padding * 2);

    var maxDim = d3.max([maxCoords.x, maxCoords.y]);
    var pointFactor = side / (maxDim + (maxCoords.r * 2));

    var x = d3.scaleLinear()
        .domain([-maxCoords.r, maxDim + maxCoords.r])
        .range([0, side]);

    var y = d3.scaleLinear()
        .domain([-maxCoords.r, maxDim + maxCoords.r])
        .range([side, 0]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(maxDim + maxCoords.r)
        .tickSize(-side)

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(maxDim + maxCoords.r)
        .tickSize(-side)

    var svg = d3.select(body)
        .append("svg")
        .attr("version", "1.1")
        .attr("xmlns", d3.namespaces.svg)
        .attr("xmlns:xlink", d3.namespaces.xlink)
        .attr("width", windowSide)
        .attr("height", windowSide)
        .attr("transform", "translate(" + padding + "," + padding + ")")

    var defs = svg.append("defs");

    var radialGradient = defs
        .selectAll("radialGradient")
        .data(stations)
        .enter()
        .append("radialGradient")
        .attr("id", function (d) {
            return "coverageGradient-" + d.id.replace(/ /g,'');
        })
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");
    radialGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", (d) => {
            return stationColoringFunc(d)
        })
        .attr("stop-opacity", 0.7);
    radialGradient.append("stop")
        .attr("offset", "90%")
        .attr("stop-color", (d) => {
            return stationColoringFunc(d)
        })
        .attr("stop-opacity", 0.2);

    svg.selectAll("stationCoverageArea")
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
            return pointFactor * d.r
        })
        //.style("fill", function (d) {
        //    return stationColoringFunc(d);
        //})
        //.style("opacity", .3)
        .style("fill", function (d) {
            return "url(#coverageGradient-" + d.id.replace(/ /g,'') + ")";
        });

    svg.selectAll("stationCenterPoints")
        .data(stations)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x(d.x);
        })
        .attr("cy", function (d) {
            return y(d.y);
        })
        .attr("r", 3)
        .style("fill", function (d) {
            return stationColoringFunc(d);
        })

    svg.selectAll("points")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x(d.x);
        })
        .attr("cy", function (d) {
            return y(d.y);
        })
        .attr("r", 2)
        .style("fill", "red")

    svg.selectAll("pointsLabels")
        .data(points)
        .enter()
        .append("text")
        .text(function (d) {
            return "Point " + d.x + "," + d.y;
        })
        .attr("x", function (d) {
            return x(d.x) - padding / 2;
        })
        .attr("y", function (d) {
            return y(d.y) - padding / 2;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "9px")
        .attr("fill", "black");

    svg.append('g')
        .attr('transform', 'translate(0,' + side + ')')
        .call(xAxis);

    svg.append('g')
        .attr('transform', 'translate(0,0)')
        .call(yAxis);

    svg.selectAll(".tick line")
        .attr("stroke", "grey")
        .attr("stroke-width", 0.5)
        .attr("stroke-opacity", 0.7)
        .attr("shape-renderingy", "crispEdges");

    svg.selectAll("stationLabels")
        .data(stations)
        .enter()
        .append("text")
        .text(function (d) {
            return d.id + ": " + d.x + "," + d.y;
        })
        .attr("x", function (d) {
            return x(d.x) + padding / 2;
        })
        .attr("y", function (d) {
            return y(d.y) + padding / 2;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black");

    var fixedSvg = radialGradientFix(body.innerHTML)
    fs.writeFileSync('graph.svg', fixedSvg);

}

start();