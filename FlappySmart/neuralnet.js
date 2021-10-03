class NeuralNetwork {
	constructor() {
		this.inputs = Array(2).fill(0);
		this.hidden = Array(2).fill(0);
		this.output = 0;

		this.inputWeights = Array(2).fill().map(x => Array(2).fill().map(y => random(-1, 1)));
		this.hiddenWeights = Array(2).fill().map(y => random(-1, 1));

		this.activationFunction = Math.tanh;
	}

	feedForward(input) {
		this.input = input;

		for (let i = 0; i < this.hidden.length; i++) {
			this.hidden[i] = this.input[0] * this.inputWeights[i][0] + this.input[1] * this.inputWeights[i][1];
			this.hidden[i] = this.activationFunction(this.hidden[i]);
		}

		this.output = this.hidden[0] * this.hiddenWeights[0] + this.hidden[1] * this.hiddenWeights[1];
		this.output = this.activationFunction(this.output);
	}
}