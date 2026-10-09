/**
 * Icon Generator for Shopify Dark Admin
 * Creates PNG icons at 16x16, 32x32, 48x48, and 128x128
 */

const fs = require('fs');
const path = require('path');

// Simple SVG icon - moon symbol for dark mode
function generateIconSVG(size) {
  const centerX = size / 2;
  const centerY = size / 2;
  const moonRadius = size * 0.35;
  const offsetX = size * 0.1;
  const offsetY = size * 0.1;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#5C6AC4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#47C1BF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="${centerX}" cy="${centerY}" r="${moonRadius}" fill="url(#moonGradient)"/>
  <circle cx="${centerX + offsetX}" cy="${centerY - offsetY}" r="${moonRadius * 0.85}" fill="#1a1a1a"/>
</svg>`;
}

const sizes = [16, 32, 48, 128];
const iconsDir = path.join(__dirname, '../extension/icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
  const svg = generateIconSVG(size);
  const svgPath = path.join(iconsDir, `icon${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`Generated: icon${size}.svg`);
});

console.log('\nSVG icons generated. Convert to PNG using:');
console.log('  - ImageMagick: convert icon.svg icon.png');
console.log('  - Inkscape: inkscape icon.svg --export-filename=icon.png');
console.log('  - Online tool: cloudconvert.com or similar');
