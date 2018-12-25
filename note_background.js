let n = function(nt) {

    let numNotes = 5;
    let notes = [];
    let trombone;
    let trumpet;
    let clarinet;
    let saxophone;
    let bassClef;
    let trebleClef;
    let halfNote;
    let quarterNote;
    let eighthNote;


    class Note {
        constructor(texture) {
            this.img = texture;

            let direction = nt.random() > 0.5 ? true : false;
            let x;
            let y = nt.random(0, nt.height/2);
            
            if (direction) {
                x = nt.random(-300, -100);
                this.angle = nt.random(-PI/4, PI/6);
            }

            else {
                x = nt.width + nt.random(100, 300);
                this.angle = nt.random(-3*PI/4, 5*PI/6);
            }

            this.r = nt.random(20, 50);
            this.pos = nt.createVector(x, y);
            this.vel = nt.createVector(2*nt.cos(this.angle), 2*nt.sin(this.angle));
            this.acc = nt.createVector(0, 0.007);
            this.rotSpeed = nt.random(-0.04, 0.04);
        }

        update() {
            this.vel.add(this.acc);
            this.vel.limit(this.r * 0.2);

            if (this.vel.mag() < 1) {
                this.vel.normalize();
            }

            this.pos.add(this.vel);
            this.angle += this.rotSpeed;

            if (this.pos.y > nt.height + this.r) {
                this.randomize();
            }
        }

        render() {
            nt.push();
            nt.translate(this.pos.x, this.pos.y);
            nt.rotate(this.angle);
            nt.imageMode(CENTER);
            nt.image(this.img, 0, 0, this.r * this.img.width/175, this.r * this.img.height/175);
            nt.pop();
        }

        randomize() {
            let direction = nt.random() > 0.5 ? true : false;
            let x;
            let y = nt.random(0, nt.height/2);
            
            if (direction) {
                x = nt.random(-200, -50);
                this.angle = nt.random(-PI/4, PI/6);
            }

            else {
                x = nt.width + nt.random(50, 200);
                this.angle = nt.random(-3*PI/4, 5*PI/6);
            }

            this.r = nt.random(30, 60);
            this.pos = nt.createVector(x, y);
            this.vel = nt.createVector(2 * nt.cos(this.angle), 2 * nt.sin(this.angle));
            this.acc = nt.createVector(0, 0.007);
            this.rotSpeed = nt.random(-0.04, 0.04);

            this.img = nt.random([trombone, trumpet, clarinet, saxophone, bassClef, trebleClef, halfNote, quarterNote, eighthNote]);
        }
    }


    nt.preload = function() {
        trombone = nt.loadImage('bone.png');
        trumpet = nt.loadImage('trumpet.png');
        clarinet = nt.loadImage('clarinet.png');
        saxophone = nt.loadImage('sax.png');
        bassClef = nt.loadImage('bass_clef.png');
        trebleClef = nt.loadImage('treble_clef.png');
        halfNote = nt.loadImage('half.png');
        quarterNote = nt.loadImage('quarter.png');
        eighthNote = nt.loadImage('eighth.png');
    }

    nt.setup = function() {
        nt.frameRate(50);
        nt.createCanvas(windowWidth, windowHeight*2);

        for (let i = 0; i < numNotes; i++) {
            let texture = nt.random([trombone, trumpet, clarinet, saxophone, bassClef, trebleClef, halfNote, quarterNote, eighthNote]);
            notes.push(new Note(texture));
        }
    }

    nt.draw = function() {
        nt.background(255);

        for (let i = 0; i < numNotes; i++) {
            notes[i].update();
            notes[i].render();
        }
    }
}