// An enemy waits where it was placed until it scrolls onto the screen, then starts moving.
// Stomping on it defeats it; touching it from the side hurts the bunny.
class Enemy extends Body {
  constructor(options) {
    super(options);
    this.active = false;
    this.defeated = false;
    // ticks left of the defeat effect; the enemy is removed when it reaches 0
    this.fadeTicks = 0;
  }

  get removable() {
    return (this.defeated && this.fadeTicks <= 0) || this.y > CONFIG.canvas.height;
  }

  get harmful() {
    return this.active && !this.defeated;
  }

  activate() {
    this.active = true;
  }

  defeat() {
    this.defeated = true;
    this.fadeTicks = 20;
  }

  update(platforms) {
    if (this.defeated) {
      this.fadeTicks--;
      return;
    }
    if (!this.active) return;
    this.move(platforms);
  }
}


// 16x16 ghost frames, drawn at the same 2x pixel scale as the bunny.
const GHOST_FRAME = 16;
// where the ghost's body sits inside a scaled frame (matches the visible pixels)
const GHOST_BOX = {x: 4, y: 2, width: 24, height: 28};

class Ghost extends Enemy {
  constructor(sprites, {x, y, direction = -1}) {
    super({x, y, width: GHOST_BOX.width, height: GHOST_BOX.height});
    this.direction = direction;
    this.speedX = direction * CONFIG.ghost.speed;
    this.animator = new Animator({
      fly:  new Animation(sprites.ghostFly, {frameWidth: GHOST_FRAME, fps: 10}),
      hurt: new Animation(sprites.ghostHurt, {frameWidth: GHOST_FRAME, fps: 10})
    }, 'fly');
  }

  defeat() {
    super.defeat();
    this.animator.play('hurt');
  }

  update(platforms) {
    super.update(platforms);
    if (this.active) this.animator.update();
  }

  draw(ctx) {
    const drawX = this.x - GHOST_BOX.x;
    const drawY = this.y - GHOST_BOX.y;
    // face the way it's walking (the body is centered, so the hitbox stays put)
    const flip = this.direction > 0;
    if (!this.defeated) {
      this.animator.draw(ctx, drawX, drawY, {flip});
      return;
    }

    // squash flat and fade out
    const size = GHOST_FRAME * CONFIG.pixelScale;
    const progress = 1 - this.fadeTicks / 20;
    ctx.save();
    ctx.globalAlpha = 1 - progress;
    ctx.translate(drawX + size / 2, drawY + size);
    ctx.scale(1 + progress * 0.5, 1 - progress * 0.7);
    this.animator.draw(ctx, -size / 2, -size, {flip});
    ctx.restore();
  }
}
