class Peg {    
    constructor(spacing, i, r) {
        this.x = r * cos(spacing * i);
        this.y = r * sin(spacing * i);
        this.id = i;
    }
    
    display(c_x, c_y) {
        noStroke();
        fill(0);
        ellipse(c_x + this.x, c_y + this.y, 3, 3);
    }
}