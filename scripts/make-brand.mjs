/**
 * Genera logo recortado, favicons e imagen Open Graph a partir del logo original.
 * Uso: node scripts/make-brand.mjs ruta/al/logo-original.png
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const input = process.argv[2];
if (!input) throw new Error('Falta la ruta del logo original');
mkdirSync('public/brand', { recursive: true });

// 1. Recortar lo blanco que rodea el círculo y volverlo transparente.
const trimmed = await sharp(input).flatten({ background: '#ffffff' }).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
const { width, height } = trimmed.info;
const size = Math.max(width, height);
const square = await sharp(trimmed.data)
  .resize(size, size, { fit: 'contain', background: '#ffffff' })
  .toBuffer();
const mask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="#fff"/></svg>`);
const round = await sharp(square).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();

await sharp(round).resize(512).png({ compressionLevel: 9 }).toFile('public/brand/logo-512.png');
await sharp(round).resize(160).webp({ quality: 90 }).toFile('public/brand/logo-160.webp');
await sharp(round).resize(180).flatten({ background: '#FBF6EF' }).png().toFile('public/apple-touch-icon.png');
await sharp(round).resize(48).png().toFile('public/favicon.png');

// 2. Imagen para compartir en redes (1200 × 630).
const logo = await sharp(round).resize(400).png().toBuffer();
const star = (x, y, r, fill) => `<path transform="translate(${x} ${y}) scale(${r / 12})" d="M0-12C1.5-3 3-1.5 12 0 3 1.5 1.5 3 0 12-1.5 3-3 1.5-12 0-3-1.5-1.5-3 0-12Z" fill="${fill}"/>`;
const bg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBF6EF"/><stop offset="1" stop-color="#F6DDD5"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  ${star(1080, 110, 34, '#C8964F')}${star(1140, 200, 16, '#C8964F')}${star(560, 545, 20, '#C8964F')}
  <text x="520" y="250" font-family="Georgia, serif" font-size="74" fill="#3C2415">Come home</text>
  <text x="520" y="335" font-family="Georgia, serif" font-size="74" fill="#3C2415">to clean.</text>
  <text x="522" y="410" font-family="Arial, sans-serif" font-size="32" fill="#8e4f3e">House cleaning in South Florida</text>
  <text x="522" y="456" font-family="Arial, sans-serif" font-size="32" fill="#8e4f3e">Weekly. Spotless. Done for you.</text>
</svg>`);
await sharp(bg).composite([{ input: logo, left: 70, top: 115 }]).jpeg({ quality: 88 }).toFile('public/brand/og.jpg');
console.log('Listo: public/brand, favicon.png, apple-touch-icon.png');
