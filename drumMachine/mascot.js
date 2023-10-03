class mascot {
  constructor(startX, startY, drumPng) {
    this.x = startX;
    this.y = startY;
    this.speed = 5.5;
    this.swaySpeed = 0.1;
    this.drum = drumPng
  }

  updateSpeedSway(drummingSpeed, swayingSpeed){
    let speedMap = map(drummingSpeed, 50, 200, 12, 3);
    let swayMap = map(swayingSpeed, 50, 200, 4, 7)
    this.speed = speedMap;
    this.swaySpeed = swayMap;
  }
  update() {
    this.x = this.x + sin(frameCount * 0.1) * this.swaySpeed; // make him move side to side!
  }

  // function for drumer's appearance
  display() {
    push();
    translate(this.x, this.y);
    image(this.drum, -115,10, 225, 125);
    this.drawArms(0, 0, this.speed); // call function draw arms
    noStroke();
    // creature head
    fill("#fff6d3");
    ellipse(0, 0, 160, 80);

    // eyes
    fill("#fff6d3");
    ellipse(-50, -40, 50, 50);
    ellipse(50, -40, 50, 50);
    fill("#7c3f58");
    ellipse(-50, -40, 30, 30);
    ellipse(50, -40, 30, 30);
    // mouth
    rect(-14, 0, 30, 8)

    

    pop();
  }

  //arms - they are drumming!!
  drawArms(x, y, speed) {
    push();
    let angle = frameCount / speed;
    rotate(radians(cos(angle) * 8));
    translate(0, -10);
    strokeWeight(15);
    stroke("#7c3f58");

    // arms
    curve(-7, 17, -37, 47, -58, 28, -19, 40); //left arm
    curve(7, 17, 37, 49, 58, 30, 19, 42); //right arm
    pop();
  }
}
