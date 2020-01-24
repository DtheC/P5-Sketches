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
  this.bg = color(this.colourScheme.pop());
  background(this.bg);
  this.bg2 = color(this.colourScheme.pop());

  stroke(this.colourScheme[floor(random(1, this.colourScheme.length))]);

  this.bounceLines = new BounceLines(random(this.colourScheme));
  this.bounceLines2 = new BounceLines(random(this.colourScheme));

  // this.minPos = createVector(CANVAS_WIDTH / 4, CANVAS_HEIGHT * .4);
  // this.maxPos = createVector(CANVAS_WIDTH * .75, CANVAS_HEIGHT * .8);
  this.minPos = createVector(250, 250);
  this.maxPos = createVector(350, 350);

  this.currentPos = 0;
  this.currentPosOpp = 2;
}

function draw() {
  // this.bg.setAlpha(200);
  background(this.bg);
  fill(this.bg2);
  noStroke();
  beginShape();
  vertex(0, 0);
  vertex(CANVAS_WIDTH, 0);
  vertex(this.maxPos.x, this.minPos.y);
  vertex(this.minPos.x, this.minPos.y);
  endShape();
  beginShape();
  vertex(0, CANVAS_HEIGHT);
  vertex(CANVAS_WIDTH, CANVAS_HEIGHT);
  vertex(this.maxPos.x, this.maxPos.y);
  vertex(this.minPos.x, this.maxPos.y);
  endShape();
  if (frameCount % 6 === 0) {
    this.bounceLines.addNew(nextPosition());
    this.bounceLines2.addNew(nextPositionOffset());
  }
  this.bounceLines.draw();
  this.bounceLines2.draw();
}

function nextPosition() {
  this.currentPos--;
  if (this.currentPos < 0) this.currentPos = 3;
  const v = createVector();
  switch (this.currentPos) {
    case 0:
      v.x = random(this.minPos.x, this.maxPos.x);
      v.y = this.minPos.y;
      break;
    case 1:
      v.x = this.maxPos.x;
      v.y = random(this.minPos.y, this.maxPos.y);
      break;
    case 2:
      v.x = random(this.minPos.x, this.maxPos.x);
      v.y = this.maxPos.y;
      break;
    case 3:
      v.x = this.minPos.x;
      v.y = random(this.minPos.y, this.maxPos.y);
      break;
  }
  return v;
}
function nextPositionOffset() {
  this.currentPosOpp++;
  if (this.currentPosOpp > 3) this.currentPosOpp = 0;
  const v = createVector();
  switch (this.currentPosOpp) {
    case 0:
      v.x = random(this.minPos.x, this.maxPos.x);
      v.y = this.minPos.y;
      break;
    case 1:
      v.x = this.maxPos.x;
      v.y = random(this.minPos.y, this.maxPos.y);
      break;
    case 2:
      v.x = random(this.minPos.x, this.maxPos.x);
      v.y = this.maxPos.y;
      break;
    case 3:
      v.x = this.minPos.x;
      v.y = random(this.minPos.y, this.maxPos.y);
      break;
  }
  return v;
}

class BounceLines {
  constructor(colour) {
    this.colour = colour;
    this.lines = [];
  }

  addNew(position) {
    this.lines.push(new BounceLine(position));
  }

  draw() {
    stroke(this.colour);
    this.lines.forEach(x => x.update());
    if (this.lines.length < 4) return;
    noFill();
    // beginShape();
    // vertex(this.lines[0].position.x, this.lines[0].position.y);
    for (let i = 1; i < this.lines.length-2; i+=1) {
      this.lines[i].draw(this.lines[i-1].position, this.lines[i+1].position, this.lines[i+2].position);
      if (this.lines[i-1].outsideDrawZone && this.lines[i].outsideDrawZone && this.lines[i+1].outsideDrawZone) this.lines[i-1].toDelete = true;
    }
    // endShape();
    this.lines = this.lines.filter(x => !x.toDelete);
  }
}

class BounceLine {
  constructor(position) {
    this.position = position;
    this.outsideDrawZone = false;
    this.toDelete = false;
    this.speed = 1;
    this.weight = 1 * this.speed;
  }

  update() {
    this.speed *= 1.05;
    this.weight = this.speed / 2;
    const angle = atan2(CANVAS_HEIGHT/2 - this.position.y, CANVAS_WIDTH/2 - this.position.x) + Math.PI; // position.angleBetween(createVector(CANVAS_WIDTH/2, CANVAS_HEIGHT/2)); // + Math.PI;
    // console.log(angle);
    const direction = p5.Vector.fromAngle(angle);
    direction.mult(this.speed);
    // stroke(random(this.colourScheme));
    // line(xPos, yPos, xPos + direction.x, yPos + direction.y);

    // const angle = this.position.angleBetween(createVector(CANVAS_WIDTH/2, CANVAS_HEIGHT/2)) + Math.PI;
    // const direction = p5.Vector.fromAngle(angle);
    // direction.mult(this.speed);
    this.position.add(direction);
    if (this.position.x < -10000 || this.position.x > CANVAS_WIDTH + 10000) {
      if (this.position.y < -10000|| this.position.y > CANVAS_HEIGHT + 10000) this.outsideDrawZone = true;
    }
  }

  draw(previousPosition, nextPosition, nextNextPosition) {
    if (!nextPosition) return;
    strokeWeight(this.weight);
    curve(previousPosition.x, previousPosition.y, this.position.x, this.position.y, nextPosition.x, nextPosition.y, nextNextPosition.x, nextNextPosition.y);
    // bezierVertex(previousPosition.x, previousPosition.y, this.position.x, this.position.y, nextPosition.x, nextPosition.y);
    // line(this.position.x, this.position.y, nextPosition.x, nextPosition.y);
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
