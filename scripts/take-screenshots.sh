#!/bin/bash

# Create screenshots directory
mkdir -p docs/screenshots

# Check if puppeteer is available
if ! command -v npx &> /dev/null; then
    echo "npm not available, trying alternative screenshot method..."
    
    # Check for alternative tools
    if command -v chrome &> /dev/null || command -v chromium &> /dev/null; then
        echo "Chrome/Chromium found but no automation tool available"
        echo "Screenshots must be taken manually."
        echo ""
        echo "To take screenshots:"
        echo "1. Open test/test-page.html in Chrome"
        echo "2. Take a screenshot (Cmd+Shift+3 on Mac, Win+Shift+S on Windows)"
        echo "3. Save as docs/screenshots/test-page-light.png"
        echo "4. Open extension popup and enable dark mode"
        echo "5. Take another screenshot"
        echo "6. Save as docs/screenshots/test-page-dark.png"
        exit 1
    fi
fi

# Try using puppeteer if available
cat > /tmp/screenshot.js << 'EOF'
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const testPagePath = path.resolve(__dirname, '../test/test-page.html');
    await page.goto(`file://${testPagePath}`);
    await page.waitForTimeout(500);
    
    console.log('Taking light mode screenshot...');
    await page.screenshot({
      path: path.resolve(__dirname, '../docs/screenshots/test-page-light.png'),
      fullPage: true
    });
    
    console.log('Applying dark mode...');
    await page.evaluate(() => {
      document.documentElement.classList.add('sda-dark');
    });
    await page.waitForTimeout(500);
    
    console.log('Taking dark mode screenshot...');
    await page.screenshot({
      path: path.resolve(__dirname, '../docs/screenshots/test-page-dark.png'),
      fullPage: true
    });
    
    console.log('Screenshots saved successfully!');
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch(error => {
  console.error('Error taking screenshots:', error.message);
  process.exit(1);
});
EOF

node /tmp/screenshot.js 2>/dev/null || {
    echo "Puppeteer not available. Creating placeholder screenshots..."
    
    # Create placeholder image files
    mkdir -p docs/screenshots
    echo "Placeholder: Test page in light mode. Real screenshot coming soon." > docs/screenshots/test-page-light.txt
    echo "Placeholder: Test page in dark mode. Real screenshot coming soon." > docs/screenshots/test-page-dark.txt
    
    echo ""
    echo "✓ Placeholder files created in docs/screenshots/"
    echo ""
    echo "To generate real screenshots:"
    echo "1. Install puppeteer: npm install puppeteer"
    echo "2. Run: npm run screenshots"
    echo ""
    echo "Or take screenshots manually (see instructions above)"
}
