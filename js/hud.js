// 16x16 heart frames; full hearts shine one after another.
const HEART_FRAME = 16;

// Score, best score and lives, drawn on top of the game in screen coordinates.
class Hud {
  constructor(sprites, lives) {
    this.heartImage = sprites.heartShine;
    this.lives = lives;
    // ticks left of flashing for each heart that was just lost
    this.flashTicks = [];
    this.hearts = [];
    for (let i = 0; i < lives; i++) {
      this.hearts.push(new Animator({
        shine: new Animation(sprites.heartShine, {frameWidth: HEART_FRAME, fps: 12, pauseTicks: 120}),
        empty: new Animation(sprites.heartEmpty, {frameWidth: HEART_FRAME, fps: 1})
      }, 'shine', {startTick: -i * 6}));
    }
  }

  update(lives) {
    // a heart that was just lost flashes before it goes empty
    for (let i = lives; i < this.lives; i++) this.flashTicks[i] = 60;
    this.lives = lives;

    this.hearts.forEach((heart, i) => {
      if (i >= lives) heart.play('empty');
      heart.update();
      if (this.flashTicks[i] > 0) this.flashTicks[i]--;
    });
  }

  draw(ctx, {score, best}) {
    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = 'black';
    ctx.font = `25px ${CONFIG.font}`;
    ctx.fillText('Score: ' + score, 20, 40);
    ctx.font = `18px ${CONFIG.font}`;
    ctx.fillText('Best: ' + Math.max(best, score), 20, 66);
    ctx.restore();

    const size = HEART_FRAME * CONFIG.pixelScale;
    const gap = 2;
    const startX = CONFIG.canvas.width - 16 - this.hearts.length * (size + gap);
    this.hearts.forEach((heart, i) => {
      const x = startX + i * (size + gap);
      const flashing = this.flashTicks[i] > 0 && Math.floor(this.flashTicks[i] / 6) % 2 === 0;
      if (flashing) ctx.drawImage(this.heartImage, 0, 0, HEART_FRAME, HEART_FRAME, x, 14, size, size);
      else heart.draw(ctx, x, 14);
    });
  }

  // big centered message with an optional smaller line under it
  drawMessage(ctx, text, color, subtext, centerY = CONFIG.canvas.height / 2) {
    const centerX = CONFIG.canvas.width / 2;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.font = `50px ${CONFIG.font}`;
    ctx.fillText(text, centerX, centerY);
    if (subtext) {
      ctx.fillStyle = 'black';
      ctx.font = `22px ${CONFIG.font}`;
      ctx.fillText(subtext, centerX, centerY + 40);
    }
    ctx.restore();
  }
}
