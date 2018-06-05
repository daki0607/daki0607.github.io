// Visual representation of fractals from chaos.

let pos = [];
let Triangle;
let chosen = false;
let choice;
let clicks = 5;

function draw_triangle(verticies) {
  noStroke();
  fill(color(50, 200, 50, 127));
  for (let i = 0; i < 3; i++) {
    ellipse(verticies[i][0], verticies[i][1], 15, 15);
  }
}

function next_point(choice, points) {
  pos[0] = ((pos[0] + points[choice][0]) / 2);
  pos[1] = ((pos[1] + points[choice][1]) / 2);

  stroke(255, 255, 255, 10);
  point(pos[0], pos[1]);
}

function setup() {
  createCanvas(500, 500);
  background(51);

  Triangle = [[249, 50],
  [249+(400*cos(PI/3)), 50+(400*sin(PI/3))],
  [249+(400*cos(2*PI/3)), 50+(400*sin(2*PI/3))]];

  draw_triangle(Triangle);
}

function draw() {
  for (let i = 0; i < 50; i++) {
    choice = random([0, 1, 2]);
    if (chosen && clicks == 0) {
      next_point(choice, Triangle);
    }
  }
}

function mouseClicked() {
  if (chosen && clicks > 0) {
    choice = random([0, 1, 2]);
    pos[0] = ((pos[0] + Triangle[choice][0]) / 2);
    pos[1] = ((pos[1] + Triangle[choice][1]) / 2);

    noStroke();
    fill(255);
    ellipse(pos[0], pos[1], 3, 3);
    clicks--;
  }

  if (!chosen) {
    pos = [mouseX, mouseY];
    chosen = true;

    noStroke();
    fill(255);
    ellipse(pos[0], pos[1], 3, 3);
  }
}
