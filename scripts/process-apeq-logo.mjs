/**
 * One-shot: apeq-real-logo.png → transparent mark + favicons.
 * Run: node scripts/process-apeq-logo.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const source = path.join(publicDir, 'apeq-real-logo.png');

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
  const n = pts.length;
  return { r: r / n, g: g / n, b: b / n };
}

function removePlate(buffer) {
  return sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      const { width, height, channels } = info;
      const bg = sampleBg(data, width, height, channels);
      const fuzz = 28;
      for (let i = 0; i < data.length; i += channels) {
        const dr = Math.abs(data[i] - bg.r);
        const dg = Math.abs(data[i + 1] - bg.g);
        const db = Math.abs(data[i + 2] - bg.b);
        const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (dr < fuzz && dg < fuzz && db < fuzz && lum < 48) {
          data[i + 3] = 0;
        }
      }
      return sharp(data, { raw: info }).png().toBuffer();
    });
}

const transparentPng = await removePlate(readFileSync(source));

const mark = await sharp(transparentPng).trim({ threshold: 10 }).png({ compressionLevel: 9 }).toBuffer();
const meta = await sharp(mark).metadata();

writeFileSync(path.join(publicDir, 'apeq-mark.png'), mark);

// Same transparent asset — modulate was flattening alpha to white on some builds
writeFileSync(path.join(publicDir, 'apeq-mark-dark.png'), mark);

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
    files: ['apeq-mark.png', 'apeq-mark-dark.png', 'icon.png', 'apple-touch-icon.png'],
  }),
);