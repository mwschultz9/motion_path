
class swarm {
    constructor(num, cx, cy) {
        this.centerX = cx;
        this.centerY = cy;
        this.poxX = cx;
        this.cycle = 0;
    }
    draw() {
        circle(this.posX, this.centerY, 5);
    }
    
    update() {
        this.posX = this.centerX + 40 * sin(this.cycle / (18*PI)); // 1 / sec, 60cycles per second
        this.cycle += 1;
    }


}

