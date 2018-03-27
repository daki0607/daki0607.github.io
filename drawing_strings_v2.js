let img;
let r;
let buffer = 55;
let num_pegs = 250;
let pegs = [];
let spacing;
let current;
let next;
let max_strings = 3000;
let strings_used = 0;


function get_score(peg1, peg2) {
    let x1 = peg1.x;
    let y1 = peg1.y;
    let x2 = peg2.x;
    let y2 = peg2.y;
    let score = 0;
    let steps = 500;

    if (x1 == x2 && y1 == y2) {
        return 0;
    }

    for (let t = 0; t < steps; t++) {
        let sx = round((x2 - x1)*t/steps + x1 + img.width/2);
        let sy = round((y2 - y1)*t/steps + y1 + img.height/2);

        if (sx < img.width && sx > 0 && sy < img.height && sy > 0) {
            let color = img.get(sx, sy);
            let red_val = color[0];

            score += 255 - red_val;
        }
    }

    return score;
}

function get_next(current) {
    let best_score = 0;
    let best_ind = 0;

    for (let i = 0; i < pegs.length; i++) {
        let score = get_score(current, pegs[i]);
        if (score > best_score) {
            best_score = score;
            best_ind = i;
        }
    }

    return pegs[best_ind];
}

function draw_string(peg1, peg2) {
    let x1 = peg1.x;
    let y1 = peg1.y;
    let x2 = peg2.x;
    let y2 = peg2.y;
    let steps = 500;

    for (let t = 0; t < steps; t++) {
        let sx = round((x2 - x1)*t/steps + x1 + img.width/2);
        let sy = round((y2 - y1)*t/steps + y1 + img.height/2);

        if (sx < img.width && sx > 0 && sy < img.height && sy > 0) {
            let color = img.get(sx, sy);
            let red_val = color[0];
            if (red_val > 255) {
                red_val += 15;
            }
            img.set(sx, sy, red_val);
        }
    }
    img.updatePixels();

    stroke(0, 0, 0, 15);
    strokeWeight(1);
    line(x1 + width*3/4, y1 + height/2, x2 + width*3/4, y2 + height/2);
}


function preload() {
    // generate the canvas based on the size of the image
    img = loadImage("face2.png");
}

function setup() {
    createCanvas(img.width*4, img.height*2);
    background(255);
    spacing = TWO_PI / num_pegs;
    r = (img.width + buffer) / 2;

    for (let i = 0; i < num_pegs; i++) {
        pegs.push(new Peg(spacing, i, r));
    }

    current = pegs[0];
}

function draw() {
    image(img, (width/2 - img.width) / 2, (height - img.height) / 2);

    for (p of pegs) {
        p.display(width/4, height/2);
        p.display(width*3/4, height/2);
    }

    next = get_next(current);

    if (strings_used < max_strings || current != next) {
        draw_string(current, next);

        current = next;
        strings_used++;
    }
}
