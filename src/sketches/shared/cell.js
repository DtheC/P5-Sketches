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
