let grid;
let sclX, sclY; //Width and height of grid rectangles.

let picked = [];

let hideNumbers = false;
let numberOfClicks = 0;

let firstTime = true;
let time;

let totalNumbers;

function preload() {
  win = loadSound('ding.mp3');
  fail = loadSound('fail.mp3');
}

function setup() {
  // HTML elements to display info about the game.
  createCanvas(windowWidth / 1.3, windowHeight);
  select('canvas').position(0, 0);

  createP('Click the numbers in the correct order to win the game!').position(width, 0);

  createP('Choose how many numbers you want to memorize:').position(width, 85);
  numbersInput = createInput(9).position(width, 120);
  totalNumbers = parseInt(numbersInput.value());
  numbersInput.changed(generateRandomNumbers);

  createP('Time to memorize numbers (only avaliable in hard mode): ').position(width, 200);
  input = createInput(0.5).position(width, 280).value(0.5);

  createP('Game difficulty:').position(width, 140);
  select = createSelect().position(width, 180);
  select.option('Easy');
  select.option('Normal');
  select.option('Hard');

  select.changed(generateRandomNumbers);


  // Setting number of rows and cols of the grid.
  rows = 5;
  cols = 8;

  // Adjusting the scale of each grid cell.
  sclX = width / cols;
  sclY = height / rows;

  // Making a 2D array full of cell objects.
  grid = Array(rows).fill().map((x, j) => Array(cols).fill().map((y, i) => new Cell(j, i)));

  generateRandomNumbers();
}


function draw() {
  background(51);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      // Changes how the grid is shown based on the game mode.
      switch (select.value()) {
        case "Easy":
          if (grid[j][i].number) grid[j][i].show();
          break;
        case "Normal":
          if (numberOfClicks !== 0) grid[j][i].show();
          break;
        case "Hard":
          if (grid[j][i].number) grid[j][i].show();
          break;
      }

      // Shows the number inside the grid (if it is not zero).
      grid[j][i].showNum();
      // Marks already clicked-on cells as white.
      grid[j][i].highlight();
    }
  }

  // Shows the numbers for a set amount of then hideNumberss it.
  if (select.value() === "Hard") {
    if (firstTime) {
      time = millis();
    }

    if (millis() - time > input.value() * 1000) {
      hideNumbers = true;
    }
    firstTime = false;
  }
}

function generateRandomNumbers() {
  picked = [];
  totalNumbers = parseInt(numbersInput.value());
  firstTime = true;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      // Resetting the grid.
      grid[j][i].number = 0;
      grid[j][i].clicked = false;
    }
  }

  // Algorithm for generating a "totalNumber" number of unique positions
  // to display the numbers.

  while (picked.length < totalNumbers) {
    let randomPos = floor(random(rows * cols));
    if (!picked.includes(randomPos) && picked.length < totalNumbers)
      picked.push(randomPos);
  }

  for (let n = 0; n < totalNumbers; n++) {
    let randomI = picked[n] % cols;
    let randomJ = floor(picked[n] / cols);
    grid[randomJ][randomI].setNumber(n + 1);
  }

  // Shows numbers after they are generated.
  hideNumbers = false;
  numberOfClicks = 0;
}

function mousePressed() {
  // If the mouse is pressed within the canvas, increment numberOfClicks and hide the numbers.
  if (mouseX < width && mouseY < height) {
    hideNumbers = true;
    numberOfClicks++;
    checkClick();
  }
}

//Cheks if the player cliqued in the correct cell.
function checkClick() {
  let i = floor(mouseX / sclX);
  let j = floor(mouseY / sclY);

  if (grid[j][i].number !== numberOfClicks) {
    // Reset and play the fail sound when the player clicks the wrong cell.
    hideNumbers = false;
    numberOfClicks = 0;
    fail.play();
    firstTime = true;
    generateRandomNumbers();
  } else grid[j][i].clicked = true;

  if (numberOfClicks === totalNumbers && hideNumbers) {
    // Reset and play the win sound when the player clicks all the correct cells.
    hideNumbers = false;
    numberOfClicks = 0;
    win.play();
    firstTime = true;
    generateRandomNumbers();
  }
}
