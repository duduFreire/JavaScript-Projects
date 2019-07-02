class Complex {
	constructor(real, imaginary) {
		this.real = real || 0;
		this.imaginary = imaginary || 0;
	}

	round() {
		if (Math.abs(this.real) < 1e-6) this.real = 0;
		if (Math.abs(this.imaginary) < 1e-6) this.imaginary = 0;
		return this;
	}

	static round(num) {
		if (Math.abs(num.real) < 1e-6) num.real = 0;
		if (Math.abs(num.imaginary) < 1e-6) num.imaginary = 0;
		return num;
	}

	static add(a, b) {
		const result = new Complex(a.real + b.real, a.imaginary + b.imaginary);
		return Complex.round(result);
	}

	add(b) {
		this.real += b.real;
		this.imaginary += b.imaginary;
		this.round();
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

		this.round();
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

		Complex.round(result);
		return result;
	}

	static exp(b) {
		const result = new Complex(Math.cos(b.imaginary), Math.sin(b.imaginary));
		//result.mult(Math.exp(b.real));
		Complex.round(result);
		return result;
	}

	getMagnitude() {
		this.round();
		return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
	}

	set(real, imaginary) {
		this.real = real;
		this.imaginary = imaginary;
		this.round();
	}

	copy() {
		this.round();
		return new Complex(this.real, this.imaginary);
	}
}