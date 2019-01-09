// Visual representation of fractals from chaos.

let pos;
let verticies = [];
let chosen = false;
let clicks = 5;
let numVerticies = 3;
let clock;
let threshold = 1000;
let aspect;

function draw_verticies(verticies) {
  translate(windowWidth/2, windowHeight/2);
  scale(1, -1);
  noStroke();
  fill(color(50, 200, 50, 127));

  for (let i = 0; i < numVerticies; i++) {
    ellipse(verticies[i].x, verticies[i].y, 15, 15);
  }
}

function next_point(choice, verticies, size) {
  let newX = (pos.x + verticies[choice].x) / 2;
  let newY = (pos.y + verticies[choice].y) / 2;
  pos.set(newX, newY);

  stroke(255, 255, 255, 10);

  if (size > 0) {
    ellipse(pos.x, pos.y, size, size);
  }

  else {
    point(pos.x, pos.y);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(51);

  aspect = min(windowWidth, windowHeight);
  let scalingFactor = aspect / 2 * 0.85;
  let angleBetween = TWO_PI / numVerticies;
  let offset = (numVerticies % 2 == 0) ? angleBetween / 2 : 0;

  for (let i = 0; i < numVerticies; i++) {
    let x = scalingFactor * cos(offset + PI/2 + angleBetween * i);
    let y = scalingFactor * sin(offset + PI/2 + angleBetween * i);

    verticies.push(createVector(x, y));
  }

  draw_verticies(verticies);
}

function draw() {
  translate(windowWidth/2, windowHeight/2);
  scale(1, -1);

  let currentTime = millis();
  
  if (currentTime - clock > threshold && threshold > 0) {
    clock = currentTime;
    threshold -= 65;

    let choice = floor(random(numVerticies));

    if (chosen) {
      next_point(choice, verticies, 2);
    }
  }

  if (threshold <= 0) {
    for (let i = 0; i < 100; i++) {
      let choice = floor(random(numVerticies));

      if (chosen) {
        next_point(choice, verticies, 0);
      }
    }
  }
}

function touchEnded() {
  if (chosen && clicks > 0) {
    let choice = floor(random(numVerticies));

    let newX = (pos.x + verticies[choice].x) / 2;
    let newY = (pos.y + verticies[choice].y) / 2;
    pos.set(newX, newY);

    noStroke();
    fill(255);
    ellipse(pos.x, pos.y, 2 + clicks/5, 2 + clicks/5);
    clicks--;

    if (clicks == 0) {
      clock = millis();
    }
  }

  if (!chosen) {
    let x = map(mouseX, 0, windowWidth, -windowWidth/2, windowWidth/2);
    let y = map(mouseY, 0, windowHeight, windowHeight/2, -windowHeight/2);
    pos = createVector(x, y);
    chosen = true;

    noStroke();
    fill(255);
    ellipse(pos.x, pos.y, 4.5, 4.5);
  }

  return false;
}
