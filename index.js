window.addEventListener('load', function(){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 1024;
  canvas.height = 500;

  /////////////////////////////////
  ///////////////Add keys//////////
  /////////////////////////////////
  const keys = {
    ArrowRight: {
      pressed: false
    },
    ArrowLeft: {
      pressed: false
    }
  };

  window.addEventListener('keydown', (e) => {
    console.log(e);
    switch (e.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        break 
      case ' ':
        bunny.speed.y = -25
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
        y: 0
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
      // if (this.pos.x < 0) this.x = 0;
      // else if (this.x)

      this.pos.y += this.speed.y
      if (this.pos.y + this.height + this.speed.y < canvas.height){
        this.speed.y += gravity;
      } else {
        this.speed.y = 0;
      }
    }
  }


  const bunny = new Bunny({x:0, y:0});

  function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    bunny.update()

    bunny.speed.x = 0;
    if (keys.ArrowRight.pressed) bunny.speed.x = 5
    else if (keys.ArrowLeft.pressed) bunny.speed.x = -5
  }
  animate();



  
});




