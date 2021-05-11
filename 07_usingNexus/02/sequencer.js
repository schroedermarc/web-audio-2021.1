// global variables
let isPlaying = false

// instrument setup
const kickSynthOptions = {
  volume: 0,
  pitchDecay: 0.45,
  octaves: 7,
  oscillator: {
    type: 'sine',
  },
  envelope: {
    attack: 0.002,
    decay: 0.8,
    sustain: 0.2,
    release: 1.4,
    attackCurve: 'exponential',
  },
}

const drumSynth = new Tone.MembraneSynth(kickSynthOptions)
drumSynth.connect(Tone.Master)

// nexus UI
const sequencer = new Nexus.Sequencer('#sequencer', {
  size: [600, 200],
  mode: 'toggle',
  rows: 5,
  columns: 16,
  paddingRow: 1,
  paddingColumn: 2,
})

const startButton = new Nexus.TextButton()

// Tone Events
const loop = new Tone.Loop((time) => {
  // triggered every eighth note.
  sequencer.next()
}, '8n').start(0)

// Javascript/UI Events
sequencer.on('change', function (v) {
  console.log(v)
})

sequencer.on('step', function (v) {
  console.log(v)
})

startButton.on('change', function (v) {
  if (v) {
    console.log(v)

    isPlaying = !isPlaying

    if (isPlaying) {
      Tone.Transport.start()
    } else {
      Tone.Transport.stop()
    }
  }
})
