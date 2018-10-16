function setup() {
  createCanvas(800, 600);
  slider1 = createSlider(-100, -1);
  slider1.position();
  //bird = new Bird();
  birds = [];
  for (let i = 0; i < 10; i++) {
    birds.push(new Bird(300));
  }
  height = 600;
  gap = 300;
  walllist = [];

  for (let i = 0; i < 10; i++) {
    addToWallList(200 * i);
  }
}

function addToWallList(offset) {
  z = random() * (height - gap);
  bottomheight = height - z - gap;
  walllist.push({
    top: new Wall(200 + offset, 0, 50, z),
    bottom: new Wall(200 + offset, height - bottomheight, 50, bottomheight)
  });
}

function draw() {
  background(0);
  frameRate(10);
  //frameRate(60);
  noStroke();
  fill(255);
  // text(bird.score, 100, 100);
  //console.log(walllist[0].top.x);
  for (let i = 0; i < birds.length; i++) {
    closest = walllist[0].top.x > birds[i].x ? walllist[0] : walllist[1];
    //console.log(closest.top.x-birds[i].x);
    inputs = [
      (birds[i].y-closest.bottom.y + 150) / height,
      (closest.bottom.y-birds[i].y) / height,
      (closest.top.x) / 600,
      (birds[i].x)/600
    ];
    if (!birds[i].hasCollided) {
      birds[i].time++;
      let output = birds[i].brain.feedforward(inputs);

      if (birds[i].score > 1) {
        console.log(i + " " + birds[i].score);
      }
      //help best bird
      //console.log(output[0]);
      // console.log(closest.top.x-birds[0].x);
      if (output[0] > 0.5) {
        birds[i].up();
        birds[i].jumps++; 
      }

      birds[i].update();
      birds[i].show();
    }
  }

  //bird jumps only in between
  //Should we pass in difference?
  for (let i = 0; i < walllist.length; i++) {
    fill(0, 255, 0);
    rect(
      walllist[i].top.x,
      walllist[i].top.y,
      walllist[i].top.width,
      walllist[i].top.height
    );

    walllist[i].top.velocity = slider1.value();
    walllist[i].bottom.velocity = slider1.value();
    walllist[i].top.update();
    walllist[i].bottom.update();

    if (i <= 2) {
      for (let j = 0; j < birds.length; j++) {
        isColliding(birds[j], walllist[i]);
      }
    }
    if (walllist[i].top.x < -50) {
      walllist.splice(0, 1);
      addToWallList(walllist[walllist.length - 1].top.x);
    }
    rect(
      walllist[i].bottom.x,
      walllist[i].bottom.y,
      walllist[i].bottom.width,
      walllist[i].bottom.height
    );
  }

  let allCollided = true;
  for (let i = 0; i < birds.length; i++) {
    if (!birds[i].hasCollided) {
      allCollided = false;
      break;
    }
  }

  if (allCollided) {
    // console.log(birds[0].time+" "+birds[birds.length-1].time);

    birds.sort((a, b) => {
      return a.jumps - b.jumps;
    });

    bestBird = birds[birds.length - 1];
      // birds.sort((a, b)=>{
    	// return a.time-b.time;
      // }
    secondBestBird = birds[birds.length - 2];
    let length = birds.length;
    birds = [];

    for (let i = 0; i < length; i++) {
      createdBird = new Bird();
      createdBird.brain.inheritFrom(bestBird.brain, secondBestBird.brain);
      
      createdBird.brain.mutate(0.2);
      birds.push(createdBird);
    }

    //   for(let i=0; i<walllist.length; i++)
    //   {
    // 	  walllist[i].top.x+=200;
    // 	  walllist[i].bottom.x+=200;
    //   }

    //   let closest=walllist[0].top.x>birds[0].x?0:1;
    //   walllist.splice(closest, 1);
  }
}

function isColliding(bird, wallitem) {
  top = wallitem.top;
  bottom = wallitem.bottom;
  if (
    (bird.x + 16 >= wallitem.top.x &&
      bird.y - 16 <= wallitem.top.y + wallitem.top.height) ||
    (bird.x + 16 >= wallitem.top.x && bird.y + 16 >= wallitem.bottom.y)
  ) {
    // wallitem.top.velocity = 0;
    // wallitem.bottom.velocity = 0;
    bird.setter(0);
    bird.veloy = 0;
    bird.lift = 0;
    bird.gravity += 100;
    bird.hasCollided = true;
  } else if (bird.x - 50 == wallitem.bottom.x) {
    bird.score += 1;
    //console.log(bird.score);
  }
}
function Bird(y) {
  this.y = random(0, height);
  this.x = 25;
  this.gravity = 0.7;
  this.veloy = 0;
  this.velox = 0;
  this.lift = -15;
  this.score = 0;
  this.brain = new NeuralNetwork(4, 1, 1);
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
}

// function keyPressed()
// {
// 	if(key==' ')
// 	{

// 		bird.up();
// 	}
// }

function Wall(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;
  this.velocity = -1;

  this.update = function() {
    this.x += this.velocity;
  };
}
