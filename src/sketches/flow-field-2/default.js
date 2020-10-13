const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;
const ITERATIONS = 5;

const NOISE_LENGTH = 100;


let left_x;
let right_x;
let top_y;
let bottom_y;
let resolution;
let num_columns;
let num_rows;
let grid;
let default_angle;

let colourScheme;

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function setup() {
  noStroke();
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  background(0);
  colourScheme = ColorSchemeController.getSchemeWithXColours(5);
  if (Math.random() > 0.5) colourScheme = colourScheme.reverse();
  setupVariables();
  generateGrid();
  rotateGrid();
  // addSquaresToGrid();
  console.log('Drawing grid');
  drawLines();
  console.log('Done');
}

function setupVariables() {
  left_x = Math.round(CANVAS_WIDTH * -0.5)
  right_x = Math.round(CANVAS_WIDTH * 1.5)
  top_y = Math.round(CANVAS_HEIGHT * -0.5)
  bottom_y = Math.round(CANVAS_HEIGHT * 1.5)
  resolution = 2;
  num_columns = (right_x - left_x) / resolution
  num_rows = (bottom_y - top_y) / resolution
  console.log(num_columns, num_rows);
  grid = Array(num_columns).fill(0).map(x => Array(num_rows).fill(0));
  default_angle = Math.PI * 0.25
}

function generateGrid() {
  for (let x = 0; x < num_rows; x++) {
    for (let y = 0; y < num_rows; y++) {
      // grid[x][y] = Math.random() * (2 * Math.PI);
      grid[x][y] = noise(x / 150, y / 50) * (Math.PI * 2);
    }
  }
}

function rotateGrid() {
  for (let x = 0; x < num_rows; x++) {
    for (let y = 0; y < num_rows; y++) {
      // grid[x][y] = Math.random() * (2 * Math.PI);
      // grid[x][y] = noise(x / 20, y / 10) * (Math.PI * 2);
      grid[x][y] += Math.cos(y) + Math.sin(x);
    }
  }
}

function addSphereToGrid(center, radius) {

}

function addSquaresToGrid() {
  for(let i = 0; i < 2; i++) {
    const t1 = createVector(random(0, grid[0].length), random(0, grid.length));
    const t2 = createVector(random(0, grid[0].length), random(0, grid.length));
    addSquareToGrid(t1, t2);
  }
}

function addSquareToGrid(topLeft, bottomRight) {
  let angle = 0;
  const distX = bottomRight.x - topLeft.x;
  const distY = bottomRight.y - topLeft.y;
  const center = createVector(topLeft.x + (distX / 2), topLeft.y + (distY / 2));
  for (let y = topLeft.y; y < bottomRight.y; y++) {
    for (let x = topLeft.x; x < bottomRight.x; x++) {
      const currPos = createVector(x, y);
      if (y >= 0 && y < num_columns && x >= 0 && x < num_rows) {
        grid[y][x] += (center.angleBetween(currPos) * -p5.Vector.dist(center, currPos)) * 2;
      }
    }
    // angle = Math.sin(x);
  }
}

// function drawGrid() {
//   fill(255);
//   rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//   stroke(0);
//   for (let x = 0; x < num_columns; x++) {
//     for (let y = 0; y < num_rows; y++) {
//       // fill(grid[x][y] / (2 * Math.PI) * 255);
//       // fill(grid[x][y] * 255);
//       // rect(x*2, y*2, 2, 2);
//       const xOffset = left_x + (2 * x);
//       const yOffset = y - top_y;
//       stroke(getColorBasedOnAngle(grid[x][y]));
//       push();
//       translate(xOffset, yOffset);
//       rotate(grid[x][y]);
//       line(0, 0, 2, 0);
//       pop();
//       // console.log(grid[x][y]);
//     }
//   }

function drawLines() {
  for (let index = 0; index < 10000; index++) {
    drawLine();
  }
}

function drawLine() {
  noFill();
  const col = color(colourScheme[Math.floor(random(0, colourScheme.length))]);
  col.setAlpha(150);
  stroke(col);
  strokeWeight(random(2, 8));
  // console.log(col);
  // stroke(255,0,255);
  let x = random(left_x, right_x);
  let y = random(top_y, bottom_y);
  let x_offset, y_offset, columnIndex, rowIndex, gridAngle, xStep, yStep, weight = 0;
  let stepLength = 1;
  let length = random(31, 500);
  // col.setAlpha(255 - (length * 5));
  beginShape();
  for (let i = 0; i < length; i++) {
    curveVertex(x, y);
    x_offset = x - left_x;
    y_offset = y - top_y;
    columnIndex = Math.round(x_offset / resolution);
    rowIndex = Math.round(y_offset / resolution);
    if (columnIndex >= 0 && columnIndex < num_columns && rowIndex >= 0 && rowIndex < num_rows) {
      gridAngle = grid[columnIndex][rowIndex];
    }
    xStep = stepLength * Math.cos(gridAngle);
    yStep = stepLength * Math.sin(gridAngle);

    x += xStep;
    y += yStep;

    // strokeWeight(getParabolicStrokeWeight(i, length, 0, 10));
    // const col = color(getColorBasedOnAngle(gridAngle));
    // col.setAlpha(15);
    // stroke(col);
    // strokeWeight(gridAngle / (2*Math.PI) * 10);
  }
  endShape();
}

function getParabolicStrokeWeight(currentTime, endTime, offset, max) {
  const percent = endTime / currentTime;
  const x = (max * percent) - (max / 2);
  endTime = 0.4;
  const yyy = (-endTime * Math.pow(x, 2)) - (offset * x) + max;
  console.log(x);
  return yyy;
}

function getColorBasedOnAngle(angle) {
  const percent = angle / (Math.PI * 2);
  return colourScheme[Math.floor(percent * colourScheme.length)];
}

// function draw() {
//   fill('rgba(0,0,0,0.1)');
//   rect(0, 0, width, height);
// }

