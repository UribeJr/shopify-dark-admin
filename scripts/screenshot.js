#!/usr/bin/env node

/**
 * Take screenshots using Playwright/Puppeteer or Chrome headless
 * Creates light and dark mode screenshots of the test page
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function tryPlaywright() {
  try {
    const { chromium } = require('playwright');
    console.log('Using Playwright...');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    
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
    
    await browser.close();
    console.log('✓ Screenshots saved successfully!');
    return true;
  } catch (e) {
    return false;
  }
}

async function tryPuppeteer() {
  try {
    const puppeteer = require('puppeteer');
    console.log('Using Puppeteer...');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const testPagePath = path.resolve(__dirname, '../test/test-page.html');
    await page.goto(`file://${testPagePath}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Taking light mode screenshot...');
    await page.screenshot({
      path: path.resolve(__dirname, '../docs/screenshots/test-page-light.png'),
      fullPage: true
    });
    
    console.log('Applying dark mode...');
    await page.evaluate(() => {
      document.documentElement.classList.add('sda-dark');
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Taking dark mode screenshot...');
    await page.screenshot({
      path: path.resolve(__dirname, '../docs/screenshots/test-page-dark.png'),
      fullPage: true
    });
    
    await browser.close();
    console.log('✓ Screenshots saved successfully!');
    return true;
  } catch (e) {
    return false;
  }
}

function createPlaceholders() {
  console.log('Creating placeholder image info files...');
  
  const placeholderText = `
This is a placeholder. Real screenshots require:
1. Chrome/Chromium with screenshot capability, OR
2. Puppeteer: npm install puppeteer
3. Or Playwright: npm install playwright

To generate manually:
1. Open test/test-page.html in Chrome
2. Take full-page screenshot (Cmd+Shift+4 on Mac, F12 > Cmd+Shift+P > "Capture full size screenshot" on Chrome)
3. Toggle dark mode in extension popup
4. Take another full-page screenshot
`;

  const dir = path.resolve(__dirname, '../docs/screenshots');
  fs.writeFileSync(path.join(dir, 'test-page-light-placeholder.txt'), placeholderText);
  fs.writeFileSync(path.join(dir, 'test-page-dark-placeholder.txt'), placeholderText);
  
  console.log('✓ Placeholder files created');
  console.log('⚠️  Real screenshots need to be generated manually or with puppeteer/playwright');
}

async function main() {
  console.log('📸 Attempting to generate screenshots...\n');
  
  if (await tryPlaywright()) return;
  if (await tryPuppeteer()) return;
  
  console.log('\n❌ No screenshot tool available');
  createPlaceholders();
}

main().catch(error => {
  console.error('Error:', error.message);
  createPlaceholders();
});
