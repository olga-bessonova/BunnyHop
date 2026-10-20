// Game-wide settings. Every class reads its numbers from here.
const CONFIG = {
  canvas: {width: 800, height: 500},

  // the game simulates at a fixed rate so speed is the same on every monitor
  ticksPerSecond: 60,

  // pixel art is drawn at 2x so every sprite has the same pixel size
  pixelScale: 2,

  gravity: 1,

  bunny: {
    startX: 20,
    runSpeed: 5,
    jumpSpeed: 18,
    stompBounce: 10,
    lives: 3,
    // frames without ground contact before the bunny counts as falling
    coyoteFrames: 3,
    // after a hit the bunny can't be hurt again for this long
    invincibleTicks: 120,
    hurtTicks: 24,
    knockbackSpeed: 3,
    // falling into a gap: the bunny hangs in fright, then drops slowly out of view
    gapFreezeTicks: 40,
    gapFallGravity: 0.25,
    gapSequenceTicks: 120
  },

  // the bunny stays this far from the left edge while the world scrolls
  cameraLead: 400,

  ghost: {speed: 0.5},

  score: {
    // one point for every this many pixels of progress
    pixelsPerPoint: 10,
    stomp: 100,
    carrot: 10
  },

  font: 'myFontHack'
};
