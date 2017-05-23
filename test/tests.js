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

});
