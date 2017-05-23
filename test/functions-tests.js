var assert = require('chai').assert;
var expect = require('chai').expect;
var functions = require('../functions');

describe('Functions', function() {
  describe('maxCoords', function() {
    it('should return max x and y from stations', function() {
      var coords = [{ x: 10, y: 10 }, { x: 25, y: 42 }, { x: 1, y: 1 }];
      var maxCoords =  functions.maxCoords(coords);
      assert.equal(25, maxCoords.x);
      assert.equal(42, maxCoords.y);
    });
  });
  describe('powerFunc', function() {
    it('should calculate the power with the func (r-d)^2', function() {
        var power = functions.powerFunc(10, 5);
        assert.equal(25, power)
        assert.throws(function () { functions.powerFunc(10, 15) }, 'Distance was longer than reach');
    });
  });
  describe('distanceBetweenPoints', function() {
    it('should calculate the distance between two points', function() {
        var d1 = functions.distanceBetweenPoints(1,1,5,5);
        var d2 = functions.distanceBetweenPoints(1,5,1,5);
        assert.equal(0, d1)
        assert.equal(5, d2|0)
    });
  });

});
