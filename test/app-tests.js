var assert = require('chai').assert;
var expect = require('chai').expect;
var app = require('../app');
var Network = require('../app').Network;
var Station = require('../app').Station;

describe('Network', function () {
  describe('build network', function () {
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
      var point = { x: 26, y: 26 };
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
      var point = { x: 19, y: 19 };
      var station = network.highestPowerStation(point);     
      assert.isTrue(typeof station !== 'undefined' );
      assert.equal(25, station.x);
      assert.equal(25, station.y);

      var outsideReachPoint = { x: 1, y:1 };
      station = network.highestPowerStation(outsideReachPoint);
      assert.isTrue(typeof station === 'undefined' );
      network.dispose();

   });
  });

});