// a touch held longer than this runs; a shorter one is a tap and jumps
const TOUCH_HOLD_MS = 140;

// Tracks the keys and touches the game uses.
// Keyboard: arrows run, Space or Up jumps.
// Touch: hold the left or right half of the screen to run, tap to jump.
// On-screen pad (phones in landscape): arrow buttons run, round buttons jump.
class Input {
  constructor() {
    this.left = false;
    this.right = false;
    // set on key press or tap, cleared when the game uses it, so a short tap is never missed
    this.jumpQueued = false;
    // active touches by pointer id: {side, holding, timer}
    this.touches = new Map();
    // on-screen arrow buttons held down
    this.pad = {left: false, right: false};

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

  // listens for touches on the page; enabled(e) says whether a touch should control the game
  attachTouch(enabled) {
    const sideOf = (e) => e.clientX < window.innerWidth / 2 ? -1 : 1;

    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' || !enabled(e)) return;
      // buttons, links and the on-screen pads keep working normally
      if (e.target.closest('button, a, .pad')) return;
      e.preventDefault();

      const touch = {side: sideOf(e), holding: false};
      touch.timer = setTimeout(() => { touch.holding = true; }, TOUCH_HOLD_MS);
      this.touches.set(e.pointerId, touch);
    }, {passive: false});

    // sliding a held finger across the middle changes direction
    window.addEventListener('pointermove', (e) => {
      const touch = this.touches.get(e.pointerId);
      if (touch) touch.side = sideOf(e);
    });

    const release = (e, tapped) => {
      const touch = this.touches.get(e.pointerId);
      if (!touch) return;
      clearTimeout(touch.timer);
      if (tapped && !touch.holding) this.jumpQueued = true;
      this.touches.delete(e.pointerId);
    };
    window.addEventListener('pointerup', (e) => release(e, true));
    window.addEventListener('pointercancel', (e) => release(e, false));
  }

  // on-screen buttons marked data-pad="left", "right" or "jump"
  attachPad(buttons) {
    buttons.forEach(button => {
      const action = button.dataset.pad;
      button.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        // keep getting this finger's events even if it slides off the button
        button.setPointerCapture(e.pointerId);
        button.classList.add('pressed');
        if (action === 'jump') this.jumpQueued = true;
        else this.pad[action] = true;
      });
      const release = () => {
        button.classList.remove('pressed');
        if (action !== 'jump') this.pad[action] = false;
      };
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      button.addEventListener('lostpointercapture', release);
      // no long-press menu on the buttons
      button.addEventListener('contextmenu', (e) => e.preventDefault());
    });
  }

  consumeJump() {
    const queued = this.jumpQueued;
    this.jumpQueued = false;
    return queued;
  }

  // horizontal direction: -1 left, 1 right, 0 none
  get direction() {
    let left = this.left || this.pad.left;
    let right = this.right || this.pad.right;
    this.touches.forEach(touch => {
      if (!touch.holding) return;
      if (touch.side < 0) left = true;
      else right = true;
    });
    if (right && !left) return 1;
    if (left && !right) return -1;
    return 0;
  }
}
