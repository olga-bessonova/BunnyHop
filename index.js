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
  


  function createImage(imageSrc){
    const image = new Image();
    image.src = imageSrc
    return image; 
  }

  /////////////////////////////////////////
  ///////////////  Add keys  //////////////
  /////////////////////////////////////////
  const keys = {
    ArrowRight: {
      pressed: false
    },
    ArrowLeft: {
      pressed: false
    }
  };

  window.addEventListener('keydown', (e) => {
    // console.log(e);
    switch (e.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        break 
      case ' ':
        if (bunny.onGround()) bunny.speed.y = -25
        else if (bunny.speed.y === 0) bunny.speed.y = -25
        else bunny.speed.y = 0
        break
    }
  })


  window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break 
    }
  })




  const gravity = 1;
  const posXStart = 20;

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
      this.image = document.getElementById('bunny')
      this.width = this.image.width / 6
      this.height = this.image.height
      this.frameX = 0
      this.frameY = 0 
      // sizeAdjustment is needed because bunny has too large padding to all boundaries
      this.sizeAdjustment = 10
    }

    draw(){
      ctx.strokeStyle = 'black';
      ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
      ctx.beginPath();
      ctx.arc(this.pos.x + this.width/2, this.pos.y + this.height/2, this.width/2 - this.sizeAdjustment, 0, Math.PI * 2);
      ctx.stroke();
      // ctx.fillStyle = 'red';
      // ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
      ctx.drawImage(this.image, 
                    this.frameX * this.width, this.frameY * this.height,
                    this.width, this.height,
                    this.pos.x, this.pos.y, this.width, this.height);
                     

    }

    update(enemies){
      // collision detection
      console.log(enemies);
      enemies.forEach(enemy => {
        const dx = enemy.pos.x - this.pos.x - this.sizeAdjustment;
        const dy = enemy.pos.y - this.pos.y - this.sizeAdjustment;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // console.log(distance);
        console.log(enemy.pos.y - (this.pos.y + this.height));

        if (enemy.pos.x               >= this.pos.x + this.sizeAdjustment &&
            enemy.pos.x + enemy.width <= this.pos.x + this.width - this.sizeAdjustment &&
            enemy.pos.y               >= this.pos.y + this.height - this.sizeAdjustment &&
            enemy.pos.y - (this.pos.y + this.height - this.sizeAdjustment) <= this.sizeAdjustment
            // enemy.pos.y - (this.pos.y + this.height) <= 1

            ){
              console.log('enemy defeated');
              // bunny jumped on enemy and enemy needs to be removed
              remove(enemy);
              // console.log(enemies);

        } else if (distance < enemy.width / 2 + this.width / 2) {
      
          gameOver = true;
          console.log(gameOver);
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
      ctx.strokeStyle = 'black';
      ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
      ctx.beginPath();
      ctx.arc(this.pos.x + this.width/2, this.pos.y + this.height/2, this.width/2, 0, Math.PI * 2);
      ctx.stroke();
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

  function remove(enemy){
    const index = enemies.indexOf(el => {
      el.pos.x === enemy.pos.x &&
      el.pos.y === enemy.pos.y
    })
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


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////  Initialaze instances of classes and some variables  //////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
  let scrollScore = 0;
  let enemyScore = 0;
  // let bunny = new Bunny({x:0, y:0});
  let bunny = new Bunny();
  // let enemy = new Enemy();
  let enemies = [];
  let terrains = [];
                  //  [new Terrain({x: 60, y: 200, imageSrc: './assets/rectangular.png'}),
                    // new Terrain({x: 200, y: 400, imageSrc: './assets/rectangular.png'})];

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////  Start function - reassign instances of classes and some variables  //////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


  function start(){
    scrollScore = 0;
    enemyScore = 0;
    bunny = new Bunny({x:0, y:0});
    enemies = [ 
                new Enemy({x: 450, y: 100}),
                new Enemy({x: 550, y: terrainY - 40})
                //new Enemy({x: 1000, y: terrainY - 40}),
                // new Enemy({x: 800, y: 100})
              ];
    terrains = [new Terrain({x: -5, y: terrainY}),
                new Terrain({x: 1 * 200-6, y: terrainY}),
                new Terrain({x: 2 * 200-6, y: terrainY}),
                new Terrain({x: 3 * 200-6 + pitfallGap, y: terrainY}),
                new Terrain({x: 450, y: 350}),
                new Terrain({x: 4 * 200-6 + 2 * pitfallGap, y: terrainY}),
                new Terrain({x: 5 * 200-6 + 2 * pitfallGap, y: terrainY}),
                new Terrain({x: 6 * 200-6 + 2 * pitfallGap, y: terrainY}),
                new Terrain({x: 7 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 8 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                
                new Terrain({x: 8 * 200-6 + 4.5 * pitfallGap, y: 350}),
                new Terrain({x: 8.7 * 200-6 + 4.5 * pitfallGap, y: 250}),

                new Terrain({x: 9 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 11 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 12 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 13 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 14 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 15 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 16 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                new Terrain({x: 17 * 200-6 + 4.5 * pitfallGap, y: terrainY}),
                // new Terrain({x: 3*200-6 + 100, y: terrainY}),
                // new Terrain({x: 3*200-6 + 100, y: terrainY}),
              ];
              //  [new Terrain({x: 60, y: 200, imageSrc: './assets/rectangular.png'}),
                // new Terrain({x: 200, y: 400, imageSrc: './assets/rectangular.png'})];
  };

  function displayInfo(ctx){
    ctx.font = '40px Halvetica';
    ctx.fillStyle = 'black';
    ctx.fillText('SCORE: ' + scrollScore+enemyScore, 20, 50);
    if (gameOver) {
      ctx.textAlign = 'center';
      ctx.fillStyle = 'black';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
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
    bunny.update(enemies);
    enemies.forEach(enemy => {
      enemy.update();
    });
    
    bunny.speed.x = 0;
    if (keys.ArrowRight.pressed && bunny.pos.x < canvas.width / 2 - bunny.width) {
      bunny.speed.x = universalSpeed;
      // enemy.speed.x = universalSpeed/10;
    } else if (keys.ArrowLeft.pressed && bunny.pos.x < canvas.width / 2 - bunny.width ){
      bunny.speed.x = -universalSpeed;
      // enemy.speed.x = universalSpeed/10;
      
    } else {
      bunny.speed.x = 0

      if (keys.ArrowRight.pressed) {
        scrollScore += universalSpeed;
        enemies.forEach(enemy => {
          enemy.pos.x -= universalSpeed;
        })

        terrains.forEach(terrain => {
          terrain.pos.x -= universalSpeed;
        })
      } else if (keys.ArrowLeft.pressed){
        scrollScore -= universalSpeed;
        enemies.forEach(enemy => {
          enemy.pos.x += universalSpeed;
        })
        
        terrains.forEach(terrain => {
          terrain.pos.x += universalSpeed;
        })
      } else if (bunny.pos.x <= 10 && keys.ArrowLeft.pressed){
        // scrollScore -= universalSpeed;
        terrains.forEach(terrain => {
          terrain.pos.x += 0;
        })
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
          
          if (scrollScore > 3000) console.log('Win!') 
          if (bunny.pos.y > canvas.height) {
            console.log('Lose!');
            start();
          }
          
          if (!gameOver) window.requestAnimationFrame(animate);
        }
        start();
        animate();
  
});




