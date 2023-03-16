// import terrain from './assets/rectangular.png'

window.addEventListener('load', function(){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 1024;
  canvas.height = 500;
  const universalSpeed = 5;
  const pitfallGap = 100;
  const terrainY = canvas.height - 28;
  let gameOver = false;
  let gameWin = false;
  let pause = false;
  const gravity = 1;
  const posXStart = 20;

  const keys = {
    ArrowRight: {
      pressed: false
    },
    ArrowLeft: {
      pressed: false
    }
  };


   /////////////////////////////////////////
  ///////////////  Add keys  //////////////
  /////////////////////////////////////////
  window.addEventListener('keydown', (e) => {
    // console.log(e);
    switch (e.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        bunny.changeSprite(bunnySpriteRunRight)
        break
      case 'ArrowLeft':
        // debugger
        keys.ArrowLeft.pressed = true
        bunny.changeSprite(bunnySpriteRunLeft)
        break 
      case ' ':
        bunny.changeSprite(bunnySpriteRunRight)
        if (bunny.onGround()) bunny.speed.y = -18
        else if (bunny.speed.y === 0) bunny.speed.y = -18
        else bunny.speed.y = 0
        break
    }
  })


  window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = false
        bunny.changeSprite(bunnySpriteStandRight)
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        bunny.changeSprite(bunnySpriteStandLeft)
        break 
    }
  })

/////////////////////////////////////////////
///////////////  Add sprites  //////////////
/////////////////////////////////////////////

  bunnyDefault = {
    image: document.getElementById('bunny'),
    coord: [21, 27, 37, 43]
  }
  bunnySpriteRunRight = {
    image: document.getElementById('bunnySpriteRunRight'),
    coord: [21, 27, 37, 43]
  }

  bunnySpriteRunLeft = {
    image: document.getElementById('bunnySpriteRunLeft'),
    coord: [21, 27, 37, 43]
    // coord: [480 - 21 - 37, 27, 37, 43]
  }

  bunnySpriteStandRight = {
    image: document.getElementById('bunnySpriteStandRight'),
    coord: [21, 27, 37, 43]
  }

  bunnySpriteStandLeft = {
    image: document.getElementById('bunnySpriteStandLeft'),
    coord: [21, 27, 37, 43]
  }

  

  

  class Bunny {
    constructor(pos){
      this.canvas = canvas;
      this.ctx = ctx;

      this.pos = {
        x: posXStart,
        y: 0 //canvas.height - this.height
      }

      this.speed = {
        x: 0,
        y: 0
      }

      // this.sprites = {
      //   default: {
      //     image: spriteBunnyDefault.image,
      //     coord: spriteBunnyDefault.coord
      //   },
      //   run: {
      //     right: {
      //       image: spriteBunnySpriteRunRight.image,
      //       coord: spriteBunnySpriteRunRight.coord
      //     },
      //     left: {
      //       image: spriteBunnySpriteRunLeft.image,
      //       coord: spriteBunnySpriteRunLeft.coord
      //     }
      //   },
      //   idle: {
      //     right: {
      //       image: spriteBunnySpriteStandRight.image,
      //       coord: spriteBunnySpriteStandRight.coord
      //     }
      //   }

      // }
      this.currentSpriteObject = bunnyDefault
      this.currentSprite = this.currentSpriteObject.image
      this.coord = this.currentSpriteObject.coord
      this.width = this.coord[2]//this.image.width / 6
      this.height = this.coord[3]//this.image.height
      // this.frameX = 0
      // this.frameY = 0 
      // sizeAdjustment is needed because bunny has too large padding to all boundaries
      // this.sizeAdjustment = 0
    }

    changeSprite(newSprite){
      this.currentSpriteObject = newSprite
      this.currentSprite = newSprite.image
      this.coord = newSprite.coord
    }

    draw(){
      // ctx.strokeStyle = 'black';
      // ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
      // ctx.beginPath();
      // ctx.arc(this.pos.x + this.width/2, this.pos.y + this.height/2, this.width/2 - this.sizeAdjustment, 0, Math.PI * 2);
      // ctx.stroke();
      // ctx.fillStyle = 'red';
      // ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
      // ctx.drawImage(this.image, 
      //               this.frameX * this.width, this.frameY * this.height,
      //               this.width, this.height,
      //               this.pos.x, this.pos.y, this.width, this.height);
      ctx.drawImage(this.currentSprite, 
                    this.coord[0], this.coord[1],
                    this.coord[2], this.coord[3],
                    this.pos.x, this.pos.y, this.width, this.height);
                     

    }

    update(enemies){
      // collision detection
      // console.log(enemies);
      enemies.forEach((enemy, index) => {
        // const dx = enemy.pos.x - this.pos.x - this.sizeAdjustment;
        // const dy = enemy.pos.y - this.pos.y - this.sizeAdjustment;
        // const dx = enemy.pos.x - this.pos.x - this.sizeAdjustment;
        // const dy = enemy.pos.y - this.pos.y - this.sizeAdjustment;
        // const distance = Math.sqrt(dx * dx + dy * dy);
        // console.log(distance);
        // console.log(enemy.pos.y - (this.pos.y + this.height));

        // bunny jumps on top of enemy. Top Collision
        if (enemy.pos.x                <= this.pos.x + this.width &&
            enemy.pos.x + enemy.width  >= this.pos.x              &&
            enemy.pos.y >= this.pos.y + this.height &&
            enemy.pos.y <= this.pos.y + this.height + this.speed.y

            // enemy.pos.y               >= this.pos.y + this.height - this.sizeAdjustment &&
            // enemy.pos.y - (this.pos.y + this.height) <= 1

            ){
              console.log('enemy defeated');
              this.speed.y = -10;
              // bunny jumped on enemy and enemy needs to be removed
              remove(enemy, index);
              // console.log(enemies);

        // } else if (distance < enemy.width / 2 + this.width / 2) {
        } else if ( 
                    // enemy touches bunny on the left
                   (enemy.pos.x + enemy.width  >= this.pos.x  &&
                    enemy.pos.x                <= this.pos.x  + this.width  &&
                    enemy.pos.y >= this.pos.y &&
                    enemy.pos.y + enemy.height <= this.pos.y + this.height) ||

                    // enemy touches bunny on the right
                   (enemy.pos.x  <= this.pos.x + this.width &&
                    enemy.pos.x  >= this.pos.x &&
                    enemy.pos.y >= this.pos.y &&
                    enemy.pos.y + enemy.height <= this.pos.y + this.height) ||

                    // enemy falls on top of the bunny
                   (enemy.pos.x + enemy.width >= this.pos.x &&
                    enemy.pos.x <= this.pos.x + this.width &&
                    enemy.pos.y + enemy.height === this.pos.y)

        ) {
          // console.log(this.pos);
          // console.log(enemy.pos);
          gameOver = true;
          // console.log(gameOver);
        }
      });

      this.draw();
      this.pos.x += this.speed.x;
      if (this.pos.x < posXStart) this.pos.x = posXStart;
      // else if (this.pos.x + this.width >= canvas.width) this.pos.x = canvas.width - this.width;

      //console.log(this.onGround());
      this.pos.y += this.speed.y
      // if (!this.onGround()) 
      if (this.pos.y + this.height + this.speed.y < canvas.height && !this.onGround()){
        this.speed.y += gravity;
      } 
      // remove else for a pitfall logic
      //else {
        //this.speed.y = 0;
      //}
    }

    // check if bunny is on the terrain
    onGround(){
      return this.pos.y >= canvas.height - this.height;
    }
  }

  class Enemy {
    constructor({x, y}){
           
      
      this.speed = {
        x: 0.5,
        y: 0
      }

      this.pos = {
        x: x,
        y: y//terrainY - this.height// - this.speed.y -1
      }
      this.image = document.getElementById('ghost')
      this.width = this.image.width / 6
      this.height = this.image.height
      this.frameX = 0
      this.frameY = 0 

    }
    draw(){
      // ctx.strokeStyle = 'black';
      // ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
      // ctx.beginPath();
      // ctx.arc(this.pos.x + this.width/2, this.pos.y + this.height/2, this.width/2, 0, Math.PI * 2);
      // ctx.stroke();
      // ctx.fillStyle = 'grey';
      // ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
      ctx.drawImage(this.image, 
        this.frameX * this.width, this.frameY * this.height,
        this.width, this.height,
        this.pos.x, this.pos.y, this.width, this.height);

    }
    update(){
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

  // function remove(enemy){
  //   const index = enemies.indexOf(el => {
  //     el.pos.x === enemy.pos.x &&
  //     el.pos.y === enemy.pos.y
  //   })
  //   enemies.splice(index,1);
  //   enemyScore += 100;
  //   // return enemies;
  // }

  function remove(enemy, index){
    enemies.splice(index,1);
    enemyScore += 100;
    // return enemies;
  }

  class Terrain {
    constructor({x,y}) {
      // constructor({x,y, imageSrc}) {
      this.pos = {
        x: x,
        y: y
      }
      
      // this.image = imageSrc
      // this.width = this.image.width
      // this.height = this.image.height
      this.width = 200
      this.height = 30
    }

    draw() {
      ctx.fillStyle = 'black'
      ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
      // ctx.drawImage(this.image, this.pos.x, this.pos.y);
    } 
  }


  function pauseButtonListener() {
    let pauseButton = document.getElementById("pause-button") 
    pauseButton.addEventListener("click", buttonEvent)
    
    function buttonEvent(e) {
      if (pause === true) {
        pause = false;
        // animate();
      } else if (pause === false) pause = true;
    }
  }




  let restartButton = document.getElementById("restart-button");
  restartButton.addEventListener('click', () => {
    // window.location.reload(false);
    start();
  })
  

    // function removeListener() {
    //     pauseButton.removeEventListener("click", buttonEvent);
    // }

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////  Initialaze instances of classes and some variables  //////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
  let scrollScore = 0;
  let enemyScore = 0;
  let bunny = new Bunny();
  let enemies = [];
  let terrains = [];
 
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////  Start function - reassign instances of classes and some variables  //////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


  function start(){
    scrollScore = 0;
    enemyScore = 0;
    enemies = [ 
      new Enemy({x: 450, y: 100}),
                new Enemy({x: 550, y: terrainY - 40}),
                new Enemy({x: 1290, y: 350 - 40}),
                // new Enemy({x: 1290 - 40, y: 350 - 40}),
                new Enemy({x: 1290 - 40, y: terrainY - 40}),
                new Enemy({x: 1790, y: 150 - 40}),
                new Enemy({x: 1790 - 40, y: 150 - 40}),
                new Enemy({x: 1790 - 40*2, y: 150 - 40}),

                new Enemy({x: 1790 - 40*2, y: 150 - 40}),
                new Enemy({x: 1790 - 40*2, y: 150 - 40}),
                
                new Enemy({x: 8 * 200-6 + 4.5 * pitfallGap + 170, y: 350 - 40}),
                new Enemy({x: 8 * 200-6 + 4.5 * pitfallGap + 170 - 40, y: 250 - 40}),

                new Enemy({x: 3300, y: 150 - 40}),
                new Enemy({x: 3300 - 40*1, y: terrainY - 40}),
                new Enemy({x: 3300 - 40*2, y: terrainY - 40})
                
              ];
    bunny = new Bunny({x:0, y:0});
    terrains = [new Terrain({x: -5, y: terrainY}),
                new Terrain({x: 1 * 200-6, y: terrainY}),
                new Terrain({x: 2 * 200-6, y: terrainY}),
                new Terrain({x: 3 * 200-6 + pitfallGap, y: terrainY}),
                new Terrain({x: 450, y: 350}),
                new Terrain({x: 4 * 200-6 + 2 * pitfallGap, y: terrainY}),
                new Terrain({x: 5 * 200-6 + 2 * pitfallGap, y: terrainY}),
                new Terrain({x: 6 * 200-6 + 2 * pitfallGap, y: terrainY}),
                new Terrain({x: 1100, y: 350}),
                new Terrain({x: 1250, y: 200}),
                new Terrain({x: 1600, y: 150}),

                new Terrain({x: 7 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 8 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                
                new Terrain({x: 8 * 200-6 + 4.5 * pitfallGap, y: 350}),
                new Terrain({x: 8.9 * 200-6 + 4.5 * pitfallGap, y: 250}),

                new Terrain({x: 9 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 11 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 12 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 13 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 14 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 15 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 16 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 17 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 3*200-6 + 100, y: terrainY}),
              ];
              //  new Terrain({x: 200, y: 400, imageSrc: './assets/rectangular.png'})];
  };

  function displayInfo(ctx){
    ctx.font = '25px myFontHack';
    ctx.fillStyle = 'black';
    let score = Math.floor(scrollScore / 10) + enemyScore;
    if (score < 0) score = 0;
    ctx.fillText('Score: ' + score, 20, 50);
    if (gameOver) {
      ctx.font = '50px myFontHack';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'black';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    }

    if (gameWin) {
      ctx.font = '50px myFontHack';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'green';
      ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2);
      // gameWin = false;
    }
  };

  
  
  /////////////////////////////////////////////////
  ///////////////  Animate function  //////////////
 //////////////////////////////////////////////////
  function animate() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    terrains.forEach(terrain => {
      terrain.draw();
    });
    enemies.forEach(enemy => {
      enemy.update();
    });
    bunny.update(enemies);
    
    bunny.speed.x = 0;
    if (keys.ArrowRight.pressed && bunny.pos.x < canvas.width / 2) {
      bunny.speed.x = universalSpeed;
      scrollScore += universalSpeed;
      // enemy.speed.x = universalSpeed/10;
    } else if (keys.ArrowLeft.pressed && bunny.pos.x < canvas.width / 2 ){
      
        bunny.speed.x = -universalSpeed;
        scrollScore -= universalSpeed;
        if (scrollScore < 0) scrollScore = 0;

      // enemy.speed.x = universalSpeed/10;
      
    } else {
      bunny.speed.x = 0
      
      if (keys.ArrowRight.pressed) {
        // scrollScore += bunny.pos.x;
        scrollScore += universalSpeed;
        enemies.forEach(enemy => {
          enemy.pos.x -= universalSpeed;
        })

        terrains.forEach(terrain => {
          terrain.pos.x -= universalSpeed;
        })
      } else if (keys.ArrowLeft.pressed && scrollScore > 0){
          scrollScore -= universalSpeed;
          if (scrollScore < 0) scrollScore = 0;

          enemies.forEach(enemy => {
            enemy.pos.x += universalSpeed;
          })
          
          terrains.forEach(terrain => {
            terrain.pos.x += universalSpeed;
          })
      // } else if (bunny.pos.x <= 10 && keys.ArrowLeft.pressed){
      //   // scrollScore -= universalSpeed;
      //   terrains.forEach(terrain => {
      //     terrain.pos.x += 0;
      //   })
      }
    }
    // console.log(scrollScore);
    
    terrains.forEach(terrain => {
      // top collision with a terrain or a platform
      if (( bunny.pos.y + bunny.height                 <= terrain.pos.y && 
        bunny.pos.y + bunny.height + bunny.speed.y >= terrain.pos.y &&
        bunny.pos.x + bunny.width                  >= terrain.pos.x &&
        bunny.pos.x                                <= terrain.pos.x + terrain.width 
        ) ||
        // bottom collision with a terrain or a platform
        
        (   bunny.pos.y                                >= terrain.pos.y + terrain.height && 
            bunny.pos.y + bunny.speed.y                <= terrain.pos.y + terrain.height &&
            bunny.pos.x + bunny.width                  >= terrain.pos.x &&
            bunny.pos.x                                <= terrain.pos.x + terrain.width )) {
              
              bunny.speed.y = 0
            }
          })


          
          terrains.forEach(terrain => {
            // top collision with a terrain or a platform
            
            for (let i = 0; i < enemies.length; i++){
              if (( enemies[i].pos.y + enemies[i].height                      <= terrain.pos.y && 
                enemies[i].pos.y + enemies[i].height + enemies[i].speed.y >= terrain.pos.y &&
                enemies[i].pos.x + enemies[i].width                       >= terrain.pos.x &&
                enemies[i].pos.x                                          <= terrain.pos.x + terrain.width 
        ) ||
        // bottom collision with a terrain or a platform
        
        ( enemies[i].pos.y                                          >= terrain.pos.y + terrain.height && 
              enemies[i].pos.y + enemies[i].speed.y                     <= terrain.pos.y + terrain.height &&
              enemies[i].pos.x + enemies[i].width                       >= terrain.pos.x &&
              enemies[i].pos.x                                          <= terrain.pos.x + terrain.width )) {

                enemies[i].speed.y = 0
              }
            }
            
          })
          // console.log(scrollScore);
          // console.log(bunny.pos.x);
          
          if (scrollScore > 3000) {
            console.log('Win!') ;
            gameWin = true;
          }
          if (bunny.pos.y > canvas.height) {
            console.log('Lose!');
            start();
          }
          displayInfo(ctx);
          pauseButtonListener();
          // console.log(pause);
          if (!gameOver && !gameWin && !pause ) window.requestAnimationFrame(animate);
          // if (pause) window.requestAnimationFrame(animate);

          // console.log(terrains[0].pos.x)
        }

        // function displayStart(ctx){
        //   ctx.font = '25px myFontHack';
        //   ctx.fillStyle = 'black';
      
        //   if (start) {
        //     ctx.font = '50px myFontHack';
        //     ctx.textAlign = 'center';
        //     ctx.fillStyle = 'green';
        //     ctx.fillText('START!', canvas.width / 2, canvas.height / 2);
        //   }
        // };
        
        start();
        animate();


  
});




