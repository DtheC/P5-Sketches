const CELL_WIDTH = 100;
const CELL_HEIGHT = 10;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

// const ITERATIONS = 4;

const NOISE_LENGTH = .01;
const NOISE_OFFSET = 1 * CELL_HEIGHT;

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function setup() {
  noStroke();
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.colourScheme = ColorSchemeController.getSchemeWithXColours(5);
  if (Math.random() > 0.5) this.colourScheme = this.colourScheme.reverse();
  this.colourScheme = this.colourScheme.map(x => color(x));
  const alph = 50;
  this.colourScheme[1].setAlpha(alph);
  this.colourScheme[2].setAlpha(alph);
  this.colourScheme[3].setAlpha(alph);
  this.colourScheme[4].setAlpha(alph);
  background(this.colourScheme[0]);

  this.cells = [];
  this.time = 0;
  // this.rotations = [0, Math.PI /2 , Math.PI, Math.PI * 1.5];
  this.rotations = [0];
  this.c1 = random(this.colourScheme);
  this.c2 = random(this.colourScheme);
  while (this.c1 == this.c2) {
    this.c2 = random(this.colourScheme);
  }
  // let count = 0;
  // for (let x = 0; x < CANVAS_WIDTH; x += CELL_WIDTH) {
  //   for (let y = 0; y < CANVAS_HEIGHT; y += CELL_HEIGHT) {
  //     const noise1 = noise((x + this.time) * NOISE_LENGTH, (y + this.time) * NOISE_LENGTH);
  //     const noise2 = noise((x + this.time) * NOISE_LENGTH, (y + this.time + NOISE_OFFSET) * NOISE_LENGTH);
  //     const cell = new CellSplitToneFade(createVector(x, y), createVector(CELL_WIDTH, CELL_HEIGHT), random(this.colourScheme));
  //     const split1 = noise((x + this.time) * NOISE_LENGTH, (y + this.time) * NOISE_LENGTH);
  //     const split2 = noise((x + this.time) * NOISE_LENGTH, (y + this.time + NOISE_OFFSET) * NOISE_LENGTH);
  //     if (count % 2 === 0) {
  //       cell.initVariables(this.colourScheme, this.c2, split1, split2, 0);
  //     } else {
  //       cell.initVariables(this.colourScheme, this.c1, split1, split2, Math.PI);
  //     }
  //     this.cells.push(cell);
  //     cell.draw();
  //   }
  //   count++;
  // }
}

function draw() {
  // for (let x = 0; x < CANVAS_WIDTH; x += CELL_WIDTH) {
  //   for (let y = 0; y < CANVAS_HEIGHT; y += CELL_HEIGHT) {
  //     const split1 = noise((x + this.time) * NOISE_LENGTH, (y + this.time) * NOISE_LENGTH);
  //     const split2 = noise((x + this.time) * NOISE_LENGTH, (y + this.time + NOISE_OFFSET) * NOISE_LENGTH);

  //     let x1 = x / CELL_WIDTH;
  //     let y1 = y / CELL_HEIGHT;
  //     // console.log(y1 * (CANVAS_WIDTH / CELL_WIDTH) + x1);
  //     this.cells[y1 * (CANVAS_WIDTH / CELL_WIDTH) + x1].initVariables(this.c1, this.c2, split1, split2, this.cells[y1 * (CANVAS_WIDTH / CELL_WIDTH) + x1].rotation);
  //     this.cells[y1 * (CANVAS_WIDTH / CELL_WIDTH) + x1].draw();
  //   }
  // }
  let count = 0;
  for (let x = 0; x < CANVAS_WIDTH; x += CELL_WIDTH) {
    for (let y = 0; y < CANVAS_HEIGHT; y += CELL_HEIGHT) {
      const noise1 = noise((x + this.time) * NOISE_LENGTH, (y + this.time) * NOISE_LENGTH);
      const noise2 = noise((x + this.time) * NOISE_LENGTH, (y + this.time + NOISE_OFFSET) * NOISE_LENGTH);
      const cell = new CellSplitToneFade(createVector(x, y), createVector(CELL_WIDTH, CELL_HEIGHT), random(this.colourScheme));
      const split1 = noise((x + this.time) * NOISE_LENGTH, (y + this.time) * NOISE_LENGTH);
      const split2 = noise((x + this.time) * NOISE_LENGTH, (y + this.time + NOISE_OFFSET) * NOISE_LENGTH);
      if (count % 2 === 0) {
        cell.initVariables(this.colourScheme, split1, split2, 0);
      } else {
        cell.initVariables(this.colourScheme, 1 - split2, 1 - split1, Math.PI);
      }
      // this.cells.push(cell);
      cell.draw();
    }
    count++;
  }
  time+= 1;
  if (frameCount > 1000) canvasRecorder.done();
}

  // this.cells = [];
  // for (let i = 0; i < CANVAS_WIDTH; i++) {
  //   this.cells.push(new NoiseMover(createVector(i, CANVAS_HEIGHT/2), random(this.colourScheme), 1));
  //   this.cells.push(new NoiseMover(createVector(i, CANVAS_HEIGHT/2), random(this.colourScheme), -1));
  // }

  // loadPixels();
  // for (let x = 0; x < CANVAS_WIDTH; x++) {
  //   for (let y = 0; y < CANVAS_HEIGHT; y++) {
  //     const n = floor(scale(noise(x * NOISE_LENGTH, NOISE_LENGTH * 2 * y), 0, 1, 0, this.colourScheme.length));
  //     const col = color(this.colourScheme[n]);
  //     fill(col);
  //     rect(x, y, 1, 1);
  //   }
  // }
  // updatePixels();

// function draw() {
//   // let a = 0.00;
//   // let inc = TWO_PI / CANVAS_HEIGHT;
//   // // for (let x = 0; x < CANVAS_WIDTH; x++) {
//   // //   for (let y = 0; y < CANVAS_HEIGHT; y++) {
//   // //     const n = floor(scale(noise(x / NOISE_LENGTH, y / NOISE_LENGTH), 0, 1, 0, this.colourScheme.length));
//   // //     // console.log(n);
//   // //     const col = color(this.colourScheme[n]);
//   // //     fill(col);
//   // //     const yOffset = scale(noise(x / NOISE_LENGTH, y / NOISE_LENGTH, scale(cos(a), -1, 1, 0, CANVAS_HEIGHT) / NOISE_LENGTH), 0, 1, 1, 100);
//   // //     rect(x, y, 1, yOffset + 1);
//   // //     a += inc;
//   // //     y += yOffset - 1;
//   // //   }

//   // for (let y = 0; y < CANVAS_HEIGHT; y++) {
//   //   for (let x = 0; x < CANVAS_WIDTH; x++) {
//   //     // const cc = scale(cos(a), -1, 1, 0, 50);
//   //     // fill(scale(noise(x / NOISE_LENGTH, y * cc / NOISE_LENGTH), 0, 1, 0 , 255));
//   //     const noi = noise(x / NOISE_LENGTH, (y + cos(a)) / NOISE_LENGTH);
//   //     fill(scale(noi, 0, 1, 0, 255));
//   //     // fill(scale(cos(a), -1, 1, 0, 255));
//   //     rect(x, y, 1, 1);
//   //   }
//   //   a+= inc;
//   // }
//   // this.cells.forEach(e => e.draw());
// }

class NoiseMover {
  constructor(location, colour, yDirection) {
    this.location = location;
    this.colour = colour;
    this.yDir = yDirection;
  }

  draw() {
    const dist = abs(this.location.y - (CANVAS_HEIGHT / 2));
    fill(this.colour);
    rect(this.location.x, this.location.y, 1, 1);
    this.location.x += scale(noise(this.location.x / NOISE_LENGTH, dist / NOISE_LENGTH), 0, 1, -1, 1);
    // this.location.y += scale(noise(this.location.y * (dist * dist)), 0, 1, -1, 1);
    this.location.y += this.yDir;
    if (this.location.x > CANVAS_WIDTH) this.location.x = 0;
    if (this.location.x < 0) this.location.x = CANVAS_WIDTH;
  }
}
