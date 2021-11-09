// change 120 to treeheight based on mouseY
// create chroma color scale
// create function to get color scale value from height
// add offset feature
// create synth, delay, and reverb
// create tone loop
// add draw event
// hook up synth and reverb parameters to mouse values

const synthOptions = {
  volume: -10,
  oscillator: {
    type: 'sawtooth',
  },
  filter: {
    Q: 1,
    type: 'lowpass',
    rolloff: -96,
  },
  envelope: {
    attack: 0.01,
    decay: 0.4,
    sustain: 0.3,
    release: 0.1,
  },
  filterEnvelope: {
    attack: 0.06,
    decay: 0.2,
    sustain: 0.5,
    release: 2,
    baseFrequency: 200,
    octaves: 7,
    exponent: 2,
  },
}

let synth, reverb, feedbackDelay

let theta
let treeHeight
let offsetValue = 0
const offsetInc = 0.1

const colorScale = chroma.scale([
  'black',
  'gray',
  'white',
  'red',
  'white',
  'gray',
  'black',
])

function setup() {
  createCanvas(800, 500)

  // set bpm
  Tone.Transport.bpm.value = 105

  // create instruments and effects
  synth = new Tone.MonoSynth(synthOptions)
  reverb = new Tone.Convolver({ url: '../samples/space.wav', wet: 0.3 })
  feedbackDelay = new Tone.FeedbackDelay({ delayTime: '8n', wet: 0.2 })

  // routing
  synth.connect(feedbackDelay)
  feedbackDelay.connect(reverb)
  reverb.toMaster()

  // synth arp
  const synthArp = new Tone.Sequence(
    function (time, note) {
      synth.triggerAttackRelease(note, '16n', time)

      Tone.Draw.schedule(function () {
        if (note) {
          offsetValue += offsetInc
        }
      }, time)
    },
    [
      'A4',
      null,
      'Ab4',
      'E1',
      null,
      'A3',
      'Ab4',
      null,
      'B4',
      'Eb4',
      'Ab4',
      'B4',
      'Gb4',
      'E4',
      'A4',
      null,
    ],
    '16n'
  )

  // start both transport and loop
  synthArp.start(0)
  Tone.Transport.start('+0.1')
}

function draw() {
  background(0)
  frameRate(30)
  stroke(255)
  strokeWeight(2)

  // mapping to mouse - both the tree height and some synth and effect parameters
  treeHeight = map(mouseY, 0, height, 300, 0)
  reverb.wet.value = map(mouseY, 0, height, 0.5, 0)
  synth.filterEnvelope.baseFrequency = map(mouseX, 0, width, 0, 300)

  // Let's pick an angle 0 to 90 degrees based on the mouse position
  let a = (mouseX / width) * 90
  // Convert it to radians
  theta = radians(a)
  // Start the tree from the bottom of the screen
  translate(width / 2, height)
  // Draw a line 120 pixels
  stroke(calcColor(treeHeight))
  line(0, 0, 0, -treeHeight)
  // Move to the end of that line
  translate(0, -treeHeight)
  // Start the recursive branching!

  branch(treeHeight)
}

function branch(h) {
  // Each branch will be 2/3rds the size of the previous one
  h *= 0.66

  // All recursive functions must have an exit condition!!!!
  // Here, ours is when the length of the branch is 2 pixels or less
  if (h > 3) {
    push() // Save the current state of transformation (i.e. where are we now)
    rotate(theta) // Rotate by theta
    stroke(calcColor(h))
    line(0, 0, 0, -h) // Draw the branch

    translate(0, -h) // Move to the end of the branch
    branch(h) // Ok, now call myself to draw two new branches!!
    pop() // Whenever we get back here, we "pop" in order to restore the previous matrix state

    // Repeat the same thing, only branch off to the "left" this time!
    push()
    rotate(-theta)
    stroke(calcColor(h))
    line(0, 0, 0, -h)
    translate(0, -h)
    branch(h)
    pop()
  }
}

// function to create a movable color band spectrum. Uses global variables.
function calcColor(h) {
  // maps the given height on a scale of 0 (shortest) to 1 (longest)
  const lengthIndex = map(h, treeHeight, 3, 1, 0)

  colorPos = Math.abs(Math.sin(lengthIndex + offsetValue))

  // const colorPos = (lengthIndex + offsetValue) % 1;

  return colorScale(colorPos).hex()
}
