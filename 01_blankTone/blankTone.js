// 1. make a bouncing ball - X
// 2. add synth
// 3. make synth play on wall hit

////////////////////
// global variables 
////////////////////
let pos, vel;
let radius = 30;
let synth;

function setup(){
  // called once at the beginning
  createCanvas(700, 700)

  // ball setup
  pos = createVector(width / 2, height / 2);
  vel = createVector(10, 0.7)

  // synth setup
  synth = new Tone.MonoSynth()
  synth.connect(Tone.Master)

}

function draw(){
  // called over and over as the script runs
  background(0, 0, 0, 10)

  // 1. update position and velocity

  if (pos.x < radius / 2 || pos.x > width - radius / 2){
    // ball outside bounds in the x direction
    vel.x = -1 * vel.x;
    synth.triggerAttackRelease('c2', '32n')
  }

  if (pos.y < radius / 2 || pos.y > height - radius / 2){
    // ball outside bounds in the y direction
    vel.y = -1 * vel.y
    synth.triggerAttackRelease('c2', '32n')
  }

  pos.add(vel) 

  // 2. render
  fill('#FFFFFF') // 'white'
  ellipse(pos.x, pos.y, radius)
}