































window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      bunny.changeSprite(bunnySpriteRunRight);
      faceSide = 'right';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      bunny.changeSprite(bunnySpriteRunLeft);
      faceSide = 'left';
      break;
    case ' ':
      if (!spacePressed) { // Check if spacebar is not already pressed
        spacePressed = true;
        if (faceSide === 'right') bunny.changeSprite(bunnySpriteRunRight);
        else bunny.changeSprite(bunnySpriteRunLeft);
        if (bunny.onGround()) bunny.speed.y = -18;
        else if (bunny.speed.y === 0) bunny.speed.y = -18;
        else bunny.speed.y = 0;
      }
      break;
  }
});


window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      bunny.changeSprite(bunnySpriteStandRight);
      faceSide = 'right';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      bunny.changeSprite(bunnySpriteStandLeft);
      faceSide = 'left';
      break;
    case ' ':
      spacePressed = false; // Reset the spacePressed variable
      if (faceSide === 'right') bunny.changeSprite(bunnySpriteStandRight);
      else bunny.changeSprite(bunnySpriteStandLeft);
      break;
  }
});