class Cell {
  constructor(coordinates, size, colour) {
    this.position = coordinates;
    this.size = size;
    this.colour = colour ? colour : color(Math.random() * 255);
  }

  draw() {
    fill(this.colour);
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}

class CellRound extends Cell {
  draw() {
    fill(this.colour);
    ellipse(this.position.x + (this.size.x / 2), this.position.y + (this.size.y / 2), this.size.x, this.size.y);
  }
}