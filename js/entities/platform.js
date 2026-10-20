// Ground pieces and floating platforms. Bodies can stand on top and bump their heads underneath.
class Platform {
  constructor({x, y, width = 200, height = 30}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }

  draw(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
