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
      var missingNn = network.nearestNeighbor({
        x: 1,
        y: 1
      });
      // assert.isTrue(typeof missing_nn === 'undefined');
      var includedNn = network.nearestNeighbor({
        x: 6,
        y: 6
      });
      // assert.isFalse(typeof includedNn === 'undefined');
      var includedNn2 = network.nearestNeighbor({
        x: 21,
        y: 21
      });
      // assert.isFalse(typeof includedNn2 === 'undefined');

    });
  });

});