const points = [];
let center;
let xRange = 2;
let aspectRatio;

const coefficients = Array(20).fill(0);
let k = 0.1;

let cycles = 100;

function setup() {
	createCanvas(windowWidth, windowHeight);
	aspectRatio = windowWidth / windowHeight;

	center = createVector(0, 0);
}

function draw() {
	background(0);

	if (mouseIsPressed) {
		//points.push(createVector(scrToX(mouseX), scrToY(mouseY)));
	}

	strokeWeight(6);
	stroke(255, 255, 0);
	for (const p of points) {
		point(xToScr(p.x), yToScr(p.y));
	}

	if (keyIsPressed) {
		adjn(cycles);
	}

	drawMouse();
	drawAxes();
	drawFunc();
}

function adjn(n) {
	for (let i = 0; i < n; i++)
		adjust();
}

function drawLine() {
	strokeWeight(3);
	stroke(0, 50, 255);
	line(
		xToScr(center.x - xRange / 2), yToScr(f(center.x - xRange / 2)),
		xToScr(center.x + xRange / 2), yToScr(f(center.x + xRange / 2))
	);
}

function drawFunc() {
	strokeWeight(3);
	stroke(0, 50, 255);
	noFill();
	beginShape();
	for (let i = 0; i < 100; i++) {
		const x = map(i, 0, 99, center.x - xRange / 2, center.x + xRange / 2);
		vertex(xToScr(x), yToScr(f(x)));
	}
	endShape();
}

function f(x) {
	let result = 0;
	for (let i = 0; i < coefficients.length; i++) {
		result += coefficients[i] * Math.pow(x, i);
	}

	return result;
}

function adjust() {
	const deltas = Array(coefficients.length).fill(0);

	for (const p of points) {
		const error = f(p.x) - p.y;

		for (let i = 0; i < deltas.length; i++) {
			deltas[i] += error * Math.pow(p.x, i);
		}
	}

	const mult = k / points.length;
	for (let i = 0; i < coefficients.length; i++) {
		coefficients[i] -= mult * deltas[i];
	}
}

function desmos() {
	// for (let i = 0; i < points.length; i++) {
	// 	console.log('(' + points[i].x + ', ' + points[i].y + ')');
	// }
	let str = '';
	for (let i = coefficients.length - 1; i >= 0; i--) {
		str += coefficients[i] + "*x^" + i + "+";
	}

	return str;
}

function cost() {
	let result = 0;
	for (const p of points) {
		result += (p.y - f(p.x)) * (p.y - f(p.x));
	}

	return result / points.length;
}

function mousePressed() {
	points.push(createVector(scrToX(mouseX), scrToY(mouseY)));
}

function mouseDragged(event) {
	// center.x -= event.movementX * xRange * 0.001;
	// center.y += event.movementY * xRange / aspectRatio * 0.001;
}

function mouseWheel(event) {
	xRange += event.delta / 625 * xRange;
}

function drawAxes() {
	const originX = xToScr(0);
	const originY = yToScr(0);

	strokeWeight(2);
	stroke(255);
	line(0, originY, width, originY);
	line(originX, 0, originX, height);
}

function drawMouse() {
	noStroke();
	fill(255);
	textSize(20);
	text(nf(scrToX(mouseX), 1, 1) + ", " + nf(scrToY(mouseY), 1, 1), mouseX, mouseY);
}

function scrToX(coord) {
	return map(coord, 0, width, center.x - xRange / 2, center.x + xRange / 2);
}

function scrToY(coord) {
	return map(coord, height, 0, center.y - xRange / 2 / aspectRatio, center.y + xRange / 2 / aspectRatio);
}

function xToScr(coord) {
	return map(coord, center.x - xRange / 2, center.x + xRange / 2, 0, width);
}

function yToScr(coord) {
	return map(coord, center.y - xRange / 2 / aspectRatio, center.y + xRange / 2 / aspectRatio, height, 0);
}