// The grass platform tile, in its own pixels (drawn at 2x like every sprite):
// grass tufts stick up above the surface, then grass and dirt below it.
const PLATFORM_TILE = {
  // the walkable grass top
  surfaceRow: 3,
  // grass + dirt height from the surface down
  bodyRows: 10,
  // plain dirt rows, repeated to make a platform deeper
  dirtRows: {from: 9, to: 11},
  // rounded ends; the part in between repeats to make a platform wider
  capWidth: 4
};

// Ground pieces and floating platforms. Bodies can stand on top and bump their heads underneath.
// x, y is the top-left of the walkable surface; grass tufts are drawn above it.
class Platform {
  constructor({x, y, width = 200, height = PLATFORM_TILE.bodyRows * CONFIG.pixelScale}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }

  // draws the tile stretched to this platform's size once, so each frame is a single image
  render(tile) {
    const scale = CONFIG.pixelScale;
    const {surfaceRow, bodyRows, dirtRows, capWidth} = PLATFORM_TILE;
    // in tile pixels
    const width = Math.ceil(this.width / scale);
    const depth = Math.max(bodyRows, Math.ceil(this.height / scale));
    const middleWidth = tile.width - capWidth * 2;

    const image = document.createElement('canvas');
    image.width = width * scale;
    image.height = (surfaceRow + depth) * scale;
    const ctx = image.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // one horizontal band of the tile (rows from..to) drawn across the whole width at row atRow
    const band = (from, rows, atRow) => {
      const sy = from, dy = atRow * scale, h = rows * scale;
      ctx.drawImage(tile, 0, sy, capWidth, rows, 0, dy, capWidth * scale, h);
      for (let x = capWidth; x < width - capWidth; x += middleWidth) {
        const w = Math.min(middleWidth, width - capWidth - x);
        ctx.drawImage(tile, capWidth, sy, w, rows, x * scale, dy, w * scale, h);
      }
      ctx.drawImage(tile, tile.width - capWidth, sy, capWidth, rows, (width - capWidth) * scale, dy, capWidth * scale, h);
    };

    // tufts, grass and the dirt just under it
    const topRows = dirtRows.from;
    band(0, topRows, 0);
    // deeper platforms repeat the plain dirt
    const bottomRows = surfaceRow + bodyRows - topRows;
    const dirtHeight = dirtRows.to - dirtRows.from + 1;
    let row = topRows;
    while (row < surfaceRow + depth - bottomRows) {
      const rows = Math.min(dirtHeight, surfaceRow + depth - bottomRows - row);
      band(dirtRows.from, rows, row);
      row += rows;
    }
    // the bottom edge
    band(topRows, bottomRows, row);

    this.image = image;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y - PLATFORM_TILE.surfaceRow * CONFIG.pixelScale);
  }
}


// Merges platforms that touch at the same height into one, so ground reads as one long strip.
function mergePlatforms(platforms) {
  const sorted = platforms.map(data => new Platform(data)).sort((a, b) => a.y - b.y || a.x - b.x);
  const merged = [];
  sorted.forEach(platform => {
    const last = merged[merged.length - 1];
    if (last && last.y === platform.y && last.height === platform.height && platform.x <= last.right) {
      last.width = Math.max(last.right, platform.right) - last.x;
    } else {
      merged.push(platform);
    }
  });
  return merged;
}
