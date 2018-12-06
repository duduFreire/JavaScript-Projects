class Cell {
  constructor(j, i) {
    this.j = j;
    this.i = i;
    this.number = 0;
    this.clicked = false;
  }

  show() {
    let x = this.i * sclX;
    let y = this.j * sclY;

    strokeWeight(1);
    stroke(255);
    fill(51);
    rect(x, y, sclX, sclY);
  }

  setNumber(number) {
    this.number = number;
  }

  showNumber() {
    if (!hideNumbers && this.number) {
      let x = this.i * sclX;
      let y = this.j * sclY;

      strokeWeight(1);
      stroke(255);
      fill(51);
      rect(x, y, sclX, sclY);

      noStroke();
      fill(255);
      textAlign(CENTER);
      textSize((sclX + sclY) / 4);
      text(this.number, x + sclX / 2, y + sclY / 1.5);
    }
  }

  highlight() {
    let x = this.i * sclX;
    let y = this.j * sclY;

    if (this.clicked) {
      strokeWeight(1);
      stroke(0);
      fill(0);
      rect(x, y, sclX, sclY);
    }
  }
}
