/**
 * Convert SVG icons to PNG using Puppeteer
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  const iconsDir = path.join(__dirname, '../extension/icons');
  const sizes = [16, 32, 48, 128];
  
  for (const size of sizes) {
    const svgPath = path.join(iconsDir, `icon${size}.svg`);
    const pngPath = path.join(iconsDir, `icon${size}.png`);
    
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>${svgContent}</body>
      </html>
    `;
    
    await page.setContent(html);
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    
    await page.screenshot({
      path: pngPath,
      omitBackground: true,
      clip: { x: 0, y: 0, width: size, height: size }
    });
    
    console.log(`Converted: icon${size}.svg -> icon${size}.png`);
  }
  
  await browser.close();
  console.log('\nAll icons converted successfully!');
}

convertSvgToPng().catch(console.error);
