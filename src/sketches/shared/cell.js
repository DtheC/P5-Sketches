class Cell {
  constructor(coordinates, size, colour) {
    this.position = coordinates;
    this.size = size;
    this.colour = colour ? colour : color(Math.random() * 255);
    this.initVariables();
  }

  initVariables() {
    // Nothing
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

class CellOutline extends Cell {
  initVariables() {
    this.rotation = 0;
  }

  draw() {
    // console.log(this.rotation);
    if (this.size.x > 4) {
      fill(0, 0);
      stroke(this.colour);
      let strokeSize = this.size.x / 10;
      if (strokeSize < 1) strokeSize = 1;
      strokeWeight(strokeSize);
      push();
      translate(this.position.x + (this.size.x / 2), this.position.y + (this.size.y / 2));
      rotate(this.rotation);
      rect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
      line(-this.size.x / 2, -this.size.y / 2, this.size.x / 2, this.size.y / 2);
      pop();
    }
  }
}

class CellStrikeThrough extends Cell {
  initVariables() {
    this.rotation = 0;
  }

  draw() {
    strokeCap(SQUARE);
    // console.log(this.rotation);
    if (this.size.x > 4) {
      fill(0, 0);
      stroke(this.colour);
      let strokeSize = this.size.x / 5;
      if (strokeSize < 1) strokeSize = 1;
      strokeWeight(strokeSize);
      push();
      translate(this.position.x + (this.size.x / 2), this.position.y + (this.size.y / 2));
      rotate(this.rotation);
      // rect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
      line(-this.size.x / 2, -this.size.y / 2, this.size.x / 2, this.size.y / 2);
      pop();
    }
  }
}

class Cell3D extends Cell {
  draw() {
    // this.colour.setAlpha(255);
    fill(this.colour);
    stroke(this.colour);
    strokeWeight(10);
    line(this.position.x, this.position.y, this.position.z, this.position.x + this.size.x, this.position.y + this.size.y, this.position.z + this.size.z);
  }
}