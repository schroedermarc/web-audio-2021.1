//////////////////////
// controls
/////////////////////
let drawWave = true
let effectOn = true
let isFFT = false
let octave = 3
let selectedChordButton = 0
Tone.Transport.bpm.value = 128
let selectedPattern = 'up'

///////////////////
// globals
///////////////////
let synth, delay, autoFilter, convolver
let wave
let select
let keyInfo
let selectedChord
let chordNotes
let pattern

let Scale = Tonal.Scale
let Chord = Tonal.Chord
let Key = Tonal.Key

const synthSettings = {
  volume: -20,
  frequency: 'C7',
  detune: 0,
  oscillator: {
    type: 'sawtooth', //sine, sawtooth, triangle
  },
  filter: {
    Q: 1,
    type: 'lowpass',
    rolloff: -48,
  },
  envelope: {
    attack: 0.04,
    decay: 0.0,
    sustain: 0.1,
    release: 4,
  },
  filterEnvelope: {
    attack: 0.02,
    decay: 0,
    sustain: 1,
    release: 0.3,
    baseFrequency: 600,
    octaves: 7,
    exponent: 5,
  },
}

const delaySettings = {
  delayTime: '16n',
  maxDelay: 1,
  wet: 0.5,
  feedback: 0.73,
}

const convolverSettings = { url: '../../samples/space.wav', wet: 0.3 }

function setup() {
  // get initial key info
  getKeyInfo()

  //UI population
  keyInfo.chords.forEach((chord, i) => {
    const newButton = document.createElement('div')
    newButton.id = `chord-button-${i}`
    newButton.classList.add('chord-button')
    if (selectedChordButton === i) {
      newButton.classList.add('selected')
      selectedChord = chord
    }
    newButton.innerHTML = `${chord} (${keyInfo.grades[i]})`
    newButton.addEventListener('click', function () {
      selectedChordButton = i
      changeChordToSelected()
    })
    document.getElementById('chord-button-container').appendChild(newButton)
  })
  changeChordToSelected()

  // create tone elements
  synth = new Tone.MonoSynth(synthSettings)
  delay = new Tone.PingPongDelay(delaySettings)
  convolver = new Tone.Convolver(convolverSettings)
  autoFilter = new Tone.Chorus({})
  fft = new Tone.FFT(256) //.toMaster();
  wave = new Tone.Waveform(256) //.toMaster();

  // // routing
  if (effectOn) {
    // effect flag is on(true)
    synth.chain(delay, convolver, fft, wave, Tone.Master)
  } else {
    // effect flag is off (false)
    synth.chain(fft, wave, Tone.Master)
    //  (FYI) SAME AS:
    // synth.connect(fft);
    // synth.connect(wave);
    // wave.toMaster();
  }

  // pattern setup
  pattern = new Tone.Pattern(
    (time, note) => {
      synth.triggerAttackRelease(note, '8n', time, 1)
    },
    chordNotes,
    selectedPattern
  )
}

function getKeyInfo() {
  const root = document.getElementById('root-selector').value
  const key = document.getElementById('key-selector').value

  if (key === 'Major') {
    keyInfo = Key.majorKey(root)
  } else if (key === 'Minor') {
    keyInfo = Key.minorKey(root).natural
  }
}

function changeChordToSelected() {
  const root = document.getElementById('root-selector').value

  for (let i = 0; i <= 6; i++) {
    const button = document.getElementById(`chord-button-${i}`)
    button.classList.remove('selected')
    // button.innerHTML = keyInfo.chords[i]
    button.innerHTML = `${keyInfo.chords[i]} (${keyInfo.grades[i]})`
    if (i === selectedChordButton) {
      button.classList.add('selected')
    }
  }

  selectedChord = keyInfo.chords[selectedChordButton]
  selectedChordSuffix = Chord.get(selectedChord).aliases[0]
  chordNotes = Chord.getChord(selectedChordSuffix, `${root}${octave}`).notes

  if (pattern) {
    pattern.values = chordNotes
  }
  console.log(chordNotes)
}

document.getElementById('plus-button').addEventListener('click', () => {
  if (octave < 7) {
    octave++
    document.getElementById('octave-num').innerHTML = octave
  }
  getKeyInfo()
  changeChordToSelected()
})

document.getElementById('minus-button').addEventListener('click', () => {
  if (octave > 1) {
    octave--
    document.getElementById('octave-num').innerHTML = octave
  }
  getKeyInfo()
  changeChordToSelected()
})

document.getElementById('start-button').addEventListener('click', () => {
  Tone.Transport.start('+0.1')
  pattern.start(0)
})

document.getElementById('stop-button').addEventListener('click', () => {
  pattern.stop(0)
})

document.getElementById('root-selector').addEventListener('input', () => {
  getKeyInfo()
  changeChordToSelected()
})

document.getElementById('key-selector').addEventListener('input', () => {
  getKeyInfo()
  changeChordToSelected()
})

document.getElementById('pattern-selector').addEventListener('input', (e) => {
  pattern.pattern = e.target.value
})

document.getElementById('bpm-selector').addEventListener('input', (e) => {
  Tone.Transport.bpm.value = e.target.value
})
