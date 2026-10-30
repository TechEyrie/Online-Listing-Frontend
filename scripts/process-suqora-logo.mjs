/**
 * One-shot: suqora-real-logo.png → transparent mark + favicons.
 * Run: node scripts/process-suqora-logo.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const source = path.join(publicDir, 'suqora-real-logo.png');

function sampleBg(data, width, height, channels) {
  const pts = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  for (const [x, y] of pts) {
    const i = (y * width + x) * channels;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return { r: r / 4, g: g / 4, b: b / 4 };
}

function removePlate(inputBuffer) {
  return sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      const { width, height, channels } = info;
      const bg = sampleBg(data, width, height, channels);
      const out = Buffer.from(data);
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const i = (y * width + x) * channels;
          const pr = out[i];
          const pg = out[i + 1];
          const pb = out[i + 2];
          const dr = pr - bg.r;
          const dg = pg - bg.g;
          const db = pb - bg.b;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);
          const lum = 0.2126 * pr + 0.7152 * pg + 0.0722 * pb;
          const isBg =
            (dist < 38 && lum < 95) ||
            (pr < 28 && pg < 28 && pb < 28) ||
            (lum < 22 && dist < 55) ||
            (pr > 238 && pg > 238 && pb > 238) ||
            (lum > 232 && dist < 30);
          if (isBg) out[i + 3] = 0;
        }
      }
      return sharp(out, { raw: { width, height, channels } }).png().toBuffer();
    });
}

const transparentPng = await removePlate(readFileSync(source));

const mark = await sharp(transparentPng).trim({ threshold: 10 }).png({ compressionLevel: 9 }).toBuffer();
const meta = await sharp(mark).metadata();

writeFileSync(path.join(publicDir, 'suqora-mark.png'), mark);

// Same transparent asset — modulate was flattening alpha to white on some builds
writeFileSync(path.join(publicDir, 'suqora-mark-dark.png'), mark);

const iconCrop = await sharp(mark)
  .extract({
    left: 0,
    top: 0,
    width: Math.min(meta.width ?? 1477, Math.round((meta.width ?? 1477) * 0.42)),
    height: meta.height ?? 519,
  })
  .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
writeFileSync(path.join(publicDir, 'icon.png'), iconCrop);

const apple = await sharp(mark)
  .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), apple);

console.log(
  JSON.stringify({
    markWidth: meta.width,
    markHeight: meta.height,
    files: ['suqora-mark.png', 'suqora-mark-dark.png', 'icon.png', 'apple-touch-icon.png'],
  }),
);
