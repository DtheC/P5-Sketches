const CELL_WIDTH = 10;
const CELL_HEIGHT = 50;
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
  this.bg = this.colourScheme.pop();
  console.log(this.colourScheme.length);
  background(this.bg);
  this.time = 0;
  this.cells = [];
  
  let offset = 0;
  for (let y = CELL_HEIGHT; y < CANVAS_HEIGHT - CELL_HEIGHT; y+=CELL_HEIGHT) {
    this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset + .50));
    this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset + .40));
    this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset + .30));
    this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset + .20));
    this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset + .1));
    this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset));
    offset += 0.1;
  }
  // this.noiseOffset = 1 * CELL_HEIGHT;
  // this.cells = [];
  // let = count = 0;
  // for(let y = -CELL_HEIGHT; y < CANVAS_HEIGHT; y+= CELL_HEIGHT) {
  //   for(let x = -CELL_WIDTH; x < CANVAS_WIDTH; x+= CELL_WIDTH) {
  //     let xOffset = 0;
  //     if (this.count % 2 === 0) {
  //       xOffset = CELL_WIDTH / 2;
  //     }
  //     this.cells.push(new Celle(random(this.colourScheme), createVector(x + xOffset, y), createVector(1, CELL_HEIGHT), count));
  //     // const n =floor(scale(noise(x * sin(this.noiseOffset) + cos(this.time)), 0, 1, 0, this.colourScheme.length));
  //     // fill(this.colourScheme[n]);
  //     // rect(x, 0, 1, CANVAS_HEIGHT);
  //     noStroke();
  //   }
  //   count += 1;
  // }
}

function draw() {
  this.bg.setAlpha(30);
  background(this.bg);
  this.cells.forEach(x => x.draw());
  // this.time += 0.1;
  // fill(255);
  // const width = scale(sin(noise(this.time)), -1, 1, 0, 1) * CANVAS_WIDTH;
  // push();
  // translate(CANVAS_WIDTH / 2 - width / 2, 0);
  // rect(0, CANVAS_HEIGHT / 4, width, CANVAS_HEIGHT / 2);
  // pop();
  if (frameCount > 500) canvasRecorder.done();
}

class RectToPoint {
  constructor(colour, position, size, noiseOffset) {
    this.colour = colour;
    this.position = position;
    this.size = size;
    this.noiseOffset = noiseOffset;
    this.travelToPosition = createVector(0, this.position.y);
    this.time = 0;
    this.speed = random(0.1, 1);
  }

  draw() {
    this.time += 0.01;
    // this.travelToPosition.x = scale(sin(noise(this.time + this.noiseOffset, this.position.y) - 0.5), -1, 1, 0, 1) * CANVAS_WIDTH;
    this.travelToPosition.x = noise(this.time + this.noiseOffset, this.position.y) * CANVAS_WIDTH;
    this.position = p5.Vector.lerp(this.position, this.travelToPosition, this.speed);

    fill(this.colour);
    push();
    translate(-CELL_WIDTH / 2, 0);
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
    pop();


    // this.noiseOffset += 0.01;
    // let width = noise(cos(this.position.x) + sin(this.noiseOffset)) * CELL_WIDTH;
    // push();
    // translate(this.position.x - (width/2), this.position.y);
    // // rect(CELL_WIDTH / 2, 0, width, this.size.y);
    // rect(CELL_WIDTH / 2, 0, width, this.size.y);
    // pop();
  }
}
