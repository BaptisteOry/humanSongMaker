/*------------------------------
General
------------------------------*/
"use strict"; //Force to declare any variable used

/*------------------------------
Initialisation
------------------------------*/
document.addEventListener("DOMContentLoaded", initialiser);

function initialiser(evt) {

  /* Tempo buttons */
  $(".btn_field_number").on("click", changeTempoNumber);

}

function changeTempoNumber(evt) {
  const btn_field_number = $(this);
  const field_number = btn_field_number.parent().find(".field_number")
  const old_val = field_number.val();
  let new_val = 0;

  // increment
  if (btn_field_number.text() == "+") {
    if (old_val < 200) {
      new_val = parseFloat(old_val) + 5;
    } else {
      new_val = 200;
    }
    // decrement
  } else {
    if (old_val > 60) {
      new_val = parseFloat(old_val) - 5;
    } else {
      new_val = 60;
    }
  }

  field_number.val(new_val);
}

/*------------------------------
Canvas P5
------------------------------*/

function setup() {
  var canvas = createCanvas(600, 600);
  canvas.parent("board_canvas");
}

function draw() {
  background(220);
}