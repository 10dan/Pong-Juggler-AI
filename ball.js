class Ball {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.xv = 0;
    this.yv = 0;
    this.speed = 3;
    this.size = 20;
    this.color = color(random(255), 255, 255);
    this.t = millis();
    this.reset();

  }
  move() {
    this.x += this.xv;
    this.y += this.yv;
    if ((this.x < 0) || (this.x > width)) {
      this.yv += 1;
      this.xv *= -1;
    }
    if (this.y < 0) {
      this.yv *= -1;
    }
    if (this.y > height) {
      this.reset();
      score -= 10;
    }

    if (millis() - this.t > 500) { //Needed to stop it expliting game.
      if ((this.y >= y - wid) &&
        (this.x < x + len) &&
        (this.x > x - len)) {
        this.t = millis();
        score += 50; //Reward for hitting a ball.
        this.scoreToAdd++;
        let a = map(this.x - x, -len, len, 0, -PI);
        this.xv = -cos(a) * this.speed;
        this.yv = -sin(a) * this.speed;
        this.yv *= -1;
      }
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
    let angle = random(0, PI);
    this.xv = -cos(angle) * this.speed;
    this.yv = -sin(angle) * this.speed;
  }
}