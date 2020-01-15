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

class CellBox3D extends Cell {
  draw() {
    // this.colour.setAlpha(200);
    fill(this.colour);
    // noStroke();
    push();
    translate(this.position.x, this.position.y, this.position.z);
    box(this.size.x, this.size.y, this.size.z);
    pop();
  }
}

class CellSphere3D extends Cell {
  draw() {
    // this.colour.setAlpha(200);
    fill(this.colour);
    // noStroke();
    push();
    translate(this.position.x, this.position.y, this.position.z);
    sphere(this.size.x);
    pop();
  }
}

class CellCone3D extends Cell {
  draw() {
    // this.colour.setAlpha(200);
    fill(this.colour);
    // noStroke();
    push();
    translate(this.position.x, this.position.y, this.position.z);
    cone(this.size.x, this.size.y);
    pop();
  }
}

class CellSplitTone extends Cell {
  initVariables(colour1, colour2, split1, split2, rotation) {
    this.colour = colour1;
    this.colourBase = colour2;
    this.split1 = this.size.x * split1;
    this.split2 = this.size.x * split2;
    this.rotation = rotation;
  }

  draw() {
    push();
    translate(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, this.position.x);
    rotate(this.rotation);
    fill(this.colourBase);
    rect(-this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
    fill(this.colour);
    beginShape();
    vertex((-this.size.x / 2) + this.split1, -this.size.y / 2);
    vertex(this.size.x / 2, -this.size.y / 2);
    vertex(this.size.x / 2, this.size.y / 2);
    vertex((-this.size.x /2) + this.split2, this.size.y / 2);
    endShape();
    pop();
  }
}

class CellSplitToneFade extends Cell {
  initVariables(colours, split1, split2, rotation) {
    this.colours = colours;
    this.split1 = this.size.x * split1;
    this.split2 = this.size.x * split2;
    this.rotation = rotation;
    // if (this.colourBase) this.colourBase.setAlpha(20);
    // if (this.colour) this.colour.setAlpha(20);
  }

  draw() {
    push();
    translate(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
    rotate(this.rotation);
    // fill(this.colours[0]);
    // fill(random(0, 255));
    // rect(-this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
    fill(this.colours[1]);
    this.drawWithOffset(0);
    fill(this.colours[2]);
    this.drawWithOffset(4);
    fill(this.colours[3]);
    this.drawWithOffset(8);
    fill(this.colours[4]);
    this.drawWithOffset(12);
    pop();
  }

  drawWithOffset(offset) {
    beginShape();
    vertex((-this.size.x / 2) + this.split1 + offset, -this.size.y / 2);
    vertex(this.size.x / 2, -this.size.y / 2);
    vertex(this.size.x / 2, this.size.y / 2);
    vertex((-this.size.x /2) + this.split2 + offset, this.size.y / 2);
    endShape();
  }
}