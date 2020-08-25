//P5 JS CONSTANTS
const FRAMERATE = 60;
const CANVAS_X = 1200;
const CANVAS_Y = 1200;
const FONTSIZE = 20;
let showinfo = false;
let showtrails = false;
let creatingBody = false;
//PHYSICS CONSTANTS
const G = 6.674*(10**-11);

//OTHER
var fillbuffer, strokebuffer, strokeweightbuffer;
var trailPoints;

function dTime(){
  return deltaTime/1000; 
}

function forceBetween(bodyA, bodyB){
  return G * ( ( bodyA.mass * bodyB.mass ) / distanceBetween( bodyA.position , bodyB.position ) );
}  

function distanceBetween(veca, vecb){
   return p5.Vector.mag(p5.Vector.sub(veca, vecb));
}

let bodies = []
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
    this.trail = [];
    this.selected = false;
    this.addedForce = [];
    
    bodies.push(this);
  }
    
  update(){
    let accelerationsActing = [];
    let resultantAdded = createVector(0,0);
    for(let accel of this.addedForce) resultantAdded.add(accel);
    this.addedForce = [];
    for(let body of bodies){
      let gAcceleration = p5.Vector.sub(body.position, this.position).setMag((forceBetween(this, body)/this.mass));
      this.velocity.add(gAcceleration);
      if(this.name === "SUN  ") print(this.velocity.mag());
      accelerationsActing.push(gAcceleration);
    }
    this.velocity.add(resultantAdded);
    this.position.add(this.trueVelocity());
    if(showinfo){
      for(let a of accelerationsActing){
        if(a != undefined) drawArrow(this.position, a, color(0, 0, 255), this.radius);
      }
      drawArrow(this.position, this.trueVelocity(), color(255, 0, 255), this.radius, this.mincutoff);
    }
    if(!showtrails){ this.trail = []; trailPoints = 0; }
    else {this.trail.push(this.position.copy()); trailPoints++;}
    if(this.trail.length > 400){ this.trail.shift(); trailPoints--; }
  }
  render(){
    fill(this.colour);
    stroke(this.colour);
    strokeWeight(2);
    if(showtrails) for(let t of this.trail) point(t.x, t.y);
    strokeWeight(7);
    stroke(color(255));
    if(!this.mouseInside()) noStroke();
    ellipse(this.position.x, this.position.y, this.radius);
    fill(fillbuffer);
    stroke(strokebuffer);
    strokeWeight(strokeweightbuffer);
    
  }
  addForce(force){
    this.addedForce.push(p5.Vector.div(force, this.mass));
  }
  mouseInside(){
    return !(distanceBetween(createVector(mouseX, mouseY), this.position) > this.radius/2);
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
  trailPoints = 0;
  createCanvas(CANVAS_X, CANVAS_Y);
  frameRate(FRAMERATE);
  textFont('Courier New');
  textSize(FONTSIZE);
  let earth = new Body(createVector(300, 1100), 4000000, 50, createVector(-100, -30), color(26, 188, 156), "EARTH");
  let sun = new Body(createVector(600, 600), 6000000000000, 180, createVector(0,0), color(255,255,0), "SUN", true);
  let mars = new Body(createVector(800, 1200), 5000000, 80, createVector(50, -40), color(188, 42, 58), "MARS");
  let jack = new Body(createVector(400, 200), 7000000, 110, createVector(80, 30), color(105, 105, 105), "JACK");
  let kashiyuka = new Body(createVector(200, 200), 6000000, 94, createVector(100, 20), color(0, 197, 255), "KASHIYUKA");
}

function draw() {
 
  fill(fillbuffer);
  background(0);
  let i = 1;
  for(let body of bodies){ body.update(); body.render(); }
  
  if(showinfo){
    noStroke();
    for(let body of bodies){
      text('SPEED OF ' + body.name + ': ' + body.speed().toFixed(2) + ' p/s', 20, 20+(i*FONTSIZE));
      i++;
    }
    text('ELAPSED TIME:' + (millis()/1000).toFixed(0), 20, 20+(i*FONTSIZE));
    i++;
    text('FPS: ' + (dTime()**-1).toFixed(0), 20, 20+(i*FONTSIZE));
    i++;
    if(showtrails){
      text('TRAIL POINTS: ' + trailPoints, 20, 20+(i*FONTSIZE));
      i++;
    }
    stroke(strokebuffer);
    strokeWeight(strokeweightbuffer);
  }
  if(creatingBody){
    diameter += deltaTime;
    fill(colour);

    ellipse(mouseX, mouseY, diameter/2);
    fill(fillbuffer);
  }
  if(selected){
    stroke(255, 0, 0);
    strokeWeight(4);
    line(bodyActedUpon.position.x, bodyActedUpon.position.y, mouseX, mouseY);
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
  let conditional = (arrowVec.mag() < (min+arrowSize)) && (arrowVec.mag() > 0);
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
  if(keyCode == 84) showtrails = !showtrails;
}

var diameter;
var colour;
var bodyActedUpon;
var selected;
function mousePressed(){
  selected = false;
  for(let body of bodies){
    if(body.mouseInside()){
      bodyActedUpon = body;
      original = body.position.copy();
      selected = true;
      break;
    }
  }
  if(!creatingBody){
    creatingBody = !selected;
    diameter = 0;
    colour = color(random(0, 255), random(0, 255), random(255));
  }
  
  
}
function mouseReleased(){
  creatingBody = false;
  
  if(!selected) new Body(createVector(mouseX, mouseY), diameter*127272.727, diameter, createVector(0,0), colour, "CLICKED");
  else {
    let dist = p5.Vector.mult(p5.Vector.sub(bodyActedUpon.position, createVector(mouseX, mouseY)));
    bodyActedUpon.addForce(p5.Vector.mult(dist, bodyActedUpon.mass/2));
  }
  selected = false;
}