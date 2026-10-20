// Points that float up and fade where they were earned ("+10", "+100").
class FloatingText {
  constructor(text, x, y, color = 'black') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.ticks = 45;
  }

  get removable() {
    return this.ticks <= 0;
  }

  update() {
    this.ticks--;
    this.y -= 0.8;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, this.ticks / 15);
    ctx.font = `18px ${CONFIG.font}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
