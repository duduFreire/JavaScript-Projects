const popSize = 100;

let birds = [];
let savedBirds = [];
const pipes = [];

let currentPipe = 0;
let generations = 1;

function setup() {
	createCanvas(600, windowHeight);

	for (let i = 0; i < popSize; i++) {
		birds[i] = new Bird();
	}

	for (let i = 0; i < 3; i++) {
		pipes[i] = new Pipe(width + i * 360);
	}
	ellipseMode(RADIUS);

	console.log(generations);
}

function draw() {
	background(113, 200, 206);

	for (const pipe of pipes) {
		pipe.update();
		pipe.display();

		if (pipe.pos.x < -pipe.width) {
			pipe.respawn(width + 360);
		}

	}

	if (pipes[currentPipe].pos.x + pipes[currentPipe].width + 16 < width / 10) {
		currentPipe++;
		currentPipe %= pipes.length;
	}

	for (let i = birds.length - 1; i >= 0; i--) {
		if (birds[i].hit(pipes[currentPipe])) {
			savedBirds.push(birds.splice(i, 1)[0]);
			continue;
		}

		birds[i].think();
		birds[i].update();
		if (i < 10)
			birds[i].display();
	}

	if (birds.length === 0) {
		nextGen();
	}

}