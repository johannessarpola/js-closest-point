var assert = require('chai').assert;
var expect = require('chai').expect;
var app = require('../app');

describe('Network', function () {
  describe('build network', function () {
    it('should build network correctly', function () {
      var stations = [
        new app.Station(10, 10, 5), 
        new app.Station(25, 25, 10)
        ]
      var network = new app.Network(stations);
      assert.isTrue(network.stations.length > 0)
    });
  });
  describe('highestPowerStation', function () {
    it('should get the highest powered station to a point', function () {
      var stations = [
        new app.Station(10, 10, 5), 
        new app.Station(25, 25, 10)
        ]
      var network = new app.Network(stations);
      var point = { x: 19, y: 19 };
      var station = network.highestPowerStation(point);     
      assert.isTrue(typeof station !== 'undefined' );
      assert.equal(25, station.x);
      assert.equal(25, station.y);

      var outsideReachPoint = { x: 1, y:1 };
      station = network.highestPowerStation(outsideReachPoint);
      assert.isTrue(typeof station === 'undefined' );

   });
  });

});