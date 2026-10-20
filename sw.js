// Service worker: makes Bunny Hop installable and playable offline.
// Files are served from the cache right away and refreshed in the background,
// so an update shows up the next time the game is opened.
// Bump the version when files are added or removed from the list below.
const CACHE = 'bunnyhop-v1';

const FILES = [
  './',
  'index.html',
  'index.css',
  'manifest.webmanifest',
  'js/config.js',
  'js/sprites.js',
  'js/input.js',
  'js/high-score.js',
  'js/entities/body.js',
  'js/entities/platform.js',
  'js/entities/bunny.js',
  'js/entities/enemy.js',
  'js/entities/carrot.js',
  'js/entities/floating-text.js',
  'js/hud.js',
  'js/win-scene.js',
  'js/level.js',
  'js/game.js',
  'js/main.js',
  'assets/bunnypack_assets/bunnypack_spritesheets/bunny_idle_strip4.png',
  'assets/bunnypack_assets/bunnypack_spritesheets/bunny_idle_blink_strip4.png',
  'assets/bunnypack_assets/bunnypack_spritesheets/bunny_run_strip6.png',
  'assets/bunnypack_assets/bunnypack_spritesheets/bunny_jump_strip12.png',
  'assets/bunnypack_assets/bunnypack_spritesheets/bunny_fall_strip4.png',
  'assets/bunnypack_assets/bunnypack_spritesheets/bunny_land_strip2.png',
  'assets/bunnypack_assets/bunnypack_spritesheets/bunny_hurt_strip6.png',
  'assets/bunnypack_assets/bunnypack_spritesheets/bunny_die_strip16.png',
  'assets/bunnypack_assets/bunnypack_spritesheets/bunny_fright_strip9.png',
  'assets/PlatformerPack/ghost1_fly.png',
  'assets/PlatformerPack/ghost1_hurt.png',
  'assets/PlatformerPack/heart2-shine.png',
  'assets/PlatformerPack/heart2-empty.png',
  'assets/carrot/carrot_shine_strip5.png',
  'assets/fonts/hackbot-font/HackbotFreeTrial-8MgA2.otf',
  'assets/fonts/snes-font/SnesItalic-1G9Be.ttf',
  'assets/icon/bunny.png',
  'assets/icon/app/icon-192.png',
  'assets/icon/app/icon-512.png',
  'assets/icon/app/icon-maskable-512.png',
  'assets/icon/app/apple-touch-icon.png'
];

// the icons font comes from a CDN; its own font files are cached the first time they load
const OPTIONAL_FILES = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => Promise.all([
    cache.addAll(FILES),
    // a CDN hiccup shouldn't stop the game from installing
    ...OPTIONAL_FILES.map(url => cache.add(url).catch(() => {}))
  ])));
  self.skipWaiting();
});

// remove caches from older versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(event.request, {ignoreSearch: true});
    const fresh = fetch(event.request)
      .then(response => {
        if (response.ok) cache.put(event.request, response.clone());
        return response;
      })
      .catch(() => cached);
    // keep the service worker alive until the background refresh finishes
    event.waitUntil(fresh.then(() => {}));
    return cached || fresh;
  }));
});
