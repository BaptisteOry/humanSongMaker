/*------------------------------
General
------------------------------*/
"use strict"; //Force to declare any variable used

let passersby = [[[-100, -100], [0, 0]]]

//const game = document.getElementById("game");

/*------------------------------
Initialisation
------------------------------*/
document.addEventListener("DOMContentLoaded", initialiser);

function initialiser(evt) {
    
}

function setup() {
    var canvas = createCanvas(400, 400);
    canvas.parent("canvasHolder");
}

function draw() {
  background(220);
  movement();
}

/*------------------------------
Game
------------------------------*/

function movement() {
  for(let i=0; i<passersby.length; i++) {
    if(passersby[i][1][0] === 0 && passersby[i][1][1] === 0) {
      passersby[i][1][0] = random(0.5, 5);
      passersby[i][1][1] = random(0, 5);
    }
    passersby[i][0][0] += passersby[i][1][0];
    passersby[i][0][1] += passersby[i][1][1];
    fill(0)
    ellipse(passersby[i][0][0], passersby[i][0][1], 100, 100)
    if(passersby[i][0][0] < -100 || passersby[i][0][0] > width+100 || passersby[i][0][1] < -100 || passersby[i][0][1] > height+100) {
      passersby[i] = passersby.pop()
      
    }
  }
  if(passersby.length < 5 && random(0, 100) > 98) {
    passersby.push([[-100, -100], [0, 0]])
  }
}

