# Bunny Hop

[Play Bunny Hop!](https://olga-bessonova.github.io/BunnyHop/)

# Background

A side-scrolling game where the main character bunny needs to get from start to finish. Along the way the bunny defeats enemies by jumping on top of them. The bunny has one life. The bunny loses life if an enemy bites or the bunny fall through the gap on a map. If the bunny falls through the pitfall, the game restarts. If an enemy kills the bunny, a "GAME OVER" message appears and the game stops.

There is a scoring system. The game ends successfully if the map ends and the bunny reaches the finish. 

<img src="https://i.postimg.cc/65Mr8BDy/begin-dead.gif">
<img src="https://i.postimg.cc/kXJNM2Y0/begin-fall2.gif">
<img src="https://i.postimg.cc/rwzSWvkg/win.gif">


# Functionality
* Use left, right arrows to move left and right. Use space to jump. 
* Implementation of gravity.
* Implementation of collision
* Map update (side-scrolling feature)
* Attack enemies
* Gain points by moving closer to finish and defeating enemies 

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
Here is an implementation of a class Enemy:
```javascript
  class Enemy {
    constructor({x, y}){           
      
      this.speed = {
        x: 0.5,
        y: 0
      }

      this.pos = {
        x: x,
        y: y
      }
      this.image = document.getElementById('ghost')
      this.width = this.image.width / 6
      this.height = this.image.height
      this.frameX = 0
      this.frameY = 0 
    }

    draw(){
      ctx.drawImage(this.image, 
        this.frameX * this.width, this.frameY * this.height,
        this.width, this.height,
        this.pos.x, this.pos.y, this.width, this.height);
    }

    update(){
      this.frameX++;
      if (this.frameX >= 6) this.frameX = 0      
      this.draw();
      this.pos.x -= this.speed.x;
      this.pos.y += this.speed.y;
      if (this.pos.y + this.height + this.speed.y < canvas.height && !this.onGround()){
        this.speed.y += gravity;
      }
    }

    onGround(){
      return this.pos.y >= canvas.height - this.height;
    }
  };
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
