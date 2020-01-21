const CELL_WIDTH = 10;
const CELL_HEIGHT = 50;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const NOISE_LENGTH = .009;
const NOISE_OFFSET = 1 * CELL_HEIGHT;

const Y_AXIS = 1;
const X_AXIS = 2;

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

function setup() {
  // noStroke();
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.colourScheme = ColorSchemeController.getSchemeWithXColours(5);
  if (Math.random() > 0.5) this.colourScheme = this.colourScheme.reverse();
  this.bg = color(this.colourScheme[0]);
  background(this.bg);
  this.time = 0;
  this.cells = [];
  this.r = new Rotator(
    true,
    createVector(1, 1),
    0,
    createVector(random(250, 400), random(200, 400)),
    chroma.scale([this.colourScheme[1], this.colourScheme[1]]).colors(10),
    new Rotator(
      true,
      createVector(2, 2),
      10,
      createVector(random(200, 300), random(200, 300)),
      chroma.scale([this.colourScheme[2], this.colourScheme[2]]).colors(10),
      new Rotator(
        true,
        createVector(3, 4),
        20,
        createVector(random(150, 250), random(150,250)),
        chroma.scale([this.colourScheme[3], this.colourScheme[3]]).colors(10),
        new Rotator(
          true,
          createVector(5, 5),
          30,
          createVector(random(50, 100), random(50, 100)),
          chroma.scale([this.colourScheme[4], this.colourScheme[4]]).colors(10),
          null
        )
        )
        )
        );
      }
      
function draw() {
  if (this.doDraw) {
    background(this.bg);
    stroke(color(255, 255, 255));
    strokeWeight(20);
    strokeCap(SQUARE);
    push();
    translate(noise(frameCount * NOISE_LENGTH) * (CANVAS_WIDTH - 200) + 100, CANVAS_HEIGHT / 2);
    this.r.draw();
    pop();
  }
}

function mouseClicked() {
  this.doDraw = !this.doDraw;
}

class Rotator {
  constructor(doDraw, position, armLength, size, colours, child) {
    this.doDraw = doDraw;
    this.position = position;
    this.armLength = armLength;
    this.child = child;
    this.size = size;
    this.colours = colours.map(x => color(x));
    // this.colours.forEach(x => x.setAlpha(200));
    console.log(this.colours);
    this.currentColourIndex = 0;
    this.rotation = 0;
  }

  draw() {
    push();
    const w = noise(this.position.x, this.position.y, frameCount * NOISE_LENGTH);
    fill(this.colours[floor(scale(w, 0, 1, 0, this.colours.length))]);
    // if (this.doDraw) ellipse(0, 0, this.size.x, this.size.y);
    if (this.doDraw) arc(0, 0, this.size.x, this.size.y, -Math.PI, w * (Math.PI * 2) - Math.PI);
    rotate(w * (Math.PI * 2) - (Math.PI / 2));
    translate(0, this.armLength);
    if (this.child) this.child.draw();
    pop();
  }
}
