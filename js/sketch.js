/*------------------------------
General
------------------------------*/
"use strict"; //Force to declare any variable used

const colors = ["#FF6300", "#95035D", "#C8062A", "#FFA500", "#027A98"]
const instruments = ["bugle", "maracas", "violin", "electric_guitar", "saxophone", "guitar", "bongos"]
const rythms = ["001", "002", "003"]
let passersby = [{
  position: [100, 100],
  speed: [1, 1],
  selected: false,
  playing: true,
  osc: null,
  trigger: 0,
  index: 0,
  instrument: instruments[0],
  rhythm: rythms[0],
  color: colors[0]
}]
const radius = 50
const scale = [17, 19, 21, 22, 24, 26, 28]
const coloredSquares = [[{color: [149, 3, 93], displayed: false}, {color: [200, 6, 42], displayed: false}, {color: [255, 165, 0], displayed: false}, {color: [255, 99, 0], displayed: false}, {color: [2, 122, 152], displayed: false}, {color: [135, 241, 255], displayed: false}, {color: [227, 24, 10], displayed: false}],
                      [{color: [170, 44, 125], displayed: false}, {color: [211, 44, 71], displayed: false}, {color: [255, 180, 19], displayed: false}, {color: [255, 120, 23], displayed: false}, {color: [38, 149, 173], displayed: false}, {color: [141, 244, 255], displayed: false}, {color: [233, 57, 37], displayed: false}],
                      [{color: [181, 65, 142], displayed: false}, {color: [217, 64, 87], displayed: false}, {color: [255, 187, 29], displayed: false}, {color: [255, 130, 35], displayed: false}, {color: [57, 162, 183], displayed: false}, {color: [145, 246, 255], displayed: false}, {color: [235, 72, 50], displayed: false}],
                      [{color: [191, 86, 158], displayed: false}, {color: [222, 83, 100], displayed: false}, {color: [255, 194, 38], displayed: false}, {color: [255, 141, 47], displayed: false}, {color: [72, 175, 193], displayed: false}, {color: [148, 247, 255], displayed: false}, {color: [238, 90, 64], displayed: false}],
                      [{color: [202, 107, 174], displayed: false}, {color: [228, 102, 115], displayed: false}, {color: [255, 200, 48], displayed: false}, {color: [255, 153, 59], displayed: false}, {color: [93, 189, 204], displayed: false}, {color: [151, 248, 255], displayed: false}, {color: [241, 107, 77], displayed: false}],
                      [{color: [213, 127, 190], displayed: false}, {color: [233, 121, 128], displayed: false}, {color: [255, 206, 58], displayed: false}, {color: [255, 164, 70], displayed: false}, {color: [111, 202, 214], displayed: false}, {color: [154, 249, 255], displayed: false}, {color: [244, 124, 90], displayed: false}],
                      [{color: [223, 148, 206], displayed: false}, {color: [239, 140, 144], displayed: false}, {color: [255, 214, 67], displayed: false}, {color: [255, 174, 82], displayed: false}, {color: [129, 215, 224], displayed: false}, {color: [157, 251, 255], displayed: false}, {color: [247, 141, 104], displayed: false}]]
let selection = -1


/*------------------------------
Initialisation
------------------------------*/
$(document).ready(initialiser);

function initialiser(evt) {

  /* Change options */
  $(".btn_field_number").click(changeTempoNumber);
  $(".radio_instruments").change(changeInstrument);
  $(".field_select").change(changeRythm);

  $("#instrument").hide();
  $("#rythm").hide();

}

function changeTempoNumber(evt) {
  const btn_field_number = $(this);
  const field_number = btn_field_number.parent().find(".field_number")
  const old_val = field_number.val();
  let new_val = 0;

  // Increment
  if (btn_field_number.text() == "+") {
    if (old_val < 200) {
      new_val = parseFloat(old_val) + 5;
    } else {
      new_val = 200;
    }
    // Decrement
  } else {
    if (old_val > 60) {
      new_val = parseFloat(old_val) - 5;
    } else {
      new_val = 60;
    }
  }

  field_number.val(new_val);
}

function changeInstrument(evt) {
  if (selection != -1) {
    changeColors()
    selection.instrument = $(this).val();
  }
}

function changeRythm(evt) {
  if (selection != -1) {
    changeColors()
    selection.rhythm = $(this).val();
  }
}

/*------------------------------
Canvas P5
------------------------------*/

function setup() {
  const canvas = createCanvas(600, 600);
  canvas.parent("board_canvas");
  passersby.forEach(person => {
    // A triangle oscillator
    person.osc = new p5.TriOsc();
    // Start silent
    person.osc.start();
    person.osc.amp(0);
    person.instrument = random(instruments);
    person.rythm = random(rythms);
  });
  canvas.mousePressed(selectPassersBy);

}

function draw() {
  background(220);
  // for(let i = 0; i < 7; i++) {
  //   for(let j = 0; j < 7; j++) {
  //     if(coloredSquares[i][j].displayed) {
  //       lightSquare(i, j, coloredSquares[j][i].color[0], coloredSquares[j][i].color[1], coloredSquares[j][i].color[2])
  //     }
  //   }
  // }
  for (let i = 0; i < passersby.length; i++) {
    playRhythm(rhythm1, i);
  }
  movement();
}

function movement() {
  for (let i = 0; i < passersby.length; i++) {
    passersby[i].position[0] += passersby[i].speed[0];
    passersby[i].position[1] += passersby[i].speed[1];
    if (passersby[i].selected) {
      strokeWeight(1)
      fill(passersby[i].color)
    } else fill(0)
    ellipse(passersby[i].position[0], passersby[i].position[1], radius, radius)
    if (passersby[i].position[0] > 1 && passersby[i].position[0] < width-1 && passersby[i].position[1] > 1 && passersby[i].position[1] < height-1) {
      passersby[i].playing = true
    }
    if (passersby[i].position[0] < 1 || passersby[i].position[0] > width-1 || passersby[i].position[1] < 1 || passersby[i].position[1] > height-1) {
      passersby[i].playing = false;
      passersby[i].osc.fade(0, 0.5);
    }
    if (passersby[i].position[0] < -radius || passersby[i].position[0] > width + radius || passersby[i].position[1] < -radius || passersby[i].position[1] > height + radius) {
      passersby[i] = passersby.pop()
    }
  }
  if (passersby.length < 15 && random(0, 100) > 95) {
    const card = ["north", "south", "est", "west"]
    const pos = random(card)
    let x = 0;
    let y = 0;
    let speedX = 0;
    let speedY = 0;
    switch (pos) {
      case "north":
        x = random(-radius, width + radius);
        y = -radius;
        speedX = random(-1.0, 1.0);
        speedY = random(0.1, 1.0);
        break;
      case "south":
        x = random(-radius, width + radius);
        y = height + radius;
        speedX = random(-1.0, 1.0);
        speedY = -random(0.1, 1.0);
        break;
      case "est":
        x = width + radius;
        y = random(-radius, height + radius);
        speedX = -random(0.1, 1.0);
        speedY = random(-1.0, 1.0);
        break;
      case "west":
        x = -radius;
        y = random(-radius, height + radius);
        speedX = random(0.1, 1.0);
        speedY = random(-1.0, 1.0);
        break;

      default:
        break;
    }
    passersby.push({
      position: [x, y],
      speed: [speedX, speedY],
      selected: false,
      playing: false,
      osc: null,
      trigger: 0,
      index: 0,
      instrument: random(instruments),
      rhythm: random(rythms)
    })
    passersby[passersby.length - 1].color = random(colors)
    // A triangle oscillator
    passersby[passersby.length - 1].osc = new p5.TriOsc();
    // Start silent
    passersby[passersby.length - 1].osc.start();
    passersby[passersby.length - 1].osc.amp(0)
  }
}

const getNote = (x, y) => {
  let note = scale[floor((x / width) * 7)];
  note += floor((y / height) * 7) * 12;
  return note;
}

const getSqare = (x, y) => {
  const indexX = floor((x / width) * 7);
  const indexY = floor((y / height) * 7);
  const posX = (width/14) * (indexX + 1);
  const posY = (height/14) * (indexY + 1);
  return [posX, posY];
}

const lightSquare = (i, j, r, g, b) => {
  strokeWeight(0); 
  fill(r, g, b);
  const x =i*(width/7)
  const y =j*(height/7)
  rect(x, y, width/7, height/7)
}

const rhythm1 = [400, 200, 200, 400, 400, 200, 200]

const playRhythm = (rhythm, personId) => {

 if(passersby[personId].playing && millis() < passersby[personId].trigger) {
    const note = getNote(passersby[personId].position[0], passersby[personId].position[1]);
    const i = displaySquares(note)[0]
    const j = displaySquares(note)[1]
    // console.log(i+", "+j)
    // console.log(passersby[personId].position[0] +", " +passersby[personId].position[1])
    lightSquare(i, j, coloredSquares[j][i].color[0], coloredSquares[j][i].color[1], coloredSquares[j][i].color[2])
  }

  if (passersby[personId].playing && millis() > passersby[personId].trigger) {
    const note = getNote(passersby[personId].position[0], passersby[personId].position[1]);
    playNote(note, rhythm1[passersby[personId].index], passersby[personId].osc);
    passersby[personId].trigger = millis() + rhythm1[passersby[personId].index];
    passersby[personId].index++;
    // const i = displaySquares(note)[0]
    // const j = displaySquares(note)[1]
    // coloredSquares[i][j].displayed=true

  } else if (passersby[personId].index >= rhythm.length) {
    passersby[personId].index = 0;
  }
}

// A function to play a note
function playNote(note, duration, osc) {
  osc.freq(midiToFreq(note));
  // Fade it in
  osc.fade(0.5, 0.2);

  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function () {
      osc.fade(0, 0.2);
    }, duration - 50);
  }
}

function selectPassersBy() {
  inCircle(mouseX, mouseY)
  if (selection !== -1) {
    if (selection.selected) {
      selection.selected = false
      $("#instrument").hide();
      $("#rythm").hide();
    } else {
      passersby.forEach(person => person.selected = false);
      selection.selected = true;
      $("#instrument").show();
      $("#rythm").show();
      const form = $("#actions_form");
      form.find("#" + selection.instrument).prop("checked", true);
      form.find("#" + selection.rhythm).prop("selected", true);
      changeColors()
    }
  }
}

const inCircle = (x, y) => {
  for (let i = 0; i < passersby.length; i++) {
    if (sqrt((x - passersby[i].position[0]) * (x - passersby[i].position[0]) + (y - passersby[i].position[1]) * (y - passersby[i].position[1]) < radius * radius)) {
      selection = passersby[i];
    }
  }
}

function changeColors() {
  $(".btn, .radio_instruments:not(:checked)+div").hover(function (evt) {
    if ($(this).prev().is(":checked") == false) {
      $(this).css({
        "background-color": evt.type === "mouseenter" ? selection.color : "",
        "border-color": evt.type === "mouseenter" ? selection.color : ""
      });
    }
  });
  $(".radio_instruments+div, .field_select>option").css("background-color", "");
  $(".radio_instruments+div").css("border-color", "");
  $("#board_canvas>#infos, .radio_instruments:checked+div, .field_select>option:checked").css("background-color", selection.color);
  $(".radio_instruments:checked+div").css("border-color", selection.color);
}

const displaySquares = (note) => {
  let i = 0;
  switch (note%12) {
    case 5:
      break;
    case 7:
      i = 1
      break;
    case 9:
      i = 2
      break;
    case 10:
      i = 3
      break;
    case 0:
      i = 4
      break;
    case 2:
      i = 5
      break;
    case 4:
      i = 6
      break;
    default:
      break;
  }

  const j = floor((note-17)/12);

  return [i, j]
}