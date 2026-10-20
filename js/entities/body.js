// Anything that moves under gravity and stands on platforms.
// x, y, width, height is the hitbox in world coordinates; the sprite is drawn around it.
class Body {
  constructor({x, y, width, height, footInset = 0}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    // only the middle of the feet can stand on a platform, so bodies
    // slip off an edge instead of standing on air with their toes
    this.footInset = footInset;
    this.framesInAir = 0;
    this.standingOn = null;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }

  overlaps(other) {
    return this.x < other.x + other.width && this.right > other.x &&
           this.y < other.y + other.height && this.bottom > other.y;
  }

  isOverHorizontally(platform, inset = 0) {
    return this.right - inset >= platform.x && this.x + inset <= platform.right;
  }

  // moves the body one tick, landing on platforms and bumping into their undersides
  move(platforms) {
    this.x += this.speedX;

    const landing = this.speedY >= 0 && platforms.find(platform =>
      this.bottom <= platform.y &&
      this.bottom + this.speedY >= platform.y &&
      this.isOverHorizontally(platform, this.footInset));

    this.standingOn = landing || null;
    if (landing) {
      // stand right on the surface
      this.y = landing.y - this.height;
      this.speedY = 0;
      this.framesInAir = 0;
      return;
    }
    this.framesInAir++;

    const ceiling = this.speedY < 0 && platforms.find(platform =>
      this.y >= platform.bottom &&
      this.y + this.speedY <= platform.bottom &&
      this.isOverHorizontally(platform));

    if (ceiling) {
      this.y = ceiling.bottom;
      this.speedY = 0;
    } else {
      this.y += this.speedY;
      this.speedY += CONFIG.gravity;
    }
  }
}
