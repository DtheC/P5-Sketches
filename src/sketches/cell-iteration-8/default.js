const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const ITERATIONS = 5;

const NOISE_LENGTH = 100;

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function setup() {
  noStroke();
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.colourScheme = ColorSchemeController.getSchemeWithXColours(5);
  if (Math.random() > 0.5) this.colourScheme = this.colourScheme.reverse();
  this.cells = [];
  let col = color(this.colourScheme[0]);
  col.setAlpha(255);
  this.cells.push(new Cell(createVector(0, 0, 0), createVector(CANVAS_WIDTH, CANVAS_HEIGHT, 0), col));
  this.cells[0].draw();

  this.generator = iterateCells();
  this.oldStamp = 0;
  requestAnimationFrame(runGen);
}

function runGen(timeStamp) {
  if (timeStamp - this.oldStamp > 100) {
    this.generator.next();
    this.oldStamp = timeStamp;
  }
  requestAnimationFrame(runGen);
}

function drawCell(cellArray) {
  noStroke();
  cellArray.forEach(e => e.draw());
}

function * iterateCells() {
  for (let index = 1; index < ITERATIONS; index++) {
    const oldCells = this.cells.slice(0);
    this.cells = [];
    for (let oldCellIndex = 0; oldCellIndex < oldCells.length; oldCellIndex++) {
      const col = color(this.colourScheme[index]);
      col.setAlpha(255);
      const newCells = iterate(oldCells[oldCellIndex], col);
      for (let newCellIndex = 0; newCellIndex < newCells.length; newCellIndex++) {
          drawCell([newCells[newCellIndex]]);
          this.cells.push(newCells[newCellIndex]);
      }
      if (oldCellIndex % (index * index * 100) == 0) yield null;
    }
    yield null;
  }
}

function iterate(cellToIterate, nextColour) {
  const cells = [];
  let split = (Math.round(scale(noise(cellToIterate.position.x / NOISE_LENGTH, cellToIterate.position.y / NOISE_LENGTH), 0.2, 0.8, 0, 1) * 5)) * 2; // Even numbers only
  if (split === 0 && !cellToIterate.hasSplit) {
    cellToIterate.hasSplit = true;
    split = Math.round(Math.random() * 5) * 2;
  }
  if (split === 0) cellToIterate.isDone = true;
  if (cellToIterate.isDone) return cellToIterate;
  const newCellWidth = cellToIterate.size.x / split;
  const newCellHeight = cellToIterate.size.y / split;
  const newCellSize = createVector(newCellWidth, newCellHeight, 0);
  for (let y = 0; y < split; y++) {
    for (let x = 0; x < split; x++) {
      let offsetX = ((noise((cellToIterate.position.x + (x * newCellWidth))/ NOISE_LENGTH, (cellToIterate.position.y + (y * newCellHeight)) / NOISE_LENGTH)) - .5) * 10;
      let offsetY = ((noise(0, (cellToIterate.position.x + (x * newCellWidth)) / NOISE_LENGTH, (cellToIterate.position.y + (y * newCellHeight)))/NOISE_LENGTH) - .5) * 10;
      const loc = createVector(cellToIterate.position.x + (x * newCellWidth), cellToIterate.position.y + (y * newCellHeight), 0);
      const newCell = new CellRound(loc, newCellSize, nextColour);
      newCell.hasSplit = true;
      cells.push(newCell);
    }
  }
  if (cells.length == 0) cells.push(cellToIterate);
  return cells;
}
