// The map, in world coordinates. The camera starts at x = 0.
const GROUND_Y = CONFIG.canvas.height - 28;

const LEVEL = {
  // the bunny wins after running this far
  finishX: CONFIG.bunny.startX + 3000,

  platforms: [
    // ground, with gaps at 594-694, 894-994, 1594-1844 and 2444-2644
    {x: -5,   y: GROUND_Y},
    {x: 194,  y: GROUND_Y},
    {x: 394,  y: GROUND_Y},
    {x: 694,  y: GROUND_Y},
    {x: 994,  y: GROUND_Y},
    {x: 1194, y: GROUND_Y},
    {x: 1394, y: GROUND_Y},
    {x: 1844, y: GROUND_Y},
    {x: 2044, y: GROUND_Y},
    {x: 2244, y: GROUND_Y},
    {x: 2644, y: GROUND_Y},
    {x: 2844, y: GROUND_Y},
    {x: 3044, y: GROUND_Y},
    {x: 3244, y: GROUND_Y},
    {x: 3444, y: GROUND_Y},
    {x: 3644, y: GROUND_Y},
    {x: 3844, y: GROUND_Y},

    // floating platforms
    {x: 450,  y: 350},
    {x: 1100, y: 350},
    {x: 1250, y: 200},
    {x: 1600, y: 150},
    {x: 2044, y: 350},
    {x: 2224, y: 250}
  ],

  // ghosts drop onto whatever is under them when the level starts
  ghosts: [
    {x: 450,  y: 100},
    {x: 550,  y: GROUND_Y - 40},
    {x: 1250, y: GROUND_Y - 40},
    {x: 1290, y: 310},
    {x: 1710, y: 110},
    {x: 1750, y: 110},
    {x: 1790, y: 110},
    {x: 2174, y: 210},
    {x: 2214, y: 310},
    {x: 3220, y: GROUND_Y - 40},
    {x: 3260, y: GROUND_Y - 40},
    {x: 3300, y: 110}
  ],

  // carrots are scattered randomly each round, always this many
  carrotCount: 16
};


// Random carrot spots above platforms, so every carrot can be reached:
// some sit on a surface, others float within jumping height of it.
function randomCarrotSpots(platforms, count) {
  const width = CARROT_BOX.width;
  const height = CARROT_BOX.height;
  // keep clear of the start, and of the score and hearts at the top of the screen
  const minX = 150;
  const maxX = LEVEL.finishX - width;
  const minY = 80;
  const minDistance = 70;
  const totalWidth = platforms.reduce((sum, platform) => sum + platform.width, 0);

  const spots = [];
  for (let attempt = 0; spots.length < count && attempt < 5000; attempt++) {
    // wider platforms get more carrots
    let pick = Math.random() * totalWidth;
    const platform = platforms.find(platform => (pick -= platform.width) < 0) || platforms[0];

    const x = platform.x + 8 + Math.random() * (platform.width - 16 - width);
    const lift = Math.random() < 0.5 ? 0 : 40 + Math.random() * 80;
    const y = platform.y - 6 - lift - height;
    if (x < minX || x > maxX || y < minY) continue;

    // not inside or touching any platform, and not bunched up with other carrots
    const padded = {x: x - 6, y: y - 6, width: width + 12, height: height + 12};
    const blocked = platforms.some(other =>
      padded.x < other.right && padded.x + padded.width > other.x &&
      padded.y < other.bottom && padded.y + padded.height > other.y);
    const crowded = spots.some(spot => Math.abs(spot.x - x) < minDistance && Math.abs(spot.y - y) < minDistance);
    if (blocked || crowded) continue;

    spots.push({x, y});
  }
  return spots;
}
