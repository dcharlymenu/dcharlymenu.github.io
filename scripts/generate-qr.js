import QRCode from 'qrcode';
import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '..', 'public', 'qr');
const logoPath = join(__dirname, '..', 'public', 'images', 'logo.webp');
const menuUrl = 'https://dcharlymenu.github.io/';

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

async function generate() {
  // --- 1. Generate styled QR with logo center ---
  const qrSize = 560;
  const qrBuffer = await QRCode.toBuffer(menuUrl, {
    width: qrSize,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#1c1917', light: '#fffbeb' },
  });

  // Prepare logo with rounded background
  const logoW = 130;
  const logoH = 85;
  const logoPadding = 12;
  const logoBoxW = logoW + logoPadding * 2;
  const logoBoxH = logoH + logoPadding * 2;

  const logoResized = await sharp(logoPath)
    .resize(logoW, logoH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Create rounded rect mask for logo background
  const logoBackground = Buffer.from(`
    <svg width="${logoBoxW}" height="${logoBoxH}">
      <rect width="${logoBoxW}" height="${logoBoxH}" rx="14" fill="#fffbeb"/>
      <rect x="2" y="2" width="${logoBoxW - 4}" height="${logoBoxH - 4}" rx="12" fill="none" stroke="#d97706" stroke-width="2.5"/>
    </svg>
  `);

  // Composite logo onto QR
  const qrWithLogo = await sharp(qrBuffer)
    .composite([
      {
        input: await sharp(logoBackground).png().toBuffer(),
        top: Math.round((qrSize - logoBoxH) / 2),
        left: Math.round((qrSize - logoBoxW) / 2),
      },
      {
        input: logoResized,
        top: Math.round((qrSize - logoH) / 2),
        left: Math.round((qrSize - logoW) / 2),
      },
    ])
    .png()
    .toBuffer();

  // Save QR-only version
  writeFileSync(join(outputDir, 'menu-qr-simple.png'), qrWithLogo);
  console.log('Generated: public/qr/menu-qr-simple.png (QR with logo)');

  // --- 2. Build print-ready card ---
  const cardW = 750;
  const cardH = 1000;
  const qrCardSize = 520;
  const qrX = Math.round((cardW - qrCardSize) / 2);
  const qrY = 210;
  const footerY = qrY + qrCardSize + 25;

  const cardSvg = Buffer.from(`
    <svg width="${cardW}" height="${cardH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="50%" stop-color="#fef3c7"/>
          <stop offset="100%" stop-color="#fffbeb"/>
        </linearGradient>
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#92400e" flood-opacity="0.15"/>
        </filter>
      </defs>

      <!-- Card background -->
      <rect width="${cardW}" height="${cardH}" rx="28" fill="url(#cardBg)"/>

      <!-- Outer border -->
      <rect x="6" y="6" width="${cardW - 12}" height="${cardH - 12}" rx="24" fill="none" stroke="#d97706" stroke-width="3"/>

      <!-- Inner decorative border -->
      <rect x="16" y="16" width="${cardW - 32}" height="${cardH - 32}" rx="18" fill="none" stroke="#d97706" stroke-width="0.8" stroke-dasharray="8,6" opacity="0.5"/>

      <!-- Corner decorations (chile peppers) -->
      <text x="40" y="55" font-size="30" opacity="0.6">🌶️</text>
      <text x="${cardW - 60}" y="55" font-size="30" opacity="0.6">🌶️</text>
      <text x="40" y="${cardH - 25}" font-size="30" opacity="0.6">🔥</text>
      <text x="${cardW - 60}" y="${cardH - 25}" font-size="30" opacity="0.6">🔥</text>

      <!-- Restaurant name -->
      <text x="50%" y="72" text-anchor="middle" font-family="Georgia, 'Palatino Linotype', 'Book Antiqua', serif" font-size="48" font-weight="bold" fill="#1c1917" letter-spacing="1">
        Restaurante
      </text>
      <text x="50%" y="130" text-anchor="middle" font-family="Georgia, 'Palatino Linotype', 'Book Antiqua', serif" font-size="54" font-weight="bold" fill="#92400e" letter-spacing="2">
        D'Charly
      </text>

      <!-- Tagline -->
      <text x="50%" y="162" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-style="italic" fill="#b45309" letter-spacing="3">
        Mexican Taste &amp; Tradition
      </text>

      <!-- Decorative divider top -->
      <line x1="180" y1="182" x2="330" y2="182" stroke="#d97706" stroke-width="1.5" opacity="0.6"/>
      <text x="${cardW / 2}" y="189" text-anchor="middle" font-size="16" opacity="0.7">🍽️</text>
      <line x1="420" y1="182" x2="570" y2="182" stroke="#d97706" stroke-width="1.5" opacity="0.6"/>

      <!-- QR code shadow box -->
      <rect x="${qrX - 8}" y="${qrY - 8}" width="${qrCardSize + 16}" height="${qrCardSize + 16}" rx="16" fill="white" filter="url(#shadow)"/>
      <rect x="${qrX - 8}" y="${qrY - 8}" width="${qrCardSize + 16}" height="${qrCardSize + 16}" rx="16" fill="none" stroke="#d97706" stroke-width="1.5" opacity="0.4"/>

      <!-- Decorative divider bottom -->
      <line x1="180" y1="${footerY + 8}" x2="330" y2="${footerY + 8}" stroke="#d97706" stroke-width="1.5" opacity="0.6"/>
      <text x="${cardW / 2}" y="${footerY + 15}" text-anchor="middle" font-size="16" opacity="0.7">📞</text>
      <line x1="420" y1="${footerY + 8}" x2="570" y2="${footerY + 8}" stroke="#d97706" stroke-width="1.5" opacity="0.6"/>

      <!-- Scan instruction -->
      <text x="50%" y="${footerY + 50}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#78716c" letter-spacing="2">
        ESCANEA PARA VER EL MENU
      </text>

      <!-- Delivery info -->
      <text x="50%" y="${footerY + 90}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#1c1917">
        Servicio a Domicilio
      </text>
      <text x="50%" y="${footerY + 125}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="bold" fill="#d97706" letter-spacing="2">
        626-453-4954
      </text>
    </svg>
  `);

  // Resize QR for the card
  const qrForCard = await sharp(qrWithLogo).resize(qrCardSize, qrCardSize).png().toBuffer();

  const card = await sharp(cardSvg)
    .composite([{
      input: qrForCard,
      top: qrY,
      left: qrX,
    }])
    .png()
    .toBuffer();

  writeFileSync(join(outputDir, 'menu-qr.png'), card);
  console.log('Generated: public/qr/menu-qr.png (print-ready card)');

  // --- 3. SVG version (plain) ---
  const svg = await QRCode.toString(menuUrl, {
    type: 'svg',
    margin: 2,
    errorCorrectionLevel: 'H',
  });
  writeFileSync(join(outputDir, 'menu-qr.svg'), svg);
  console.log('Generated: public/qr/menu-qr.svg');

  console.log(`\nQR codes point to: ${menuUrl}`);
}

generate().catch(console.error);
