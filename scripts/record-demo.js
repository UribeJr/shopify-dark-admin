#!/usr/bin/env node

/**
 * Record a demo video of Shopify Dark Admin V1
 * Uses Playwright with the extension loaded via persistent context
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { promisify } = require('util');

const sleep = promisify(setTimeout);

// Simple HTTP server for test page
function createServer() {
  const testPagePath = path.resolve(__dirname, '../test/test-page.html');
  const testPageContent = fs.readFileSync(testPagePath, 'utf8');
  
  return http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(testPageContent);
  });
}

async function recordDemo() {
  console.log('🎬 Starting Shopify Dark Admin demo recording...\n');
  
  // Start local server for test page
  const server = createServer();
  await new Promise(resolve => server.listen(8888, resolve));
  console.log('✓ Local server started on http://localhost:8888\n');
  
  try {
    // Create temporary user data directory for extension
    const userDataDir = path.resolve(__dirname, '../.tmp-chrome-profile');
    if (fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    }
    fs.mkdirSync(userDataDir, { recursive: true });
    
    const extensionPath = path.resolve(__dirname, '../extension');
    
    console.log('🚀 Launching browser with extension...');
    
    // Launch with extension loaded
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false, // Need non-headless for extension loading
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      viewport: { width: 1280, height: 800 },
      recordVideo: {
        dir: path.resolve(__dirname, '../.tmp-videos'),
        size: { width: 1280, height: 800 }
      },
      slowMo: 100 // Slow down for better video capture
    });
    
    const page = await context.newPage();
    
    console.log('✓ Browser launched with extension\n');
    
    // Route admin.shopify.com to our local test page
    await page.route('https://admin.shopify.com/**', async route => {
      const response = await fetch('http://localhost:8888');
      const body = await response.text();
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body
      });
    });
    
    console.log('✓ Route interceptor configured\n');
    
    // Navigate to "admin.shopify.com" (will be intercepted)
    console.log('📄 Loading test page...');
    await page.goto('https://admin.shopify.com/store/test/home');
    await sleep(1500);
    
    // Take screenshot - light mode
    console.log('📸 Capturing light mode...');
    await page.screenshot({ 
      path: path.resolve(__dirname, '../.tmp-screenshots/01-light-mode.png'),
      fullPage: false
    });
    await sleep(500);
    
    // Scroll down a bit to show content
    await page.evaluate(() => window.scrollTo(0, 300));
    await sleep(1000);
    
    // Get extension ID
    const targets = context.backgroundPages();
    let extensionId = null;
    
    if (targets.length > 0) {
      const bgPage = targets[0];
      extensionId = bgPage.url().match(/chrome-extension:\/\/([^\/]+)/)?.[1];
      console.log(`✓ Extension ID: ${extensionId}\n`);
    }
    
    if (!extensionId) {
      // Try to find extension ID from service worker
      const serviceWorkerPage = context.serviceWorkers()[0];
      if (serviceWorkerPage) {
        extensionId = serviceWorkerPage.url().match(/chrome-extension:\/\/([^\/]+)/)?.[1];
        console.log(`✓ Extension ID from service worker: ${extensionId}\n`);
      }
    }
    
    // Open extension popup
    console.log('🎨 Opening extension popup...');
    const popupPage = await context.newPage();
    
    if (extensionId) {
      await popupPage.goto(`chrome-extension://${extensionId}/popup/popup.html`);
    } else {
      // Fallback: open popup.html directly from file
      const popupPath = path.resolve(__dirname, '../extension/popup/popup.html');
      await popupPage.goto(`file://${popupPath}`);
    }
    
    await sleep(1000);
    
    // Click "On" mode
    console.log('🌙 Enabling dark mode (On)...');
    await popupPage.click('[data-mode="on"]');
    await sleep(500);
    
    // Switch back to main page to show dark mode
    await page.bringToFront();
    await sleep(1500);
    
    // Take screenshot - dark mode
    console.log('📸 Capturing dark mode...');
    await page.screenshot({ 
      path: path.resolve(__dirname, '../.tmp-screenshots/02-dark-mode.png'),
      fullPage: false
    });
    await sleep(500);
    
    // Scroll through components
    console.log('📜 Scrolling through components...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(500);
    
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => window.scrollBy(0, 200));
      await sleep(800);
    }
    
    await sleep(1000);
    
    // Open popup again and switch to Off
    console.log('☀️ Switching to Off (light mode)...');
    await popupPage.bringToFront();
    await sleep(500);
    await popupPage.click('[data-mode="off"]');
    await sleep(500);
    
    await page.bringToFront();
    await sleep(1500);
    
    // Scroll up to show the change
    await page.evaluate(() => window.scrollTo(0, 200));
    await sleep(1500);
    
    // Switch to System mode
    console.log('🖥️ Switching to System mode...');
    await popupPage.bringToFront();
    await sleep(500);
    await popupPage.click('[data-mode="system"]');
    await sleep(500);
    
    await page.bringToFront();
    await sleep(1000);
    
    // Take screenshot - system mode (light)
    console.log('📸 Capturing system mode (light)...');
    await page.screenshot({ 
      path: path.resolve(__dirname, '../.tmp-screenshots/03-system-light.png'),
      fullPage: false
    });
    
    // Emulate dark color scheme
    console.log('🌑 Emulating dark color scheme...');
    await page.emulateMedia({ colorScheme: 'dark' });
    await sleep(2000);
    
    // Scroll a bit to show the transition
    await page.evaluate(() => window.scrollTo(0, 400));
    await sleep(1000);
    
    // Emulate light color scheme
    console.log('☀️ Emulating light color scheme...');
    await page.emulateMedia({ colorScheme: 'light' });
    await sleep(2000);
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(1000);
    
    console.log('\n✅ Demo recording complete!\n');
    
    // Close and save video
    await popupPage.close();
    await page.close();
    await context.close();
    
    // Move video to artifacts
    console.log('📦 Processing video...');
    const videoDir = path.resolve(__dirname, '../.tmp-videos');
    const videos = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
    
    if (videos.length > 0) {
      const videoPath = path.join(videoDir, videos[0]);
      const artifactsDir = '/opt/cursor/artifacts';
      const demoDir = path.resolve(__dirname, '../docs/demo');
      
      // Create directories
      fs.mkdirSync(artifactsDir, { recursive: true });
      fs.mkdirSync(demoDir, { recursive: true });
      
      // Copy to artifacts (keeping webm)
      const artifactPath = path.join(artifactsDir, 'shopify-dark-admin-demo.webm');
      fs.copyFileSync(videoPath, artifactPath);
      console.log(`✓ Video saved to: ${artifactPath}`);
      
      // Copy screenshots to demo dir
      const screenshotsDir = path.resolve(__dirname, '../.tmp-screenshots');
      if (fs.existsSync(screenshotsDir)) {
        const screenshots = fs.readdirSync(screenshotsDir);
        screenshots.forEach(screenshot => {
          fs.copyFileSync(
            path.join(screenshotsDir, screenshot),
            path.join(demoDir, screenshot)
          );
        });
        console.log(`✓ Screenshots saved to: ${demoDir}`);
      }
      
      // Note about conversion
      console.log('\n📝 Note: Video is in WebM format. To convert to MP4:');
      console.log(`   ffmpeg -i ${artifactPath} -c:v libx264 -crf 23 -preset medium -c:a aac ${artifactsDir}/shopify-dark-admin-demo.mp4`);
      
      return {
        videoPath: artifactPath,
        screenshotsDir: demoDir
      };
    } else {
      console.log('❌ No video files found');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error recording demo:', error);
    throw error;
  } finally {
    server.close();
    console.log('\n✓ Server stopped');
  }
}

// Main
recordDemo()
  .then(result => {
    if (result) {
      console.log('\n🎉 Demo recording successful!');
      console.log(`   Video: ${result.videoPath}`);
      console.log(`   Screenshots: ${result.screenshotsDir}`);
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Demo recording failed:', error.message);
    process.exit(1);
  });
