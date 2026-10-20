window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  const pauseButton = document.getElementById('pause-button');
  const pauseIcon = pauseButton.querySelector('i');
  const restartButton = document.getElementById('restart-button');
  const playAgainButton = document.getElementById('play-again');

  loadSprites(SPRITE_PATHS).then(sprites => {
    const game = new Game(canvas, sprites);

    const showPaused = (paused) => {
      pauseIcon.classList.toggle('fa-pause', !paused);
      pauseIcon.classList.toggle('fa-play', paused);
    };

    const restart = () => {
      game.restart();
      game.paused = false;
      showPaused(false);
    };

    game.onPlayAgainChange = (visible) => {
      playAgainButton.hidden = !visible;
    };

    restartButton.addEventListener('click', () => {
      restart();
      // drop focus so Space jumps instead of pressing the button again
      restartButton.blur();
    });

    playAgainButton.addEventListener('click', () => {
      restart();
      playAgainButton.blur();
    });

    // Enter works too once the button shows
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !playAgainButton.hidden) restart();
    });

    pauseButton.addEventListener('click', () => {
      showPaused(game.togglePause());
      pauseButton.blur();
    });

    game.start();
  });
});
