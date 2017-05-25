var assert = require('chai').assert;
var expect = require('chai').expect;
var rewire = require('rewire');

var functions = require('../functions');
var internalFunc = rewire('../functions.js');

describe('Functions', function () {
  
  describe('maxCoords', function () {
    it('should return max x and y from stations', function () {
      var coords = [{
        x: 10,
        y: 10
      }, {
        x: 25,
        y: 42
      }, {
        x: 1,
        y: 1
      }];
      var maxCoords = functions.maxCoords(coords);
      assert.equal(25, maxCoords.x);
      assert.equal(42, maxCoords.y);
    });
  });

  describe('powerFunc', function () {
    it('should calculate the power with the func (r-d)^2', function () {
      var power = functions.powerFunc(10, 5);
      assert.equal(25, power)
      assert.throws(function () {
        functions.powerFunc(10, 15)
      }, 'Distance was longer than reach');
    });
  });

  describe('distanceBetweenPoints', function () {
    it('should calculate the distance between two points', function () {
      var d1 = functions.distanceBetweenPoints(1, 1, 5, 5);
      var d2 = functions.distanceBetweenPoints(1, 5, 1, 5);
      assert.equal(0, d1);
      assert.equal(5, d2 | 0);
    });
  });

  describe('readStations', function () {
    it('should create stations from csv file', function () {
      functions.readStations("test/test_stations.csv", function (stations) {
          assert.equal(3, stations.length);
          assert.equal(10, stations[2].x);
          assert.equal(0, stations[2].y);
          assert.equal(12, stations[2].r);
      });
    });
  });

  describe('readCsv', function () {
    it('should read the contents from test/test.csv', function () {
      var readCsvAsync = internalFunc.__get__("readCsvAsync");
      readCsvAsync("test/test.csv", function (rows) {
        assert.equal(3, rows.length)
        assert.equal("abc", rows[0][0]);
        assert.equal(1, rows[0][1]);
        assert.equal("cba", rows[0][2]);
      });
    });
  });


});