let ship;
let shipimg;
let badships = [];
let badshipimg;
let badCount = 10;
let bullets = [];
let score=0;

let model, cam, keypointX=0;

function preload(){
  shipimg = loadImage('data/ship.png');
  badshipimg = loadImage('data/japan.png');
}
function setup() {
  createCanvas(640, 480);
  
  cam = createCapture(VIDEO);
  cam.hide();
  
  model = ml5.poseNet(cam, ready);
  model.on('pose', result);
   
  ship = new Ship();
  for(let i=0; i<badCount; i++){
    badships[i] = new BadShip();
  }
}


function ready(){
  console.log("ok");
}

function result(data){
  console.log(data);
  if(data.length>0){
     keypointX = data[0].pose.keypoints[0].position.x; //코x
   } else {
     keypointX = 0;
   }
}


function draw() {
  image(cam, 0, 0);
  textSize(24);
  text(score, 10, 30);
  ship.show();
  ship.move(keypointX);
  
  for(let i=0; i<badships.length; i++){
    badships[i].show();
    badships[i].move();
    for(let j=0; j<bullets.length; j++){
      if(badships[i].hit(bullets[j])){
        badships.splice(i, 1);
        bullets.splice(j, 1);
        badships.push(new BadShip());
        score += 1;
      }
    }
  }

  
  
  for(let i=0; i<bullets.length; i++){
    bullets[i].show();
    bullets[i].move();
    if(bullets[i].y<0){
      bullets.splice(i, 1);
    }
  }
}

function keyPressed(){
  if (key == ' ') {
    bullets.push(new Bullet());
  }
}




class Ship{
  constructor(){
    this.w = 100;
    this.h = 100; 
    this.x = keypointX;
    this.y = height-100;
  }
  
  show(){
    image(shipimg, keypointX, this.y, this.w, this.h);
  }
  move(a){
    this.x = a;
    
    if(this.x<0){
      this.x = 0;
    }
    if(this.x>width-this.w){
      this.x = width-this.w;
    }
  }
}

class BadShip{
  constructor(){
    this.w = 40;
    this.h = 30;
    this.x = random(width-this.w);
    this.y = random(-400);
    this.s = random(2, 7);
  }
  
  show(){
    image(badshipimg, this.x, this.y, this.w, this.h);
  }
  
  move(){
    this.y += this.s;
    if(this.y>height){
      this.y = random(-400);
      this.x = random(width-this.w);
    }
  }
  
  hit(b){
    if(this.x<b.x && b.x<this.x+this.w && this.y<b.y && b.y<this.y+this.h){
      return true;
    }
  }
}

class Bullet {
  constructor(){
    this.w = 10;
    this.x = ship.x+ship.w/2;
    this.y = ship.y;
  }
  show(){
    fill('black');
    circle(this.x, this.y, this.w);
  }
  
  move(){
    this.y -= 5;
  }
}