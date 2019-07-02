let range = 1.5;
const coefficients = [];
let terms = [];
let scalingFactor;

let t = 0;

const numOfTerms = 100; // Actual number of terms is 2 * numOfterms + 1;

let trail = [];

let fileData;
let coords = [];

let screenCenter;
let frameRateSum = avgFrameRate = 0;

let domain = 1; // "t" (input of function) will go from 0 to "domain".

function preload() {
	fileData = loadStrings("coords.txt");
	pathData = loadJSON("path.json");
}

function setup() {
	createCanvas(720, 720);
	ellipseMode(RADIUS);

	scalingFactor = width / (2 * range);

	screenCenter = new Complex();

	// while (pathData.drawing.length != 1) {
	// 	pathData.drawing[0] = pathData.drawing[0].concat(pathData.drawing[1]);
	// 	pathData.drawing.splice(1, 1);
	// }

	// pathData.drawing = pathData.drawing[0];

	// for (let i = 2; i < pathData.drawing.length; i++) {
	// 	pathData.drawing[0] = pathData.drawing[0].concat(pathData.drawing[i]);
	// 	pathData.drawing.splice(i, 1);
	// }

	// while (pathData.drawing.length !== 2) {
	// 	pathData.drawing[1] = pathData.drawing[1].concat(pathData.drawing[2]);
	// 	pathData.drawing.splice(2, 1);
	// }

	// for (let i = 0; i < pathData.drawing[0].length; i++) {
	// 	coords.push({
	// 		real: map(pathData.drawing[0][i], 0, 255, -1, 1),
	// 		imaginary: map(pathData.drawing[1][i], 0, 255, 1, -1)
	// 	})
	// }


	for (let i = 0; i < fileData.length; i++) {
		fileData[i] = fileData[i].trim();
		const splitted = fileData[i].split(' ');
		const num = {
			real: float(splitted[0]),
			imaginary: float(splitted[1]),
		}
		if (!isNaN(num.real))
			coords.push(num);
	}

	// Calculate coefficients.

	// The iterator goes from -numOfTerms to numOfTerms so that there are the
	// same amount of terms with negative frequency as there are with positive 
	// frequency, and one term with frequency 0. This means that there actually
	// are 2 * numOfTerms + 1 terms.

	for (let n = -numOfTerms; n <= numOfTerms; n++) {
		// As "t" (function input) goes from 0 to 1, the function should look at
		// arguments whose indexes go from 0 to coords.length -1.

		const func = x => new Complex(
			coords[round(x / domain * (coords.length - 1))].real,
			coords[round(x / domain * (coords.length - 1))].imaginary
		);
		coefficients.push(coefficient(func, n));

		//coefficients.push(coefficient(x => new Complex(x, Math.sin(x * TAU * 3) + Math.sin(x * TAU * 2)), n));
		//coefficients.push(stepFunction(n));
	}
}

function draw() {
	background(51);
	scalingFactor = width / (2 * range);

	// Calculate each term of the sequence.
	// Nth Term = e ^ (tau * i * n * t) * Nth Coefficient
	for (let n = 0; n < coefficients.length; n++) {
		const exponential = Complex.exp(new Complex(0, TAU * (n - numOfTerms) * t / domain));
		terms[n] = {
			val: Complex.mult(exponential, coefficients[n]),
			freq: n - numOfTerms
		};
	}

	// Frequencies go from ..., -1, 0, 1, ... to 0, 1, -1, 2, -2, ...
	// This line is optional, its effect is only aesthetical.
	terms.sort((a, b) => (Math.abs(a.freq) > Math.abs(b.freq)) ? 1 : -1);

	// Draw real and imaginary axis.
	strokeWeight(1);
	stroke(255);
	centerLine(0, 0, 0, 1e6);
	centerLine(0, 0, 1e6, 1e6);

	// Draw mouse coordinates.
	stroke(0);
	fill(255);
	text(canvasToX(mouseX).toFixed(2) + ' ' + canvasToY(mouseY).toFixed(2), mouseX, mouseY);

	// Draw circles and vectors.
	let sum = lastSum = new Complex();

	for (let n = 0; n < terms.length; n++) {
		lastSum = sum.copy();
		sum.add(terms[n].val);

		noFill();
		stroke(255, 255, 255, 50);
		ellipse(xToCanvas(lastSum.real), yToCanvas(lastSum.imaginary), terms[n].val.getMagnitude() * scalingFactor);

		stroke(255, 0, 0);
		drawArrow(xToCanvas(lastSum.real), yToCanvas(lastSum.imaginary), xToCanvas(sum.real), yToCanvas(sum.imaginary));
	}


	drawTrail(sum);
	drawCorrectPath();

	if (frameCount > 1 && frameCount < 100) {
		frameRateSum += frameRate();
		avgFrameRate = frameRateSum / frameCount;
	}

	if (frameCount > 1) {
		if (t > 1.5) {
			trail.pop();
		}
		// This line increments time so that it takes a 
		// (number multiplying avg frame rate) amount of seconds for 
		// "t" to go from 0 to 1, completing one cycle.
		t += 1 / (60 * 10);
	}
}

function drawTrail(sum) {
	if (t > 0) {
		trail.unshift({
			real: sum.real,
			imaginary: sum.imaginary
		});
	}

	// Draw the path traced by the arrows.
	noFill();
	stroke(255, 255, 0);
	beginShape();
	for (let i = 0; i < trail.length; i++) {
		vertex(xToCanvas(trail[i].real), yToCanvas(trail[i].imaginary));
	}
	endShape();
}

function drawCorrectPath() {
	// Draw the path that the arrows should aproximate.
	stroke(0, 255, 0, 50);
	beginShape();
	for (let i = 0; i < coords.length; i++) {
		vertex(xToCanvas(coords[i].real), yToCanvas(coords[i].imaginary));
	}
	endShape(CLOSE);
}

function drawRealTrail(sum) {
	if (t > 0) {
		trail.unshift({
			real: sum.real,
			imaginary: yToCanvas(0)
		});
	}

	// Draw the path traced by the arrows.
	noFill();
	stroke(255, 255, 0);
	beginShape();
	for (let i = 0; i < trail.length; i++) {
		vertex(xToCanvas(trail[i].real), trail[i].imaginary);
		trail[i].imaginary++;
	}
	endShape();
}

function canvasToX(coord) {
	return range * 2 * (coord / width - 0.5) + screenCenter.real;
}

function canvasToY(coord) {
	return range * 2 * (0.5 - coord / height) + screenCenter.imaginary;
}

function xToCanvas(x) {
	return width * ((x - screenCenter.real) / (range * 2) + 0.5);
}

function yToCanvas(y) {
	return height * (0.5 - (y - screenCenter.imaginary) / (range * 2));
}

function stepFunction(n) {
	// nth coefficient of the step function is 0 if n is even
	// and -2/(n * PI * i) otherwise.
	if (n % 2 === 0) return new Complex();
	return new Complex(0, -2 / (n * PI));
}

function coefficient(func, n) {
	// nth coefficient of a function called "f" in the fourier series is equal to:
	// Integral (f(k) * e^(-TAU * i * n * k) dk) from k = 0 to 1.

	// newFunc = func(k) * e ^ (-TAU * k * n * i)
	const newFunc = k => Complex.mult(func(k), Complex.exp(new Complex(0, -TAU * k * n / domain)));
	// Aproximates the integral of newFunc from 0 to 1,
	// using 20 000 subdivisons.
	return Complex.mult(integral(newFunc, 0, domain, 20000), 1 / domain);
}

function integral(func, xMin, xMax, quantity) {
	// Aproximates integral using Riemann sum.
	const result = new Complex();
	const stepSize = (xMax - xMin) / quantity;
	for (let n = 0; n < quantity; n++) {
		result.add(func(n * stepSize + xMin).mult(stepSize));
	}
	return result;
}


function drawArrow(x0, y0, x1, y1) {
	const vec = p5.Vector.sub(createVector(x1, y1), createVector(x0, y0));
	const vecMag = vec.mag() * Math.sqrt(scalingFactor) / 800;

	line(x0, y0, x1, y1);
	push();
	translate(x1, y1);
	rotate(vec.heading() + HALF_PI);
	line(0, 0, vecMag, vecMag * 2);
	line(0, 0, -vecMag, vecMag * 2);
	pop();
}

function mouseWheel(event) {
	// Change range when according to the mouseWheel.
	// This zooms in or out on the image.
	// The amount that is zoomed in is proportional to the range.
	range += event.delta / 625 * range
}

function mouseDragged() {
	screenCenter.real -= range * 2 / width * (mouseX - pmouseX);
	screenCenter.imaginary += range * 2 / height * (mouseY - pmouseY);
}

function centerLine(centerX, centerY, slope, size) {
	centerX = xToCanvas(centerX);
	centerY = yToCanvas(centerY);

	// The line angle with the real axis is
	// equal to atan(slope). Provided only the sine and
	// cosine of the slope is needed, this calculations 
	// can be optimized in the following way:

	// cos(atan(x)) = 1/sqrt(x^2 + 1)
	cosAngle = 1 / Math.sqrt(slope * slope + 1);
	// sin(atan(x)) = x/sqrt(x^2 + 1) = x * cos(atan(x))
	sinAngle = slope * cosAngle;

	// If the slope is too big, treat it as infinity.
	if (slope > 1e4) {
		cosAngle = 0;
		sinAngle = 1;
	}

	x1 = centerX - size / 2 * cosAngle;
	y1 = centerY + size / 2 * sinAngle;
	x2 = centerX + size / 2 * cosAngle;
	y2 = centerY - size / 2 * sinAngle;

	line(x1, y1, x2, y2);
}