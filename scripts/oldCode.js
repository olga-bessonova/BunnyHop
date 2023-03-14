class Sprite {
  constructor({pos, imageSrc}) {
    this.pos = pos
    this.image = new Image()
    this.image.src = imageSrc
  }

  draw() {
    if (!this.image) {
      return ctx.drawImage(this.image, this.pos.x, this.pos.y)
    }     
  }

  update(){
    this.draw()
  }
};

const background = new Sprite({pos:{x:0,y:0}, imageSrc: './assets/autumn-landscape-background/background.jpg'})
