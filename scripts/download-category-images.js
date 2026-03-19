/**
 * Downloads free stock food photos from Pexels for each menu category,
 * resizes to 400x400 square, applies a cartoon/painted filter, and converts to webp.
 *
 * Usage: node scripts/download-category-images.js
 *
 * Uses curated Pexels photo IDs (free to use, no API key needed).
 * To use your own photos, just replace the files in public/images/categories/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/images/categories');
const SIZE = 400;

// Curated Pexels photo IDs — all free to use (Pexels license)
const CATEGORIES = [
  { id: 'desayunos', pexelsId: 28525196 },
  { id: 'entradas', pexelsId: 12557544 },
  { id: 'ensaladas', pexelsId: 3743537 },
  { id: 'tortas', pexelsId: 17498978 },
  { id: 'hamburguesas', pexelsId: 70497 },
  { id: 'algo-mas', pexelsId: 5840082 },
  { id: 'comida-del-dia', pexelsId: 3981486 },
  { id: 'platillos', pexelsId: 769289 },
  { id: 'mariscos', pexelsId: 921367 },
  { id: 'burritos', pexelsId: 461198 },
  { id: 'menudo', pexelsId: 14179986 },
  { id: 'postres', pexelsId: 18089587 },
  { id: 'bebidas-sin-alcohol', pexelsId: 691172 },
  { id: 'bebidas-con-alcohol', pexelsId: 15901846 },
];

function getPexelsUrl(pexelsId) {
  return `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=600`;
}

async function downloadImage(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function cartoonize(buffer, outputPath) {
  // Step 1: Resize and smooth with median filter (painterly look)
  const smoothed = await sharp(buffer)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
    .median(7)
    .toBuffer();

  // Step 2: Boost saturation & brightness, then posterize by reducing color depth
  await sharp(smoothed)
    .modulate({ saturation: 1.8, brightness: 1.05 })
    .sharpen({ sigma: 1.5 })
    .webp({ quality: 85 })
    .toFile(outputPath);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const forceRegenerate = process.argv.includes('--force');
  console.log('Downloading & cartoonizing category images from Pexels...\n');

  let success = 0;
  let failed = 0;

  for (const cat of CATEGORIES) {
    const outPath = path.join(OUT_DIR, `${cat.id}.webp`);

    if (fs.existsSync(outPath) && !forceRegenerate) {
      console.log(`  ✓ ${cat.id}.webp already exists, skipping (use --force to regenerate)`);
      success++;
      continue;
    }

    const url = getPexelsUrl(cat.pexelsId);

    try {
      console.log(`  ↓ ${cat.id} (pexels #${cat.pexelsId})...`);
      const buffer = await downloadImage(url);
      await cartoonize(buffer, outPath);
      console.log(`  ✓ ${cat.id}.webp saved (cartoon style)`);
      success++;
    } catch (err) {
      console.error(`  ✗ ${cat.id} failed: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} saved, ${failed} failed`);
  if (failed > 0) {
    console.log('Tip: Re-run the script to retry, or place your own 400x400 .webp photos in public/images/categories/');
  }
}

main();
