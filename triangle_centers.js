var a, b, c;
var amove = false;
var bmove = false;
var cmove = false;
var r = 10;
var ce, ci;

function highway() {
  this.x1;
  this.y1;
  this.x2;
  this.y2;

  this.get_points = function(ce, ci) {
    this.x1 = ce[0];
    this.y1 = ce[1];
    this.x2 = ci[0];
    this.y2 = ci[1];
  }

  this.show = function() {
    var m = (this.y2 - this.y1) / (this.x2 - this.x1);
    var b = this.y1 - m*this.x1;
    var p1 = [-10, -m*10 + b];
    var p2 = [810, m*810 + b];

    stroke(255, 255, 255, 127);
    strokeWeight(2);
    line(p1[0], p1[1], p2[0], p2[1]);
  }
}

function intersect(ra, rb, sa, sb) {
  // Parametric form
  var rpx = ra[0];
  var rpy = ra[1];
  var rdx = rb[0] - ra[0];
  var rdy = rb[1] - ra[1];
  
  var spx = sa[0];
  var spy = sa[1];
  var sdx = sb[0] - sa[0];
  var sdy = sb[1] - sa[1];
  
  // Check if parallel
  var rmag = Math.sqrt(rdx*rdx + rdy*rdy);
  var smag = Math.sqrt(sdx*sdx + sdy*sdy);
  if (rdx/rmag == sdx/smag && rdy/rmag == sdy/smag) {
    return null;
  }
  
  // Solve for t1 & t2
  var t2 = (rdx*(spy - rpy) + rdy*(rpx - spx)) / (sdx*rdy - sdy*rdx);
  var t1 = (spx + sdx*t2 - rpx) / rdx;
  
  // Check if t1 and t2 exist
  if (t1 < 0) return null;
  if (t2 < 0 || t2 > 1) return null;
  
  // Return where they intersect
  return [rpx + rdx*t1, rpy + rdy*t1];
}

function centroid(a, b, c, h) {
  var ab = [(a[0]+b[0])/2, (a[1]+b[1])/2];
  var bc = [(b[0]+c[0])/2, (b[1]+c[1])/2];
  var ca = [(c[0]+a[0])/2, (c[1]+a[1])/2];
  
  var isect = intersect(a, bc, b, ca);
  
  stroke(255, 0, 0, 55);
  strokeWeight(4);
  line(a[0], a[1], bc[0], bc[1]);
  line(b[0], b[1], ca[0], ca[1]);
  line(c[0], c[1], ab[0], ab[1]);
  
  noStroke();
  fill(255, 0, 0, 255);
  ellipse(isect[0], isect[1], r+3, r+3);

  return isect;
}

function circumcenter(a, b, c, h) {
  var ab = [(a[0]+b[0])/2, (a[1]+b[1])/2];
  var bc = [(b[0]+c[0])/2, (b[1]+c[1])/2];
  var ca = [(c[0]+a[0])/2, (c[1]+a[1])/2];
  
  // Normal lines
  var dab = -(b[0] - a[0]) / (b[1] - a[1]);
  var dbc = -(c[0] - b[0]) / (c[1] - b[1]);
  
  // Find intersection
  var x_ = (dab*ab[0] - ab[1] - dbc*bc[0] + bc[1]) / (dab - dbc);
  var y_ = dab*(x_ - ab[0]) + ab[1];
  var d_ = Math.sqrt((x_ - a[0])*(x_ - a[0]) + (y_ - a[1])*(y_ - a[1]));
  
  noStroke();
  fill(0, 255, 0, 255);
  ellipse(x_, y_, r+3, r+3);

  stroke(0, 255, 0, 55);
  strokeWeight(4);
  line(ab[0], ab[1], x_, y_);
  line(bc[0], bc[1], x_, y_);
  line(ca[0], ca[1], x_, y_);
  
  noFill();
  stroke(0, 255, 0, 127);
  strokeWeight(6);
  ellipse(x_, y_, d_*2, d_*2);

  return [x_, y_];
}

function orthocenter(a, b, c) {
  var mab = -(b[0] - a[0]) / (b[1] - a[1]);
  var mbc = -(c[0] - b[0]) / (c[1] - b[1]);
  var bab = c[1] - mab*c[0];
  var bbc = a[1] - mbc*a[0];
  
  var x_ = (bbc - bab) / (mab - mbc);
  var y_ = mab*x_ + bab;

  stroke(0, 0, 255, 127);
  strokeWeight(4);
  line(a[0], a[1], x_, y_);
  line(b[0], b[1], x_, y_);
  line(c[0], c[1], x_, y_);
  
  noStroke();
  fill(0, 0, 255, 255);
  ellipse(x_, y_, r+3, r+3);
}

function setup() {
  createCanvas(800, 800);
  
  a = [354, 520];
  b = [350, 250];
  c = [570, 350];

  H = new highway();
}

function draw() {
  background(0);
  
  noStroke();
  fill(255);
  ellipse(a[0], a[1], r, r);
  ellipse(b[0], b[1], r, r);
  ellipse(c[0], c[1], r, r);
  
  stroke(255);
  strokeWeight(3);
  line(a[0], a[1], b[0], b[1]);
  line(b[0], b[1], c[0], c[1]);
  line(c[0], c[1], a[0], a[1]);
  
  ce = centroid(a, b, c);
  ci = circumcenter(a, b, c);
  orthocenter(a, b, c);

  H.get_points(ce, ci);
  H.show();
}

function mousePressed() {
  if (abs(mouseX-a[0]) < r && abs(mouseY-a[1]) < r) {
    amove = true;
  }
  else if (abs(mouseX-b[0]) < r && abs(mouseY-b[1]) < r) {
    bmove = true;
  }
  else if (abs(mouseX-c[0]) < r && abs(mouseY-c[1]) < r) {
    cmove = true;
  }
  return false;
}

function mouseDragged() {
  if (amove) {
    a[0] = mouseX;
    a[1] = mouseY;
  }
  else if (bmove) {
    b[0] = mouseX;
    b[1] = mouseY;
  }
  else if (cmove) {
    c[0] = mouseX;
    c[1] = mouseY;
  }
  return false;
}

function mouseReleased() {
  amove = false;
  bmove = false;
  cmove = false;
}