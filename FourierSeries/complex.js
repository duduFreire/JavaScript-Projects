class Complex {
	constructor(real, imaginary) {
		this.real = real || 0;
		this.imaginary = imaginary || 0;
	}

	static add(a, b) {
		return new Complex(a.real + b.real, a.imaginary + b.imaginary);
	}

	add(b) {
		this.real += b.real;
		this.imaginary += b.imaginary;
		return this;
	}

	mult(b) {
		if (b instanceof Complex) {
			const tempReal = this.real;
			this.real = this.real * b.real - this.imaginary * b.imaginary;
			this.imaginary = tempReal * b.imaginary + this.imaginary * b.real;
		} else {
			this.real *= b;
			this.imaginary *= b;
		}
		return this;
	}

	static mult(a, b) {
		const result = new Complex();
		if (b instanceof Complex) {
			const tempReal = a.real;
			result.real = a.real * b.real - a.imaginary * b.imaginary;
			result.imaginary = tempReal * b.imaginary + a.imaginary * b.real;
		} else {
			result.real = a.real * b;
			result.imaginary = a.imaginary * b;
		}

		if (Math.abs(result.imaginary) < 1e-4) result.imaginary = 0;
		return result;
	}

	static exp(b) {
		const result = new Complex(Math.cos(b.imaginary), Math.sin(b.imaginary));
		result.mult(Math.exp(b.real));
		if (Math.abs(result.imaginary) < 1e-4) result.imaginary = 0;
		return result;
	}

	getMagnitude() {
		return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
	}

	copy() {
		return new Complex(this.real, this.imaginary);
	}
}