/*
-------------------------------------------------
Defining the function V(n)
-------------------------------------------------
t: 0 <= t <= 2pi

Vn : t -> e^nit

ex: V(1): t -> e^it = cos(t) + isin(t) (A unit circle starting at (1, 0) )
ex: V(-2): t -> e^-2it = cos(2t) - isin(2t) 
(A unit circle starting at (1, 0), but goes in reverse at twice the speed.)
ex: V(0): t -> 1 (A point at (1, 0) that doesn't move.)

-------------------------------------------------
Multiplying by a complex number
-------------------------------------------------
ex: (1 + isqrt(3))*V(1)
(A unit circle that starts at the point (1 + isqrt(3)) )
ex: (1 + isqrt(3))*V(-2)
(A unit circle that starts at the point (1 + isqrt(3)), but goes in reverse at twice the speed.)

-------------------------------------------------
Adding equations together
-------------------------------------------------
What is V(1) + 0.2i*V(-3) + pi/20*V(-7) + 0.6*V(8) ?
It is 0.6*V(8) starting from pi/20*V(-7) starting from 0.2i*V(-3) starting from V(1).

-------------------------------------------------
Approximating a path F
-------------------------------------------------
If adding circular paths together can produce complex curves, how would you determine the scale factors for each V(n) to add together to approximate a specific curve?

Let a(n) = 1/2pi * the integral from 0 to 2pi of f(t)*e^-int dt
(a(n) is the n'th fourier coefficient.)

Make a list of a(n) * V(n).
As more terms are added together from this list, the better the approximation of the original path, F, will be.
*/

let graph;
let button_eval;
let button_reset;
let button_show_shapes;
let draw_speed;
let num_circles;

let test_points; // On the complex plane
let curve_points = [[-7.5, 93.75], [7.5, 93.75], [112.5, 131.25], [187.5, 0], [75, -150], [0, -187.5], [-75, -150], [-187.5, 0], [-112.5, 131.25]];
let fpoints;
let evaluated = false;
let anim_frame = 0;
let path = [];
let finished = false;
let show_shapes = true;


function cmult(a, b, c, d) {
    // Multiply 2 complex numbers together (a+bi) * (c+di)
    return [a * c - b * d, a * d + b * c];
}

function dft(time) {
    // A really inefficient method of calculating the fourier transform
    // time is a list of complex numbers (in the time domain).
    let coeffs = [];
    let n = time.length;
    for (let i = 0; i < n; i++) {
        // The index of the coefficient
        let re = 0;
        let im = 0;
        let angle = 0;

        for (let j = 0; j < n; j++) {
            // Sum of all equations
            angle = TWO_PI * i * j / n;
            re += time[j][0] * Math.cos(angle) + time[j][1] * Math.sin(angle);
            im += -time[j][0] * Math.sin(angle) + time[j][1] * Math.cos(angle);
        }
        coeffs.push([re / n, im / n, i]);
    }
    return coeffs;
}

function evaluate_curve_points(points) {
    let transformed = dft(points).sort(function (a, b) {
        // Sort in order of size of circles
        return b[0] * b[0] + b[1] * b[1] - a[0] * a[0] - a[1] * a[1];
    });

    return transformed;
}

function draw_points(points) {
    if (show_shapes) {
        stroke(255);
        strokeWeight(2);

        for (let i = 0; i < points.length; i++) {
            ellipse(points[i][0], points[i][1], 3, 3);
        }
    }
}

function draw_circles(fpoints) {
    let path_point = [0, 0];
    for (let i = 0; i < fpoints.length; i++) {
        let order = fpoints[i][2];
        // let angle = anim_frame / 360 * TWO_PI * i;
        let angle = (anim_frame / 360) * TWO_PI * ((order > fpoints.length / 2) ? (order - fpoints.length) : order);
        let c = cmult(Math.cos(angle), Math.sin(angle), fpoints[i][0], fpoints[i][1]);

        if (show_shapes) {
            noFill();
            stroke(127);
            strokeWeight(1);

            let circ_r = Math.sqrt(c[0] * c[0] + c[1] * c[1]);
            ellipse(0, 0, 2 * circ_r, 2 * circ_r);
            if (i == fpoints.length - 1) {
                stroke(255, 0, 0);
                strokeWeight(3);
            }
            else {
                stroke(0, 255, 0);
            }
            ellipse(c[0], c[1], 2, 2);
        }

        path_point[0] += c[0];
        path_point[1] += c[1];

        translate(c[0], c[1]);
    }
    if (!finished) {
        if (parseFloat(draw_speed.value) > 0) {
            path.push(path_point);
        }
    }
}

function draw_path(path) {
    stroke(0, 0, 255);
    strokeWeight(1.5);

    for (let i = 0; i < path.length - 1; i++) {
        line(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1]);
    }
}

function draw_axes() {
    stroke(42);
    strokeWeight(1);

    line(0, height / 2, 0, -height / 2);
    line(-width / 2, 0, width / 2, 0);
}


function setup() {
    // 750, 750
    let dim = min(windowWidth, windowHeight);
    graph = createCanvas(Math.round(dim*0.75), Math.round(dim*0.75));
    graph.parent('graphContainer');
    button_eval = document.getElementById("eval_button");
    button_reset = document.getElementById("reset_button");
    button_show_shapes = document.getElementById("toggle_button");
    draw_speed = document.getElementById("draw_speed");

    // test_points = [[0, 150], [100, -100], [-100, -50], [0, 0]];
}

function draw() {
    background(0);
    translate(width / 2, height / 2);
    scale(1, -1);

    draw_axes();
    draw_points(curve_points);
    if (evaluated) {
        draw_path(path);
        draw_circles(fpoints);

        anim_frame += parseFloat(draw_speed.value);
        if (anim_frame > 360) {
            anim_frame -= 360;
            finished = true;
            path.push(path[0]);
        }
    }
}


function reset_all() {
    curve_points = [];
    evaluated = false;
    draw_speed.value = 0.5;
    anim_frame = 0;
    path = [];
    finished = false;
    show_shapes = true;
}

function mousePressed() {
    if (!evaluated) {
        if (mouseX > 0 & mouseX < width & mouseY > 0 & mouseY < height) {
            let x = map(mouseX, 0, width, -width / 2, width / 2);
            let y = map(mouseY, 0, height, height / 2, -height / 2);
            curve_points.push([x, y]);
        }
    }
}

function evaluate_curve() {
    if (!evaluated) {
        fpoints = evaluate_curve_points(curve_points);
        evaluated = true;
    }
}

function toggle_shapes() {
    show_shapes = !show_shapes;
}
