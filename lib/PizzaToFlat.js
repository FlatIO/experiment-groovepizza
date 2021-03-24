/**
 * Copyright 2017-2021 Flat (Tutteo Ltd.)
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var POW2 = [1, 2, 4, 8, 16];
var DURATIONS = {
  1: '16th',
  2: 'eighth',
  4: 'quarter',
  8: 'half',
  16: 'whole'
};

var INSTRUMENTS = {
  conga: {
    name: 'Conga',
    midi: '64',
    pitchMapping: {
      'uE/4': {
        normal: '64',
        default: 'normal'
      }
    }
  },
  bongo: {
    name: 'Bongo',
    midi: '61',
    pitchMapping: {
      'uE/4': {
        normal: '61',
        default: 'normal'
      }
    }
  },
  bell: {
    name: 'Bell',
    midi: '57',
    pitchMapping: {
      'uE/4': {
        normal: '57',
        default: 'normal'
      }
    }
  },
  kick: {
    name: 'Kick',
    midi: '36',
    pitchMapping: {
      'uE/4': {
        normal: '36',
        default: 'normal'
      }
    }
  },
  snare: {
    name: 'Snare',
    midi: '39',
    pitchMapping: {
      'uE/4': {
        normal: '39',
        default: 'normal'
      }
    }
  },
  'hi-hat': {
    name: 'Hi-Hat',
    midi: '45',
    pitchMapping: {
      'uE/4': {
        normal: '45',
        default: 'normal'
      }
    }
  },
  ride: {
    name: 'Ride',
    midi: '52',
    pitchMapping: {
      'uE/4': {
        normal: '52',
        default: 'normal'
      }
    }
  }
};

function PizzaToFlat(pizza) {
  this.pizza = pizza;
  this.pizza.options = this.pizza.options || {};
  this.pizzaToFlatPartsMapping = {};
}

/**
 * Create the base of the score file
 *
 * @param {string} title Title of the Pizza
 * @return {object} The base of the file
 */
PizzaToFlat.prototype.boostrapScore = function (title) {
  this.score = {
    'score-partwise': {
      $version: '3.0',
      credit: [{
        'credit-type': 'title',
        'credit-words': title || 'Groove Pizza'
      }],
      'part-list': {
        'score-part': [],
      },
      part: [],
      identification: {
        rights: 'Made using Groove Pizza (https://apps.musedlab.org/groovepizza/) and Flat (https://flat.io)'
      }
    }
  };
  this.scorePartwise = this.score['score-partwise'];
  this.scoreParts = this.scorePartwise['part-list']['score-part'];

  return this.score;
};

/**
 * Create a new part into the score
 *
 * @param {string} key Groove Pizza intrument key
 */
PizzaToFlat.prototype.createPart = function (key) {
  // Re-use part from a previous section with the same instrument
  if (typeof this.pizzaToFlatPartsMapping[key] !== 'undefined') {
    return;
  }

  // Add part
  var instru = INSTRUMENTS[key];
  if (!instru) {
    throw new Error('Instrument ' + key + ' is not available');
  }

  var id = ['P', this.scoreParts.length + 1].join('');
  var idIns = id + '-X1';

  var part = {
    'part-name': instru.name,
    'part-abbreviation': '',
    'score-instrument': {
      'instrument-name': instru.name,
      $id: idIns
    },
    'midi-instrument': {
      'midi-unpitched': instru.midi,
      'midi-program': '1',
      volume: '100',
      'midi-channel': '10'
    },
    pitchMapping: instru.pitchMapping,
    $id: id
  };
  part['midi-instrument'].$id = idIns;

  this.scoreParts.push(part);
  this.scorePartwise.part.push({
    $id: id,
    measure: []
  });
  this.pizzaToFlatPartsMapping[key] = this.scoreParts.length - 1;
};

/**
 * Create all the parts from the Groove Pizza
 *
 * @param {object} section A Groove Pizza section
 */
PizzaToFlat.prototype.createParts = function (section) {
  Object.keys(section.patterns).forEach(this.createPart.bind(this));
};

/**
 * Transform the number of a pizza slices into a time signature
 *
 * @param {mumber} slices Number of slices in the pizza
 * @return {object} Time signature
 */
PizzaToFlat.prototype.getTimeSignature = function (slices) {
  var ts = {
    beats: 4,
    'beat-type': 4
  };

  switch (slices) {
    case 2:
      ts.beats = slices;
      break;
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 9:
    case 11:
    case 12:
    case 13:
    case 15:
      ts.beats = slices;
      ts['beat-type'] = 8;
      break;
    case 8:
    case 10:
    case 14:
      ts.beats = slices / 2;
      break;
  }

  return ts;
};

/**
 * Build the attributes for a pizza section
 *
 * @param {object} section A Groove Pizza section
 */
PizzaToFlat.prototype.getSectionAttributes = function (section) {
  return [{
    divisions: '4',
    time: this.getTimeSignature(section.slices),
    clef: {
      sign: 'percussion',
      line: '2'
    },
    key: {
      fifths: '0'
    },
    'staff-details': {
      'staff-lines': '1'
    },
    noteBefore: '-1'
  }];
};

/**
 * Add a rest in the measure for the tick duration
 *
 * @param {object} measure A file measure
 * @param {number} tickDuration The duration of the rest (number of pizza slices)
 */
PizzaToFlat.prototype.createRest = function (measure, tickDuration) {
  while (tickDuration > 0) {
    for (var i = POW2.length - 1; i >= 0; i--) {
      if (tickDuration >= POW2[i]) {
        measure.note.push({
          staff: '1',
          voice: '1',
          rest: {},
          duration: POW2[i],
          type: DURATIONS[POW2[i]]
        });

        // Remaining duration
        tickDuration -= POW2[i];
        break;
      }
    }
  }
};

/**
 * Add a note in the measure for the tick duration
 *
 * @param {object} scorePart Header of the part
 * @param {object} measure A file measure
 * @param {number} tickDuration The duration of the rest (number of pizza slices)
 */
PizzaToFlat.prototype.createNote = function (scorePart, measure, tickDuration) {
  // Add note
  for (var i = POW2.length - 1; i >= 0; i--) {
    if (tickDuration >= POW2[i]) {
      measure.note.push({
        staff: '1',
        voice: '1',
        unpitched: {
          'display-step': 'E',
          'display-octave': '4'
        },
        instrument: {
          $id: scorePart['score-instrument'].$id
        },
        duration: POW2[i],
        type: DURATIONS[POW2[i]],
      });

      // Remaining duration
      tickDuration -= POW2[i];
      break;
    }
  }

  // Complete with rests
  if (tickDuration > 0) {
    this.createRest(measure, tickDuration);
  }
};

/**
 * Fill a measure from a section patterns
 *
 * @param {object} scorePart Header of the part
 * @param {object} measure File measure
 * @param {object} section Groove Pizza section
 * @param {object} patterns Groove Pizza section part patterns
 */
PizzaToFlat.prototype.fillMeasure = function (scorePart, measure, section, patterns) {
  // Merge ticks
  var ticks = [], previousTick;
  patterns.forEach(function (tick) {
    if (previousTick && !tick) {
      previousTick.duration++;
    }
    else {
      previousTick = {
        state: !!tick,
        duration: 1
      };
      ticks.push(previousTick);
    }
  });

  // Fill the measure with notes
  ticks.forEach(function (tick) {
    // Note
    if (tick.state) {
      this.createNote(scorePart, measure, tick.duration);
    }
    // Rest
    else {
      this.createRest(measure, tick.duration);
    }
  }.bind(this));
};

/**
 * Create an measure and fill it
 *
 * @param {object} scorePart Header of the part
 * @param {object} section Groove Pizza section
 * @param {object} patterns Groove Pizza section part patterns
 */
PizzaToFlat.prototype.createMeasure = function (scorePart, section, patterns) {
  var tempo = section.options.tempo || this.pizza.options.tempo || 80;
  var swing = section.options.swing || this.pizza.options.swing || 0;

  var measure = {
    attributes: this.getSectionAttributes(section),
    sound: {
      $tempo: tempo,
      '$adagio-swing': {
        swing: swing > 0,
        ratio: swing * 100
      },
    },
    note: []
  };

  // Loop mode, add repeat barline
  if (section.repeat) {
    measure.barline = {
      $location: 'right',
      'bar-style': 'light-heavy',
      repeat: {
        $direction: 'backward',
        $times: 1,
        $winged: 'none'
      }
    };
  }

  this.fillMeasure(scorePart, measure, section, patterns);

  return measure;
};

/**
 * For multi-sections and changing instruments, complete the other non-playing instruments in this section with empty measures
 */
PizzaToFlat.prototype.completeNonPlayingInstruments = function () {
  // Find which part has the largest number of measures, and align the other parts on it
  var totalMeasures = 0;
  for (var i = 0; i < this.scorePartwise.part.length; i++) {
    var numberMeasures = this.scorePartwise.part[i].measure.length;
    if (numberMeasures > totalMeasures) {
      totalMeasures = numberMeasures;
    }
  }

  // Create empty measures
  for (var p = 0; p < this.scorePartwise.part.length; p++) {
    var partwise = this.scorePartwise.part[p];
    while (partwise.measure.length < totalMeasures) {
      var section = this.pizza.sections[partwise.measure.length];
      var measure = this.createMeasure(this.scoreParts[p], section, this.generateEmptyPattern(section));
      measure.$number = partwise.measure.length + 1;
      partwise.measure.push(measure);
    }
  }
};

/**
 * Generates an empty pattern based on the number of slices.
 * To be used to create empty measures for non playing instruments
 */
PizzaToFlat.prototype.generateEmptyPattern = function (section) {
  var patterns = [];
  for (var i = 0; i < section.slices; i++) {
    patterns.push(0);
  }
  return patterns;
};

/**
 * Creates a section for the pizza
 *
 * @param {object} section Groove Pizza section
 */
PizzaToFlat.prototype.createSection = function (section) {
  section.options = section.options || {};

  var instruments = Object.keys(section.patterns);

  for (var i = 0; i < instruments.length; i++) {
    var instruKey = instruments[i];
    var patterns = section.patterns[instruKey];
    var partIdx = this.pizzaToFlatPartsMapping[instruKey];
    var partwise = this.scorePartwise.part[partIdx];

    var measure = this.createMeasure(this.scoreParts[partIdx], section, patterns);
    measure.$number = partwise.measure.length + 1;
    partwise.measure.push(measure);
  }

  this.completeNonPlayingInstruments();
};

/**
 * Converts a pizza into a Flat score
 *
 * @return {object} The Flat score
 */
PizzaToFlat.prototype.convert = function () {
  this.boostrapScore(this.pizza.name);

  var sections = this.pizza.sections;
  if (!Array.isArray(sections) || sections.length === 0) {
     throw new Error('No pizza section in the JSON');
  }
  // Remove the sections repeats, only keep the last one
  for (var i = 0; i < sections.length; i++) {
    if (i < sections.length - 1) {
      sections[i].repeat = 0;
    }
  }
  // Score creatinon
  for (var s = 0; s < sections.length; s++) {
    // New instruments for the sections
    this.createParts(sections[s]);
    // If we had previous pizzas and new instrument, complete them with empty measures
    if (i > 0) {
      this.completeNonPlayingInstruments();
    }
    // New measures
    this.createSection(sections[s]);
  }

  return this.score;
};

if (typeof module !== 'undefined') {
  module.exports = PizzaToFlat;
}
