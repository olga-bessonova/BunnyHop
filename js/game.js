// how long GAME OVER shows before the "Play again" button appears
const GAME_OVER_DELAY_TICKS = 2 * CONFIG.ticksPerSecond;

// Runs the game: builds the level, steps the world at a fixed rate and draws it.
class Game {
  constructor(canvas, sprites) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = CONFIG.canvas.width;
    canvas.height = CONFIG.canvas.height;
    // keep pixel art crisp when sprites are scaled up
    this.ctx.imageSmoothingEnabled = false;

    this.sprites = sprites;
    this.input = new Input();
    this.highScore = new HighScore();
    this.paused = false;
    // called with true/false when the "Play again" button should show or hide
    this.onPlayAgainChange = () => {};

    this.restart();
  }

  restart() {
    const sprites = this.sprites;
    this.platforms = LEVEL.platforms.map(data => new Platform(data));
    this.bunny = new Bunny(sprites, {x: CONFIG.bunny.startX, y: 0});
    this.enemies = LEVEL.ghosts.map(data => this.settle(new Ghost(sprites, data)));
    this.carrots = randomCarrotSpots(this.platforms, LEVEL.carrotCount)
      .map((spot, i) => new Carrot(sprites, spot, i));
    this.effects = [];
    this.lastPlatform = null;
    this.levelEnd = Math.max(...this.platforms.map(platform => platform.right));
    this.cameraX = 0;

    this.lives = CONFIG.bunny.lives;
    this.hud = new Hud(sprites, this.lives);
    this.furthestX = this.bunny.x;
    this.stompPoints = 0;
    this.carrotPoints = 0;
    // 'playing', 'dying' (death animation), 'over' or 'won'
    this.state = 'playing';
    this.newBest = false;
    // ticks since the game ended
    this.endTicks = 0;
    this.winScene = null;
    this.setPlayAgain(false);
    this.input.consumeJump();
  }

  // drops an enemy onto the highest platform under it, so it waits there until it's on screen
  settle(enemy) {
    const below = this.platforms
      .filter(platform => platform.y >= enemy.bottom && enemy.isOverHorizontally(platform))
      .sort((a, b) => a.y - b.y)[0];
    if (below) enemy.y = below.y - enemy.height;
    return enemy;
  }

  get score() {
    const distance = Math.floor((this.furthestX - CONFIG.bunny.startX) / CONFIG.score.pixelsPerPoint);
    return Math.max(0, distance) + this.stompPoints + this.carrotPoints;
  }

  togglePause() {
    if (this.state !== 'playing' && this.state !== 'dying' && this.state !== 'falling') return this.paused;
    this.paused = !this.paused;
    return this.paused;
  }

  start() {
    const step = 1000 / CONFIG.ticksPerSecond;
    let last = performance.now();
    let pending = 0;

    const frame = (now) => {
      // cap the catch-up after the tab was in the background
      pending += Math.min(now - last, 250);
      last = now;
      while (pending >= step) {
        if (!this.paused) this.update();
        pending -= step;
      }
      this.draw();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  update() {
    this.hud.update(this.lives);
    this.carrots.forEach(carrot => carrot.update());
    this.effects.forEach(effect => effect.update());
    this.effects = this.effects.filter(effect => !effect.removable);

    if (this.state === 'dying') {
      // the world freezes while the death animation plays
      this.bunny.update(this.input, this.platforms);
      if (this.bunny.animator.done) this.endGame('over');
      return;
    }
    if (this.state === 'falling') {
      this.updateFalling();
      return;
    }
    if (this.state === 'over' || this.state === 'won') {
      this.endTicks++;
      if (this.winScene) this.winScene.update();
      // after a game over, give the player a moment before offering to play again
      if (this.state === 'won' || this.endTicks >= GAME_OVER_DELAY_TICKS) this.setPlayAgain(true);
      return;
    }

    const bunny = this.bunny;
    bunny.update(this.input, this.platforms);
    // a fall into a gap respawns the bunny on the last platform it stood on
    if (bunny.standingOn) this.lastPlatform = bunny.standingOn;
    this.furthestX = Math.max(this.furthestX, bunny.x);
    this.updateCamera();

    this.enemies.forEach(enemy => {
      // enemies wake up once they scroll onto the screen
      if (!enemy.active && enemy.x < this.cameraX + CONFIG.canvas.width) enemy.activate();
      enemy.update(this.platforms);
    });
    this.checkEnemies();
    this.enemies = this.enemies.filter(enemy => !enemy.removable);

    this.collectCarrots();

    // feet below ground level can only mean the bunny is in a gap
    if (bunny.bottom > GROUND_Y + 4 && bunny.speedY > 0) this.fellIntoGap();
    else if (bunny.x >= LEVEL.finishX) this.endGame('won');
  }

  updateCamera() {
    const maxCamera = this.levelEnd - CONFIG.canvas.width;
    const target = this.bunny.x - CONFIG.cameraLead;
    this.cameraX = Math.max(0, Math.min(target, maxCamera));
  }

  checkEnemies() {
    const bunny = this.bunny;
    for (const enemy of this.enemies) {
      if (!enemy.harmful || !bunny.overlaps(enemy)) continue;

      // landing on top defeats the enemy: the bunny is falling and was above it last tick
      const previousBottom = bunny.bottom - bunny.speedY;
      if (bunny.speedY > 0 && previousBottom <= enemy.y + 6) {
        enemy.defeat();
        bunny.stomp();
        this.stompPoints += CONFIG.score.stomp;
        this.effects.push(new FloatingText('+' + CONFIG.score.stomp, enemy.x + enemy.width / 2, enemy.y));
      } else if (!bunny.invincible) {
        this.loseLife();
        if (this.state === 'playing') bunny.hurt(enemy.x + enemy.width / 2);
        return;
      }
    }
  }

  collectCarrots() {
    this.carrots.forEach(carrot => {
      if (carrot.collected || !this.bunny.overlaps(carrot)) return;
      carrot.collected = true;
      this.carrotPoints += CONFIG.score.carrot;
      this.effects.push(new FloatingText('+' + CONFIG.score.carrot, carrot.x + carrot.width / 2, carrot.y, '#d9661f'));
    });
    this.carrots = this.carrots.filter(carrot => !carrot.collected);
  }

  loseLife() {
    this.lives--;
    if (this.lives > 0) return;
    this.bunny.die();
    this.state = 'dying';
  }

  // the world freezes so the player sees what happened: the bunny shakes, then drops out of view
  fellIntoGap() {
    this.lives--;
    this.state = 'falling';
    this.fallTicks = 0;
    this.bunny.startFalling();
  }

  updateFalling() {
    this.fallTicks++;
    this.bunny.updateFalling(this.fallTicks > CONFIG.bunny.gapFreezeTicks);

    const outOfView = this.bunny.y > CONFIG.canvas.height;
    if (!outOfView || this.fallTicks < CONFIG.bunny.gapSequenceTicks) return;

    if (this.lives <= 0) {
      this.endGame('over');
      return;
    }
    this.respawn();
  }

  respawn() {
    this.state = 'playing';
    // back onto the last platform the bunny stood on, fully on it
    const platform = this.lastPlatform || this.platforms[0];
    const bunny = this.bunny;
    const x = Math.max(platform.x, Math.min(bunny.x, platform.right - bunny.width));
    bunny.respawn(x, platform.y - bunny.height);
    this.updateCamera();
  }

  endGame(state) {
    this.state = state;
    this.endTicks = 0;
    this.newBest = this.highScore.submit(this.score);
    if (state === 'won') this.winScene = new WinScene(this.sprites);
  }

  setPlayAgain(visible) {
    if (this.playAgainVisible === visible) return;
    this.playAgainVisible = visible;
    this.onPlayAgainChange(visible);
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    // the world, shifted by the camera
    ctx.save();
    ctx.translate(-Math.round(this.cameraX), 0);
    this.platforms.forEach(platform => platform.draw(ctx));
    this.carrots.forEach(carrot => carrot.draw(ctx));
    this.enemies.forEach(enemy => enemy.draw(ctx));
    // after a win the bunny leaves the level and celebrates up front instead
    if (this.state !== 'won') this.bunny.draw(ctx);
    this.effects.forEach(effect => effect.draw(ctx));
    ctx.restore();

    const bestLine = this.newBest ? 'New best score!' : null;
    if (this.state === 'won') {
      // fade the level so the celebration stands out
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
      this.hud.draw(ctx, {score: this.score, best: this.highScore.best});
      this.hud.drawMessage(ctx, 'YOU WIN!', 'green', bestLine, 140);
      this.winScene.draw(ctx, CONFIG.canvas.width / 2, 385);
      return;
    }

    this.hud.draw(ctx, {score: this.score, best: this.highScore.best});
    if (this.state === 'over') this.hud.drawMessage(ctx, 'GAME OVER', 'black', bestLine);
    else if (this.state === 'falling') this.hud.drawMessage(ctx, 'OOPS!', 'black', 'You fell into a gap', 200);
    else if (this.paused) this.hud.drawMessage(ctx, 'PAUSED', 'black');
  }
}
