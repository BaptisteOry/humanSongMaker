/*------------------------------
General
------------------------------*/
"use strict"; //Force to declare any variable used

let passersby = [{position: [100, 100], speed: [2, 2], playing: true, osc: null, trigger: 0, index: 0}]
let osc
let scale = [17, 19, 21, 22, 24, 26, 28]

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
    passersby.forEach(person => {
      // A triangle oscillator
    person.osc = new p5.TriOsc();
    // Start silent
    person.osc.start();
    person.osc.amp(0)
    });
    ;
}

function draw() {
  background(220);
  movement();
  for(let i=0; i<passersby.length; i++) {
    playRhythm(rhythm1, i);
  }
}

/*------------------------------
Game
------------------------------*/

function movement() {
  for(let i=0; i<passersby.length; i++) {
    // if(passersby[i].speed[0] === 0 && passersby[i].speed[1] === 0) {
    //   passersby[i].speed[0] = random(0.5, 5);
    //   passersby[i].speed[1] = random(0, 5);
    // }
    passersby[i].position[0] += passersby[i].speed[0];
    passersby[i].position[1] += passersby[i].speed[1];
    fill(0)
    ellipse(passersby[i].position[0], passersby[i].position[1], 100, 100)
    if(passersby[i].position[0] > 0 && passersby[i].position[0] < width && passersby[i].position[1] > 0 && passersby[i].position[1] < height) {
      passersby[i].playing = true
    }
    if(passersby[i].position[0] < -100 || passersby[i].position[0] > width+100 || passersby[i].position[1] < -100 || passersby[i].position[1] > height+100) {
      passersby[i] = passersby.pop()

    }
  }
  if(passersby.length < 5 && random(0, 100) > 98) {
    const card = ["north", "south", "est", "west"]
    const pos = random(card)
    let x = 0;
    let y = 0;
    let speedX = 0;
    let speedY = 0;
    switch (pos) {
      case "north":
        x = random(-100, width+100);
        y = -100;
        speedX = random(-5, 5);
        speedY = random(0.1, 5);
        break;
      case "south":
        x = random(-100, width+100);
        y = height+100;
        speedX = random(-5, 5);
        speedY = -random(0.1, 5);
        break;
      case "est":
        x = width+100;
        y = random(-100, height+100);
        speedX = -random(0.1, 5);
        speedY = random(-5, 5);
        break;
      case "west":
        x = -100;
        y = random(-100, height+100);
        speedX = random(0.1, 5);
        speedY = random(-5, 5);
        break;
    
      default:
        break;
    }
    passersby.push({position: [x, y], speed: [speedX, speedY], playing: false, osc: null, trigger: 0, index: 0})
    // A triangle oscillator
    passersby[passersby.length-1].osc = new p5.TriOsc();
    // Start silent
    passersby[passersby.length-1].osc.start();
    passersby[passersby.length-1].osc.amp(0)
  }
}

const getNote = (x, y) => {
  let note = scale[floor((x/width)*7)];
  note += floor((y/height)*7)*12;
  return note;
}

const rhythm1 = [400, 200, 200, 400, 400, 200, 200]

const playRhythm = (rhythm, personId) => {
  if (passersby[personId].playing && millis() > passersby[personId].trigger){
    playNote(getNote(passersby[personId].position[0],passersby[personId].position[1]), rhythm1[passersby[personId].index], passersby[personId].osc);
    passersby[personId].trigger = millis() + rhythm1[passersby[personId].index];
    // Move to the next note
    passersby[personId].index ++;
  // We're at the end, stop autoplaying.
  }
  else if (passersby[personId].index >= rhythm.length) {
    passersby[personId].playing = false;
    passersby[personId].osc.fade(0,0.5);
  }
}

// A function to play a note
function playNote(note, duration, osc) {
  osc.freq(midiToFreq(note));
  // Fade it in
  osc.fade(0.5,0.2);

  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function() {
      osc.fade(0,0.2);
    }, duration-50);
  }
}