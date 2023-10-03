class mascot {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.speed = 5.5;
    this.swaySpeed = 0.1;
    
  }
  update() {
    
    this.x = this.x + sin(frameCount * 0.05) * this.swaySpeed; // make him move side to side! 
    // this.swaySpeed
    
  }
  
  updateSpeedSway(drummingSpeed, swayingSpeed){
    let speedMap = map(drummingSpeed, 50, 200, 12, 3);
    let swayMap = map(swayingSpeed, 50, 200, 4, 7)
    this.speed = speedMap;
    this.swaySpeed = swayMap;
    
    
  }
  display() {
    push();
    
    translate(this.x, this.y)
    drawArms(0, 0, this.speed);
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
    rect(-14, 0, 30, 8);

    //arms - they are drumming!!
    function drawArms(x, y, speed) {
      push();
      let angle = frameCount / speed;
      rotate(radians(cos(angle) * 8));
      translate(0, -10);
      strokeWeight(15);
      stroke("#7c3f58");

      //left arm
      curve(-7, 17, -37, 47, -58, 28, -19, 40);

      //right arm
      curve(7, 17, 37, 49, 58, 30, 19, 42);
      pop();
    }

    pop();
  }
}
