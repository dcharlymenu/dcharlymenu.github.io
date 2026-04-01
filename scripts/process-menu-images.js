/**
 * Processes raw menu item photos: resizes to 600x400 and converts to webp.
 *
 * Usage:
 *   node scripts/process-menu-images.js <source> <category-id> <item-slug>
 *
 * Example:
 *   node scripts/process-menu-images.js ~/Downloads/enchiladas.jpg comida-del-dia enchiladas
 *
 * Output: public/images/menu/{category-id}/{item-slug}.webp
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_BASE = path.resolve(__dirname, '../public/images/menu');
const WIDTH = 600;
const HEIGHT = 400;

async function processImage(sourcePath, categoryId, itemSlug) {
  const outDir = path.join(OUT_BASE, categoryId);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, `${itemSlug}.webp`);

  await sharp(sourcePath)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .webp({ quality: 85 })
    .toFile(outPath);

  const stats = fs.statSync(outPath);
  const kb = (stats.size / 1024).toFixed(1);
  console.log(`  ✓ ${categoryId}/${itemSlug}.webp saved (${kb} KB)`);
}

const [sourcePath, categoryId, itemSlug] = process.argv.slice(2);

if (!sourcePath || !categoryId || !itemSlug) {
  console.error('Usage: node scripts/process-menu-images.js <source-image> <category-id> <item-slug>');
  console.error('Example: node scripts/process-menu-images.js ~/Downloads/photo.jpg comida-del-dia enchiladas');
  process.exit(1);
}

if (!fs.existsSync(sourcePath)) {
  console.error(`Source file not found: ${sourcePath}`);
  process.exit(1);
}

processImage(sourcePath, categoryId, itemSlug).catch((err) => {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
});
