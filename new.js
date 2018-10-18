var globalBestBird;
var globalSecondBestBird;

function setup() {
  createCanvas(800, 600);
  slider1 = createSlider(1, 100);
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
  generateWallList();

  
}

function generateWallList(){


  walllist=[];
  for (let i = 0; i < 10; i++) {
    addToWallList(wallgap * i);
  }
}

//We do pool selection to increase variation
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
    // console.log(birds[index].time);
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
  walllist.push(
    new Wall(wallgap + offset, 0, height - bottomheight, 50, z, bottomheight)
    // bottom: new Wall(wallgap + offset, height - bottomheight, 50, bottomheight)
  );
}

function pickOne(birds) {
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

function nextGeneration() {
  console.log("ALL COLLIDED");
  birds.sort((a, b) => {
    return a.time - b.time;
  });

  //let maxTime = birds[birds.length - 1].time;

  
  let sum=0;
  for(let j=0; j<birds.length; j++)
  {
    sum+=birds[j].time;
  }
  for (let birdIndex = 0; birdIndex < birds.length; birdIndex++) {
    birds[birdIndex].time /= sum;
     //console.log(birds[birdIndex].time);
  }

  // globalBestBird=globalBestBird.time>birds[birds.length-1].time?globalBestBird:birds[birds.length-1];
  // seconBestBird=secondBestBird.time>birds[birds.length-2].time?globalSecondBestBird:birds[birds.length-2];

  let bestBird = birds[birds.length - 1];
  let secondBestBird = birds[birds.length - 2];
    if (globalBestBird == undefined) {
      globalBestBird = bestBird;
      globalSecondBestBird = secondBestBird;
    } else {
      if (globalBestBird.time > bestBird.time) {
  //       // bestBird = globalBestBird;
      } else {
        globalBestBird = bestBird;
      }

      if (globalSecondBestBird.time > secondBestBird.time) {
  //       //secondBestBird = globalSecondBestBird;
      } else {
        globalSecondBestBird = secondBestBird;
      }
    }


    //also give next
  // birds = [];

  //console.log(birds);
  let newBirds=[];
  for (let i = 0; i < noOfBirds; i++) {
    createdBird = new Bird(closest.bottomy - 150);
    let bestBird = poolSelection(birds);
    let secondBestBird = poolSelection(birds);
    createdBird.brain.inheritFrom(bestBird.brain, secondBestBird.brain);
    createdBird.brain.mutate(0.1);
    newBirds.push(createdBird);
  }
  //console.log(birds.length);
  birds=newBirds;
  //birds.splice(0, noOfBirds);
  //console.log(birds.length);
  // for (let i = 0; i < walllist.length; i++) {
  //   walllist[i].x += wallgap;
  // }

  generateWallList();
}

function checkAllCollided() {
  //let allCollided=true;
  for (let i = 0; i < birds.length; i++) {
    if (!birds[i].hasCollided) {
      return false;
    }
  }

  return true;
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
      if (!birds[i].hasCollided) {
        closest = walllist[0].x +50> birds[i].x-16 ? walllist[0] : walllist[1];
        
        
        // console.log(walllist[1].top.x+" "+walllist[2].top.x);
        //console.log(closest.top.x-birds[i].x);
        inputs = [
          (closest.bottomy - 150) / height,
          closest.bottomy / height,
          (closest.x - birds[i].x - 16) / 600,
          birds[i].y / height
        ];

        // console.log(inputs);
        birds[i].time++;
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
        walllist[i].show();
      }

      walllist[i].update();

      if (i <= 2) {
        for (let j = 0; j < birds.length; j++) {
          if (!birds[j].hasCollided) {
            isColliding(birds[j], walllist[i]);
          }
        }
      }
      if (walllist[i].x < -50) {
        walllist.splice(0, 1);
        addToWallList(walllist[walllist.length - 1].x);
      }
    }

    if (checkAllCollided()) {
      nextGeneration();

      //   let closest=walllist[0].top.x>birds[0].x?0:1;
      //   walllist.splice(closest, 1);
    }
  }
  // text(bird.score, 100, 100);
  //console.log(walllist[0].top.x);
}

function isColliding(bird, wallitem) {
  if (
    bird.x + 16 >= wallitem.x &&
    bird.x - 16 <= wallitem.x + 50 &&
    (bird.y - 16 <= wallitem.topheight || bird.y + 16 >= wallitem.bottomy)
  ) {
    // wallitem.top.velocity = 0;
    // wallitem.bottom.velocity = 0;
    //bird.setter(0);
    //bird.veloy = 0;
    //bird.lift = 0;
    //bird.gravity += 100;
    bird.hasCollided = true;
  } else if (bird.x - 16 - 50 == wallitem.x) {
    bird.score += 1;
    //console.log(bird.score);
  }
}

// function keyPressed()
// {
// 	if(key==' ')
// 	{

// 		bird.up();
// 	}
// }
