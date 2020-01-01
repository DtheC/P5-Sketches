const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const ITERATIONS = 5;

const btn = document.getElementById('btn1');
  const chunks = [];

  console.log(btn);

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.colourScheme = ColorSchemeController.getSchemeWithXColours(5);
  this.cells = [];
  this.cells.push(new Cell(createVector(0, 0, 0), createVector(CANVAS_WIDTH, CANVAS_HEIGHT, 0), color(this.colourScheme[0])));

  this.generator = iterateCells();
  this.oldStamp = 0;
  record();
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
      const newCells = iterate(oldCells[oldCellIndex], this.colourScheme[index-1]);
      for (let newCellIndex = 0; newCellIndex < newCells.length; newCellIndex++) {
          drawCell([newCells[newCellIndex]]);
          this.cells.push(newCells[newCellIndex]);
      }
      if (oldCellIndex % 50 == 0) yield null;
      // yield null;
    }
    yield null;
  }
}

function iterate(cellToIterate, nextColour) {
  const cells = [];
  const split = (Math.round(Math.random() * 5)) * 2; // Even numbers only
  if (split == 0) cellToIterate.isDone = true;
  if (cellToIterate.isDone) return cellToIterate;
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

function record() {
  chunks.length = 0;
  let stream = document.querySelector('canvas').captureStream(30),
    recorder = new MediaRecorder(stream);
  recorder.ondataavailable = e => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  recorder.onstop = exportVideo;
  btn.onclick = e => {
    recorder.stop();
    btn.textContent = 'start recording';
    btn.onclick = record;
  };
  recorder.start();
  btn.textContent = 'stop recording';
}

function exportVideo(e) {
  var blob = new Blob(chunks);
  var vid = document.createElement('video');
  vid.id = 'recorded'
  vid.controls = true;
  vid.src = URL.createObjectURL(blob);
  document.body.appendChild(vid);
  vid.play();
}
