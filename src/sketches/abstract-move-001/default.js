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
  // ellipseMode(RADIUS);
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.colourScheme = ColorSchemeController.getSchemeWithXColours(5);
  if (Math.random() > 0.5) this.colourScheme = this.colourScheme.reverse();
  this.bg = color(this.colourScheme[0]);
  background(this.bg);

  stroke(this.colourScheme[floor(random(1, this.colourScheme.length))]);

  this.bounceLines = new BounceLines();

  this.minPos = createVector(CANVAS_WIDTH / 4, CANVAS_HEIGHT * .4);
  this.maxPos = createVector(CANVAS_WIDTH * .75, CANVAS_HEIGHT * .8);
  // this.minPos = createVector(CANVAS_WIDTH-50, 50);
  // this.maxPos = createVector(CANVAS_WIDTH, 0);

  // this.time = 0;
  // this.cells = [];
  // this.r = new Rotator(
  //   true,
  //   createVector(1, 1),
  //   0,
  //   createVector(random(250, 400), random(200, 400)),
  //   chroma.scale([this.colourScheme[1], this.colourScheme[1]]).colors(10),
  //   new Rotator(
  //     true,
  //     createVector(2, 2),
  //     10,
  //     createVector(random(200, 300), random(200, 300)),
  //     chroma.scale([this.colourScheme[2], this.colourScheme[2]]).colors(10),
  //     new Rotator(
  //       true,
  //       createVector(3, 4),
  //       20,
  //       createVector(random(150, 250), random(150,250)),
  //       chroma.scale([this.colourScheme[3], this.colourScheme[3]]).colors(10),
  //       new Rotator(
  //         true,
  //         createVector(5, 5),
  //         30,
  //         createVector(random(50, 100), random(50, 100)),
  //         chroma.scale([this.colourScheme[4], this.colourScheme[4]]).colors(10),
  //         null
  //       )
  //       )
  //       )
  //       );
}

function draw() {
  // this.bg.setAlpha(200);
  background(this.bg);
  if (frameCount % 5 === 0) {
    const x = random(this.minPos.x, this.maxPos.x);
    const y = random(this.minPos.y, this.maxPos.y);
    this.bounceLines.addNew(createVector(x, y));
  }
  this.bounceLines.draw();
  // this.ball.draw();
  // if (this.doDraw) {
  //   background(this.bg);
  //   stroke(color(255, 255, 255));
  //   strokeWeight(20);
  //   strokeCap(SQUARE);
  //   push();
  //   translate(noise(frameCount * NOISE_LENGTH) * (CANVAS_WIDTH - 200) + 100, CANVAS_HEIGHT / 2);
  //   this.r.draw();
  //   pop();
  // }
  if (frameCount > 300) canvasRecorder.done();
}

// function mouseClicked() {
//   this.doDraw = !this.doDraw;
// }

class BounceLines {
  constructor() {
    this.lines = [];
  }

  addNew(position) {
    this.lines.push(new BounceLine(position));
  }

  draw() {
    this.lines.forEach(x => x.update());
    for (let i = 0; i < this.lines.length-1; i++) {
      this.lines[i].draw(this.lines[i+1].position);
    }
  }
}

class BounceLine {
  constructor(position) {
    this.position = position;
    this.outsideDrawZone = false;
    this.speed = random(1, 10);
    this.weight = 1 * this.speed;
  }

  update() {
    const angle = this.position.angleBetween(createVector(CANVAS_WIDTH/2, CANVAS_HEIGHT/2)) + Math.PI;
    const direction = p5.Vector.fromAngle(angle);
    direction.mult(this.speed);
    this.position.add(direction);
  }

  draw(nextPosition) {
    if (!nextPosition) return;
    line(this.position.x, this.position.y, nextPosition.x, nextPosition.y);
    strokeWeight(this.weight);
  }
}

class Bouncer {
  constructor(minLimit, maxLimit, colour) {
    this.minLimit = minLimit;
    this.maxLimit = maxLimit;
    this.colour = colour;
    this.speed = random(9, 10);
    this.size = createVector(2, 2);
    this.position = p5.Vector.sub(this.maxLimit, this.minLimit);
    fill(0);
    rect(this.minLimit.x, this.minLimit.y, this.position.x, this.position.y);
    console.log(this.position);
    this.position.x += this.position.x / 4;
    this.position.y += this.position.y / 4;
    // this.position.add(random(100));
    this.direction = createVector(random(-1, 1), random(-1, 1));
  }

  draw() {
    this.position.x += (this.speed * this.direction.x);
    this.position.y += (this.speed * this.direction.y);

    if (this.position.x > this.maxLimit.x - this.size.x || this.position.x < this.minLimit.x + this.size.x) {
      this.direction.x *= random(-1.1, -0.9);
    }
    if (this.position.y > this.maxLimit.y - this.size.y || this.position.y < this.minLimit.y + this.size.y) {
      this.direction.y *= random(-1.1, -0.9);
    }

    fill(this.colour);
    ellipse(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}
