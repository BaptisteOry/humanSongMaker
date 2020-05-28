/*------------------------------
General
------------------------------*/
"use strict"; //Force to declare any variable used

const colors = ["#FF6300", "#95035D", "#C8062A", "#FFA500", "#027A98"];
const instruments = ["trumpet", "harp", "violin", "guitar-electric", "saxophone", "guitar-acoustic", "harmonium"];
const rhythms = [{number: "001", notes : ["8n", "4n", "4n", "4n", "8n", "16n", "4n"]}, {number: "002", notes : ["4n", "4n", "8n", "8n", "4n", "4n", "4n"]}, {number: "003", notes : ["16n", "16n", "8n", "16n", "16n", "16n", "8n"]}]
const radius = 50;
const scale = [12, 14, 16, 17, 19, 21, 23];
const coloredSquares = [[{color: [149, 3, 93], displayed: false}, {color: [200, 6, 42], displayed: false}, {color: [255, 165, 0], displayed: false}, {color: [255, 99, 0], displayed: false}, {color: [2, 122, 152], displayed: false}, {color: [135, 241, 255], displayed: false}, {color: [227, 24, 10], displayed: false}],
                      [{color: [170, 44, 125], displayed: false}, {color: [211, 44, 71], displayed: false}, {color: [255, 180, 19], displayed: false}, {color: [255, 120, 23], displayed: false}, {color: [38, 149, 173], displayed: false}, {color: [141, 244, 255], displayed: false}, {color: [233, 57, 37], displayed: false}],
                      [{color: [181, 65, 142], displayed: false}, {color: [217, 64, 87], displayed: false}, {color: [255, 187, 29], displayed: false}, {color: [255, 130, 35], displayed: false}, {color: [57, 162, 183], displayed: false}, {color: [145, 246, 255], displayed: false}, {color: [235, 72, 50], displayed: false}],
                      [{color: [191, 86, 158], displayed: false}, {color: [222, 83, 100], displayed: false}, {color: [255, 194, 38], displayed: false}, {color: [255, 141, 47], displayed: false}, {color: [72, 175, 193], displayed: false}, {color: [148, 247, 255], displayed: false}, {color: [238, 90, 64], displayed: false}],
                      [{color: [202, 107, 174], displayed: false}, {color: [228, 102, 115], displayed: false}, {color: [255, 200, 48], displayed: false}, {color: [255, 153, 59], displayed: false}, {color: [93, 189, 204], displayed: false}, {color: [151, 248, 255], displayed: false}, {color: [241, 107, 77], displayed: false}],
                      [{color: [213, 127, 190], displayed: false}, {color: [233, 121, 128], displayed: false}, {color: [255, 206, 58], displayed: false}, {color: [255, 164, 70], displayed: false}, {color: [111, 202, 214], displayed: false}, {color: [154, 249, 255], displayed: false}, {color: [244, 124, 90], displayed: false}],
                      [{color: [223, 148, 206], displayed: false}, {color: [239, 140, 144], displayed: false}, {color: [255, 214, 67], displayed: false}, {color: [255, 174, 82], displayed: false}, {color: [129, 215, 224], displayed: false}, {color: [157, 251, 255], displayed: false}, {color: [247, 141, 104], displayed: false}]];

let samples;
let passersby = [{
  playing: true,
  position: [100, 100],
  speed: [1, 1],
  coloredSquare: null,
  selected: false,
  color: colors[0],
  instrument: instruments[0],
  rhythm: rhythms[1],
  indexRhythm: 0,
  note: null
}];
let selection = -1;
let loaded = false;

/*------------------------------
Canvas P5
------------------------------*/

// before setup()
function preload() {

  samples = SampleLibrary.load({
    instruments: ["trumpet", "harp", "violin", "guitar-electric", "saxophone", "guitar-acoustic", "harmonium"]
  });

  Tone.Buffer.on('load', function() { 
    for (let property in samples) {
      if (samples.hasOwnProperty(property)) {
        samples[property].release = .5;
        samples[property].toMaster();
      }
    }
    loaded = true;
  });

}

// initialisation
function setup() {

  Tone.Transport.scheduleRepeat(playRythm, '4n');
  Tone.Transport.start();
  changeColors();

  const canvas = createCanvas(600, 600);
  canvas.parent("board_canvas");
  canvas.mousePressed(selectPasserBy);

  $(".btn_field_number").click(changeTempoNumber);
  $(".radio_instruments").change(changeInstrument);
  $(".field_select").change(changeRhythm);

  textSize(20);
  textStyle(ITALIC);
  textFont('Roboto Condensed');
  textAlign(CENTER, CENTER);

}

// draw() every frame
function draw() {

    if(loaded){
      background(220);
      drawColoredSquares();
      movePassersby();
      addPasserBy();
    } else {
      text("Loading... Happiness knocks at your door.", 0, height/2, width);
    }

}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

function playRythm() {
  passersby.forEach(person => {
    const note = getNote(person.position[0], person.position[1]);
    person.note = note;
  
    if(person.note != null && person.playing != false && loaded){
      const square = getSquareWithNote(person.note);
      coloredSquares[square.j][square.i].displayed = true;
      
      samples[person.instrument].triggerAttackRelease(Tone.Frequency(person.note, "midi"), person.rhythm.notes[person.indexRhythm]);
      person.indexRhythm++;
      if (person.indexRhythm >= person.rhythm.notes.length) {
        person.indexRhythm = 0;
      }

      setTimeout(() => { 
          coloredSquares[square.j][square.i].displayed = false;
      }, (Tone.Time(person.rhythm.notes[person.indexRhythm]).toSeconds())*1000 + 1000);
    }
  });
}

function drawColoredSquares(){
  for(let i = 0; i < 7; i++) {
    for(let j = 0; j < 7; j++) {
      if(coloredSquares[i][j].displayed) {
        displayColoredSquare({i : i, j : j});
      }
    }
  }
}

function movePassersby(){
  passersby.forEach(person => {
    person.position[0] += person.speed[0];
    person.position[1] += person.speed[1];
    
    if (person.position[0] > 1 && person.position[0] < width - 1 && person.position[1] > 1 && person.position[1] < height - 1) {
      person.playing = true;
    }
    if (person.position[0] < 1 || person.position[0] > width - 1 || person.position[1] < 1 || person.position[1] > height - 1) {
      person.playing = false;
    }
    if (person.position[0] < -radius || person.position[0] > width + radius || person.position[1] < -radius || person.position[1] > height + radius) {
      passersby.splice(passersby.indexOf(person), 1);
    }

    if (person.selected) {
      strokeWeight(1);
      fill(person.color);
    } else {
      fill(0);
    }
    ellipse(person.position[0], person.position[1], radius, radius);
  });
}

function addPasserBy() {
    if (passersby.length < 4 && random(0, 100) > 95) {
      const card = ["north", "south", "est", "west"];
      const pos = random(card);
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
        playing: false,
        position: [x, y],
        speed: [speedX, speedY],
        selected: false,
        color: random(colors),
        instrument: random(instruments),
        rhythm: random(rhythms),
        indexRhythm: 0,
        note: null
      })
    }
}

function getNote(x, y) {
  let note = scale[floor((x / width) * 7)];
  note += floor((y / (height)) * 6) * 12;
  return note;
}

function displayColoredSquare(square) {
  strokeWeight(0); 
  fill(coloredSquares[square.j][square.i].color[0], coloredSquares[square.j][square.i].color[1], coloredSquares[square.j][square.i].color[2]);
  const x = [square.j]*(width/7)
  const y = [square.i]*(height/6)
  rect(x, y, width/7, height/6)
}

function getSquareWithNote(note) {
  let i = 0;
  switch (note%12) {
    case 0:
      break;
    case 2:
      i = 1
      break;
    case 4:
      i = 2
      break;
    case 5:
      i = 3
      break;
    case 7:
    i = 4
      break;
    case 9:
    i = 5
      break;
    case 11:
    i = 6
      break;
    default:
      break;
  }
  const j = floor((note - 12)/12);
  return {i : i, j : j}
}

function selectPasserBy() {
  isPasserBySelect(mouseX, mouseY)
  if (selection !== -1) {
    if (selection.selected) {
      selection.selected = false
      $("#instrument, #rhythm").hide();
    } else {
      passersby.forEach(person => person.selected = false);
      selection.selected = true;
      $("#instrument, #rhythm").show();
      const form = $("#actions_form");
      form.find("#" + selection.instrument).prop("checked", true);
      form.find("#" + selection.rhythm.number).prop("selected", true);
      changeColors()
    }
  }
}

function isPasserBySelect(x, y) {
  for (let i = 0; i < passersby.length; i++) {
    if (sqrt((x - passersby[i].position[0]) * (x - passersby[i].position[0]) + (y - passersby[i].position[1]) * (y - passersby[i].position[1]) < radius * radius)) {
      selection = passersby[i];
      return true;
    }
  }
  selection = -1;
  return false;
}

function changeTempoNumber(evt) {
  const btn_field_number = $(this);
  const field_number = btn_field_number.parent().find(".field_number")
  const old_val = field_number.val();
  let new_val = 0;
  // Increment
  if (btn_field_number.text() == "+") {
    if (old_val < 240) {
      new_val = parseFloat(old_val) + 5;
    } else {
      new_val = 240;
    }
  // Decrement
  } else {
    if (old_val > 40) {
      new_val = parseFloat(old_val) - 5;
    } else {
      new_val = 40;
    }
  }
  field_number.val(new_val);
  Tone.Transport.bpm.value = new_val;
}

function changeInstrument(evt) {
  if (selection != -1) {
    changeColors();
    selection.instrument = $(this).val();
  }
}

function changeRhythm(evt) {
  if (selection != -1) {
    changeColors();
    selection.rhythm = rhythms[parseInt($(this).val())];
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