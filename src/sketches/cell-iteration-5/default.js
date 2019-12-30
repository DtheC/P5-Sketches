const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const ITERATIONS = 6;

function setup() {
  noStroke();
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.colourScheme = ColorSchemeController.getSchemeWithXColours(5);
  this.cells = [];
  let col = color(this.colourScheme[0]);
  col.setAlpha(255);
  this.cells.push(new CellRound(createVector(0, 0, 0), createVector(CANVAS_WIDTH, CANVAS_HEIGHT, 0), col));
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
      const col = color(this.colourScheme[index-1]);
      col.setAlpha(255/ITERATIONS);
      const newCells = iterate(oldCells[oldCellIndex], col);
      for (let newCellIndex = 0; newCellIndex < newCells.length; newCellIndex++) {
          drawCell([newCells[newCellIndex]]);
          this.cells.push(newCells[newCellIndex]);
      }
      if (oldCellIndex % (index * index * 100) == 0) yield null;
      // yield null;
    }
    yield null;
  }
}

function iterate(cellToIterate, nextColour) {
  const cells = [];
  const split = (Math.round(noise(cellToIterate.position.x, cellToIterate.position.y) * 5)) * 2; // Even numbers only
  if (split == 0) cellToIterate.isDone = true;
  if (cellToIterate.isDone) return cellToIterate;
  const newCellWidth = cellToIterate.size.x / split;
  const newCellHeight = cellToIterate.size.y / split;
  const newCellSize = createVector(newCellWidth, newCellHeight, 0);
  for (let y = 0; y < split; y++) {
    for (let x = 0; x < split; x++) {
      const loc = createVector(cellToIterate.position.x + (x * newCellWidth), cellToIterate.position.y + (y * newCellHeight), 0);
      cells.push(new CellRound(loc, newCellSize, nextColour));
    }
  }
  if (cells.length == 0) cells.push(cellToIterate);
  return cells;
}
