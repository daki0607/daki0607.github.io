let c = function(crv) {

    let num_peeps = 40;
    let peeps = [];
    let cones = [];
    let start_markers = [];
    let end_markers = [];
    let padding = 30;
    let spacing = 30;
    let added = false;
    let start;

    class Cone {
        constructor(x, y) {
            this.pos = crv.createVector(x, y);
            this.active = false;
        }

        move() {
            this.pos.y = crv.mouseY;
        }

        render() {
            crv.noStroke();
            crv.fill(255, 115, 35);
            crv.ellipse(this.pos.x, this.pos.y, 15, 15);
        }
    }

    class Peep {
        constructor(ind, x, y) {
            this.order = ind;
            this.pos = crv.createVector(x, y);
            this.t = 0;
        }

        render() {
            crv.noStroke();
            crv.fill(255, 200, 0);
            crv.ellipse(this.pos.x, this.pos.y, 15, 15);
        }

        move() {
            if (this.pos.x >= 100 && this.pos.y <= 400) {
                let startX = start_markers[this.order].x;
                let startY = start_markers[this.order].y;
                let endX = end_markers[this.order].x;
                let endY = end_markers[this.order].y;

                let newX = cones[0].pos.x + (startX - cones[0].pos.x) * crv.cos(this.t);
                let newY = cones[0].pos.y + (endY - cones[0].pos.y) * crv.sin(this.t);

                this.pos.x = newX;
                this.pos.y = newY;
                this.t += 0.005;
            }
            if (this.pos.y > 400 && this.pos.x > 100) {
                this.pos.y--;
            }
            if (this.pos.y < 400 && this.pos.x < 100) {
                this.pos.x--;
            }
        }
    }

    function addPeeps() {
        for (let p = 0; p < num_peeps; p++) {
            let x = start_markers[p % 5].x;
            let y = crv.floor(p / 5) * spacing + 550;
            peeps.push(new Peep(p % 5, x, y));
        }
    }

    crv.setup = function() {
        crv.createCanvas(500, 500);

        cones.push(new Cone(100, 400)); // Bottom left
        cones.push(new Cone(400, 400)); // Bottom right
        cones.push(new Cone(100, 100)); // Top left

        for (let i = 0; i < 5; i++) {
            start_posX = crv.lerp(cones[0].pos.x + padding, cones[1].pos.x - padding, i / 4);
            start_posY = 400;
            
            start_markers.push(crv.createVector(start_posX, start_posY));
        }

        start = crv.millis();
    }

    crv.draw = function() {
        crv.background(0);

        for (let i = 0; i < 3; i++) {
            cones[i].render();
        }

        for (let j = 0; j < 5; j++) {
            end_posY = crv.lerp(cones[0].pos.y - padding, cones[2].pos.y + padding, j / 4);
            end_posX = cones[0].pos.x;

            end_markers[j] = crv.createVector(end_posX, end_posY);
        }

        if (peeps.length > 0) {
            for (let p = 0; p < num_peeps; p++) {
                peeps[p].move();
                peeps[p].render();
            }
        }

        if (crv.millis() - start >= 4000) {
            if (!added) {
                addPeeps();
                added = true;
            }
        }
    }

    crv.touchStarted = function() {
        if (crv.dist(cones[2].pos.x, cones[2].pos.y, crv.mouseX, crv.mouseY) < 10) {
            cones[2].active = true;
        }
        else {
            cones[2].active = false;
        }
        return false;
    }

    crv.touchMoved = function() {
        if (cones[2].active) {
            cones[2].move();
        }
        return false;
    }
}

let yourp5 = new p5(c, "curved");