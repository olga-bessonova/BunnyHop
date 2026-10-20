// All bunny sheets are horizontal strips of 40x40 frames facing right.
// They are drawn at 2x scale and mirrored when the bunny faces left.
const BUNNY_FRAME = 40;
// where the bunny's body sits inside a scaled frame (matches the visible pixels)
const BUNNY_BOX = {x: 22, y: 28, width: 34, height: 40};
// idle loops before the bunny blinks
const IDLE_LOOPS_BEFORE_BLINK = 3;

class Bunny extends Body {
  constructor(sprites, {x, y}) {
    super({x, y, width: BUNNY_BOX.width, height: BUNNY_BOX.height, footInset: 10});

    const sheet = (image, fps, loop = true, frames) => new Animation(image, {frameWidth: BUNNY_FRAME, fps, loop, frames});
    this.animator = new Animator({
      idle:  sheet(sprites.bunnyIdle, 8),
      blink: sheet(sprites.bunnyIdleBlink, 8, false),
      run:   sheet(sprites.bunnyRun, 16),
      jump:  sheet(sprites.bunnyJump, 24, false),
      fall:  sheet(sprites.bunnyFall, 12),
      land:  sheet(sprites.bunnyLand, 12, false),
      hurt:  sheet(sprites.bunnyHurt, 16, false),
      // the first 6 frames are the bunny shaking with fright
      fright: sheet(sprites.bunnyFright, 16, true, 6),
      die:   sheet(sprites.bunnyDie, 16, false)
    }, 'idle');

    this.facing = 1;
    this.dead = false;
    this.hurtTicks = 0;
    this.invincibleTicks = 0;
  }

  get invincible() {
    return this.invincibleTicks > 0;
  }

  // on a platform now, or left it only a moment ago
  isStanding() {
    return this.speedY >= 0 && this.framesInAir <= CONFIG.bunny.coyoteFrames;
  }

  update(input, platforms) {
    if (this.dead) {
      this.animator.play('die');
      this.animator.update();
      return;
    }

    if (this.invincibleTicks > 0) this.invincibleTicks--;

    if (this.hurtTicks > 0) {
      // knocked back: controls don't work until the hurt animation ends
      this.hurtTicks--;
      input.consumeJump();
    } else {
      const direction = input.direction;
      this.speedX = direction * CONFIG.bunny.runSpeed;
      if (direction !== 0) this.facing = direction;
      if (input.consumeJump() && this.isStanding()) this.speedY = -CONFIG.bunny.jumpSpeed;
    }

    this.move(platforms);
    if (this.x < CONFIG.bunny.startX) this.x = CONFIG.bunny.startX;

    this.chooseAnimation(input);
    this.animator.update();
  }

  stomp() {
    this.speedY = -CONFIG.bunny.stompBounce;
  }

  // knocked away from whatever hit it; the game decides about lives
  hurt(fromX) {
    this.hurtTicks = CONFIG.bunny.hurtTicks;
    this.invincibleTicks = CONFIG.bunny.invincibleTicks;
    const away = fromX > this.x + this.width / 2 ? -1 : 1;
    this.speedX = away * CONFIG.bunny.knockbackSpeed;
    this.speedY = -8;
    this.facing = -away;
  }

  // fell into a gap: stop and shake with fright before dropping
  startFalling() {
    this.speedX = 0;
    this.speedY = 0;
    this.hurtTicks = 0;
    this.invincibleTicks = 0;
    this.animator.play('fright');
  }

  // one tick of the slow drop out of the gap; drop is false while it hangs in fright
  updateFalling(drop) {
    if (drop) {
      this.speedY += CONFIG.bunny.gapFallGravity;
      this.y += this.speedY;
    }
    this.animator.update();
  }

  die() {
    this.dead = true;
    this.speedX = 0;
  }

  respawn(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.framesInAir = 0;
    this.hurtTicks = 0;
    this.invincibleTicks = CONFIG.bunny.invincibleTicks;
  }

  // pick the animation from the bunny's current state
  chooseAnimation(input) {
    const animator = this.animator;
    const inAir = this.speedY < 0 || this.framesInAir > CONFIG.bunny.coyoteFrames;

    if (this.hurtTicks > 0) animator.play('hurt');
    else if (inAir) animator.play(this.speedY < 0 ? 'jump' : 'fall');
    else if (input.direction !== 0) animator.play('run');
    else if (animator.name === 'jump' || animator.name === 'fall' || animator.name === 'hurt') animator.play('land');
    else if ((animator.name === 'land' || animator.name === 'blink') && !animator.done) return;
    else if (animator.name === 'idle' && animator.loops >= IDLE_LOOPS_BEFORE_BLINK) animator.play('blink');
    else animator.play('idle');
  }

  draw(ctx) {
    // blink while invincible
    if (this.invincible && !this.dead && Math.floor(this.invincibleTicks / 4) % 2 === 0) return;

    const size = BUNNY_FRAME * CONFIG.pixelScale;
    const flip = this.facing < 0;
    // when mirrored, the body sits at the other side of the frame
    const offsetX = flip ? size - BUNNY_BOX.x - BUNNY_BOX.width : BUNNY_BOX.x;
    this.animator.draw(ctx, this.x - offsetX, this.y - BUNNY_BOX.y, {flip});
  }
}
