// scene globals
var startButton, stopButton;
var synth;
var synthArp;
var kickSynth;
var pingPong;

///////////////////////////////
// instrument options
///////////////////////////////


//////////////////////////
// effect options
//////////////////////////
const pluckOptions = {
  attackNoise: 8,
  dampening: 15000,
  resonance: 0.9

};

const pluckOptionsArp = {
  attackNoise: 4,
  dampening: 1000,
  resonance: 0.7

};

const pingPongOptions = {
  delayTime: "16n",
  maxDelayTime: 1,
  wet: 0.5
}


//////////////////////////////
// instruments
/////////////////////////////
synth = new Tone.PluckSynth(pluckOptions);
synthArp = new Tone.PluckSynth(pluckOptionsArp);
kickSynth = new Tone.MembraneSynth({
  volume: -15
});


/////////////////////////////
// effects
/////////////////////////////
pingPong = new Tone.PingPongDelay(pingPongOptions);

///////////////////////////////
// routing
//////////////////////////////
synth.toMaster();
synthArp.connect(pingPong);
pingPong.toMaster();
kickSynth.toMaster();




function setup() {

  createCanvas(400, 400);

  startButton = createButton('start');
  stopButton = createButton('stop');
  startButton.position(10, 10);
  stopButton.position(10, 30);
  startButton.mousePressed(startSong);
  stopButton.mousePressed(stopSong);

  // START SEQUENCES HERE
  const synthPart = new Tone.Sequence(function (time, note) {
    synth.triggerAttackRelease(note, '8n', time);
  }, ['C2'], '8n');

  const kickPart = new Tone.Sequence(function (time, note) {
    kickSynth.triggerAttackRelease(note, '8n', time);
  }, ['C2'], '4n');

  const scale = getScaleRange("A", 'major', 2);
  const arpPattern = new Tone.Pattern(function (time, note) {
    synthArp.triggerAttackRelease(note, '8n', time);
  }, [scale[0], scale[0], scale[4], scale[0]], 'up');
  arpPattern.playbackRate = 2;

  // synthPart.start(0); 
  arpPattern.start(0);
  kickPart.start(0);

  Tone.Transport.start("+0.1");



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