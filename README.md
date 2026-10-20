# Bunny Hop

[Play Bunny Hop!](https://olga-bessonova.github.io/BunnyHop/)

# Background

A side-scrolling game where the main character bunny needs to get from start to finish. Along the way the bunny defeats ghosts by jumping on top of them and collects carrots. The bunny has 3 lives. It loses a life if a ghost bites it or it falls into a gap on the map. After a fall it comes back on the last platform it stood on. When all lives are gone, a "GAME OVER" message appears and the game stops.

There is a scoring system, and the best score is kept in the browser between visits. The game ends successfully if the bunny reaches the finish.

<img src="https://i.postimg.cc/65Mr8BDy/begin-dead.gif">
<img src="https://i.postimg.cc/kXJNM2Y0/begin-fall2.gif">
<img src="https://i.postimg.cc/rwzSWvkg/win.gif">


# Functionality
* Use left, right arrows to move left and right. Use space or the up arrow to jump.
* Implementation of gravity.
* Implementation of collision
* Map update (side-scrolling feature)
* Attack enemies. Enemies start moving when they appear on screen.
* 3 lives, shown as hearts
* Gain points by moving closer to finish (1 point per 15px), defeating enemies (+50) and collecting carrots (+10)
* Best score saved in the browser (localStorage)
* Carrots are scattered randomly each round (always 20)
* "Play again" button after winning, or 2 seconds after a game over (Enter works too)
* Sprite animations for idle, run, jump, fall, land, hurt and death
* Mobile: plays sideways (landscape) on phones. Hold the left or right side of the screen to run, tap to jump
* Installable app (PWA): works offline after the first visit
  * Android (Chrome): menu, then "Install app" / "Add to Home screen"
  * iPhone (Safari): Share, then "Add to Home Screen"

Bonus features (to be implemented):
* Sound effects
* Mute and unmute sound effects
* The board of lead players

# Wireframes
<img src="https://i.postimg.cc/Yqx6CpGk/wireframe.png"  width="40%">
<!-- (https://i.imgur.com/WmzEkKc.png) -->

# Technologies, Libraries, APIs
* Canvas
* Javascript
* HTML
* CSS

Bonus feature (to be implemented):
* Google Fire

# Code
The game is split into one class per file under `js/`:

| File | What it does |
|---|---|
| `config.js` | All game settings (speeds, gravity, lives, points) |
| `sprites.js` | Loads sprite sheets; `Animation` and `Animator` play strips of frames |
| `input.js` | Keyboard state |
| `high-score.js` | Best score in localStorage |
| `entities/body.js` | Shared gravity and platform collision |
| `entities/bunny.js` | The player |
| `entities/enemy.js` | `Enemy` base class and the `Ghost` |
| `entities/platform.js` | Ground and floating platforms |
| `entities/carrot.js` | Collectible carrots |
| `hud.js` | Score, best score and hearts |
| `win-scene.js` | The happy bunny with a carrot under "YOU WIN!" |
| `level.js` | Map layout: platforms, ghosts, carrots |
| `game.js` | Game loop, camera, scoring, lives |
| `main.js` | Starts the game, buttons, phone rotation, full screen |
| `../sw.js`, `../manifest.webmanifest` | Offline cache and app install settings |

Here is the `Enemy` class. It waits until it scrolls onto the screen, then starts moving:
```javascript
class Enemy extends Body {
  constructor(options) {
    super(options);
    this.active = false;
    this.defeated = false;
    this.fadeTicks = 0;
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
```

# Timeline
## Day 1
* Research sprites, canvas and google fire. 
* Set up skeleton
* Add canvas

## Day 2
* Implement a Class Bunny (square instead of a bunny). Make it move and drop with a gravity
* Connect left, right, space to movement and jumping
* Add gravity and a character's physics


## Day 3
* Implement a Class Terrain to create ground and platforms 
* Add collision detection


## Day 4
* Add live score
* Add a class Enemy
* Add several enemies, implement their physics and disappearance 


## Day 5
* Add gaps on a map and logic behind it
* Add sprites for all characters
* Implement side scrolling background 
* Add styling


## Day 6
* Update styling


## 
