const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const ITERATIONS = 5;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.colourScheme = ColorSchemeController.getSchemeWithXColours(5);
  fill(this.colourScheme[0]);
  rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.cells = [];
  this.cells.push(new Cell(createVector(0, 0, 0), createVector(CANVAS_WIDTH, CANVAS_HEIGHT, 0), color(this.colourScheme[0])));

  for (let index = 1; index < ITERATIONS; index++) {
    console.log(`Iteration ${index} in progress...`);
    const oldCells = this.cells.slice(0);
    this.cells = [];
    oldCells.forEach((elem) => {
      const newCells = iterate(elem, this.colourScheme[index]);
      newCells.forEach(newElem => this.cells.push(newElem));
    });
  }

  noStroke();
  this.cells.forEach(element => {
    element.draw();
  });
}

function iterate(cellToIterate, nextColour) {
  const cells = [];
  const split = (Math.round(Math.random() * 5)) * 2; // Even numbers only
  const newCellWidth = cellToIterate.size.x / split;
  const newCellHeight = cellToIterate.size.y / split;
  const newCellSize = createVector(newCellWidth, newCellHeight, 0);
  for (let y = 0; y < split; y++) {
    for (let x = 0; x < split; x++) {
      const loc = createVector(cellToIterate.position.x + (x * newCellWidth), cellToIterate.position.y + (y * newCellHeight), 0);
      cells.push(new Cell(loc, newCellSize, nextColour));
    }
  }
  if (cells.length == 0) cells.push(cellToIterate);
  return cells;
}
