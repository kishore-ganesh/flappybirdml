var globalBestBird;
var globalSecondBestBird;
let maxTime=0;
function setup() {
  createCanvas(800, 600);
  slider1 = createSlider(1, 1000);
  slider1.value(1);
  // speed=slider1.value();
  inputBox = createInput();
  saveButton = createButton("Save generation");
  loadButton = createButton("Load generation");
  saveButton.mousePressed(saveGeneration);
  loadButton.mousePressed(loadGeneration);
  slider1.position();
  //bird = new Bird();
  birds = [];
  noOfBirds = 250;
  for (let i = 0; i < noOfBirds; i++) {
    birds.push(new Bird(300));
  }
  height = 600;
  gap = 150;
  wallgap = 400;
  walllist = [];

  for (let i = 0; i < 10; i++) {
    addToWallList(wallgap * i);
  }

  
}


function poolSelection(birds) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= birds[index].time;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  // Make sure it's a copy!
  // (this includes mutation)
  return birds[index];
}

function addToWallList(offset) {
  z = random() * (height - gap);
  bottomheight = height - z - gap;
  walllist.push({
    top: new Wall(wallgap + offset, 0, 50, z),
    bottom: new Wall(wallgap + offset, height - bottomheight, 50, bottomheight)
  });
}

function pickOne(birds)
{
//   let index=Math.floor(Math.random()*(birds.length-1));
//   console.log(index);
//   //let chosenBird=undefined;
//   r=random();
//   while(birds[index].time>r)
//   {
//     index=Math.random()*(birds.length-1);
//     //r=random()
//   }

  return random(birds);
  
}

function loadGeneration() {
  let bestBird = new Bird();
  let secondBestBird = new Bird();
  bestBird.brain.get(inputBox.value);
  secondBestBird.brain.get(inputBox.value + "2");
  birds = [];
  birds.push(bestBird);
  birds.push(secondBestBird);
  redraw();
}

function saveGeneration() {
  globalBestBird.brain.dump(inputBox.value);
  globalSecondBestBird.brain.dump(inputBox.value + "2");
}

function draw() {
  background(0);
  //frameRate(10);
  //frameRate(5);
  frameRate(60);
  //check bias dimension
  noStroke();
  fill(255);
  for (let noOfLoops = 0; noOfLoops < slider1.value(); noOfLoops++) {
    for (let i = 0; i < birds.length; i++) {
      closest = walllist[0].top.x > birds[i].x ? walllist[0] : walllist[1];
      // console.log(walllist[1].top.x+" "+walllist[2].top.x);
      //console.log(closest.top.x-birds[i].x);
      inputs = [
        (closest.bottom.y - 150) / height,
        closest.bottom.y / height,
        (closest.top.x - birds[i].x - 16) / 600,
        birds[i].y / height
      ];
      if (!birds[i].hasCollided) {
        birds[i].time++;
        maxTime=max(maxTime, birds[i].time);
        let output = birds[i].brain.feedforward(inputs);

        //  console.log(i + " " + birds[i].score);

        //help best bird
        //console.log(output[0]);
        // console.log(closest.top.x-birds[0].x);
        if (output[0] > 0.5) {
          birds[i].up();
          birds[i].jumps++;
        }

        // birds[i].scale(slider1.value());
        birds[i].update();
        if (slider1.value() < 5) {
          birds[i].show();
        }
      }
    }

    //bird jumps only in between
    //Should we pass in difference?
    for (let i = 0; i < walllist.length; i++) {
      fill(0, 255, 0);

      if (slider1.value() < 5) {
        rect(
          walllist[i].top.x,
          walllist[i].top.y,
          walllist[i].top.width,
          walllist[i].top.height
        );
      }

      //walllist[i].top.velocity = slider1.value();
      //walllist[i].bottom.velocity = slider1.value();
      // walllist[i].top.scale(slider1.value());
      //walllist[i].bottom.scale(slider1.value());
      walllist[i].top.update();
      walllist[i].bottom.update();

      if (i <= 2) {
        for (let j = 0; j < birds.length; j++) {
          if (!birds[j].hasCollided) {
            isColliding(birds[j], walllist[i]);
          }
        }
      }
      if (walllist[i].top.x < -50) {
        walllist.splice(0, 1);
        addToWallList(walllist[walllist.length - 1].top.x);
      }
      if (slider1.value() < 5) {
        rect(
          walllist[i].bottom.x,
          walllist[i].bottom.y,
          walllist[i].bottom.width,
          walllist[i].bottom.height
        );
      }
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

      // birds.sort((a, b) => {
      //   return a.jumps - b.jumps;
      // });
      console.log("ALL COLLIDED");
      birds.sort((a, b) => {
        return a.time - b.time;
      });

      // console.log(maxTime);
      for(let bird=0; bird<birds.length; bird++)
      {
        birds[bird].time/=maxTime;
        //console.log(birds[bird].time);
      }



    

    //  bestBird = birds[birds.length - 1];

    //   // birds.sort((a, b)=>{
    //   // return a.time-b.time;
    //   // });
      // secondBestBird = birds[birds.length - 2];
    //   if (globalBestBird == undefined) {
    //     globalBestBird = bestBird;
    //     globalSecondBestBird = secondBestBird;
    //   } else {
    //     if (globalBestBird.time > bestBird.time) {
    //       // bestBird = globalBestBird;
    //     } else {
    //       globalBestBird = bestBird;
    //     }

    //     if (globalSecondBestBird.time > secondBestBird.time) {
    //       //secondBestBird = globalSecondBestBird;
    //     } else {
    //       globalSecondBestBird = secondBestBird;
    //     }
    //   }

      // birds = [];

      //console.log(birds);

      for (let i = 0; i < noOfBirds; i++) {
        createdBird = new Bird(closest.bottom.y - 150);
        let bestBird=poolSelection(birds);
        let secondBestBird=poolSelection(birds);
        createdBird.brain.inheritFrom(bestBird.brain, secondBestBird.brain);
        createdBird.brain.mutate(0.1);
        birds.push(createdBird);
      }

     birds.splice(0, noOfBirds);

      for (let i = 0; i < walllist.length; i++) {
        walllist[i].top.x += wallgap;
        walllist[i].bottom.x += wallgap;
      }

      //   let closest=walllist[0].top.x>birds[0].x?0:1;
      //   walllist.splice(closest, 1);
    }
  }
  // text(bird.score, 100, 100);
  //console.log(walllist[0].top.x);
}

function isColliding(bird, wallitem) {
  top = wallitem.top;
  bottom = wallitem.bottom;
  if (
    bird.x + 16 >= wallitem.top.x &&
    bird.x - 16 <= wallitem.top.x + 50 &&
    (bird.y - 16 <= wallitem.top.height || bird.y + 16 >= wallitem.bottom.y)
  ) {
    // wallitem.top.velocity = 0;
    // wallitem.bottom.velocity = 0;
    //bird.setter(0);
    //bird.veloy = 0;
    //bird.lift = 0;
    //bird.gravity += 100;
    bird.hasCollided = true;
  } else if (bird.x - 16 - 50 == wallitem.bottom.x) {
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

  this.scale = function(speed) {
    this.velocity = -1 * speed;
  };
}
