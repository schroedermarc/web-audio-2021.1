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

nodes = [];
strings = [];
var convolver;


var stringThetas;

colorScale = chroma.scale(['#C004D9', '#AB05F2', '#6D0FF2', '#3316F2']);

function setup() {

  createCanvas(800, 800);
  angleMode(DEGREES);

  const n = new Node(100, 0, 1, colorScale(0.3).hex());
  const n2 = new Node(200, 0, 1.2, colorScale(0.6).hex());
  const n3 = new Node(300, 0, 0.4, colorScale(0.9).hex());
  nodes.push(n);
  nodes.push(n2);
  nodes.push(n3);

  const s = new String(random(0, 360), 'A4');
  const s2 = new String(random(0, 360), 'E4');
  const s3 = new String(random(0, 360), 'G4');
  strings.push(s);
  strings.push(s2);
  strings.push(s3);

  stringThetas = strings.map(el => { return Math.round(el.getTheta()) });

  // convolver = new Tone.Convolver({ url: '../samples/space.wav', wet: 0.3 }).toMaster();


}

function draw() {

  background('black');

  strings.forEach(el => {
    el.display();
  })

  nodes.forEach(el => {
    el.update();
    el.display();
  })



}


class Node {

  constructor(r, theta, velocity, color) {

    this.r = r;
    this.theta = theta;
    this.radVelocity = velocity;
    this.color = color;
    this.pos = createVector(cos(theta) * r, sin(theta) * r);

  }

  update() {
    this.theta = this.theta += this.radVelocity;
    this.pos.x = cos(this.theta) * this.r;
    this.pos.y = sin(this.theta) * this.r;

    if (stringThetas.includes(Math.round(this.theta % 360))) {
      const synthIndex = stringThetas.indexOf(Math.round(this.theta % 360))
      console.log(synthIndex);
      strings[synthIndex].playNote();

    }

  }

  display() {
    fill(this.color);
    push();
    translate(width / 2, height / 2)
    ellipse(this.pos.x, this.pos.y, 30, 30);
    pop();
  }

}

class String {

  constructor(theta, note) {
    this.theta = theta;
    this.length = 1000;
    this.note = note

    this.synth = new Tone.MonoSynth(synthOptions);
    this.fft = new Tone.Waveform(256)
    this.convolver = new Tone.Convolver({ url: '../samples/space.wav', wet: 0.3 }).toMaster();



    this.synth.connect(this.fft);
    this.fft.connect(this.convolver);

  }

  getTheta() {
    return this.theta;
  }

  display() {

    // const waveArray = fft.getValue();
    // beginShape();
    // for (let i = 0; i < waveArray.length; i++) {
    //   curveVertex(map(log(i), 0, log(waveArray.length), 0, width), map(waveArray[i], -200, 0, height, 0));
    // }
    // endShape();


    // beginShape();
    // for (let i = 0; i < waveArray.length; i++) {
    //   curveVertex(bandSize * i, map(waveArray[i], -1, 1, height, 0));
    // }
    // endShape();

    const waveArray = this.fft.getValue();
    const bandSize = this.length / 265;

    push();
    translate(width / 2, height / 2);
    stroke('white');
    line(0, 0, cos(this.theta) * this.length, sin(this.theta) * this.length);

    // beginShape();
    // for (let i = 0; i < waveArray.length; i++) {
    //   curveVertex(cos(this.theta * (waveArray[i] * 0.1)) * (bandSize * i), sin(this.theta * (waveArray[i] * 0.1)) * (bandSize * i));
    // }
    // endShape();
    pop();

  }

  playNote() {
    this.synth.triggerAttackRelease(this.note, '8n');
  }

}