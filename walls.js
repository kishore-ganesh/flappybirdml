function Wall(x, topy, bottomy, width, topheight, bottomheight) {
  this.x = x;
  this.topy = topy;
  this.bottomy = bottomy;
  this.height = height;
  this.width = width;
  this.velocity = -1;
  this.topheight = topheight;
  this.bottomheight = bottomheight;

  this.update = function() {
    this.x += this.velocity;
  };

  this.scale = function(speed) {
    this.velocity = -1 * speed;
  };

  this.show = function() {
    rect(this.x, this.topy, this.width, this.topheight);

    rect(this.x, this.bottomy, this.width, this.bottomheight);
  };
}
    