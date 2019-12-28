const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.cells = [];
  for (let y = 0; y < CANVAS_HEIGHT; y += CELL_HEIGHT) {
    for (let x = 0; x < CANVAS_WIDTH; x += CELL_WIDTH) {
      cells.push(new Cell(createVector(x, y, 0), createVector(20, 20, 0)));
    }
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

function draw() {
  // noStroke();
  // this.cells.forEach(element => {
  //   element.draw();
  // });
  // if (mouseIsPressed) {
  //   fill(0);
  //   stroke(255);
  // } else {
  //   fill(255);
  //   stroke(0);
  // }
  // ellipse(mouseX, mouseY, 80, 80);

}

class Cell {
  constructor(coordinates, size) {
    this.position = coordinates;
    this.size = size;
    this.colour = color(Math.random() * 255);
  }

  draw() {
    fill(this.colour);
    rect(this.position.x, this.position.y, 20, 20);
  }
}