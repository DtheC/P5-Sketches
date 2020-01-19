const CELL_WIDTH = 10;
const CELL_HEIGHT = 50;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const NOISE_LENGTH = .01;
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
  noStroke();
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.colourScheme = ColorSchemeController.getSchemeWithXColours(5);
  if (Math.random() > 0.5) this.colourScheme = this.colourScheme.reverse();
  this.colourScheme = this.colourScheme.map(x => color(x));
  this.bg = this.colourScheme.pop();
  background(this.bg);
  this.time = 0;
  this.cells = [];
  
  // let offset = 0;
  // for (let y = CELL_HEIGHT; y < CANVAS_HEIGHT - CELL_HEIGHT; y+=CELL_HEIGHT) {
  //   this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset + .50));
  //   this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset + .40));
  //   this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset + .30));
  //   this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset + .20));
  //   this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset + .1));
  //   this.cells.push(new RectToPoint(random(this.colourScheme), createVector(random(0, CANVAS_WIDTH), y), createVector(CELL_WIDTH, CELL_HEIGHT), offset));
  //   offset += 0.1;
  // }
  // this.t = new SpinnerGrenade(random(this.colourScheme), random(this.colourScheme), createVector(CANVAS_WIDTH/2, CANVAS_HEIGHT), createVector(30, 50), 0);
}

function draw() {
  setGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, this.bg, color(255), 1);
  noStroke();
  this.cells.forEach(x => x.draw());
  this.cells = this.cells.filter(x => !x.toRemove);

  // Make New
  if (random() > 0.8) {
    this.cells.push(new SpinnerGrenade(random(this.colourScheme), random(this.colourScheme), createVector(random(-100, CANVAS_WIDTH+100), CANVAS_HEIGHT+100), createVector(30, 50), random(0, 100)));
    this.cells.sort((a, b) => a.scale-b.scale);
  }
  // this.bg.setAlpha(30);
  // background(this.bg);
  // this.cells.forEach(x => x.draw());
  if (frameCount > 500) canvasRecorder.done();
}

class SpinnerGrenade {
  constructor(colour, spinnerColour, position, size, noiseOffset) {
    this.colour = colour;
    this.spinnerColour = spinnerColour;
    this.position = position;
    this.size = size;
    this.noiseOffset = noiseOffset;
    this.travelToPosition = createVector(0, this.position.y);
    this.time = 0;
    this.speed = createVector(random(0.1, 1), random(0.1, 1));
    this.scale = random(0.1, 2);
    this.size.x *= this.scale;
    this.size.y *= this.scale;
    this.whirl = new SpinnerWhirl(this.spinnerColour, createVector(0, -this.size.y/2-(this.size.y/5)), this.size.x, createVector(this.size.y/5, this.size.y/5));
  }

  draw() {
    this.time += 0.01 * this.scale;
    this.travelToPosition.x = noise(this.time / this.scale + this.noiseOffset, this.position.y) * (CANVAS_WIDTH + 500) - 250;
    // this.travelToPosition.y -= this.speed.y;
    // this.position.y -= 10;
    const rot = scale(this.position.x - this.travelToPosition.x, -CANVAS_WIDTH/4, CANVAS_WIDTH/4, Math.PI, -Math.PI);
    push();
    translate(this.position.x, this.position.y - (this.time * CANVAS_HEIGHT));
    rotate(rot);
    // console.log(rot);
    fill(this.colour);
    // scale(0.2);
    ellipse(0, 0, this.size.x, this.size.y);
    this.whirl.draw();
    // fill(255,0,0);
    // ellipse(0, -this.size.y/2, 5, 5);
    // rect(this.position.x, this.position.y, this.size.x, this.size.y);
    pop();
    this.position = p5.Vector.lerp(this.position, this.travelToPosition, this.speed.x);
    // this.position.y -= 10;
    // this.position.y += this.speed.y;

    if (this.position.y - (this.time * CANVAS_HEIGHT) < -100) this.toRemove = true;
  }
}

class SpinnerWhirl {
  constructor(colour, yOffset, xWidth, size) {
    this.colour = colour;
    this.yOffset = yOffset;
    this.size = size;
    this.xWidth = xWidth;
    this.time = 0;
  }

  draw() {
    fill(this.colour);
    this.time += 0.1;
    // fill(255, 0, 0);
    push();
    translate(0, this.yOffset.y);
    // stroke(255,0, 0);
    // line(-25, 0, 25, 0);
    for(let i = 0; i < Math.PI*2; i+=(Math.PI*2)/10) {
      ellipse((sin(this.time + i) * this.xWidth), cos(this.time+i)*this.xWidth/5-(sin(this.time)), this.size.x, this.size.y);
    }
    pop();
  }
}
