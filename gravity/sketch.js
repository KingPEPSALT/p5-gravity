//P5 JS CONSTANTS
const FRAMERATE = 60;
const CANVAS_X = 1200;
const CANVAS_Y = 1200;
const FONTSIZE = 20;
let showinfo = true;

//PHYSICS CONSTANTS
const G = 6.674*(10**-11);

//OTHER
var fillbuffer, strokebuffer, strokeweightbuffer;

function dTime(){
  return deltaTime/1000; 
}

function forceBetween(bodyA, bodyB){
  return G * ( ( bodyA.mass * bodyB.mass ) / distanceBetween( bodyA , bodyB ) );
}  

function distanceBetween(bodyA, bodyB){
   return p5.Vector.mag(p5.Vector.sub(bodyA.position, bodyB.position));
}

var bodies = []
class Body{
  
  constructor(position, mass, diameter, velocity, colour, name, mincutoff = false){
    this.position = position;
    this.mass = mass;
    this.velocity = velocity;
    if(name === "SUN  "){
      print(velocity.mag()); 
    }
    this.radius = diameter/2;
    this.colour = colour;
    this.name = name
    this.mincutoff = mincutoff;
    bodies.push(this);
  }
    
  update(){
    let accelerationsActing = []
    for(let body of bodies){
      let gAcceleration = p5.Vector.sub(body.position, this.position).setMag((forceBetween(this, body)/this.mass));
      this.velocity.add(gAcceleration);
      if(this.name === "SUN  ") print(this.velocity.mag());
      accelerationsActing.push(gAcceleration);
    }
    this.position.add(this.trueVelocity());
    if(showinfo){
      for(let a of accelerationsActing){
        if(a != undefined) drawArrow(this.position, a, color(0, 0, 255), this.radius);
      }
      drawArrow(this.position, this.trueVelocity(), color(255, 0, 255), this.radius, this.mincutoff);
    }

  }
  render(){
    fill(this.colour);
    noStroke();
    ellipse(this.position.x, this.position.y, this.radius*2);
    fill(fillbuffer);
    stroke(strokebuffer);
    strokeWeight(strokeweightbuffer);
    
  }
  
  // PROPERTIES
  
  // base velocity properties
  direction(){
    return this.velocity.normalize();
  }
  speed(){
    return this.velocity.mag(); // in Pixels per second
  }
  // velocity properties after delta time adjustment
  trueVelocity(){
    return p5.Vector.mult(this.velocity, dTime()); 
  }
  trueSpeed(){
    return this.trueVelocity().mag(); // in Pixels per frame
  }
  
}

  
function setup() {
  fillbuffer = color(255, 255, 255);
  strokebuffer = color(255, 255, 255);
  strokeweightbuffer = 4;
  
  createCanvas(CANVAS_X, CANVAS_Y);
  frameRate(FRAMERATE);
  textFont('Courier New');
  textSize(FONTSIZE);
  let earth = new Body(createVector(300, 1100), 4000000, 25, createVector(-100, -30), color(0, 159, 225), "EARTH");
  let sun = new Body(createVector(600, 600), 6000000000000, 90, createVector(0,0), color(255,255,0), "SUN  ", true);
  let mars = new Body(createVector(800, 1200), 5000000, 40, createVector(50, -40), color(188, 42, 58), "MARS ");
  let jack = new Body(createVector(400, 200), 7000000, 55, createVector(80, 30), color(105, 105, 105), "JACK ");  
}

function draw() {
 
  fill(fillbuffer);
  background(0);
  for(let body of bodies) body.update();
  for(let body of bodies) body.render();
  
  let i = 1;
  if(showinfo){
    noStroke();
    for(let body of bodies){
      text('SPEED OF ' + body.name + ': ' + body.speed().toFixed(2) + ' p/s', 20, 20+(i*FONTSIZE));
      i++;
    }
    text('   ELAPSED TIME: ' + (millis()/1000).toFixed(0), 20, 20+(i*FONTSIZE));
    i++;
    text('            FPS: ' + (dTime()**-1).toFixed(0), 20, 20+(i*FONTSIZE));
    stroke(strokebuffer);
    strokeWeight(strokeweightbuffer);
  }
  
}
function drawArrow(base, vec, col, min, mincutoff = false) {
  push();
  let arrowSize = 10;
  let arrowVec = vec.copy();
  arrowVec.mult(30);
  stroke(col);
  strokeWeight(3);
  fill(col);
  translate(base.x, base.y);

  // minimum formatting work
  let conditional = arrowVec.mag() < (min+arrowSize);
  if(mincutoff) conditional = conditional && (arrowVec.mag() > 1);
  if(conditional) arrowVec.setMag(min+arrowSize);

  line(0, 0, arrowVec.x, arrowVec.y);
  rotate(vec.heading());
  translate(arrowVec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
  fill(fillbuffer);
  stroke(strokebuffer);
  strokeWeight(strokeweightbuffer);
}

function keyPressed(){
  if(keyCode == 72) showinfo = !showinfo; 
}
