const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const ITERATIONS = 3;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.cells = [];
  this.cells.push(new Cell(createVector(0, 0, 0), createVector(CANVAS_WIDTH, CANVAS_HEIGHT, 0)));

  for (let index = 0; index < ITERATIONS; index++) {
    const oldCells = this.cells.slice(0);
    this.cells = [];
    oldCells.forEach((elem) => {
      const newCells = iterate(elem);
      newCells.forEach(newElem => this.cells.push(newElem));
    });
  }

  noStroke();
  this.cells.forEach(element => {
    element.draw();
  });
}

function iterate(cellToIterate) {
  const cells = [];
  const split = (Math.round(Math.random() * 5)) * 2; // Even numbers only
  const newCellWidth = cellToIterate.size.x / split;
  const newCellHeight = cellToIterate.size.y / split;
  const newCellSize = createVector(newCellWidth, newCellHeight, 0);
  for (let y = 0; y < split; y++) {
    for (let x = 0; x < split; x++) {
      const loc = createVector(cellToIterate.position.x + (x * newCellWidth), cellToIterate.position.y + (y * newCellHeight), 0);
      cells.push(new Cell(loc, newCellSize));
    }
  }
  if (cells.length == 0) cells.push(cellToIterate);
  return cells;
}

class Cell {
  constructor(coordinates, size) {
    this.position = coordinates;
    this.size = size;
    this.colour = color(Math.random() * 255);
  }

  draw() {
    fill(this.colour);
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}