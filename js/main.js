window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  const pauseButton = document.getElementById('pause-button');
  const pauseIcon = pauseButton.querySelector('i');
  const restartButton = document.getElementById('restart-button');
  const playAgainButton = document.getElementById('play-again');
  const fullscreenButton = document.getElementById('fullscreen-button');

  // phones and tablets: the game fills the screen in landscape and waits in portrait
  const phoneLandscape = window.matchMedia('(pointer: coarse) and (orientation: landscape)');
  const phonePortrait = window.matchMedia('(pointer: coarse) and (orientation: portrait)');
  const installedApp = window.matchMedia('(display-mode: fullscreen), (display-mode: standalone)');

  registerServiceWorker();

  loadSprites(SPRITE_PATHS).then(sprites => {
    const game = new Game(canvas, sprites);
    new RotateScene(document.getElementById('rotate-scene'), sprites, () => phonePortrait.matches).start();

    // on a phone in landscape the whole screen is the controller; elsewhere only the game itself
    game.input.attachTouch(e => phoneLandscape.matches || e.target.closest('#screen'));
    game.input.attachPad(document.querySelectorAll('[data-pad]'));

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

    // turning the phone to portrait hides the game, so pause it; resume when it turns back
    let pausedByRotation = false;
    const onRotate = () => {
      if (phonePortrait.matches && !game.paused) {
        pausedByRotation = game.togglePause();
      } else if (!phonePortrait.matches && pausedByRotation) {
        game.togglePause();
        pausedByRotation = false;
      }
      showPaused(game.paused);
    };
    phonePortrait.addEventListener('change', onRotate);
    onRotate();

    // full screen hides the browser bars; an installed app is already full screen
    const updateFullscreenButton = () => {
      fullscreenButton.hidden = !document.fullscreenEnabled || !phoneLandscape.matches || installedApp.matches;
      fullscreenButton.querySelector('i').className =
        'fa-solid fa-2x ' + (document.fullscreenElement ? 'fa-compress' : 'fa-expand');
    };
    fullscreenButton.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen({navigationUI: 'hide'})
          // Android can keep the game sideways; other browsers ignore this
          .then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape'))
          .catch(() => {});
      }
      fullscreenButton.blur();
    });
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    phoneLandscape.addEventListener('change', updateFullscreenButton);
    updateFullscreenButton();

    game.start();
  });
});

// caches the game so it installs as an app and plays offline
function registerServiceWorker() {
  // service workers need https (or localhost); opening the file directly skips this
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
