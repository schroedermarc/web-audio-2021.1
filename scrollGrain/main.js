// create tone elements
const convolver = new Tone.Reverb({
  wet: 0.3,
})
const grainPlayer = new Tone.GrainPlayer({
  url: '../samples/ML_Loop_Chords_Piano_Extra35_130_F_Minor.wav',
  onload: () => {
    main()
  },
  loop: true,
  // loopStart: 0.4,
  // loopEnd: 0.5,
  loopStart: 0.2,
  loopEnd: 0.3,
  grainSize: 0.1,
  playbackRate: 4,
  overlap: 0.1,
  reverse: false,
})

function main() {
  grainPlayer.chain(convolver, Tone.Master)
}

// play event
document.getElementById('play-button').addEventListener('mousedown', () => {
  Tone.start()
  grainPlayer.start()
})

// scroll event
document.addEventListener('scroll', (e) => {
  const factorY = window.scrollY / 2200
  const factorX = window.scrollX / 2000

  const newPos = 7 * factorY

  grainPlayer.loopStart = newPos
  grainPlayer.loopEnd = newPos + 0.1
  grainPlayer.playbackRate = 0.1 + factorX * 6
})
