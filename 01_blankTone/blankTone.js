var ballPosition;
var velocity;
var chordPlayed = false;

// synth options
FMOptions = {
  harmonicity: 3,
  modulationIndex: 10,
  detune: 0,
  oscillator: {
    type: "sine"
  },
  envelope: {
    attack: 0.01,
    decay: 0.01,
    sustain: 1,
    release: 0.5
  },
  modulation: {
    type: "triangle"
  },
  modulationEnvelope: {
    attack: 0.5,
    decay: 0,
    sustain: 1,
    release: 0.5
  }
}


//synths
var synth = new Tone.FMSynth(FMOptions);

//routing
synth.toMaster();

function setup() {
  createCanvas(600, 600);

  ballPosition = createVector(random(15, width - 15), random(15, height - 15));
  velocity = createVector(random(3, 17), random(3, 6));
}

function draw() {

  background('black');

  // check for walls
  if (ballPosition.x <= 15 || ballPosition.x >= width - 15) {
    synth.triggerAttackRelease('C4', '16n');
    velocity.x = velocity.x * -1;
  }

  if (ballPosition.y <= 15 || ballPosition.y >= height - 15) {
    synth.triggerAttackRelease('C2', '16n');
    velocity.y = velocity.y * -1;
  }

  const squareStart = 185;
  const squareEnd = 415;

  if (ballPosition.x > squareStart
    && ballPosition.x < squareEnd
    && ballPosition.y > squareStart
    && ballPosition.y < squareEnd
  ) {
    // in frames
    if (!chordPlayed) {
      // play the chord
      synth.triggerAttackRelease("B4", '2n');
      chordPlayed = true;
    }

    fill(random(255), random(255), random(255));
  } else {
    // out frames
    chordPlayed = false;
    fill('white');
  }

  rect((width / 2) - 100, (height / 2) - 100, 200, 200);



  // move the ball
  ballPosition.add(velocity);

  fill('white');
  ellipse(ballPosition.x, ballPosition.y, 30);



}