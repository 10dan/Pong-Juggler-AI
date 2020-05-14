class Ball {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.xv = 0;
    this.yv = 0;
    this.speed = 2;
    this.size = 20;
    this.color = color(random(255), 255, 255);
    this.t = millis();
    this.reset();
  }
  move() {
    let tempx = this.x;
    let tempy = this.y;
    this.x += this.xv;
    this.y += this.yv;
    if ((this.x < 0) || (this.x > width)) {
      this.xv *= -1;
      this.x = tempx;
    }
    if (this.y < 0) {
      this.yv *= -1;
      this.y = tempy;
    }
    if (this.y > height) {
      this.reset();
      score -= 10;
    }
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xv = random(-this.speed, this.speed);
    this.yv = this.speed;
  }
}
