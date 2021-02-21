

class pMovement {
    constructor(mtype, px, py, direction, tx, ty, maxx, maxy){
        this.mtype = mtype; // movement type 1, 2
        this.cycle = 0;
        this.position = createVector(px, py);
        this.startPos = this.position.copy();
        this.target = createVector(tx, ty); 
        console.log("target", this.target);
        this.vy = 3;
        this.maxx = maxx;
        this.maxy = maxy;
        this.active = true;
        this.direction = direction;


        this.velocity = createVector(0,this.vy); // px / ms
        this.accr = createVector(0.05,0);
        this.accl = createVector(-0.05,0);

        this.accx = createVector(0,0); // x acceleration
        
        this.atarget = createVector(0,0);

        this.poslst = []; // list of positions for curve visualization

        this.movementType = 1;

        this.dt = 0;
        this.ax = 0;
        this.vx = 0;
        this.targetX = 0;

    }

    // update der position - 1 zyklus weiterrechnen
    update() {
        if (this.mtype == 1) {
            this.movement1();
        }
        if (this.mtype == 2) {
            this.movement2();
        }
        if (this.mtype == 3) {
            this.movement3();
        }
        if (this.mtype == 4) {
            this.movement4();
        }
        if (this.mtype == 5) {
            this.movement5();
        }
    
    
    

    }


//   def ypos(t, vy):
//   return(t*vy)

// def xpos(t, vy, dy, w):
//   return(easeInOutQuad(ypos(t, vy) / dy) * w)

    easeInOutQuad(x) {
        return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
    }

    //
    // movement via easing function
    // 
    movement5() {
        if (!this.active) return;

        let dy = ( this.target.y - this.startPos.y); // total y distance to target
        let py = (this.position.y - this.startPos.y); // current y position relative to start (for easing)
        let w = (this.target.x - this.startPos.x); // x distance to target

        // calculate y position as vy * cycle (vy is in pixels per cycle)
        this.position.y = this.startPos.y + (this.vy * this.cycle);
        // calculate x as distance * output of easing function(py / dy) relative position mapped to range 0,1
        this.position.x = this.startPos.x + (w * this.easeInOutQuad(py / dy ));
        console.log("y:", this.position.y, "py:", py, (py/dy));
        // rechts links logik einbauen, dann fertig :)
        this.poslst.push(this.position.copy());
        this.cycle++;
        if (this.position.y > this.maxy) this.active = false;

    }


    // einfacher bogen zur anderen seite, symmetrisch - abwurf von geschossen
    movement4() {
        if (!this.active) return;

        // einfacher bogen zur anderen seite
        // strecke wird in zwei abschnitte geteilt

        // noch in die klasse stecken, sonst gehen die werte verloren...

        if (this.cycle == 0) { 
            if (this.position.x < (this.maxx / 2)) {
                this.targetX = this.maxx - 5; // Math.round(random(0,20));
            } else {
                this.targetX = 5;
            }
            console.log("target:", this.targetX);
            // am anfang berechnen
            // anzahl cycles um mittelpunkt zwischen y pos und base zu ereichen
            this.dt = Math.round(0.5 * (this.target.y - this.position.y) / this.vy); 
            this.ax = 2*(0.5*(this.targetX- this.position.x)) / (this.dt*this.dt);
            // console.log("dt:", this.dt)
            // console.log("ax:", this.ax)
            this.accx.x = this.ax; 
            // zielkoordinate x bestimmen, es soll immer der ganze screen überquert werden
            // d.h. start links: target = rechts und umgekehrt

        }
        if (this.cycle == this.dt) { // erster punkt erreicht, acceleration drehen
            this.ax = 2*(this.targetX - this.position.x - this.velocity.x*this.dt) / (this.dt*this.dt);
            console.log("cycle == dt", this.cycle);
            console.log("ax:", this.ax);
            
            this.accx.x = this.ax;
        }


        // evtl. noch start-cycle einbauen, dadurch verschiebt sich dann alles etwas
        // mitte anvisieren (+- zufall)
        // if (this.cycle < (2*this.dt)) {
            this.velocity.add(this.accx);

            // this.position.x = x0+... cycle*this.cycle
        // }
        //     // ax neu berechnen, links oder rechts
        //     // in diesem fall symmetrische bewegung, d.h. die umgekehrte beschleunigung wird verwendet
        //     ax = (400 - this.position.x) / (dt*dt);
        // }
                

        // immer gleich, position ausrechnen
        this.position.add(this.velocity);
        this.poslst.push(this.position.copy());
        this.cycle++;
        if (this.position.y > this.maxy) this.active = false;
        

    }


    // einfache bewegung
    movement2() {
        if (!this.active) return;

        if (this.cycle < 50) {
            this.velocity.add(this.accr);
        }
        if (this.cycle >= 50 && this.cycle < 100) {
            this.velocity.add(this.accl);
        }
        this.position.add(this.velocity);
        this.poslst.push(this.position.copy());
        this.cycle++;
        if (this.position.y > this.maxy) this.active = false;

    }

    // weite kurve nach rechts / links
    // weite: 1*1/2*(100^2)*0.05 = 500 px
    // 200 zeiteinheiten / cycle = 200 * this.vy = 600 px
    // zeit ergibt sich aus abstand zur baseline auf der sich das schiff befindet
    // cycles = (startpos - baseline) / vy

    // ich könnte ax so errechnen das immer eine komplette kurve herauskommt, d.h. am ende senkrechte
    // bewegung, 
    movement3() {
        if (!this.active) return;

        if (this.cycle < 100) {
            this.velocity.add(this.accr);
        }
        if (this.cycle >= 100 && this.cycle < 200) {
            this.velocity.add(this.accl);
        }
        this.position.add(this.velocity);
        this.poslst.push(this.position.copy());
        this.cycle++;
        if (this.position.y > this.maxy) this.active = false;

    }

    // sinus bewegung...


    drawLines() {
        line(0, this.startPos.y, this.maxx, this.startPos.y);
        line(0, this.startPos.y+50*this.vy, this.maxx, this.startPos.y+50*this.vy);
        line(0,this.startPos.y+100*this.vy, this.maxx, this.startPos.y+100*this.vy);
        
        //drawArrow(createVector(400, this.startPos.y+80), createVector(30,0), 'black');

    }


    // movement 1: half circle + accelerated targeting
    movement1() {
        if (!this.active) return;

        if (this.cycle < 50) {
            // circle motion
            this.position = this.getCpoint(50-1, this.cycle, this.startPos, 50, this.direction);
        }


        if (this.cycle >= 50 && this.cycle < 100) {
            this.velocity.add(this.accr);
            this.position.add(this.velocity);
            // beschleunigung ausrechnen um target zu treffen
            // dann setzen
        }
        if (this.cycle == 100) { // calculate acceleration to reach target at 100
            let dt = (700 - this.position.y) / this.vy; // time to y ship position
            let dx = this.target.x - this.position.x;
            let vx = this.velocity.x;
            let ax = 2*(dx-vx*dt) / (dt*dt);
            console.log("x:", this.position.x, "tx:", this.target.x, "dt:", dt, " dx:", dx, "ax:", ax);
            this.atarget = createVector(ax,0);
            // this.velocity.x = 0;
        }
        if (this.cycle >= 100) {
            this.velocity.add(this.atarget);
            this.position.add(this.velocity);
            // console.log(this.cycle, this.position.x, this.position.y);
            // beschleunigung ausrechnen um target zu treffen
            // dann setzen
        }
        this.poslst.push(this.position.copy());

        
        this.cycle++;
        if (this.position.y > this.maxy) this.active = false;

    }



    draw() {
        // if (this.active) {
            let cnt = 0;
            let n = this.poslst.length;
            this.poslst.forEach(el =>{
                // fill(color((cnt/n)*255, (cnt/n)*255, (cnt/n)*255));
                color = map(cnt, 0, n, 0, 360);
                fill(color,360,360);

                circle(el.x, el.y, 4);
                cnt += 1;
            


            });
        // todo, noch richtige beschleunigung einzeichnen
        // drawArrow(createVector(this.position.x, this.position.y), createVector(30,0), 'white');

//            circle(this.position.x, this.position.y, 5);


// ellipse(this.position.x, this.position.y, 3, 3);
        // }
        // zeichnen des objekts
    }

    // direction:1 initial turn to left
    // direction: -1: initial turn to right
    // length in pixels: pi*r = 157 -> 50 steps: 3.14 px per cycle
    // ermittle punkt auf kreis - für kreissegment, bzw. halbkreisförmige pfade
    // current Pos eingeben - center kommt zurück
    // pfad, erste n schritte: -> getCpoint, danach ausrechnen
    // richtung einbauen, also über radius +-
    getCpoint(steps,curstep, spos, radius, direction) {
        let rvec;
        if (direction == 1) {
            rvec = createVector(radius,0); // rvec - to calc circle position
        } else {
            rvec = createVector(-radius,0); // rvec - to calc circle position
        }
        let centerVec = p5.Vector.add(spos, rvec);
        let rotAngle = PI - (curstep * (PI/steps));
        if (direction == 1) {
            rvec.rotate(-rotAngle);
        } else {
            rvec.rotate(rotAngle);
        }             
        
        let cpos = p5.Vector.add(centerVec, rvec);
        return(cpos);
    } 
  


}


function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }


