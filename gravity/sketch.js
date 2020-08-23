//P5 JS CONSTANTS
const FRAMERATE = 120;
const CANVAS_X = 1200;
const CANVAS_Y = 1200;
const FONTSIZE = 20;

//PHYSICS CONSTANTS
const G = 6.674*(10**-11);

//OTHER
var fillbuffer, strokebuffer, strokeweightbuffer;

function dTime(){
  return deltaTime/1000; 
}

var bodies = []
class Body{
  
  constructor(position, mass, radius, velocity = createVector(0,0),  colour = color(100, 149, 237)){
    this.position = position;
    this.mass = mass;
    this.velocity = velocity;
    this.radius = radius;
    this.colour = colour; // Cornflower blue
    bodies.push(this);
  }
  
  update(other){
    
    let gVelocity = p5.Vector.sub(other.position, this.position).setMag(forceToDSpeed(this.force(other), this));
    let gVelocityDraw = p5.Vector.mult(gVelocity, 20);
    this.velocity.add(gVelocity);
    this.position.add(this.trueVelocity());
    if(showinfo){
      drawArrow(this.position, gVelocityDraw, color(0, 0, 255));
      drawArrow(this.position, this.velocity, color(255, 0, 255));
    }

  }
  render(){
    fill(this.colour);
    noStroke();
    ellipse(this.position.x, this.position.y, this.radius);
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
  // RELATIONAL
  force(other){
    return forceBetween(this, other); 
  }
  distance(other){
    return distanceBetween(this, other);
  }
  
}


let showinfo = false;
function forceBetween(bodyA, bodyB){
  return G * ( ( bodyA.mass * bodyB.mass ) / distanceBetween( bodyA , bodyB ) );
}  

function forceToDSpeed(force, body){
  print(body.mass);
  return (force/body.mass);
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
  let b1 = new Body(createVector(300, 1100), 1, 25, createVector(-50, -30));
  let b2 = new Body(createVector(400, 800), 7000000000000, 90, createVector(10, -10), color(194,30,86));
}

function draw() {
 
  fill(fillbuffer);
  background(0);
  //for(let body of bodies) body.update();
  bodies[0].update(bodies[1]);
  bodies[1].update(bodies[0]);
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
function drawArrow(base, vec, myColor) {
  push();
  arrowVec = p5.Vector.mult(vec, 1);
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, arrowVec.x, arrowVec.y);
  rotate(vec.heading());
  let arrowSize = 7;
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
