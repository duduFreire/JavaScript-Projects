let grid;
let sclX, sclY;

let picked = [];

let hide = false;
let numberOfClicks = 0;

let firstTime = true;
let time;

let totalNumbers;

function preload() {
  win = loadSound('ding.mp3');
  fail = loadSound('fail.mp3');
}

function setup() {
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


  rows = 5;
  cols = 8;

  sclX = width / cols;
  sclY = height / rows;

  grid = Array(rows).fill().map((x, j) => Array(cols).fill().map((y, i) => new Cell(j, i)));
  generateRandomNumbers();
}


function draw() {
  background(51);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
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

      grid[j][i].showNum();
      grid[j][i].highlight();
    }
  }

  if (select.value() === "Hard") {
    if (firstTime) {
      time = millis();
    }

    if (millis() - time > input.value() * 1000) {
      hide = true;
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
      grid[j][i].number = 0;
      grid[j][i].clicked = false;
    }
  }

  while (picked.length < totalNumbers) {
    let randomPos = floor(random(rows * cols));
    if (!picked.includes(randomPos) && picked.length < totalNumbers)
      picked.push(randomPos);
  }

  for (let n = 0; n < totalNumbers; n++) {
    let randomI = picked[n] % cols;
    let randomJ = floor(picked[n] / cols);
    grid[randomJ][randomI].setNum(n + 1);
  }

  hide = false;
  numberOfClicks = 0;
}

function startGame() {
  hide = true;
  numberOfClicks++;
  checkClick();
}

function mousePressed() {
  if (mouseX < width && mouseY < height) {
    startGame();
  }
}

function checkClick() {
  let i = floor(mouseX / sclX);
  let j = floor(mouseY / sclY);

  if (grid[j][i].number !== numberOfClicks) {
    hide = false;
    numberOfClicks = 0;
    fail.play();
    firstTime = true;
    generateRandomNumbers();
  } else grid[j][i].clicked = true;

  if (numberOfClicks === totalNumbers && hide) {
    hide = false;
    numberOfClicks = 0;
    win.play();
    firstTime = true;
    generateRandomNumbers();
  }
}
