var assert = require('assert'),
  fs = require('fs'),
  path = require('path');

var PizzaToFlat = require('../lib/PizzaToFlat');

describe('Pizza to Flat', function () {
  describe('Chameleon', function () {
    var chameleon;
    it('should convert to a Flat JSON file', function (done) {
      var pizza = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'pizzas', 'chameleon.json')));

      chameleon = new PizzaToFlat(pizza).convert();
      assert.ok(typeof chameleon === 'object' && chameleon);
      assert.ok(chameleon['score-partwise'], 'Missing score-partwise');
      assert.equal(chameleon['score-partwise'].$version, '3.0');

      console.log(JSON.stringify(chameleon, null, 4));
      done();
    });
  });
});
