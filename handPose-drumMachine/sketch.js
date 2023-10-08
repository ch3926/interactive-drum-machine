// https://teachablemachine.withgoogle.com/models/-WRDWUT2c/
// p5.js drum machine
// incorporating elements of tone.js library
// Inspiration: https://editor.p5js.org/asd0999/sketches/r1od2atFQ

// ------------- setting global variables -------------

let canvasW = 800;
let canvasH = 700;
// set some colors ----
// let buttonColor = "#7c3f58";
// let textColor = "#e2f3e4";
// let bpmTextColor = "#e2f3e4";
// let canvasColor = "#ee8695";
// let gridColor = "##e2f3e4";
// -----------

let buttonColor = "white";
let textColor = "grey";
let bpmTextColor = "#e2f3e4";
let canvasColor = "white";
let gridColor = "##e2f3e4";

// vars for adding poseNet functionality ----
let poseNet;
let myVideo;
let myResults;
const minDistHands = 0;
const minDistHandsButton = 0;
let leftW;
let rightW;
lastPos = [0, 0];
currPos = [];
let cursor
let popSound
let clickSound
// play symbol "▷"
// pause symbol "||"

// -----------

// vars to control playback ----
let numSteps = 8; // number of columns / loop (x-axis)
let currentStep = 0;
let numSamples = 4; // number of sounds / kit (y-axis)
let beat = 0;
let value = 0;
let cells = []; // stores cells as list
let cellCenterPositions = []; // creates a 4*8 empty array


// grid drawing settings ----
let a = 40; // cell height variable
let b = 25; // cell width variable
let gridW, gridH, cellW, cellH; // initializing values for grid
//let colors = ["#292831", "#333f58", "#4a7a96", "#96b0b3"]; // array of colors
let colors;

// -----------

// button for play/pause, slider for controlling BPM / speed
let playButton;
let slider;
// -----------

// bpm/mascot/ settings ----
let drummingSpeed = 5.5;
//let drumMap;
let swayingSpeed = 0.1;
minBpm = 50;
maxBpm = 200;
bpm = 50;
// -----------

// sample kits/sounds ----
let beats; // kit 1
let trap; // kit 2
let mix; // kit 3
let kitChosen; // variable for choosing drum kit
let soundNames = ["kick", "snare", "hat", "other"]; //one of each in each kit
// associate different sounds with each kit
//Tone.Player is a way to load and play back an audio file
// -----------

// create three sets of beat sounds ----
// these can be replaced with different kit sounds
beats = new Tone.Players({
  kick: "sounds/beats/kick1.wav",
  snare: "sounds/beats/snare1.wav",
  hat: "sounds/beats/hat1.wav",
  other: "sounds/beats/other1.wav",
});

trap = new Tone.Players({
  kick: "sounds/trap/kick2.wav",
  snare: "sounds/trap/snare2.wav",
  hat: "sounds/trap/hat2.wav",
  other: "sounds/trap/other2.wav",
});
mix = new Tone.Players({
  kick: "sounds/mix/kick3.mp3",
  snare: "sounds/mix/snare3.mp3",
  hat: "sounds/mix/hat3.mp3",
  other: "sounds/mix/other3.mp3",
});

// toMaster function connects the output to the context's destination node
beats.toMaster();
trap.toMaster();
mix.toMaster();

// transport is a timekeeper function in tone.js
//8th means 8th note
Tone.Transport.scheduleRepeat(onTheBeat, "8n");

// ------------- end of setting global variables ---------------

function keyPressed() {
  if (keyCode == RIGHT_ARROW && slider.value() < maxBpm) {
    bpm += 10;
    slider.value(bpm);
  } else if (keyCode == LEFT_ARROW && slider.value() > minBpm) {
    bpm -= 10;
    slider.value(bpm);
  }
  if (keyCode == 32) { // space bar
    togglePlay()
  }
}

function preload() {
  //soundFormats('mp3', 'ogg');
  popSound = createAudio("toggle_sounds/pop.mp3");
  clickSound = createAudio("toggle_sounds/click.mp3");
  cursor = loadImage("cursors/cursor1.png");
}

function setup() {
  // for poseNet ----
  myVideo = createCapture(VIDEO);
  myVideo.hide();
  createCanvas(640, 480);
  poseNet = ml5.poseNet(myVideo, gotModel);
  // noStroke();
  // fill(155, 20, 200);
  // rectMode(CENTER);
  // -----------
  colors = ["#11826e", "#edd92a", "#e957b2", "#f7583a"]; // array of colors

  mascot = new mascot(350, 600);
  // slider for bpm
  slider = createSlider(minBpm, maxBpm, 100);
  slider.position(540, 445);
  slider.addClass("bpmSlider");
  slider.input(speedVisualization);
  //slider.style("width", "200px");
  // mapping slider to bpm ----

  // drop down menu to select kit ----
  menu = createSelect();
  menu.position(canvasW / 2 - 270, canvasH / 2 + 50);
  //menu.size(150, 70);
  menu.size(70, 70);
  menu.style("background-color", buttonColor);
  menu.style("font-family", "DM Mono");
  menu.style("-webkit-appearance", "none")
  menu.style("font-size", "30px");
  menu.style("text-align", "center");
  menu.style("border-width", "0px"); // get rid of border width
  menu.style("color", textColor);
  menu.style("border-radius", "50%");
  menu.selected("beats");
  menu.option("B");
  menu.option("T");
  menu.option("M");
  menu.changed(mySelectEvent);
  kitChosen = menu.value(); // set kit chosen to be menu item selected

  // initialize cells
  // OFF = 0, ON = 1
  for (let sample = 0; sample < numSamples; sample++) {
    cells[sample] = []; // make empty list of 4 rows
    //
    for (let step = 0; step < numSteps; step++) {
      cells[sample][step] = 0; // set each cell in row to 0
    }
  }

  // visual settings for grid ----
  createCanvas(canvasW, canvasH);
  gridW = canvasW - 2 * b; // 750 across
  gridH = canvasW / 2 - 2 * a; // 320 down
  cellW = gridW / numSteps; // width of each cell
  cellH = gridH / numSamples; // height of each cell

  // create play button ----
  playButton = createButton("▷");
  //playButton.position(310, 400);
  playButton.position(canvasW / 2 - 50, canvasH / 2 + 40)
  playButton.mouseClicked(togglePlay);
  playButton.style("background-color", buttonColor);
  // playButton.size(200, 100);
  playButton.size(100, 100);
  playButton.style("font-family", "Fredoka One");
  playButton.style("color", textColor);
  playButton.style("font-size", "38px");
  playButton.style("border-color", "grey");
  playButton.style("border-width", "2px"); // get rid of border/stroke
  playButton.style("border-radius", "50px");
}
function gotModel() {
  poseNet.on("pose", gotResults);
  poseNet.flipHorizontal = true;
}

function gotResults(results) {
  myResults = results;
  // if (myResults[0]){
  //   const newNose = results[0].pose.nose;
  // }
  //console.log('myResults', myResults)
}

function toggleCell(noseX, noseY, leftX, leftY, realNoseX, realNoseY) { //, leftX, leftY
  if (dist(realNoseX, realNoseY, leftX, leftY) < 50) {
    let x = noseX - b; // current x position of mouse
    let y = noseY - a; // current y position of mouse

    // which cell is clicked
    let i = floor(x / cellW);
    let j = floor(y / cellH);

    // cell on/off switch
    cells[j][i] = !cells[j][i];
    popSound.volume(0.4);
    popSound.play()
    lastPos[0] = noseX;
    lastPos[1] = noseY;
  }
}

function onTheBeat(time) {
  currentStep = beat % numSteps; //beat starts at 0, numSteps is global num of columns
  for (let sample = 0; sample < numSamples; sample++) {
    //
    if (cells[sample][currentStep]) {
      // if row at column is 'on'
      let k, k2, k3;
      // grab correct sample from chosen kit
      if (kitChosen == "beats") {
        k = beats.get(soundNames[sample]);
        k.start(time);
      } else if (kitChosen == "trap") {
        k2 = trap.get(soundNames[sample]);
        k2.start(time);
      } else if (kitChosen == "mix") {
        k3 = mix.get(soundNames[sample]);
        k3.start(time);
      }
    }
  }
  beat++; //increase beat for looping
}

function draw() {
  noStroke()
  // initialize canvas + mascot each time
  background(canvasColor);
  slider.input(speedVisualization);
  mascot.updateSpeedSway(drummingSpeed, swayingSpeed);
  mascot.display();
  mascot.update();

  if (myResults && myResults[0]) {
    const nose = myResults[0].pose.rightWrist;
    const realNose = myResults[0].pose.leftShoulder;
    const left = myResults[0].pose.leftWrist;
    //const nose = myResults[0].pose.leftWrist;
    // fill("red");
    // ellipse(nose.x, nose.y, 10, 10);
    image(cursor, nose.x - 30, nose.y - 30, 40, 40)
    //ellipse(left.x, left.y, 10, 10);

    currPos[0] = nose.x;
    currPos[1] = nose.y;

    if (
      b < nose.x &&
      nose.x < b + gridW &&
      a < nose.y &&
      nose.y < a + gridH &&
      dist(currPos[0], currPos[1], lastPos[0], lastPos[1]) > 20
    ) {


      toggleCell(nose.x, nose.y, left.x, left.y, realNose.x, realNose.y);
    }
  }

  // }
  //making sure the centers are stored properly
  // fill("purple");
  // ellipse(71.875, 80, 10, 10);

  // draw play button shadow ---------
  drawingContext.shadowOffsetX = 4;
  drawingContext.shadowOffsetY = 4;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = "grey";
  fill("grey");
  ellipse(canvasW / 2, canvasH / 2 + 90, 100, 100);
  //rect(70, 395, 150, 70, 20);
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = "grey";
  //---------

  // create bpm slider ---------
  // fill("#7c3f58");
  // noStroke();
  // rect(595, 390, 80, 45, 20);
  // textSize(24);
  // fill(bpmTextColor);
  // noStroke();
  // text("BPM", 610, 420);
  // textFont("Fredoka One");

  // make BPM slider control speed of playback
  let currBpm = slider.value();
  // use Tone.Transport to help with bpm
  Tone.Transport.bpm.value = currBpm;
  //fill(value);
  // ---------------

  // draw faded dots

  for (let step = 0; step < numSteps; step++) {
    for (let sample = 0; sample < numSamples; sample++) {
      fill("rgba(192,192,192, 0.5)"); // grey faded dot grid

      xPos = (2 * (b + step * cellW) + cellW) / 2;
      yPos = (2 * (a + sample * cellH) + cellH) / 2;

      // console.log((2 * (b + step * cellW) + cellW) / 2)
      // console.log((2 * (a + sample * cellH) + cellH) / 2)
      ellipse(xPos, yPos, 30, 30);
    }
  }

  // for getting center coords of each cell
  for (let sample = 0; sample < numSamples; sample++) {
    cellCenterPositions[sample] = []; // make am empty array each loop
    for (let step = 0; step < numSteps; step++) {
      fill("rgba(192,192,192, 0.5)"); // grey faded dot grid

      xPos = (2 * (b + step * cellW) + cellW) / 2;
      yPos = (2 * (a + sample * cellH) + cellH) / 2;
      cellCenterPositions[sample][step] = [xPos, yPos];

      // console.log((2 * (b + step * cellW) + cellW) / 2)
      // console.log((2 * (a + sample * cellH) + cellH) / 2)
      ellipse(
        (2 * (b + step * cellW) + cellW) / 2,
        (2 * (a + sample * cellH) + cellH) / 2,
        30,
        30
      );
    }
  }
  //console.log(cellCenterPositions) // show position array

  // fill the 'on' cells in grid each draw loop
  for (let step = 0; step < numSteps; step++) {
    for (let sample = 0; sample < numSamples; sample++) {
      if (cells[sample][step] == 1) {
        // if user turned cell 'on'
        fill(colors[sample]); // fill with correct color scheme
        // rect(
        //   b + step * cellW, //
        //   a + sample * cellH,
        //   cellW,
        //   cellH
        // );
        ellipse(
          (2 * (b + step * cellW) + cellW) / 2, //
          (2 * (a + sample * cellH) + cellH) / 2,
          50,
          50
        );
      }
    }
  }

  // highlight column playing
  for (let i = 0; i <= numSteps; i++) {
    // highlight the cell that is playing
    let step = (beat - 1) % numSteps;
    if (i == step && Tone.Transport.state == "started") {
      fill(0, 40); // highlight column with a shade of black
      noStroke();
      rect(b + i * cellW, a, cellW, gridH);
    }
  }
}

function mousePressed() {
  // make sure the mouse is in the grid
  if (b < mouseX && mouseX < b + gridW && a < mouseY && mouseY < a + gridH) {
    // margins
    let x = mouseX - b;
    let y = mouseY - a;

    // which cell is clicked
    let i = floor(x / cellW);
    let j = floor(y / cellH);

    // cell on/off switch
    popSound.volume(0.4);
    popSound.play()
    //clickSound.play()
    cells[j][i] = !cells[j][i];
  }
}

// PLAY / PAUSE button
function togglePlay() {
  if (Tone.Transport.state == "started") {
    Tone.Transport.stop();
    playButton.style("font-size", "38px");
    playButton.html("▷");
  } else {
    if (beats.loaded && trap.loaded) {
      Tone.Transport.start();
      playButton.style("font-size", "68px")
      playButton.html("⏸");
    }
  }
}

// select the kits 'mySelectEvent' is a function in p5.js
function mySelectEvent() {
  if (menu.value() == "beats") {
    kitChosen = "beats";
  } else if (menu.value() == "trap") {
    kitChosen = "trap";
  } else if (menu.value() == "mix") {
    kitChosen = "mix";
  }
  // say which kit is currently selected and playing in console
  console.log("playing kit: " + kitChosen);
}

// changes drummer mascot's speed of movement according to BPM
function speedVisualization() {
  // setting new drummingSpeed global
  let value = slider.value();
  drummingSpeed = value;
  swayingSpeed = value;
}
