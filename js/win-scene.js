// Shown under "YOU WIN!": a big happy bunny hopping in place with a carrot.
const WIN_BUNNY_SCALE = 4;
const WIN_CARROT_SCALE = 3;
// ticks for one hop, and how much of it is spent in the air
const HOP_TICKS = 48;
const HOP_AIR = 0.55;
const HOP_HEIGHT = 28;

class WinScene {
  constructor(sprites) {
    this.bunny = new Animator({
      idle: new Animation(sprites.bunnyIdle, {frameWidth: BUNNY_FRAME, fps: 8}),
      jump: new Animation(sprites.bunnyJump, {frameWidth: BUNNY_FRAME, fps: 1})
    }, 'idle');
    this.carrot = new Animator({
      shine: new Animation(sprites.carrotShine, {frameWidth: CARROT_FRAME, fps: 12, pauseTicks: 30})
    }, 'shine');
    this.tick = 0;
  }

  update() {
    this.tick++;
    this.bunny.update();
    this.carrot.update();
  }

  // centerX, groundY is where the bunny's feet touch the ground
  draw(ctx, centerX, groundY) {
    const phase = (this.tick % HOP_TICKS) / HOP_TICKS;
    const inAir = phase < HOP_AIR;
    const hop = inAir ? Math.sin(phase / HOP_AIR * Math.PI) * HOP_HEIGHT : 0;

    // shadow shrinks while the bunny is up
    const shadow = 1 - hop / HOP_HEIGHT * 0.4;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(centerX, groundY, 40 * shadow, 7 * shadow, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // bunny body center in an unscaled frame is about (19, 24), feet at row 34
    const bunnyX = centerX - 19 * WIN_BUNNY_SCALE;
    const bunnyY = groundY - 34 * WIN_BUNNY_SCALE - hop;
    if (inAir) {
      this.bunny.play('jump');
      // a mid-jump frame with the legs tucked in
      this.bunny.draw(ctx, bunnyX, bunnyY, {scale: WIN_BUNNY_SCALE, frame: 1});
    } else {
      this.bunny.play('idle');
      this.bunny.draw(ctx, bunnyX, bunnyY, {scale: WIN_BUNNY_SCALE});
    }

    // the carrot is held up in front of the bunny, tilted a little
    const carrotSize = CARROT_FRAME * WIN_CARROT_SCALE;
    ctx.save();
    ctx.translate(bunnyX + 30 * WIN_BUNNY_SCALE, bunnyY + 25 * WIN_BUNNY_SCALE);
    ctx.rotate(0.35);
    this.carrot.draw(ctx, -carrotSize / 2, -carrotSize / 2, {scale: WIN_CARROT_SCALE});
    ctx.restore();
  }
}
