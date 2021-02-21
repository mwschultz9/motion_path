
// gui params
var t1 = 25;
var delta1 = 0.01;
// set angle range and step with magic variables
var delta1Max = 1;
var delta1Step = 0.005;





var playerShip = 400;
var playerShipMax = 700;
var playerShipStep = 1;

var direction = ['left', 'right'];
var clearscreen = [true, false];

// gui
var visible = true;
var gui, gui2;

let movers = [];
let pathType = 2;
let swarm1;

function setup() {
  colorMode(HSB, 360);


  
//  createCanvas(windowWidth, windowHeight);
  createCanvas(800, 800); 
  swarm1 = new swarm(10, 400, 200);

  // Calculate big radius
  bigRadius = height / 3.0;

  // Create Layout GUI


  // movers.push(new pMovement(2, 500,150, this.direction, playerShip, 700, 800, 800));

//  movers.push(new pMovement(1, 400,150, this.direction, playerShip, 700, 800, 800));

  // Don't loop automatically
	// ??
  // noLoop();


  drawBackGrnd();

  
}

function drawBackGrnd() {
  background('#0f0f0f');
  for(i = 0; i < 800 / 40; i++) {
    stroke('rgba(255,255,255,0.04)');
    line(0,i*40,800,i*40);
    line(i*40,0, i*40, 800);
  }

}


function draw() {
  // if (clearscreen) clear();
  drawBackGrnd();
  fill(255);
  // fill(0, 102, 153);
  let pathTxt = pathType;
  if (pathType == 5) pathTxt = "quadratic easing";

  text("dive path test tool", 10, 40)
  text('path: '+pathTxt, 10, 60);  
  text('s to start a new dive', 10, 80);  


  for (let p of movers) {
    p.update(); 
    p.draw(); 
    // p.drawLines();
  }
  

  fill("white");
  triangle(mouseX-8, mouseY, mouseX+8, mouseY, mouseX, mouseY+10);

  swarm1.update();
  // swarm1.draw();

  fill("white");
  triangle(playerShip-8, 700, playerShip +8, 700, playerShip, 690);

}


// check for keyboard events
function keyPressed() {
  switch(key) {
    // type [F1] to hide / show the GUI
    case 'a':
      playerShip = 100;
      break;
    case 'b':
      playerShip = 400;
      break;
    case 'c':
      playerShip = 700;
      break;
    case '-':
      playerShip -= 5;
      break;
    case '1':
      pathType = 1;
      break;
    case '2':
      pathType = 2;
      break;
    case '3':
      pathType = 3;
      break;
    case '4':
      pathType = 4;
      break;
    case '5':
      pathType = 5;
      break;
    case 'c':
      clear();
      break;
    case 'p':
      visible = !visible;
      if(visible) gui.show(); else gui.hide();
      break;
    case 's':
      if (direction == "left") {
        movers.push(new pMovement(pathType,mouseX,mouseY, 1, playerShip, 700, 800, 800));
      } else {
        movers.push(new pMovement(pathType,mouseX,mouseY, -1, playerShip, 700, 800, 800));
      }
      break;
      // constructor(mtype, px, py, direction, tx, ty, maxx, maxy){

  }
}
// function mousePressed() {
//   movers.push(new pMovement(mouseX,mouseY, this.direction, playerShip, 700, 800));

//   rect(mouseX, mouseY, 5, 5);
//   // prevent default
//   return false;
// }

// draw a regular n-gon with n sides
function ngon(n, x, y, d) {
  beginShape();
  for(var i = 0; i < n; i++) {
    var angle = TWO_PI / n * i;
    var px = x + sin(angle) * d / 2;
    var py = y - cos(angle) * d / 2;
    vertex(px, py);
  }
  endShape(CLOSE);
}


// draw a regular n-pointed star
function star(n, x, y, d1, d2) {
  beginShape();
  for(var i = 0; i < 2 * n; i++) {
    var d = (i % 2 === 1) ? d1 : d2;
    var angle = PI / n * i;
    var px = x + sin(angle) * d / 2;
    var py = y - cos(angle) * d / 2;
    vertex(px, py);
  }
  endShape(CLOSE);
}
