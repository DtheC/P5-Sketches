const CELL_WIDTH = 10;
const CELL_HEIGHT = 10;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const CELL_COUNT = 20;

// const ITERATIONS = 4;

const NOISE_LENGTH = 100;

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function setup() {
  noStroke();
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.colourScheme = ColorSchemeController.getSchemeWithXColours(5);
  if (Math.random() > 0.5) this.colourScheme = this.colourScheme.reverse();
  background(color(random(this.colourScheme)));

  this.cells = [];
  for (let i = 0; i < CANVAS_WIDTH; i++) {
    this.cells.push(new NoiseMover(createVector(i, CANVAS_HEIGHT/2), random(this.colourScheme), 1));
    this.cells.push(new NoiseMover(createVector(i, CANVAS_HEIGHT/2), random(this.colourScheme), -1));
  }
}

function draw() {
  // let a = 0.00;
  // let inc = TWO_PI / CANVAS_HEIGHT;
  // // for (let x = 0; x < CANVAS_WIDTH; x++) {
  // //   for (let y = 0; y < CANVAS_HEIGHT; y++) {
  // //     const n = floor(scale(noise(x / NOISE_LENGTH, y / NOISE_LENGTH), 0, 1, 0, this.colourScheme.length));
  // //     // console.log(n);
  // //     const col = color(this.colourScheme[n]);
  // //     fill(col);
  // //     const yOffset = scale(noise(x / NOISE_LENGTH, y / NOISE_LENGTH, scale(cos(a), -1, 1, 0, CANVAS_HEIGHT) / NOISE_LENGTH), 0, 1, 1, 100);
  // //     rect(x, y, 1, yOffset + 1);
  // //     a += inc;
  // //     y += yOffset - 1;
  // //   }

  // for (let y = 0; y < CANVAS_HEIGHT; y++) {
  //   for (let x = 0; x < CANVAS_WIDTH; x++) {
  //     // const cc = scale(cos(a), -1, 1, 0, 50);
  //     // fill(scale(noise(x / NOISE_LENGTH, y * cc / NOISE_LENGTH), 0, 1, 0 , 255));
  //     const noi = noise(x / NOISE_LENGTH, (y + cos(a)) / NOISE_LENGTH);
  //     fill(scale(noi, 0, 1, 0, 255));
  //     // fill(scale(cos(a), -1, 1, 0, 255));
  //     rect(x, y, 1, 1);
  //   }
  //   a+= inc;
  // }
  this.cells.forEach(e => e.draw());
}

class NoiseMover {
  constructor(location, colour, yDirection) {
    this.location = location;
    this.colour = colour;
    this.yDir = yDirection;
  }

  draw() {
    const dist = this.location.dist(createVector(0,0)) / NOISE_LENGTH;
    fill(this.colour);
    rect(this.location.x, this.location.y, this.location.dist(createVector(0,0)), this.location.dist(createVector(0,0)));
    this.location.x += scale(noise(this.location.x * (dist * dist)), 0, 1, -1, 1);
    // this.location.y += scale(noise(this.location.y * (dist * dist)), 0, 1, -1, 1);
    this.location.y += this.yDir;
    if (this.location.x > CANVAS_WIDTH) this.location.x = 0;
    if (this.location.x < 0) this.location.x = CANVAS_WIDTH;
  }
}
