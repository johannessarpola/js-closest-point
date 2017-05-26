var assert = require('chai').assert;
var expect = require('chai').expect;
var Network = require('../objects').Network;
var Station = require('../objects').Station;
var Point = require('../objects').Point;

describe('Objects', function () {

  describe('Network', function () {
    describe('constructor', function () {
      it('should build network correctly', function () {
        var stations = [
          new Station(10, 10, 5),
          new Station(25, 25, 10)
        ]
        var network = new Network(stations);
        assert.isTrue(network.stations.length > 0)
        network.dispose();
      });
    });

    describe('nearestNeighbors', function () {
      it('should find nearest neighbors for point', function () {
        var stations = [
          new Station(10, 10, 5),
          new Station(25, 25, 10),
          new Station(27, 27, 10),
          new Station(38, 38, 10)
        ]
        var network = new Network(stations);
        var point = {
          x: 26,
          y: 26
        };
        var nearStations = network.nearestNeighbors(point);
        assert.equal(2, nearStations.length);
        assert.equal(stations[1], nearStations[0]);
        assert.equal(stations[2], nearStations[1]);
        network.dispose();
      });
    });

    describe('highestPowerStation', function () {
      it('should get the highest powered station to a point', function () {
        var stations = [
          new Station(10, 10, 5),
          new Station(25, 25, 10)
        ]
        var network = new Network(stations);
        var point = {
          x: 21,
          y: 21
        };
        var station = network.highestPowerStation(point).bestStation;
        assert.isTrue(station != undefined && station != null);
        assert.equal(25, station.x);
        assert.equal(25, station.y);

        var outsideReachPoint = {
          x: 1,
          y: 1
        };
        station = network.highestPowerStation(outsideReachPoint).bestStation;
        assert.isTrue(station == undefined || station == null);
        network.dispose();

      });
    });

    describe('highestPowerStation', function () {
      it('should get ohter stations as well if point is in range for multiple stations', function () {
        var stations = [
          new Station(26, 26, 10),
          new Station(27, 27, 10),
          new Station(25, 25, 10)
        ]
        var network = new Network(stations);

        var point = {
          x: 24,
          y: 24
        };

        var otherStations = network.highestPowerStation(point).inRangeStations;
        
        assert.isTrue(otherStations != undefined);
        assert.equal(2, otherStations.length);
        assert.notEqual(25, otherStations[0].x);
        assert.notEqual(25, otherStations[1].x);
      });
    });

  });

  describe('Station', function () {
    describe('constructor', function () {
      it('should build station correctly', function () {
        var station = new Station(1, 2, 3);
        assert.equal(1, station.x);
        assert.equal(2, station.y);
        assert.equal(3, station.r);
      });
    });
  });

  describe('Point', function () {

    describe('constructor', function () {
      it('should build station correctly', function () {
        var point = new Point(1, 1);
        assert.equal(1, point.x);
        assert.equal(1, point.y);
      });
    });

    describe('isValid', function () {
      it('should build but return invalid with isValid', function () {
        var point = new Point(1, NaN);
        assert.isFalse(point.isValid());
      });
    });
  });
  
});