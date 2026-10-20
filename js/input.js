// Tracks the keys the game uses.
class Input {
  constructor() {
    this.left = false;
    this.right = false;
    // set on key press, cleared when the game uses it, so a short tap is never missed
    this.jumpQueued = false;

    window.addEventListener('keydown', (e) => this.onKey(e, true));
    window.addEventListener('keyup', (e) => this.onKey(e, false));
  }

  onKey(e, pressed) {
    switch (e.key) {
      case 'ArrowLeft':
        this.left = pressed;
        break;
      case 'ArrowRight':
        this.right = pressed;
        break;
      case ' ':
      case 'ArrowUp':
        // holding the key down doesn't keep jumping
        if (pressed && !e.repeat) this.jumpQueued = true;
        break;
      default:
        return;
    }
    // stop space and arrows from scrolling the page
    e.preventDefault();
  }

  consumeJump() {
    const queued = this.jumpQueued;
    this.jumpQueued = false;
    return queued;
  }

  // horizontal direction: -1 left, 1 right, 0 none
  get direction() {
    if (this.right && !this.left) return 1;
    if (this.left && !this.right) return -1;
    return 0;
  }
}
