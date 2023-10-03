// https://teachablemachine.withgoogle.com/models/-WRDWUT2c/
// p5.js drum machine
// incorporating elements of tone.js library
// Inspiration: https://editor.p5js.org/asd0999/sketches/r1od2atFQ

// ------------- setting global variables -------------

let classifier1;
//let audioModelJson = 'https://teachablemachine.withgoogle.com/models/meXGvmaJw/' - just clap
// let audioModelJson = 'https://teachablemachine.withgoogle.com/models/JsQC0wMns/' - whistle
let audioModelJson = 'https://teachablemachine.withgoogle.com/models/KUSHmcMR3/' // play_stop


let classifier2;
let imageModelJson = 'https://teachablemachine.withgoogle.com/models/Vz2SwhNTm/'

let canvasW = 800;
let canvasH = 700;
// set some colors ----
let buttonColor = "#7c3f58";
let textColor = "#e2f3e4";
let bpmTextColor = "#e2f3e4";
let canvasColor = "#ee8695";
let gridColor = "##e2f3e4";
// -----------

// vars to control playback ----
let numSteps = 8; // number of columns / loop (x-axis)
let currentStep = 0;
let numSamples = 4; // number of sounds / kit (y-axis)
let beat = 0;
let value = 0;
let cells = []; // stores cells as list

// grid drawing settings ----
let a = 40; // cell height variable
let b = 25; // cell width variable
let gridW, gridH, cellW, cellH; // initializing values for grid
let colors = ["#292831", "#333f58", "#4a7a96", "#96b0b3"]; // array of colors
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
maxBpm = 200
bpm = 50
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
function preload(){
  classifier1 = ml5.soundClassifier(audioModelJson + 'model.json');
  
  // for the image classifier
  classifier2 = ml5.imageClassifier(imageModelJson + 'model.json');
}

function keyPressed(){
  if (keyCode == RIGHT_ARROW && slider.value() < maxBpm){
    bpm += 10
    slider.value(bpm)
  }else if (keyCode == LEFT_ARROW && slider.value() > minBpm){
    bpm -= 10
    slider.value(bpm)
            }
}
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier2.classify(flippedVideo, gotResultVideo);
}

// When we get a result
function gotResultVideo(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  command = results[0].label;
  console.log(command)
  if (command == 'faster' && slider.value() < maxBpm){
    // Classifiy again!
    bpm += 10
    slider.value(bpm)
    classifyVideo();
  } else if (command == 'slower' && slider.value() > minBpm){
    bpm -= 10
    slider.value(bpm)
    classifyVideo();
}
}

function gotResultSound(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  command = results[0].label
  console.log(command);
  
  if (command == 'play'){
    playOnCommand();
  }
  if (command == 'stop'){
    stopOnCommand();
    //togglePlay()
  }
  // if (command == 'clap'){
  //   if(kitChosen == 'beats')
  //   menu.selected('trap');
  //   kitChosen = menu.value();
  // } else if(kitChosen == 'trap') {
  //   menu.selected('mix');
  //   kitChosen = menu.value();
  // } else if (kitChosen == 'mix'){
  //   menu.selected('beats')
  //   kitChosen = menu.value();
  // }
  // Show the first label and confidence
  // label.html('Label: ' + results[0].label);
  // confidence.html('Confidence: ' + nf(results[0].confidence, 0, 2)); // Round the confidence to 0.01
}

function setup() {
  // Start classifying
  classifier1.classify(gotResultSound);
  
  // for classifying the video with TM model ----
  // video = createCapture(VIDEO);
  // video.size(320, 240);
  // video.hide();
  //  flippedVideo = ml5.flipImage(video)
  // // Start classifying
  // classifyVideo();
  // ----
  
  //classifier2.classify(gotResults)
  mascot = new mascot(350, 600);
  // slider for bpm
  slider = createSlider(minBpm, maxBpm, 100);
  slider.position(540, 445);
  slider.input(speedVisualization);
  slider.style("width", "200px");
  // mapping slider to bpm ----

  // drop down menu to select kit ----
  menu = createSelect();
  menu.position(70, 395);
  menu.size(150, 70);
  menu.style("background-color", buttonColor);
  menu.style("font-family", "Fredoka One");
  menu.style("font-size", "30px");
  menu.style("text-align", "center");
  menu.style("border-width", "0px"); // get rid of border width
  menu.style("color", textColor);
  menu.style("border-radius", "20px");
  menu.selected("beats");
  menu.option("beats");
  menu.option("trap");
  menu.option("mix");
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
  playButton = createButton("PLAY");
  playButton.position(280, 380);
  playButton.mouseClicked(togglePlay);
  playButton.style("background-color", buttonColor);
  playButton.size(200, 100);
  playButton.style("font-family", "Fredoka One");
  playButton.style("color", textColor);
  playButton.style("font-size", "48px");
  playButton.style("border-width", "0px"); // get rid of border/stroke
  playButton.style("border-radius", "20px");
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
  // initialize canvas + mascot each time
  background(canvasColor);
  slider.input(speedVisualization);
  mascot.updateSpeedSway(drummingSpeed, swayingSpeed);
  mascot.display();
  mascot.update();

  // create bpm slider ---------
  fill("#7c3f58");
  noStroke();
  rect(595, 390, 80, 45, 20);
  textSize(24);
  fill(bpmTextColor);
  noStroke();
  text("BPM", 610, 420);
  textFont("Fredoka One");

  // make BPM slider control speed of playback
  let currBpm = slider.value();
  // use Tone.Transport to help with bpm
  Tone.Transport.bpm.value = currBpm;
  //fill(value);
  // ---------------

  // fill the 'on' cells in grid each draw loop
  for (let step = 0; step < numSteps; step++) {
    for (let sample = 0; sample < numSamples; sample++) {
      if (cells[sample][step] == 1) {
        // if user turned cell 'on'
        fill(colors[sample]); // fill with correct color scheme
        rect(
          b + step * cellW, //
          a + sample * cellH,
          cellW,
          cellH
        );
      }
    }
  }

  // draw horizontal lines
  for (let i = 0; i <= numSamples; i++) {
    let y = a + i * cellH;
    right = canvasW - b;
    strokeWeight(3);
    stroke(gridColor);
    line(b, y, right, y);
  }

  // draw vertical lines
  noStroke();
  for (let i = 0; i <= numSteps; i++) {
    right = canvasW - b;
    strokeWeight(3);
    stroke(gridColor);
    line(b + i * cellW, a, b + i * cellW, a + gridH);
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
      playButton.html("STOP");
    }
  }
}

function playOnCommand(){
  if (beats.loaded && trap.loaded) {
      Tone.Transport.start();
      playButton.html("STOP");
    }
}

function stopOnCommand(){
  if (Tone.Transport.state == "started") {
    Tone.Transport.stop();
    playButton.html("PLAY");
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
