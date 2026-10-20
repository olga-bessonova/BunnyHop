// 18x18 carrot frames with a shine that sweeps across every couple of seconds.
const CARROT_FRAME = 18;
// where the carrot sits inside a scaled frame
const CARROT_BOX = {x: 4, y: 2, width: 26, height: 34};

class Carrot {
  // x, y is the top-left of the carrot; index staggers the shines
  constructor(sprites, {x, y}, index = 0) {
    this.x = x;
    this.y = y;
    this.width = CARROT_BOX.width;
    this.height = CARROT_BOX.height;
    this.collected = false;
    this.animator = new Animator({
      shine: new Animation(sprites.carrotShine, {frameWidth: CARROT_FRAME, fps: 10, pauseTicks: 90})
    }, 'shine', {startTick: -index * 23});
    // gentle bobbing, also staggered
    this.bobTick = index * 17;
  }

  update() {
    this.animator.update();
    this.bobTick++;
  }

  draw(ctx) {
    const bob = Math.round(Math.sin(this.bobTick / 20) * 2) * CONFIG.pixelScale / 2;
    this.animator.draw(ctx, this.x - CARROT_BOX.x, this.y - CARROT_BOX.y + bob);
  }
}
