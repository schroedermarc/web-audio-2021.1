// scene globals
var startButton, stopButton;
var synth, kickSynth;
var synthSequence, kickSynthSequence;

///////////////////////////////
// instrument options
///////////////////////////////
const synth2Options = {
  vibratoAmount: 0.5,
  vibratoRate: 10,
  harmonicity: 0.2,
  voice0: {
    volume: -30,
    portamento: 0,
    oscillator: {
      type: "sine"
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 0.1
    },
    envelope: {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 0.5
    }
  },
  voice1: {
    volume: -10,
    portamento: 0,
    oscillator: {
      type: "sine"
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 0.5
    },
    envelope: {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 0.5
    }
  }
}

const kickSynthOptions = {

}

//////////////////////////
// effect options
//////////////////////////


//////////////////////////////
// instruments
/////////////////////////////
synth = new Tone.DuoSynth(synth2Options)
kickSynth = new Tone.MembraneSynth(kickSynthOptions)


/////////////////////////////
// effects
/////////////////////////////


///////////////////////////////
// routing
//////////////////////////////
synth.chain(Tone.Master)
kickSynth.chain(Tone.Master)

///////////////////////////////
// sequences
//////////////////////////////
// synthSequence = new Tone.Sequence(function(time, note){
//   synth.triggerAttackRelease(note, '8n', time)
// },['A3', 'A4', [null, 'E3']], '8n')

synthSequence = new Tone.Part(((time, value) => {
	// the value is an object which contains both the note and the velocity
	synth.triggerAttackRelease(value.note, "8n", time, value.velocity);
}), [
  { time: 0, note: "C3", velocity: 0.9 },
	{ time: "0:2", note: "C4", velocity: 0.5 },
	{ time: "0:3", note: "A4", velocity: 0.5 },
	{ time: "0:3:2", note: "A5", velocity: 0.5 },
]).start(0);
synthSequence.loop = true;

kickSynthSequence = new Tone.Sequence(function(time, note){
  kickSynth.triggerAttackRelease(note, '8n', time)
}, [
  'C2', 'C2', 'C2', 'C2',
  'C2', 'C2', 'C2', ['C3', 'C2'],
], '4n')



function setup() {

  createCanvas(400, 400);

  startButton = createButton('start');
  stopButton = createButton('stop');
  startButton.position(10, 10);
  stopButton.position(10, 30);
  startButton.mousePressed(startSong);
  stopButton.mousePressed(stopSong);

  

  // START SEQUENCES HERE
  synthSequence.start();
  kickSynthSequence.start();

  Tone.Transport.start();


}


function draw() {

  background(0);

}


function startSong() {
  Tone.Transport.start();
}

function stopSong() {
  Tone.Transport.stop();
}