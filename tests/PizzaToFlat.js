var assert = require('assert');
var fs = require('fs');
var path = require('path');

var PizzaToFlat = require('../lib/PizzaToFlat');

describe('Pizza to Flat', function () {
  describe('Chameleon', function () {
    var chameleon;
    it('should convert to a Flat JSON file', function () {
      var pizza = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'pizzas', 'chameleon.json')));
      chameleon = new PizzaToFlat(pizza).convert();
      assert.ok(typeof chameleon === 'object' && chameleon);
      assert.ok(chameleon['score-partwise'], 'Missing score-partwise');
      assert.equal(chameleon['score-partwise'].$version, '3.0');
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
          'midi-unpitched': '45',
          'midi-program': '1',
          'volume': '100',
          'midi-channel': '10',
          '$id': 'P3-X1'
        },
        'pitchMapping': {
          'uE/4': {
            'normal': '45',
            'default': 'normal'
          }
        },
        '$id': 'P3'
      });
    });

    it('should have the part content created', function () {
      assert.equal(chameleon['score-partwise'].part.length, 3);
      assert.equal(chameleon['score-partwise'].part[0].$id, 'P1');
      assert.equal(chameleon['score-partwise'].part[1].$id, 'P2');
      assert.equal(chameleon['score-partwise'].part[2].$id, 'P3');
      assert.equal(chameleon['score-partwise'].part[0].measure.length, 1);
      assert.equal(chameleon['score-partwise'].part[1].measure.length, 1);
      assert.equal(chameleon['score-partwise'].part[2].measure.length, 1);
    });

    it('should have measure attributes set (4/4 & tempo)', function () {
      assert.deepEqual(chameleon['score-partwise'].part[0].measure[0].attributes, [
        {
          'divisions': '4',
          'time': {
            'beats': 4,
            'beat-type': 4
          },
          'clef': {
            'sign': 'percussion',
            'line': '2'
          },
          'key': {
            'fifths': '0'
          },
          'staff-details': {
            'staff-lines': '1'
          },
          'noteBefore': '-1'
        }
      ]);

      assert.deepEqual(chameleon['score-partwise'].part[0].measure[0].barline, {
        $location: 'right',
        'bar-style': 'light-heavy',
        repeat: {
          $direction: 'backward',
          $times: 1,
          $winged: 'none'
        }
      });

      assert.deepEqual(chameleon['score-partwise'].part[0].measure[0].sound, {
        '$tempo': 94,
        '$adagio-swing': {
          "ratio": 30,
          "swing": true
        }
      });
    });

    it('measure content with notes & rests merged', function () {
      // [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0] (16)
      var m = chameleon['score-partwise'].part[0].measure[0];

      assert.deepEqual(m.note, [
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P1-X1'
          },
          'duration': 8,
          'type': 'half'
        },
        {
          'staff': '1',
          'voice': '1',
          'rest': {},
          'duration': 2,
          'type': 'eighth'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P1-X1'
          },
          'duration': 4,
          'type': 'quarter'
        },
        {
          'staff': '1',
          'voice': '1',
          'rest': {},
          'duration': 2,
          'type': 'eighth'
        }
      ]);
    });

    it('should fill measure full of notes (w/o rests)', function () {
      // [1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0] (16)
      var m = chameleon['score-partwise'].part[2].measure[0];

      assert.deepEqual(m.note, [
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 4,
          'type': 'quarter'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 2,
          'type': 'eighth'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 2,
          'type': 'eighth'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 2,
          'type': 'eighth'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 2,
          'type': 'eighth'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 2,
          'type': 'eighth'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 2,
          'type': 'eighth'
        }
      ]);
    });
  });

  describe('Bembe', function () {
    var bembe;
    it('should convert to a Flat JSON file', function () {
      var pizza = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'pizzas', 'bembe.json')));
      bembe = new PizzaToFlat(pizza).convert();
      assert.ok(typeof bembe === 'object' && bembe);
      assert.ok(bembe['score-partwise'], 'Missing score-partwise');
      assert.equal(bembe['score-partwise'].$version, '3.0');
    });

    it('should have measure attributes set (12/8 & tempo)', function () {
      assert.deepEqual(bembe['score-partwise'].part[0].measure[0].attributes, [
        {
          'divisions': '4',
          'time': {
            'beats': 12,
            'beat-type': 8
          },
          'clef': {
            'sign': 'percussion',
            'line': '2'
          },
          'key': {
            'fifths': '0'
          },
          'staff-details': {
            'staff-lines': '1'
          },
          'noteBefore': '-1'
        }
      ]);

      assert.deepEqual(bembe['score-partwise'].part[0].measure[0].sound, {
        '$tempo': 90,
        '$adagio-swing': {
          "ratio": 0,
          "swing": false
        }
      });
    });

    it('should have fill the 12/8 measure (bell)', function () {
      // [1,0,1,0,1,1,0,1,0,1,0,1] (12/bell)
      assert.deepEqual(bembe['score-partwise'].part[2].measure[0].note, [
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 2,
          'type': 'eighth'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 2,
          'type': 'eighth'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 1,
          'type': '16th'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 2,
          'type': 'eighth'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 2,
          'type': 'eighth'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 2,
          'type': 'eighth'
        },
        {
          'staff': '1',
          'voice': '1',
          'unpitched': {
            'display-step': 'E',
            'display-octave': '4'
          },
          'instrument': {
            '$id': 'P3-X1'
          },
          'duration': 1,
          'type': '16th'
        }
      ]);
    });
  });

  describe('4 pizzas and different kits / time signatures', function () {
    var converted;
    it('should convert to a Flat JSON file', function () {
      var pizza = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'pizzas', '4-pizzas-multi-kits.json')));
      converted = new PizzaToFlat(pizza).convert();
      assert.ok(typeof converted === 'object' && converted);
      assert.ok(converted['score-partwise'], 'Missing score-partwise');
      assert.equal(converted['score-partwise'].$version, '3.0');

      // fs.writeFileSync(path.resolve(__dirname, 'pizzas', 'out.json'), JSON.stringify(converted));
    });

    it('should have the 7 instruments part headers', function () {
      assert.ok(converted['score-partwise']['part-list']);
      assert.equal(converted['score-partwise']['part-list']['score-part'].length, 7);
      var scorePart = converted['score-partwise']['part-list']['score-part'];

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
          'midi-unpitched': '45',
          'midi-program': '1',
          'volume': '100',
          'midi-channel': '10',
          '$id': 'P3-X1'
        },
        'pitchMapping': {
          'uE/4': {
            'normal': '45',
            'default': 'normal'
          }
        },
        '$id': 'P3'
      });

      assert.deepEqual(scorePart[3], {
        'part-name': 'Conga',
        'part-abbreviation': '',
        'score-instrument': {
          'instrument-name': 'Conga',
          '$id': 'P4-X1'
        },
        'midi-instrument': {
          'midi-unpitched': '64',
          'midi-program': '1',
          'volume': '100',
          'midi-channel': '10',
          '$id': 'P4-X1'
        },
        'pitchMapping': {
          'uE/4': {
            'normal': '64',
            'default': 'normal'
          }
        },
        '$id': 'P4'
      });

      assert.deepEqual(scorePart[4], {
        'part-name': 'Bongo',
        'part-abbreviation': '',
        'score-instrument': {
          'instrument-name': 'Bongo',
          '$id': 'P5-X1'
        },
        'midi-instrument': {
          'midi-unpitched': '61',
          'midi-program': '1',
          'volume': '100',
          'midi-channel': '10',
          '$id': 'P5-X1'
        },
        'pitchMapping': {
          'uE/4': {
            'normal': '61',
            'default': 'normal'
          }
        },
        '$id': 'P5'
      });

      assert.deepEqual(scorePart[5], {
        'part-name': 'Bell',
        'part-abbreviation': '',
        'score-instrument': {
          'instrument-name': 'Bell',
          '$id': 'P6-X1'
        },
        'midi-instrument': {
          'midi-unpitched': '57',
          'midi-program': '1',
          'volume': '100',
          'midi-channel': '10',
          '$id': 'P6-X1'
        },
        'pitchMapping': {
          'uE/4': {
            'normal': '57',
            'default': 'normal'
          }
        },
        '$id': 'P6'
      });

      assert.deepEqual(scorePart[6], {
        'part-name': 'Ride',
        'part-abbreviation': '',
        'score-instrument': {
          'instrument-name': 'Ride',
          '$id': 'P7-X1'
        },
        'midi-instrument': {
          'midi-unpitched': '52',
          'midi-program': '1',
          'volume': '100',
          'midi-channel': '10',
          '$id': 'P7-X1'
        },
        'pitchMapping': {
          'uE/4': {
            'normal': '52',
            'default': 'normal'
          }
        },
        '$id': 'P7'
      });
    });

    it('should have the part content created and all have 4 measures', function () {
      assert.equal(converted['score-partwise'].part.length, 7);
      assert.equal(converted['score-partwise'].part[0].$id, 'P1');
      assert.equal(converted['score-partwise'].part[1].$id, 'P2');
      assert.equal(converted['score-partwise'].part[2].$id, 'P3');
      assert.equal(converted['score-partwise'].part[3].$id, 'P4');
      assert.equal(converted['score-partwise'].part[4].$id, 'P5');
      assert.equal(converted['score-partwise'].part[5].$id, 'P6');
      assert.equal(converted['score-partwise'].part[6].$id, 'P7');
      assert.equal(converted['score-partwise'].part[0].measure.length, 4);
      assert.equal(converted['score-partwise'].part[1].measure.length, 4);
      assert.equal(converted['score-partwise'].part[2].measure.length, 4);
      assert.equal(converted['score-partwise'].part[3].measure.length, 4);
      assert.equal(converted['score-partwise'].part[4].measure.length, 4);
      assert.equal(converted['score-partwise'].part[5].measure.length, 4);
      assert.equal(converted['score-partwise'].part[6].measure.length, 4);
    });

    it('should have the correct timesig set on each measure', function () {
      // 12/8 on first section
      for (let i = 0; i < 7; i++) {
        assert.deepEqual(converted['score-partwise'].part[i].measure[0].attributes, [
          {
            'divisions': '4',
            'time': {
              'beats': 12,
              'beat-type': 8
            },
            'clef': {
              'sign': 'percussion',
              'line': '2'
            },
            'key': {
              'fifths': '0'
            },
            'staff-details': {
              'staff-lines': '1'
            },
            'noteBefore': '-1'
          }
        ]);
      }

      // 4/4 on second section and next section
      for (let i = 0; i < 7; i++) {
        assert.deepEqual(converted['score-partwise'].part[i].measure[1].attributes, [
          {
            'divisions': '4',
            'time': {
              'beats': 4,
              'beat-type': 4
            },
            'clef': {
              'sign': 'percussion',
              'line': '2'
            },
            'key': {
              'fifths': '0'
            },
            'staff-details': {
              'staff-lines': '1'
            },
            'noteBefore': '-1'
          }
        ]);
        assert.deepEqual(converted['score-partwise'].part[i].measure[2].attributes, [
          {
            'divisions': '4',
            'time': {
              'beats': 4,
              'beat-type': 4
            },
            'clef': {
              'sign': 'percussion',
              'line': '2'
            },
            'key': {
              'fifths': '0'
            },
            'staff-details': {
              'staff-lines': '1'
            },
            'noteBefore': '-1'
          }
        ]);
      }
    });

    it('should have set the swing on & off', function () {
      assert.deepEqual(converted['score-partwise'].part[0].measure[0].sound, {
        '$tempo': 90,
        '$adagio-swing': {
          "ratio": 50,
          "swing": true
        }
      });
      assert.deepEqual(converted['score-partwise'].part[0].measure[1].sound, {
        '$tempo': 90,
        '$adagio-swing': {
          "ratio": 0,
          "swing": false
        }
      });
      assert.deepEqual(converted['score-partwise'].part[0].measure[2].sound, {
        '$tempo': 90,
        '$adagio-swing': {
          "ratio": 0,
          "swing": false
        }
      });
      assert.deepEqual(converted['score-partwise'].part[0].measure[3].sound, {
        '$tempo': 90,
        '$adagio-swing': {
          "ratio": 50,
          "swing": true
        }
      });
    });
  });
});
