class mascot {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.speed = 5.5;
    this.swaySpeed = 0.1;
    this.eyesInnerColor = color("#5b37cb")
    this.eyesOuterColor = color('#f8943e')
    this.bodyColor = color("#f8943e");
    this.armsColor = color("#5b37cb")
    this.shadowColor = color("red")

  }
  update() {

    this.x = this.x + sin(frameCount * 0.05) * this.swaySpeed; // make him move side to side! 
    // this.swaySpeed

  }

  updateSpeedSway(drummingSpeed, swayingSpeed) {
    let speedMap = map(drummingSpeed, 50, 200, 12, 3);
    let swayMap = map(swayingSpeed, 50, 200, 4, 7)
    this.speed = speedMap;
    this.swaySpeed = swayMap;


  }
  display() {
    //   push();
    //   drawingContext.shadowOffsetX = 5;
    // drawingContext.shadowOffsetY = 5;
    // drawingContext.shadowBlur = 10;
    // drawingContext.shadowColor = 'black';
    //   this.drawing(this.x, this.y,this.shadowColor, this.shadowColor, this.shadowColor, this.shadowColor)
    //   pop();

    // to draw a shadow
    push()

    drawingContext.shadowOffsetX = 2;
    drawingContext.shadowOffsetY = 2;
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = this.shadowColor;
    this.drawing(this.x, this.y)
    pop()
  }
  drawing(offsetX, offsetY, bodyColor = this.bodyColor, eyesOuterColor = this.eyesOuterColor, eyesInnerColor = this.eyesInnerColor, armsColor = this.armsColor) {

    translate(offsetX, offsetY)
    //   push()
    //   drawingContext.shadowOffsetX = 5;
    // drawingContext.shadowOffsetY = 3;
    // drawingContext.shadowBlur = 10;
    // drawingContext.shadowColor = 'black';

    drawArms(0, 0, this.speed, armsColor);
    noStroke();
    // creature head
    fill(bodyColor);
    ellipse(0, 0, 160, 80);
    // pop()

    // eyes outer
    fill(eyesOuterColor);
    ellipse(-50, -40, 50, 50);
    ellipse(50, -40, 50, 50);
    // eyes inner
    fill(eyesInnerColor);
    ellipse(-50, -40, 30, 30);
    ellipse(50, -40, 30, 30);
    // fill('black')
    // ellipse(-50, -40, 10, 10);
    // ellipse(50, -40, 10, 10);
    // mouth
    //ellipse(0, 10, 40, 40)
    rect(-16, 0, 30, 6);

    //arms - they are drumming!!
    function drawArms(x, y, speed, armsColor) {
      fill(armsColor)
      push();
      let angle = frameCount / speed;
      rotate(radians(cos(angle) * 8));
      translate(0, -10);
      strokeWeight(15);
      stroke(armsColor);

      //left arm
      curve(-7, 17, -37, 47, -58, 28, -19, 40);

      //right arm
      curve(7, 17, 37, 49, 58, 30, 19, 42);
      pop();
    }
  }
}
