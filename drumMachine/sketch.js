// p5.js drum machine
// incorporating elements of tone.js library
// Inspiration/Helpful resources: 
// Tone.js documentation https://tonejs.github.io/docs/14.7.77/index.html
// https://editor.p5js.org/asd0999/sketches/Bk5Hv3XK7
// https://editor.p5js.org/asd0999/sketches/r1od2atFQ
// https://editor.p5js.org/asd0999/sketches/Hy__xQcjX

// set some global variables
let beat = 0;
let value = 0;
let cells = [];
let buttonColor = "#7c3f58";
let textColor = "#e2f3e4";
let bpmTextColor = "#e2f3e4";
let canvasColor = "#ee8695";
let gridColor = "##e2f3e4";

// amount of steps (beats) each line
// (8)
let numSteps = 8; 
let currentStep = 0;
// number of sounds in each drum kit (4)
let numSamples = 4; 

// button for play/pause, slider for controlling BPM / speed
let playButton;
let slider;
let drum;

// other settings
let a = 40; // cell height variable
let b = 25; // cell width variable
let gridW, gridH, cellW, cellH; // initializing values for grid
let colors = ["#292831", "#333f58", "#4a7a96", "#96b0b3" ]; // array of colors

// sample kits/sounds
let beats; // kit 1
let trap; // kit 2
let mix; // kit 3

// variable for choosing drum kit
let kitChosen; 
let soundNames = ["kick", "snare", "hat", "other"]; // these are often used in those drum machine games

// mapping bmp to slider
let drummingSpeed = 5.5; // speed of creature's arms
let swayingSpeed = 0.1; // creatures left and right movement

// set of "beats - classic style sounds"
beats = new Tone.Players({
  kick: "sounds/beats/kick1.wav",
  snare: "sounds/beats/snare1.wav",
  hat: "sounds/beats/hat1.wav",
  other: "sounds/beats/other1.wav",
});

// to be replaced with different kit sounds //
// set of "Trap style sounds"
trap = new Tone.Players({
  kick: "sounds/trap/kick2.wav",
  snare: "sounds/trap/snare2.wav",
  hat: "sounds/trap/hat2.wav",
  other: "sounds/trap/other2.wav",
});

// set of funny / random sounds
mix = new Tone.Players({
  kick: "sounds/mix/kick3.mp3",
  snare: "sounds/mix/snare3.mp3",
  hat: "sounds/mix/hat3.mp3",
  other: "sounds/mix/other3.mp3",
});

// toMaster connects the output to the destination node
beats.toMaster();
trap.toMaster();
mix.toMaster();

// "Transport" is a timekeeper function
//8n means 8th notes
Tone.Transport.scheduleRepeat(currentBeat, "8n");

function preload(){
  drum = loadImage('drum.png');
}

function setup() {

  // create an instance of the drummer creature
  mascot = new mascot(340, 570, drum);
  
  // create a bpm slider
  slider = createSlider(50, 200, 100);
  slider.position(900, 810);
  slider.input(speedVisualization)
  slider.style("width", "200px");

  // drop down menu for kit selection
  menu = createSelect();
  menu.position(430, 745);
  menu.size(150, 70);
  menu.style('background-color', buttonColor);
  menu.style("font-family", "Fredoka One");
  menu.style("font-size", "30px");
  menu.style("text-align", "center");
  menu.style("border-width", "0px") // get rid of border width
  menu.style("color", textColor)
  menu.style("border-radius", "20px")
  menu.selected("beats");
  menu.option("beats");
  menu.option("trap");
  menu.option("mix");
  menu.changed(mySelectEvent);
  kitChosen = menu.value();

  // initialize cell
  // like binary numbers, ON is 1 and off is 0
  // this way we can control which grid cells to play each loop

  // create grid pattern (will have numSamples "4" rows)
  for (let sample = 0; sample < numSamples; sample++) {
    cells[sample] = [];

    // 4 rows * 8 columns 
    for (let step = 0; step < numSteps; step++) {
      cells[sample][step] = 0;
    }
  }

  // create a play button
  playButton = createButton("PLAY");
  playButton.position(650, 740);
  playButton.mouseClicked(togglePlay);
  playButton.style('background-color', buttonColor);
  playButton.size(200, 100);
  playButton.style("font-family", "Fredoka One");
  playButton.style("color", textColor)
  playButton.style("font-size", "48px");
  playButton.style("border-width", "0px") // get rid of border/stroke
  playButton.style("border-radius", "20px")

  // create the canvas
  let canvas = createCanvas(800, 700);
  canvas.parent("canvasContainer"); // placement for interactive window

  // some grid variables to be later used for calculations
  gridW = width - 2 * b;
  gridH = height / 2 - 2 * a;
  cellW = gridW / numSteps;
  cellH = gridH / numSamples;
}

// 
function currentBeat(time) {
  currentStep = beat % numSteps;
  for (let sample = 0; sample < numSamples; sample++) {
    if (cells[sample][currentStep]) {
      let k, k2, k3;

      // determining which kit is chosen
      if (kitChosen == "beats") { // "beats" track chosen
        k = beats.get(soundNames[sample]);
        k.start(time);

      } else if (kitChosen == "trap") { // "trap" track chosen
        k2 = trap.get(soundNames[sample]);
        k2.start(time);

      } else if (kitChosen == "mix") { // "mix" track chosen
        k3 = mix.get(soundNames[sample]);
        k3.start(time);
      }
    }
  }
  beat++; // increase beat value each loop
}

function draw() {
  background(canvasColor);
  
  // set mascot mapping / movement at the start of each loop
  mascot.updateSpeedSway(drummingSpeed, swayingSpeed);
  mascot.display();
  mascot.update();

  //
  fill("#7c3f58")
  noStroke();
  rect(610, 360, 80, 45, 20);
  textSize(24);
  fill(bpmTextColor);
  noStroke();
  text('BPM', 625, 390);
  textFont('Fredoka One');

  // setting up the slider
  let maxBpm = slider.value();

  // for Tone.Transport
  Tone.Transport.bpm.value = maxBpm;
  fill(value);

  // filling the cells
  for (let step = 0; step < numSteps; step++) {
    for (let sample = 0; sample < numSamples; sample++) {
      if (cells[sample][step] == 1) {
        fill(colors[sample]);
        rect(
          b + step * cellW,
          a + sample * cellH,
          cellW,
          cellH
        );
      }
    }
  }

  // horizontal lines
  for (let i = 0; i <= numSamples; i++) {
    let y = a + i * cellH;
    right = width - b;
    strokeWeight(3);
    stroke(gridColor);
    
    line(b, y, right, y);
  }

  
  // creating grid and highlights
  noStroke();
  // vertical lines
  for (let i = 0; i <= numSteps; i++) {
    right = width - b;
    strokeWeight(3);
    stroke(gridColor);
    line(b + i * cellW, a, b + i * cellW, a + gridH);

    // highlight the cell/column currently playing
    let step = (beat - 1) % numSteps;
    if (i == step && Tone.Transport.state == "started") {
      fill(0,40); // highlight column with a transparent shade
      noStroke();
      rect(b + i * cellW, a, cellW, gridH);
    }
  }
  
  
}

// for mapping the drummer to the slider
function speedVisualization() {
  // setting new drummingSpeed global 
  let value = slider.value();
  drummingSpeed = value;
  swayingSpeed = value;
  
}

function mousePressed() {
  // keep the mouse in the grid
  if (
    b < mouseX &&
    mouseX < b + gridW &&
    a < mouseY &&
    mouseY < a + gridH
  ) {
    // set some margins
    let x = mouseX - b;
    let y = mouseY - a;

    // calculate which cell is clicked
    let i = floor(x / cellW);
    let j = floor(y / cellH);

    // when clicked
    // if cell is ON, set to OFF and vice versa
    cells[j][i] = !cells[j][i];
  }
}
// PLAY / PAUSE button
function togglePlay() {
  if (Tone.Transport.state == "started") {
    Tone.Transport.stop();
    playButton.html("PLAY");
  } else {
    if (beats.loaded && trap.loaded) {
      Tone.Transport.start();
      playButton.html("PAUSE");
    }
  }
}

// select the kits with mySelectEvent
function mySelectEvent() {
  if (menu.value() == "beats") {
    kitChosen = "beats";
  } else if (menu.value() == "trap") {
    kitChosen = "trap";
  } else if (menu.value() == "mix") {
    kitChosen = "mix";
  }
}
