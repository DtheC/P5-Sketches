const CELL_WIDTH = 100;
const CELL_HEIGHT = 10;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

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
  background(255);
  this.time = 0;
  this.noiseOffset = 1 * CELL_HEIGHT;
  this.cells = [];
  let = count = 0;
  for(let y = -CELL_HEIGHT; y < CANVAS_HEIGHT; y+= CELL_HEIGHT) {
    for(let x = -CELL_WIDTH; x < CANVAS_WIDTH; x+= CELL_WIDTH) {
      let xOffset = 0;
      if (this.count % 2 === 0) {
        xOffset = CELL_WIDTH / 2;
      }
      this.cells.push(new Celle(random(this.colourScheme), createVector(x + xOffset, y), createVector(1, CELL_HEIGHT), count));
      // const n =floor(scale(noise(x * sin(this.noiseOffset) + cos(this.time)), 0, 1, 0, this.colourScheme.length));
      // fill(this.colourScheme[n]);
      // rect(x, 0, 1, CANVAS_HEIGHT);
      noStroke();
    }
    count += 1;
  }
}

function draw() {
  background(255);
  this.cells.forEach(x => x.draw());
  // this.time += 0.01;
  // this.noiseOffset += 0.01;
  // // NOISE_LENGTH += 0.01;
  if (frameCount > 500) canvasRecorder.done();
}

class Celle {
  constructor(colour, position, size, noiseOffset) {
    this.colour = colour;
    this.position = position;
    this.size = size;
    this.noiseOffset = noiseOffset;
  }

  draw() {
    this.noiseOffset += 0.01;
    fill(this.colour);
    let width = noise(cos(this.position.x) + sin(this.noiseOffset)) * CELL_WIDTH;
    push();
    translate(this.position.x - (width/2), this.position.y);
    // rect(CELL_WIDTH / 2, 0, width, this.size.y);
    rect(CELL_WIDTH / 2, 0, width, this.size.y);
    pop();
  }
}
