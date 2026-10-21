// A little scene for the "turn your phone" card: the happy bunny with a carrot
// hopping on grass platforms, with carrots and a ghost around. Only animates while visible.
const ROTATE_SCENE = {width: 360, height: 220, groundY: 190};

class RotateScene {
  constructor(canvas, sprites, isVisible) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = ROTATE_SCENE.width;
    canvas.height = ROTATE_SCENE.height;
    this.ctx.imageSmoothingEnabled = false;
    this.isVisible = isVisible;

    const groundY = ROTATE_SCENE.groundY;
    const groundDepth = ROTATE_SCENE.height - groundY;
    this.platforms = [
      new Platform({x: -4,  y: groundY, width: 144, height: groundDepth}),
      new Platform({x: 196, y: groundY, width: 168, height: groundDepth}),
      new Platform({x: 40,  y: 105, width: 100})
    ];
    this.platforms.forEach(platform => platform.render(sprites.grassPlatform));

    this.carrots = [
      new Carrot(sprites, {x: 58,  y: 105 - 6 - CARROT_BOX.height}, 0),
      new Carrot(sprites, {x: 100, y: 105 - 6 - CARROT_BOX.height}, 2),
      new Carrot(sprites, {x: 156, y: 120}, 4)
    ];
    this.ghost = new Ghost(sprites, {x: 40, y: groundY - GHOST_BOX.height, direction: 1});
    this.bunny = new WinScene(sprites);
  }

  update() {
    this.carrots.forEach(carrot => carrot.update());
    this.ghost.animator.update();
    this.bunny.update();
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ROTATE_SCENE.width, ROTATE_SCENE.height);
    this.platforms.forEach(platform => platform.draw(ctx));
    this.carrots.forEach(carrot => carrot.draw(ctx));
    this.ghost.draw(ctx);
    this.bunny.draw(ctx, 280, ROTATE_SCENE.groundY);
  }

  start() {
    const step = 1000 / CONFIG.ticksPerSecond;
    let last = performance.now();
    let pending = 0;

    const frame = (now) => {
      pending += Math.min(now - last, 250);
      last = now;
      if (this.isVisible()) {
        while (pending >= step) {
          this.update();
          pending -= step;
        }
        this.draw();
      } else {
        pending = 0;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}
