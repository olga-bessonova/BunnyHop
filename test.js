const a = [1,2,3,4,5,78,9,90];
// function evenE(a){
//   a.some(el  => {
//     return el % 2 ===0
//   })

// }
// // console.log(evenE(a))
// console.log(a.some(el  => {
//   return el % 2 ===0
// }))


// const ages = [3, 10, 18, 20];

// function eveN(el) {
//   return el % 2 ===0;
// }
// console.log(a.some(eveN));
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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



function onPlatform(terra, character){
    
  return  character.pos.y + character.height === terra.pos.y && 
          character.pos.x - character.width >= terra.pos.x &&
          character.pos.x <= terra.pos.x + terra.width 
        
} 

let onAnyPlatform = false;
for (let i = 0; i < terrains.length; i++){
  if (onPlatform(terrains[i], bunny)) onAnyPlatform = true;
}
console.log(onAnyPlatform);

// console.log(terrains.some(onPlatform(terra, bunny)))