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
    });
  });

});