let totalScore;

function nextGen() {
	totalScore = 0;
	birds = [];
	pipes[currentPipe].respawn(pipes[(currentPipe + 2) % pipes.length].pos.x + 360);
	currentPipe++;
	currentPipe %= pipes.length;

	console.log(++generations);

	for (let i = 0; i < savedBirds.length; i++) {
		totalScore += savedBirds[i].score;
	}

	for (let i = 0; i < popSize; i++) {
		birds[i] = pickOne();
	}

	savedBirds = [];
}

function pickOne() {
	let index = 0;
	let r = Math.random() * totalScore;

	while (r > 0) {
		r -= savedBirds[index].score;
		index++;
	}
	index--;

	const child = new Bird(savedBirds[index].neuralNet);
	child.mutate();
	return child;
}