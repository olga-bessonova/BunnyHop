// import terrain from './assets/rectangular.png'

window.addEventListener('load', function(){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 1024;
  canvas.height = 500;
  let scrollScore = 0;
  const universalSpeed = 5;

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

  class Bunny {
    constructor(pos){
      this.canvas = canvas;
      this.ctx = ctx;

      this.pos = {
        x: 0,
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
      ctx.fillStyle = 'red';
      ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    update(){
      this.draw();
      this.pos.x += this.speed.x;
      // if (this.pos.x < 0) this.pos.x = 0;
      // else if (this.pos.x + this.width >= canvas.width) this.pos.x = canvas.width - this.width;

      //console.log(this.onGround());
      this.pos.y += this.speed.y
      // if (!this.onGround()) 
      if (this.pos.y + this.height + this.speed.y < canvas.height && !this.onGround()){
        this.speed.y += gravity;
      } else {
        this.speed.y = 0;
      }
    }

    // check if bunny is on the terrain
    onGround(){
      return this.pos.y >= canvas.height - this.height;
    }
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


  const bunny = new Bunny({x:0, y:0});
  const terrains = [new Terrain({x: 60, y: 200}),
                    new Terrain({x: 200, y: 400})];
                  //  [new Terrain({x: 60, y: 200, imageSrc: './assets/rectangular.png'}),
                    // new Terrain({x: 200, y: 400, imageSrc: './assets/rectangular.png'})];
  

  function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    terrains.forEach(terrain => {
      terrain.draw();
    })
    bunny.update();
     

    bunny.speed.x = 0;
    if (keys.ArrowRight.pressed && bunny.pos.x < canvas.width - bunny.width) {
      bunny.speed.x = universalSpeed;
    } else if (keys.ArrowLeft.pressed && bunny.pos.x > 0){
      bunny.speed.x = -universalSpeed;
    } else {
      bunny.speed.x = 0

      if (keys.ArrowRight.pressed) {
        scrollScore += universalSpeed;
        terrains.forEach(terrain => {
          terrain.pos.x -= universalSpeed;
        })
      } else if (keys.ArrowLeft.pressed){
        scrollScore -= universalSpeed;
        terrains.forEach(terrain => {
          terrain.pos.x += universalSpeed;
        })
      }
    }
    // console.log(scrollScore);

    terrains.forEach(terrain => {
      if (bunny.pos.y + bunny.height                 <= terrain.pos.y && 
          bunny.pos.y + bunny.height + bunny.speed.y >= terrain.pos.y &&
          bunny.pos.x + bunny.width                  >= terrain.pos.x &&
          bunny.pos.x                                <= terrain.pos.x + terrain.width 
        ){
          bunny.speed.y = 0
        }
    })

    if (scrollScore > 3000) console.log('Win!') 
    
  }
  animate();






  
});




