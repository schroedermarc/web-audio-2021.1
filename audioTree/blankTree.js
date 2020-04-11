const synthOptions = {
  volume: -10,
  oscillator: {
    type: "sawtooth"
  },
  filter: {
    Q: 1,
    type: "lowpass",
    rolloff: -96
  },
  envelope: {
    attack: 0.01,
    decay: 0.4,
    sustain: 0.3,
    release: 0.1
  },
  filterEnvelope: {
    attack: 0.06,
    decay: 0.2,
    sustain: 0.5,
    release: 2,
    baseFrequency: 200,
    octaves: 7,
    exponent: 2
  }
};

let synth, synthPart, reverb;

let theta;
let treeHeight = 120;

let colorScale = chroma.scale(['black', 'gray', 'white', 'red', 'white', 'gray', 'black']);

let incrementValue = 0;
let incrementStep = 0.1;

function setup() {
  createCanvas(710, 400);

  // create elements
  synth = new Tone.MonoSynth(synthOptions);
  reverb = new Tone.Convolver({
    url: '../samples/space.wav',
    wet: 0.5
  })

  // routing
  synth.connect(reverb);
  reverb.toMaster();

  // sequences
  synthPart = new Tone.Sequence(function (time, note) {
    // play note
    synth.triggerAttackRelease(note, '16n', time);

    // increment color scale
    Tone.Draw.schedule(function () {
      if (note != null) {
        incrementValue += incrementStep;
      }
    }, time);

  }, ['A4', null, 'Ab4', 'E1', null, 'A3', 'Ab4', null, 'B4', 'Eb4', 'Ab4', 'B4', 'Gb4', "E4", 'A4', null], '16n');

  // launch things
  synthPart.start(0);

  Tone.Transport.start('+0.1');

}

function draw() {
  background(0);
  frameRate(30);
  stroke(255);

  treeHeight = map(mouseY, 0, height, 120, 0);
  reverb.wet.value = map(mouseY, 0, height, 0.5, 0);
  synth.filterEnvelope.baseFrequency = map(mouseX, 0, width, 0, 300);

  // Let's pick an angle 0 to 90 degrees based on the mouse position
  let a = (mouseX / width) * 90;
  // Convert it to radians
  theta = radians(a);
  // Start the tree from the bottom of the screen
  translate(width / 2, height);
  // Draw a line 120 pixels
  stroke(getColor(treeHeight));
  line(0, 0, 0, -treeHeight);
  // Move to the end of that line
  translate(0, -treeHeight);
  // Start the recursive branching!
  branch(treeHeight);



}

function branch(h) {
  // Each branch will be 2/3rds the size of the previous one
  h *= 0.66;

  // All recursive functions must have an exit condition!!!!
  // Here, ours is when the length of the branch is 2 pixels or less
  if (h > 2) {
    push();    // Save the current state of transformation (i.e. where are we now)
    rotate(theta);   // Rotate by theta
    stroke(getColor(h));
    line(0, 0, 0, -h);  // Draw the branch
    translate(0, -h); // Move to the end of the branch
    branch(h);       // Ok, now call myself to draw two new branches!!
    pop();     // Whenever we get back here, we "pop" in order to restore the previous matrix state

    // Repeat the same thing, only branch off to the "left" this time!
    push();
    rotate(-theta);
    stroke(getColor(h));
    line(0, 0, 0, -h);
    translate(0, -h);
    branch(h);
    pop();
  }
}

function getColor(h) {

  const colorScaleIndex = map(h, 2, 120, 0, 1); //static value based on tree position
  const colorWithOffset = (colorScaleIndex + incrementValue) % 1;

  const color = colorScale(colorWithOffset).hex();

  return color;
}