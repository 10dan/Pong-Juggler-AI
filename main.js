let x, y;
let len = 50; //Dimensions of bat.
let wid = 10;
let moveSpeed = 20; //How fast the bat can move when fast.
let score = 0;
let nn;
const maxCycles = 600; //Num frames before next round is forced started.
let rounds = 25;
let cyclesLeft = maxCycles;
let stored = []; //As the rounds play out the score and nn are added here.
let sorted = []; //Then they are sorted by score and palced here.
let numBalls = 2;
let balls_array = [];

let numInputNodes = 1 + (4 * numBalls); //x pos, balls x y xv yv for each ball.
let numHiddenNodes = 60;
let numOutputNodes = 4; //slow/fast left/right

let training = true; //State of program.

function setup() {
  rectMode(RADIUS);
  createCanvas(400, 400, P2D);
  colorMode(HSB);

  x = width / 2;
  y = height - 20;
  for (let i = 0; i < numBalls; i++) {
    balls_array[i] = new Ball();
  }
  nn = new NeuralNetwork(numInputNodes, numHiddenNodes, numOutputNodes);
}




function draw() {
  if (training == true) {
    trainEpoch();
  } else {
    //Training finished, view simulation of latest nn.
    if (cyclesLeft > 0) {
      move(); //Moves bat & balls.
      for (let i = 0; i < numBalls; i++) {
        balls_array[i].move();
      }

      //Draw on:
      background(0, 20);
      fill(255);
      rect(x, y, len, wid, wid / 2);
      textSize(50);
      fill(255);
      text(score, 50, 50);
      for (let i = 0; i < numBalls; i++) {
        balls_array[i].show();
      }
      cyclesLeft--;

    } else {
      training = true;
    }
  }
}