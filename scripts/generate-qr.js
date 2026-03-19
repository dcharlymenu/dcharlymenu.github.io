import QRCode from 'qrcode';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '..', 'public', 'qr');
const menuUrl = 'https://dcharlymenu.github.io/';

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

async function generate() {
  // PNG
  await QRCode.toFile(join(outputDir, 'menu-qr.png'), menuUrl, {
    width: 512,
    margin: 2,
    color: { dark: '#1c1917', light: '#fffbeb' },
  });
  console.log('Generated: public/qr/menu-qr.png');

  // SVG
  const svg = await QRCode.toString(menuUrl, { type: 'svg', margin: 2 });
  const { writeFileSync } = await import('fs');
  writeFileSync(join(outputDir, 'menu-qr.svg'), svg);
  console.log('Generated: public/qr/menu-qr.svg');

  console.log(`\nQR codes point to: ${menuUrl}`);
}

generate().catch(console.error);
