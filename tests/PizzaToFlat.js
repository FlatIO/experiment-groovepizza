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

    it('should use the Pizza title', function () {
      assert.ok(chameleon['score-partwise'].credit, 'No credits');
      assert.equal(chameleon['score-partwise'].credit.length, 1);
      assert.equal(chameleon['score-partwise'].credit[0]['credit-type'], 'title');
      assert.equal(chameleon['score-partwise'].credit[0]['credit-words'], 'Chameleon');
    });

    it('should have the 3 instruments part headers', function () {
      assert.ok(chameleon['score-partwise']['part-list']);
      assert.equal(chameleon['score-partwise']['part-list']['score-part'].length, 3);
      var scorePart = chameleon['score-partwise']['part-list']['score-part'];

      assert.deepEqual(scorePart[0], {
        'part-name': 'Kick',
        'part-abbreviation': '',
        'score-instrument': {
          'instrument-name': 'Kick',
          '$id': 'P1-X1'
        },
        'midi-instrument': {
          'midi-unpitched': '36',
          'midi-program': '1',
          'volume': '100',
          'midi-channel': '10',
          '$id': 'P1-X1'
        },
        'pitchMapping': {
          'uE/4': {
            'normal': '36',
            'default': 'normal'
          }
        },
        '$id': 'P1'
      });

      assert.deepEqual(scorePart[1], {
        'part-name': 'Snare',
        'part-abbreviation': '',
        'score-instrument': {
          'instrument-name': 'Snare',
          '$id': 'P2-X1'
        },
        'midi-instrument': {
          'midi-unpitched': '39',
          'midi-program': '1',
          'volume': '100',
          'midi-channel': '10',
          '$id': 'P2-X1'
        },
        'pitchMapping': {
          'uE/4': {
            'normal': '39',
            'default': 'normal'
          }
        },
        '$id': 'P2'
      });

      assert.deepEqual(scorePart[2], {
        'part-name': 'Hi-Hat',
        'part-abbreviation': '',
        'score-instrument': {
          'instrument-name': 'Hi-Hat',
          '$id': 'P3-X1'
        },
        'midi-instrument': {
          'midi-unpitched': '43',
          'midi-program': '1',
          'volume': '100',
          'midi-channel': '10',
          '$id': 'P3-X1'
        },
        'pitchMapping': {
          'uE/4': {
            'normal': '43',
            'default': 'normal'
          }
        },
        '$id': 'P3'
      });
    });
  });
});
