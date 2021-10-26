//P5 JS CONSTANTS
const FRAMERATE = 60;
const FONTSIZE = 20;
const TRAIL_LENGTH_CAP = 500;

let show_info_mode = false;
let show_trail_mode = false;
let body_being_generated = false;
//PHYSICS CONSTANTS
const G = 6.674*(10**-11);
//OTHER
var default_fill, default_stroke, default_stroke_weight;
var total_trail_particles;

function dTime(){
  return deltaTime/1000; 
}

function forceBetween(bodyA, bodyB){
  return G * ( ( bodyA.mass * bodyB.mass ) / distanceBetween( bodyA.position , bodyB.position )**2 );

}  
function directionTo(bodyA, bodyB){
  return p5.Vector.sub(bodyB.position, bodyA.position).normalize();
}
function distanceBetween(veca, vecb){
   return p5.Vector.mag(p5.Vector.sub(veca, vecb));
}

let bodies = []

class Body{
  
  constructor(position, mass, radius, velocity, colour, name, mincutoff = false){
    this.position = position;
    this.mass = mass;
    this.velocity = velocity;
    this.radius = radius;
    this.colour = colour;
    this.name = name
    this.mincutoff = mincutoff;
    this.trail = [];
    this.selected = false;
    this.acting_forces = [];
    bodies.push(this);
    bodies.sort((a, b)=>b.mass-a.mass); // will be removed if collision detection added
  }
  
  apply_force(vector_force){
    this.velocity.add(p5.Vector.div(vector_force, this.mass)); 
  }
  update_position(){
    this.position.add(this.deltaTimeVelocity());
  }
  update(){
    let resultant_force = createVector(0,0);
    for(let body of bodies){
      if(body == this) continue;
      let gravitational_force = p5.Vector.mult(directionTo(this, body), forceBetween(body, this));
      this.acting_forces.push(gravitational_force)
      resultant_force.add(gravitational_force);
    }
    // reduced divisions from n^2 to n (approx factor of n) per frame as acceleration is calculated once per body per frame rather than n times per body per frame
    this.velocity.add(p5.Vector.div(resultant_force,this.mass));
    this.update_position();

    this.acting_forces = [];

    if(!show_trail_mode) { this.trail = []; total_trail_particles = 0; } // delete trail if trail exists
    else {this.trail.push(this.position.copy()); total_trail_particles++;} // add position to trail history
    if(this.trail.length > TRAIL_LENGTH_CAP){ this.trail.pop(); total_trail_particles--; } // remove excess trail

  }
  render(){
    stroke(this.colour);
    strokeWeight(2);
    let i = 0;
    if(show_trail_mode) for(let pos of this.trail){
      colorMode(HSB, 100);
      stroke((i++)%100, 100, 100); //rainbow effect
      strokeWeight(5);
      point(pos.x, pos.y);
    } 
    // draw force arrows
    if(show_info_mode){
      for(let force of this.acting_forces)
        if(force != undefined) drawArrow(this.position, force, color(0, 0, 255), this.radius/2);
      drawArrow(this.position, this.deltaTimeVelocity(), color(255, 0, 255), this.radius/2, this.mincutoff);
    }
    colorMode(RGB, 255);
    fill(this.colour);

    strokeWeight(7);
    stroke(color(255));

    if(!this.isMouseInside()) noStroke();
    
    ellipse(this.position.x, this.position.y, this.radius*2);

    fill(default_fill);
    stroke(default_stroke);
    strokeWeight(default_stroke_weight);
    
  }
  isMouseInside(){
    return distanceBetween(createVector(mouseX, mouseY), this.position) <= this.radius; 
  }

  speed(){
    return this.velocity.mag(); // the scalar speed of the body (pixels per frame)
  }

  deltaTimeVelocity(){
    return p5.Vector.mult(this.velocity, dTime()); // the velocity, adjusted by deltaTime (pixels per second)
  }
  
}

function setup() {
  default_fill = color(255, 255, 255);
  default_stroke = color(255, 255, 255);
  default_stroke_weight = 4;
  total_trail_particles = 0;
  createCanvas(windowWidth*3, windowHeight*3);
  frameRate(FRAMERATE);
  textFont('Courier New');
  textSize(FONTSIZE);
 
}

function draw() {
 
  fill(default_fill);
  background(0);
  let i = 1;
  for(let body of bodies) body.update();
  for(let body of bodies) body.render();
   
  if(show_info_mode){ 
    noStroke(); 
    for(let body of bodies){ 
      text("BODY " + (i.toString().padStart(3, "0")) + "   " + body.speed().toFixed(2).padStart(8, "0") + ' p/s' , 20, 20+(i*FONTSIZE));
      i++
    }
    text('ELAPSED TIME:' + (millis()/1000).toFixed(0), 20, 20+(i*FONTSIZE));
    i++;
    text('FPS: ' + (dTime()**-1).toFixed(0), 20, 20+(i*FONTSIZE));
    i++;
    if(show_trail_mode){
      text('TRAIL POINTS: ' + total_trail_particles, 20, 20+(i*FONTSIZE));
      i++;
    }
    stroke(default_stroke);
    strokeWeight(default_stroke_weight);
  }
  if(body_being_generated){
    radius += deltaTime/4;
    fill(colour);

    ellipse(mouseX, mouseY, radius*2);
    fill(default_fill);
  }
  if(body_is_selected){
    stroke(255, 0, 0);
    strokeWeight(4);
    line(selected_body.position.x, selected_body.position.y, mouseX, mouseY);
    stroke(default_stroke);
    strokeWeight(default_stroke_weight);
  }
}
function drawArrow(base, vec, col, min, mincutoff = false) {
  push();
  let arrowSize = 10;
  let arrowVec = vec.copy();
  arrowVec.mult(20);
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
  fill(default_fill);
  stroke(default_stroke);
  strokeWeight(default_stroke_weight);
}

function keyPressed(){
  if(keyCode == 72) show_info_mode = !show_info_mode;
  if(keyCode == 84) show_trail_mode = !show_trail_mode;
}

var body_radius;
var body_colour;
var selected_body;
var body_is_selected;
var body_being_deleted;

function mousePressed(){
  body_is_selected = false;
  body_being_deleted = false;

  for(let body of bodies){
    if(body.isMouseInside()){
      if(mouseButton == RIGHT){
        total_trail_particles -= body.trail.length;
        bodies.splice(bodies.indexOf(body), 1);
        body_being_deleted = true;
        break;
      }else if(mouseButton == LEFT){
        selected_body = body;
        original_body_position = body.position.copy();
      }
      body_is_selected = true;
      break;
    }
  }
  if(!body_being_generated && mouseButton == LEFT){ 
    body_being_generated = !body_is_selected;
    radius = 0;
    colour = color(random(50, 255), random(50, 255), random(255));
  }
  
}
function mouseReleased(){
  
  if(body_being_generated) new Body(createVector(mouseX, mouseY), (radius**2+15)*90000000000, radius, createVector(0,0), colour, "CREATED");
  else if(!body_being_deleted && mouseButton == LEFT) selected_body.apply_force(p5.Vector.mult(p5.Vector.sub(selected_body.position, createVector(mouseX, mouseY)), selected_body.mass/2));
  body_being_generated = false;
  body_is_selected = false;
  body_being_body_being_deleted = false;
}