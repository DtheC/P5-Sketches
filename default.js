function setup() {
    createCanvas(640, 480);
}

function draw() {
    if (mouseIsPressed) {
        fill(0);
        stroke(255);
    } else {
        fill(255);
        stroke(0);
    }
    ellipse(mouseX, mouseY, 80, 80);
}
