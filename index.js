// import terrain from './assets/rectangular.png'

window.addEventListener('load', function(){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 1024;
  canvas.height = 500;
  const universalSpeed = 5;
  const pitfallGap = 100;
  const terrainY = canvas.height - 28;

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
      this.width = 40
      this.height = 40
    }

    draw(){
      ctx.strokeStyle = 'black';
      ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
      ctx.fillStyle = 'red';
      ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    update(){
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
      this.width = 40
      this.height = 40
      
      this.speed = {
        x: 0.5,
        y: 0
      }

      this.pos = {
        x: x,
        y: y//terrainY - this.height// - this.speed.y -1
      }

    }
    draw(){
      ctx.strokeStyle = 'black';
      ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
      ctx.fillStyle = 'grey';
      ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

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
    bunny = new Bunny({x:0, y:0});
    enemies = [ new Enemy({x: 1000, y: terrainY - 40}),
                new Enemy({x: 450, y: 100})
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
  }

  
  
  /////////////////////////////////////////////////
  ///////////////  Animate function  //////////////
 //////////////////////////////////////////////////
  function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    terrains.forEach(terrain => {
      terrain.draw();
    });
    bunny.update();
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
    
  }
  start();
  animate();

//   function gameOver() {
//     let startDiv = document.getElementById("start");
//     let gameCanvas = document.getElementById("canvas");
//     let gameOver = document.getElementById("game-over");
//     startDiv.style.display = "none";
//     gameCanvas.style.display = "none";
//     gameOver.style.display = "block";

//     ball.reset();
//     player1.reset();
//     player2.reset();

//     clearInterval(loop);
// }




  
});




