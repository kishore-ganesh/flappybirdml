function Bird(y) {
  this.y = random(0, height);
  this.x = 25;
  this.gravity = 0.7;
  this.veloy = 0;
  this.velox = 0;
  this.lift = -15;
  this.score = 0;
  this.brain = new NeuralNetwork(4, 2, 1);
  this.hasCollided = false;
  this.time = 0;
  this.jumps = 0;

  this.up = function() {
    this.veloy += this.lift;
  };

  this.setter = function(velox) {
    this.velox = velox;
  };

  this.show = function() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, 32, 32);
  };
  this.update = function() {
    this.veloy = this.veloy + this.gravity;
    this.y += this.veloy;
    this.veloy *= 0.9;
    this.x += this.velox;

    if (this.y > height) {
      this.y = height;
      this.veloy = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.veloy = 0;
    }
  };

  this.scale = function(speed) {
    this.gravity = 0.7 * speed;
    this.lift = -15 * speed;
  };
}
