const range = 4;
const coefficients = [];
let terms = [];
let scalingFactor;

let t = 0;

const numOfTerms = 30; // Actual number of terms is 2 * numOfterms + 1;

let trailX = [];
let trailY = [];

function setup() {
	createCanvas(720, 720);
	ellipseMode(RADIUS);

	scalingFactor = width / (2 * range);

	// Calculate coefficients.
	for (let n = -numOfTerms; n <= numOfTerms; n++) {
		//coefficients.push(stepFunction(n));
		coefficients.push(coefficient(x => new Complex(Math.exp(x), 0), n));
	}
}

function draw() {
	background(51);

	// Calculate each term of the sequence.
	// Tn = e ^ (tau * i * n * t) * Cn
	for (let n = 0; n < coefficients.length; n++) {
		const exponential = Complex.exp(new Complex(0, TAU * (n - numOfTerms) * t));
		terms[n] = Complex.mult(exponential, coefficients[n]);
	}

	// Draw real and imaginary axis.
	strokeWeight(1);
	stroke(255);
	line(0, height / 2, width, height / 2);
	line(width / 2, 0, width / 2, height);

	// Mouse coordinates.
	stroke(0);
	fill(255);
	text(canvasToX(mouseX).toFixed(2) + ' ' + canvasToY(mouseY).toFixed(2), mouseX, mouseY);

	// Draw circles and vectors.
	let sum = new Complex();
	let lastSum = new Complex();

	for (let n = 0; n < terms.length; n++) {
		lastSum = sum.copy();
		sum.add(terms[n]);

		stroke(255, 0, 0);
		line(xToCanvas(lastSum.real), yToCanvas(lastSum.imaginary), xToCanvas(sum.real), yToCanvas(sum.imaginary));

		noFill();
		stroke(255);
		ellipse(xToCanvas(lastSum.real), yToCanvas(lastSum.imaginary), terms[n].getMagnitude() * scalingFactor);

		noStroke();
		fill(0);
		ellipse(xToCanvas(sum.real), yToCanvas(sum.imaginary), terms[n].getMagnitude() * 6.2 + 1);
	}

	// Draw trail.
	trailX.unshift(sum.real);
	trailY.unshift(0);

	noFill();
	stroke(255, 0, 0);
	beginShape();
	for (let i = trailX.length - 1; i >= 0; i--) {
		vertex(xToCanvas(trailX[i]), trailY[i] + height / 2);
		trailY[i] += 1;
		if (trailY[i] > height / 2) {
			trailX.pop();
			trailY.pop();
		}
	}
	endShape();

	if (!frameRate() == 0) {
		t += 1 / (frameRate() * 10);
	}
}

function canvasToX(coord) {
	return map(coord, 0, width, -range, range);
}

function canvasToY(coord) {
	return map(coord, 0, height, range, -range);
}

function xToCanvas(x) {
	return map(x, -range, range, 0, width);
}

function yToCanvas(y) {
	return map(y, -range, range, height, 0);
}

function stepFunction(n) {
	if (n === 0 || n % 2 === 0) return new Complex();
	return new Complex(0, -2 / (n * PI));
}

function coefficient(func, n) {
	const newFunc = k => Complex.mult(func(k), Complex.exp(new Complex(0, TAU * k * n)));
	return integral(newFunc, 0, 1, 1e-4);
}

function integral(func, xMin, xMax, stepSize) {
	const result = new Complex();
	for (let i = 0; i < (xMax - xMin) / stepSize; i++) {
		result.add(func(i * stepSize + xMin).mult(stepSize));
	}
	return result;
}
