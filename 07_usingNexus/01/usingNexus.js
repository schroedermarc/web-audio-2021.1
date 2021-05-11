// link HTML elements to nexus objects
const dial = new Nexus.Dial('#dial', {
  size: [75, 75],
  interaction: 'radial', // "radial", "vertical", or "horizontal"
  mode: 'relative', // "absolute" or "relative"
  min: -60,
  max: 0,
  step: 0,
  value: 0,
})

var piano = new Nexus.Piano('#piano', {
  size: [500, 125],
  mode: 'button', // 'button', 'toggle', or 'impulse'
  lowNote: 0,
  highNote: 36,
})

// tone js
const synth = new Tone.MonoSynth() // very basic synth
synth.connect(Tone.Master) // straight into the master speaker

// events
dial.on('change', function (value) {
  synth.volume.value = value
})

piano.on('change', function (value) {
  if (value.state === true) {
    // note is being pressed
    const note = value.note % 12 // this gets the remainder of the key value when devided by 12 (how far up the octave)
    const octave = Math.floor(value.note / 12) + 3 // this calculates the octave you're in

    const noteLookup = [
      'c',
      'c#',
      'd',
      'd#',
      'e',
      'f',
      'f#',
      'g',
      'g#',
      'a',
      'a#',
      'b',
    ]
    const noteToPlay = `${noteLookup[note]}${octave}` // look up the value in the table to get the note, then concatenate with the octive to make a value tone knows
    synth.triggerAttack(noteToPlay)
  } else {
    // note is being released
    synth.triggerRelease()
  }
})
