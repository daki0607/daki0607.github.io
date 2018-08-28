let s = function(str) {
        
    let numPeeps = 40;
    let peeps = [];
    let cones = [];
    let startMarkers = [];
    let endMarkers = [];
    let padding = 35;
    let spacing = 30;
    let straightButton;

    class Cone {
        constructor(x, y) {
            this.pos = str.createVector(x, y);
            this.active = false;
        }

        move() {
            this.pos.x = str.mouseX;
            this.pos.y = str.mouseY;
        }

        render() {
            str.noStroke();
            str.fill(255, 69, 0);
            str.ellipse(this.pos.x, this.pos.y, 25, 25);
            str.fill(255, 255, 255);
            str.ellipse(this.pos.x, this.pos.y, 18, 18);
            str.fill(255, 69, 0);
            str.ellipse(this.pos.x, this.pos.y, 15, 15);
            str.fill(255, 255, 255);
            str.ellipse(this.pos.x, this.pos.y, 10, 10);
            str.fill(255, 69, 0);
            str.ellipse(this.pos.x, this.pos.y, 7, 7);
        }
    }

    class Peep {
        constructor(ind, x, y) {
            this.order = ind;
            this.pos = str.createVector(x, y);
        }

        render() {
            str.noStroke();
            str.fill(255, 255, 0);
            str.ellipse(this.pos.x, this.pos.y, 15, 15);
        }

        move() {
            this.pos.y--;
            if (this.pos.y < cones[0].pos.y && this.pos.y > cones[2].pos.y) {
                this.pos.x += (endMarkers[this.order].x - startMarkers[this.order].x) / (startMarkers[this.order].y - endMarkers[this.order].y);
            }
        }
    }

    function add_peeps() {
        for (let p = 0; p < numPeeps; p++) {
            let x = startMarkers[p % 5].x;
            let y = str.floor(p / 5) * spacing + 550;
            peeps.push(new Peep(p % 5, x, y));
        }
    }

    str.setup = function() {
        str.createCanvas(500, 500);

        cones.push(new Cone(100, 400)); // Bottom left
        cones.push(new Cone(400, 400)); // Bottom right
        cones.push(new Cone(100, 100)); // Top left
        cones.push(new Cone(400, 100)); // Top right

        straightButton = createButton('March!');
        straightButton.parent("straight-button");
        straightButton.mousePressed(add_peeps);

        for (let i = 0; i < 5; i++) {
            start_posX = str.lerp(cones[0].pos.x + padding, cones[1].pos.x - padding, i / 4);
            start_posY = 400;
            
            startMarkers.push(str.createVector(start_posX, start_posY));
        }
    }

    str.draw = function() {
        str.background(0);

        for (let i = 0; i < 4; i++) {
            cones[i].render();
        }

        for (let j = 0; j < 5; j++) {
            end_posX = str.lerp(cones[2].pos.x + padding, cones[3].pos.x - padding, j / 4);
            end_posY = cones[2].pos.y;

            endMarkers[j] = str.createVector(end_posX, end_posY);
        }

        if (peeps.length > 0) {
            for (let p = 0; p < numPeeps; p++) {
                peeps[p].move();
                peeps[p].render();
            }
        }
    }

    str.touchStarted = function() {
        for (let i = 2; i < 4; i++) {
            if (str.dist(cones[i].pos.x, cones[i].pos.y, str.mouseX, str.mouseY) < 10) {
                cones[i].active = true;
            }
            else {
                cones[i].active = false;
            }
        }
        return false;
    }

    str.touchMoved = function() {
        for (let i = 2; i < 4; i++) {
            if (cones[i].active) {
                cones[i].move();
                cones[2].pos.y = cones[i].pos.y;
                cones[3].pos.y = cones[i].pos.y;
            }
        }
        return false;
    }

    /*
    function keyPressed() {
        if (keyCode == 32) {
            if (!added) {
                addPeeps();
                added = true;
            }
        }
        return false;
    }
    */
}

let myp5 = new p5(s, "straight");
