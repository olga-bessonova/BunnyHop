const SPRITE_PATHS = {
  bunnyIdle:      'assets/bunnypack_assets/bunnypack_spritesheets/bunny_idle_strip4.png',
  bunnyIdleBlink: 'assets/bunnypack_assets/bunnypack_spritesheets/bunny_idle_blink_strip4.png',
  bunnyRun:       'assets/bunnypack_assets/bunnypack_spritesheets/bunny_run_strip6.png',
  bunnyJump:      'assets/bunnypack_assets/bunnypack_spritesheets/bunny_jump_strip12.png',
  bunnyFall:      'assets/bunnypack_assets/bunnypack_spritesheets/bunny_fall_strip4.png',
  bunnyLand:      'assets/bunnypack_assets/bunnypack_spritesheets/bunny_land_strip2.png',
  bunnyHurt:      'assets/bunnypack_assets/bunnypack_spritesheets/bunny_hurt_strip6.png',
  bunnyDie:       'assets/bunnypack_assets/bunnypack_spritesheets/bunny_die_strip16.png',
  bunnyFright:    'assets/bunnypack_assets/bunnypack_spritesheets/bunny_fright_strip9.png',
  ghostFly:       'assets/PlatformerPack/ghost1_fly.png',
  ghostHurt:      'assets/PlatformerPack/ghost1_hurt.png',
  heartShine:     'assets/PlatformerPack/heart2-shine.png',
  heartEmpty:     'assets/PlatformerPack/heart2-empty.png',
  carrotShine:    'assets/carrot/carrot_shine_strip5.png',
  grassPlatform:  'assets/platform/grass_platform.png'
};

function loadSprites(paths) {
  const entries = Object.entries(paths).map(([name, src]) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve([name, image]);
    image.onerror = () => reject(new Error('Could not load ' + src));
    image.src = src;
  }));
  return Promise.all(entries).then(Object.fromEntries);
}


// One animation from a horizontal strip of equal-sized frames.
class Animation {
  // frames can limit the animation to the first few frames of the strip
  constructor(image, {frameWidth, frameHeight = frameWidth, fps, loop = true, pauseTicks = 0, frames}) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frames = frames || Math.floor(image.width / frameWidth);
    this.ticksPerFrame = CONFIG.ticksPerSecond / fps;
    this.loop = loop;
    // looping animations can rest on their first frame between cycles (used for shines)
    this.pauseTicks = pauseTicks;
  }
}


// Plays one of several named animations and draws the current frame.
class Animator {
  constructor(animations, initial, {startTick = 0} = {}) {
    this.animations = animations;
    this.name = initial;
    this.frame = 0;
    // a negative start delays the first cycle, so several shines don't run in sync
    this.tick = startTick;
    this.done = false;
    this.loops = 0;
  }

  get current() {
    return this.animations[this.name];
  }

  play(name) {
    if (this.name === name) return;
    this.name = name;
    this.frame = 0;
    this.tick = 0;
    this.done = false;
    this.loops = 0;
  }

  update() {
    const animation = this.current;
    this.tick++;
    if (this.tick < animation.ticksPerFrame) return;

    // a looping animation waits on its first frame for pauseTicks before the next cycle
    if (this.frame === 0 && this.loops > 0 && this.tick < animation.ticksPerFrame + animation.pauseTicks) return;

    this.tick = 0;
    this.frame++;
    if (this.frame < animation.frames) return;

    if (animation.loop) {
      this.frame = 0;
      this.loops++;
    } else {
      this.frame = animation.frames - 1;
      this.done = true;
    }
  }

  // x, y is where the top-left corner of the scaled frame goes
  draw(ctx, x, y, {flip = false, scale = CONFIG.pixelScale, frame = this.frame} = {}) {
    const animation = this.current;
    const width = animation.frameWidth * scale;
    const height = animation.frameHeight * scale;

    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    if (flip) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(animation.image,
                  frame * animation.frameWidth, 0,
                  animation.frameWidth, animation.frameHeight,
                  0, 0, width, height);
    ctx.restore();
  }
}
