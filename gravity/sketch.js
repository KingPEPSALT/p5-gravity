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

var bodies = []
class Body{
  
  constructor(position, mass, diameter, velocity = createVector(0,0),  colour = color(100, 149, 237)){
    this.position = position;
    this.mass = mass;
    this.velocity = velocity;
    this.radius = diameter/2;
    this.colour = colour; // Cornflower blue
    bodies.push(this);
  }
    
  update(){
    let accelerationsActing = []
    for(let body of bodies){
      let gAcceleration = p5.Vector.sub(body.position, this.position).setMag((forceBetween(this, body)/this.mass));
      this.velocity.add(gAcceleration);
      accelerationsActing.push(gAcceleration);
    }
    this.position.add(this.trueVelocity());
    if(showinfo){
      for(let a of accelerationsActing){
        if(a != undefined) drawArrow(this.position, p5.Vector.mult(a,10), color(0, 0, 255), this.radius);
      }
      drawArrow(this.position, this.velocity, color(255, 0, 255), this.radius);
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


function forceBetween(bodyA, bodyB){
  return G * ( ( bodyA.mass * bodyB.mass ) / distanceBetween( bodyA , bodyB ) );
}  

function distanceBetween(bodyA, bodyB){
   return p5.Vector.mag(p5.Vector.sub(bodyA.position, bodyB.position));
}
  
function setup() {
  fillbuffer = color(255, 255, 255);
  strokebuffer = color(255, 255, 255);
  strokeweightbuffer = 4;
  
  createCanvas(CANVAS_X, CANVAS_Y);
  frameRate(FRAMERATE);
  textFont('Courier New');
  textSize(FONTSIZE);
  let b1 = new Body(createVector(300, 1100), 4000000, 25, createVector(-50, -30));
  let b2 = new Body(createVector(400, 800), 6000000000000, 90, createVector(10, -10), color(255,255,0));
  let b3 = new Body(createVector(600, 1200),5000000, 40, createVector(50, -40), color(188, 42, 58));

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
      text('SPEED OF BODY ' + i + ': ' + body.speed().toFixed(2) + ' p/s', 20, 20+(i*FONTSIZE));
      i++;
    }
    text('   ELAPSED TIME: ' + (millis()/1000).toFixed(0), 20, 20+(i*FONTSIZE));
    i++;
    text('            FPS: ' + (dTime()**-1).toFixed(0), 20, 20+(i*FONTSIZE));
    stroke(strokebuffer);
    strokeWeight(strokeweightbuffer);
  }
  
}
function drawArrow(base, vec, col, min) {
  push();
  let arrowSize = 7;
  let arrowVec = vec;
  stroke(col);
  strokeWeight(3);
  fill(col);
  translate(base.x, base.y);
  if(arrowVec.mag() < (min+arrowSize)) arrowVec.setMag(min+arrowSize);
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
