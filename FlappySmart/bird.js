const gravity = 0.25;
const jumpSpeed = 6;

class Bird {
	constructor(neuralNet) {
		this.pos = createVector(width / 10, height / 2);
		this.vel = 0;
		this.radius = 16;

		this.neuralNet = neuralNet || new NeuralNetwork();
		this.score = 0;
	}

	display() {
		fill(210, 192, 51);
		ellipse(this.pos.x, this.pos.y, this.radius);
	}

	think() {
		this.neuralNet.feedForward([
			(pipes[currentPipe].pos.x + pipes[currentPipe].width / 2 - this.pos.x) / width,
			(this.pos.y - pipes[currentPipe].pos.y) / height
		]);

		if (this.neuralNet.output >= 0) {
			this.jump();
		}
	}

	update() {
		this.pos.y += this.vel;
		this.vel += gravity;
		this.score++;
	}

	hit(pipe) {
		return this.pos.x + this.radius >= pipe.pos.x && this.pos.x - this.radius <= pipe.pos.x + pipe.width &&
			(this.pos.y + this.radius >= pipe.pos.y + pipe.gap / 2 || this.pos.y - this.radius <= pipe.pos.y - pipe.gap / 2)
	}

	jump() {
		this.vel = -jumpSpeed;
	}

	mutate() {
		for (let i = 0; i < this.neuralNet.inputWeights.length; i++) {
			if (Math.random() < 0.01) this.neuralNet.hiddenWeights[i] += Math.random() * 0.5 - 0.25;
			for (let j = 0; j < this.neuralNet.inputWeights.length; j++) {
				if (Math.random() < 0.01) this.neuralNet.inputWeights[i][j] += Math.random() * 0.5 - 0.25;
			}
		}
	}
}