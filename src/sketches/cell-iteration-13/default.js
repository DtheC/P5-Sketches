const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const ITERATIONS = 4;

const NOISE_LENGTH = 50;

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function setup() {
  noStroke();
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL);
  this.colourScheme = ColorSchemeController.getSchemeWithXColours(5);
  if (Math.random() > 0.5) this.colourScheme = this.colourScheme.reverse();
  this.cells = [];

  this.rotX = random(Math.PI/4);
  this.rotY = random(Math.PI/4);
  this.rotZ = random(Math.PI/4);
  this.transX = random(-300, 100);
  this.transY = random(-300, 100);
  this.transZ = random(-250, -400);
  // push();
  // translate(0, 0, -200);
  // rotateX(random(Math.PI/4));
  // rotateY(random(Math.PI/4));
  // rotateZ(random(Math.PI/4));
  // This is so inefficient- generating all the
  // for (let x = 0; x < 20; x++) {
  //   for (let y = 0; y < 20; y++) {
  //     for (let z = 0; z < 20; z++) {

        const cl = new CellBox3D(createVector(0, 0, 0), createVector(400, 400, 400), this.colourScheme[Math.floor(random(0, this.colourScheme.length))]);
        // cl.draw();
        this.cells.push(cl);
    //   }
    // }
  // }
  // translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0);
  
  // let col = color(this.colourScheme[0]);
  // col.setAlpha(255);
  // this.cells.push(new Cell(createVector(0, 0, 0), createVector(CANVAS_WIDTH, CANVAS_HEIGHT, 0), col));
  // this.cells[0].draw();
  
  background('#FFFFFF');
  const c = color(this.colourScheme[0]);
  // c.setAlpha(200);
  background(c);

  this.generator = iterateCells();
  this.oldStamp = 0;
  requestAnimationFrame(runGen);
  // pop();
  this.itCount = 1;
}

function runGen(timeStamp) {
  if (timeStamp - this.oldStamp > 100) {
    this.generator.next();
    this.oldStamp = timeStamp;
    if (this.generator.next().done && itCount < 2) {
      itCount++;
      const cl = new CellBox3D(createVector(0, 0, 0), createVector(400, 400, 400), this.colourScheme[Math.floor(random(0, this.colourScheme.length))]);
        // cl.draw();
        this.cells = [cl];
        this.rotX = random(-Math.PI, Math.PI/4);
        this.rotY = random(-Math.PI, Math.PI/4);
        this.rotZ = random(-Math.PI, Math.PI/4);
        this.transX = random(-300, 100);
        this.transY = random(-300, 100);
        this.transZ = random(-250, -400);
        // this.cells.push(cl);
      this.generator = iterateCells();
    }
  }
  requestAnimationFrame(runGen);
}

function drawCell(cellArray) {
  noStroke();
  cellArray.forEach(e => e.draw());
}

function* iterateCells() {
  for (let index = 1; index < ITERATIONS; index++) {
    const oldCells = this.cells.slice(0);
    this.cells = [];
    for (let oldCellIndex = 0; oldCellIndex < oldCells.length; oldCellIndex++) {
      const col = color(random(this.colourScheme));
      // col.setAlpha(255 - index * 50);
      // col.setAlpha(255);
      // col.setAlpha(255);
      const newCells = iterate(oldCells[oldCellIndex], col);
      for (let newCellIndex = 0; newCellIndex < newCells.length; newCellIndex++) {
        // if (newCells[newCellIndex].rotation == 0) newCells[newCellIndex].rotation = index * (Math.PI / 2);
        // console.log(newCells[newCellIndex].rotation);
        // drawCell([newCells[newCellIndex]]);
        this.cells.push(newCells[newCellIndex]);
      }
      if (oldCellIndex % (index * index * 100) == 0) yield null;
    }
    yield null;
  }
  push();
  translate(this.transX, this.transY, this.transZ);
  rotateX(this.rotX);
  rotateY(this.rotY);
  rotateZ(this.rotZ);
  for (let cellIndex = 0; cellIndex < this.cells.length; cellIndex++) {
    const toDraw = this.cells[cellIndex];
    // toDraw.colour = this.colourScheme[Math.round(noise(toDraw.position.x / NOISE_LENGTH, toDraw.position.y / NOISE_LENGTH) * this.colourScheme.length)];
    drawCell([toDraw]);
  }
  pop();
  console.log("DOne");
}

function iterate(cellToIterate, nextColour) {
  const cells = [];
  // let split = (Math.round(scale(noise(cellToIterate.position.x / NOISE_LENGTH, cellToIterate.position.y / NOISE_LENGTH), 0.2, 0.8, 0, 1) * 5)) * 2; // Even numbers only
  let split = (Math.round(noise(cellToIterate.position.x / NOISE_LENGTH, cellToIterate.position.y / NOISE_LENGTH) * 5)) * 2; // Even numbers only
  if (split === 0 && !cellToIterate.hasSplit) {
    cellToIterate.hasSplit = true;
    split = 2;
  }
  if (split === 0) cellToIterate.isDone = true;
  if (cellToIterate.isDone) return cellToIterate;
  const newCellWidth = cellToIterate.size.x / split;
  const newCellHeight = cellToIterate.size.y / split;
  const newCellDepth = cellToIterate.size.z / split;
  const newCellSize = createVector(newCellWidth, newCellHeight, newCellDepth);
  if (newCellSize.x > 4) {
    for (let z = 0; z < split; z++) {
      for (let y = 0; y < split; y++) {
        for (let x = 0; x < split; x++) {
          const loc = createVector(cellToIterate.position.x + (x * newCellWidth), cellToIterate.position.y + (y * newCellHeight), cellToIterate.position.z + (z * newCellDepth));
          let newCell = null;
          const switchVal = Math.random();
          // if (switchVal > 0 && switchVal < 0.33) newCell = new Cell(loc, newCellSize, nextColour);
          // if (switchVal > 0.33 && switchVal < 0.66) newCell = new CellRound(loc, newCellSize, nextColour);
          if (newCell === null) newCell = new CellBox3D(loc, newCellSize, nextColour);
          newCell.hasSplit = true;
          cells.push(newCell);
        }
      }
    }
  }
  if (cells.length == 0) cells.push(cellToIterate);
  return cells;
}

function draw() {
  // background('#FFFFFF');
  // const c = color(this.colourScheme[0]);
  // c.setAlpha(100);
  // background(c);
  // orbitControl();
  // push();
  // translate(0, 0, -300);
  // rotateX(rotX);
  // rotateY(rotY);
  // rotateZ(rotZ);
  // for (let cellIndex = 0; cellIndex < this.cells.length; cellIndex++) {
  //   const toDraw = this.cells[cellIndex];
  //   // toDraw.colour = this.colourScheme[Math.round(noise(toDraw.position.x / NOISE_LENGTH, toDraw.position.y / NOISE_LENGTH) * this.colourScheme.length)];
  //   drawCell([toDraw]);
  // }
  // pop();
}