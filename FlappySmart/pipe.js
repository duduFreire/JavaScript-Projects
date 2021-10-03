class Pipe {
	constructor(x) {
		this.width = 64;
		this.pos = createVector(x + this.width, random(128, height - 128));
		this.gap = 160;
	}

	respawn(x) {
		this.pos.x = x;
		this.pos.y = random(128, height - 128);
	}

	display() {
		stroke(0);
		fill(116, 193, 46);
		rect(this.pos.x, 0, this.width, this.pos.y - this.gap / 2);
		rect(this.pos.x, this.pos.y + this.gap / 2, this.width, height);
	}

	update() {
		this.pos.x -= 4;
	}
}