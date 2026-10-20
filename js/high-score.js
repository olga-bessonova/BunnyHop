// Keeps the player's best score in the browser (localStorage) between visits.
class HighScore {
  constructor(key = 'bunnyhop.bestScore') {
    this.key = key;
    this.best = this.load();
  }

  load() {
    try {
      return Number(localStorage.getItem(this.key)) || 0;
    } catch (e) {
      // storage can be blocked (private mode, disabled site data); the game still works
      return 0;
    }
  }

  // returns true when the score is a new best
  submit(score) {
    if (score <= this.best) return false;
    this.best = score;
    try {
      localStorage.setItem(this.key, String(score));
    } catch (e) {}
    return true;
  }
}
