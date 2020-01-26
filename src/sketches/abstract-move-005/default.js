const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const NOISE_LENGTH = .9;
const NOISE_OFFSET = 1 * CELL_HEIGHT;

const LINE_JUMP_SIZE = CANVAS_HEIGHT / 10;

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

// connections
// 0 - top
// 1 - right
// 2 - bottom
// 3 - left

// A - Straight
// B - Diagonal

const states = {
  '0': {
    'A': ['1', '2', '2', '3'],
    'B': ['1', '1', '2', '3', '3']
  },
  '1': {
    'A': ['0', '2', '3', '3'],
    'B': ['0', '0', '2', '2', '3']
  },
  '2': {
    'A': ['1', '0', '0', '3'],
    'B': ['1', '1', '0', '3', '3']
  },
  '3': {
    'A': ['0', '1', '1', '2'],
    'B': ['0', '0', '1', '2', '2']
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

  this.blobs = [];
  this.time = 0;

  for (let key in states) {
    for (let key2 in states[key]) {
      states[key][key2] = calculateWeights(states[key][key2]);
    }
  }

  // for (let index = 0; index < 50; index++) {
  //   this.blobs.push(new FlowBLob(createVector(0, random(0, CANVAS_HEIGHT)), random(this.colourScheme)));
  // }
  this.currentPos = createVector(CANVAS_WIDTH * .25, CANVAS_HEIGHT * .25);
  this.lastConnection = '3';
  this.lastConnectionStyle = 'A';
  this.tiles = [];
  this.colIndex = 0;
  // this.tiles.push(new WireCell(this.currentPos.copy(), createVector(CELL_WIDTH, CELL_HEIGHT), '3', '1'));
  this.tiles.push(new WireCell(this.currentPos.copy(), createVector(CELL_WIDTH, CELL_HEIGHT), '3', 'A', '1', 'A', this.colourScheme[this.colIndex]));
  this.currentPos.x += CELL_WIDTH;

  // stroke(random(this.colourScheme));
  for (let i = 0 ; i < 200; i++) nextTile();

  this.colIndex = 1;
  this.currentPos = createVector(CANVAS_WIDTH * .75, CANVAS_HEIGHT * .75);
  this.lastConnection = '3';
  this.lastConnectionStyle = 'A';
  for (let i = 0 ; i < 200; i++) nextTile();

  this.colIndex = 2;
  this.currentPos = createVector(CANVAS_WIDTH * .75, CANVAS_HEIGHT * .25);
  this.lastConnection = '3';
  this.lastConnectionStyle = 'A';
  for (let i = 0 ; i < 200; i++) nextTile();

  this.colIndex = 3;
  this.currentPos = createVector(CANVAS_WIDTH * .25, CANVAS_HEIGHT * .75);
  this.lastConnection = '3';
  this.lastConnectionStyle = 'A';
  for (let i = 0 ; i < 200; i++) nextTile();
}

function doDraw() {
  // background(255);
  // stroke(0);
  strokeWeight(2);
  this.tiles.forEach(x => x.draw());
}

function mousePressed() {
  // nextTile();
}

function nextTile() {
  let next = markov(states[this.lastConnection][this.lastConnectionStyle]);
  const connectStyle = this.getConnectionStyle(this.lastConnection, next);
  let nextReverse = abs(next-2);
  if (nextReverse === -1) nextReverse = 3;
  if (nextReverse === -2) nextReverse = 2;
  this.tiles.push(new WireCell(this.currentPos.copy(), createVector(CELL_WIDTH, CELL_HEIGHT), this.lastConnection, this.lastConnectionStyle, next, connectStyle, this.colourScheme[this.colIndex]));
  switch (next) {
    case '0':
      this.currentPos.y -= CELL_HEIGHT;
      break;
    case '1':
      this.currentPos.x += CELL_WIDTH;
      break;
    case '2':
      this.currentPos.y += CELL_HEIGHT;
      break;
    case '3':
      this.currentPos.x -= CELL_WIDTH;
      break;
  }
  // console.log(connectStyle, this.lastConnection, next);
  // next -= 2;
  // next = abs(next);
  this.lastConnection = next;
  this.lastConnectionStyle = connectStyle;
  this.doDraw();
}

function getConnectionStyle(from, to) {
  let connectionStyle = 'A';
  switch (from) {
    case '0':
      if (to === '1' || to === '3') {
        connectionStyle = "B";
      }
      break;
    case '1':
      if (to === '0' || to === '2') {
        connectionStyle = "B";
      }
      break;
    case '2':
      if (to === '1' || to === '3') {
        connectionStyle = "B";
      }
      break;
    case '3':
      if (to === '0' || to === '2') {
        connectionStyle = "B";
      }
      break;
  }
  return connectionStyle;
}

function markov(weights) {
  const num = random();
  let count = 0;
  for (let key in weights) {
    count += weights[key];
    if (count >= num) return key;
  }
}

function calculateWeights(weightArray) {
  const num = 1 / weightArray.length;
  const weights = {};
  weightArray.forEach(x => {
    if (weights[x]) {
      weights[x] += num;
    } else {
      weights[x] = num;
    }
  });
  return weights;
}

class WireCell {
  constructor(position, size, from, fromStyle, to, style, colour) {
    this.wires = [];
    this.position = position;
    this.size = size;
    this.from = from;
    this.fromStyle = fromStyle;
    this.to = to;
    this.style = style;
    this.colour = colour;
  }

  // connections
  // 0 - top
  // 1 - right
  // 2 - bottom
  // 3 - left
  draw() {
    push();
    translate(this.position.x, this.position.y);
    const start = this.getPosition(this.from, this.fromStyle);
    const end = this.getPosition(this.to, this.style);
    // fill(color(random(0, 255), random(0, 255), random(0, 255)));
    // rect(0, 0, this.size.x, this.size.y);
    // console.log(this.from, this.to, start, end);
    strokeWeight(10);
    stroke(this.colour);
    line(start.x, start.y, end.x, end.y);
    pop();
  }

  canConnect(from, to) {
    // return this.wires.any(x => x.canConnect)
  }

  getPosition(num, style) {
    let vec = createVector();
    switch (num) {
      case '0':
        vec.x = this.size.x / 2;
        break;
      case '1':
        vec.x = this.size.x;
        vec.y = this.size.y / 2;
        break;
      case '2':
        vec.x = this.size.x / 2;
        vec.y = this.size.y;
        break;
      case '3':
        vec.y = this.size.y / 2;
        break;
    }
    return vec;
  }
}

class Wire {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }


}

class FlowBLob {
  constructor(position, colour) {
    this.position = position;
    this.colour = colour;
    this.time = 0;
    this.points = [];
    this.jumpedLastRound = false;
  }

  draw() {
    const t = noise(this.time);
    if (!this.jumpedLastRound) {
      if (t < 0.33) {
        this.position.y -= LINE_JUMP_SIZE;
        this.jumpedLastRound = true;
      }
      if (t > 0.66) {
        this.position.y += LINE_JUMP_SIZE;
        this.jumpedLastRound = true;
      }
    }
    // if (this.position.y > CANVAS_HEIGHT) this.position.y = 0;
    // if (this.position.y < 0) this.position.y = CANVAS_HEIGHT;
    this.points.push(this.position.copy());
    stroke(this.colour);
    strokeWeight(2);
    for (let i = 0; i < this.points.length - 1; i++) {
      line(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y)
    }

    this.position.x += LINE_JUMP_SIZE;
    this.time += NOISE_LENGTH;
  }
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
    for (let i = 1; i < this.lines.length - 2; i += 1) {
      this.lines[i].draw(this.lines[i - 1].position, this.lines[i + 1].position, this.lines[i + 2].position);
      if (this.lines[i - 1].outsideDrawZone && this.lines[i].outsideDrawZone && this.lines[i + 1].outsideDrawZone) this.lines[i - 1].toDelete = true;
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
    const angle = atan2(CANVAS_HEIGHT / 2 - this.position.y, CANVAS_WIDTH / 2 - this.position.x) + Math.PI; // position.angleBetween(createVector(CANVAS_WIDTH/2, CANVAS_HEIGHT/2)); // + Math.PI;
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
      if (this.position.y < -10000 || this.position.y > CANVAS_HEIGHT + 10000) this.outsideDrawZone = true;
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
