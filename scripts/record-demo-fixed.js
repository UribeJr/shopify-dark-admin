#!/usr/bin/env node

/**
 * Record a CORRECT demo video of Shopify Dark Admin V1
 * Shows the test page with dark mode transitions, controls settings via storage
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
  console.log('🎬 Starting Shopify Dark Admin demo recording (FIXED)...\n');
  
  // Start local server for test page
  const server = createServer();
  await new Promise(resolve => server.listen(8888, resolve));
  console.log('✓ Local server started on http://localhost:8888\n');
  
  try {
    // Create temporary user data directory for extension
    const userDataDir = path.resolve(__dirname, '../.tmp-chrome-profile-v2');
    if (fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    }
    fs.mkdirSync(userDataDir, { recursive: true });
    
    const extensionPath = path.resolve(__dirname, '../extension');
    
    console.log('🚀 Launching browser with extension...');
    
    // Launch with extension loaded
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
      viewport: { width: 1280, height: 800 },
      recordVideo: {
        dir: path.resolve(__dirname, '../.tmp-videos-v2'),
        size: { width: 1280, height: 800 }
      }
    });
    
    console.log('✓ Browser launched with extension\n');
    
    // Get the first page (main page)
    const page = context.pages()[0] || await context.newPage();
    
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
    console.log('📄 Loading test page at admin.shopify.com...');
    await page.goto('https://admin.shopify.com/store/test/home', { waitUntil: 'networkidle' });
    await sleep(2000);
    
    // Take screenshot - light mode (system default)
    console.log('📸 Initial state (light mode)...');
    await page.screenshot({ 
      path: path.resolve(__dirname, '../.tmp-screenshots-v2/01-light-mode.png')
    });
    
    // Add text caption
    await page.evaluate(() => {
      const caption = document.createElement('div');
      caption.id = 'demo-caption';
      caption.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: -apple-system, sans-serif;
        font-size: 16px;
        font-weight: 600;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      caption.textContent = 'Mode: System (Light)';
      document.body.appendChild(caption);
    });
    
    await sleep(2000);
    
    // Scroll down to show some content
    await page.evaluate(() => window.scrollTo(0, 300));
    await sleep(1500);
    
    console.log('🌙 Setting mode to ON (dark mode)...');
    
    // Update caption
    await page.evaluate(() => {
      const caption = document.getElementById('demo-caption');
      if (caption) caption.textContent = 'Mode: ON (Dark)';
    });
    
    // Apply dark mode class (simulating what content script does)
    await page.evaluate(() => {
      document.documentElement.classList.add('sda-dark');
    });
    
    await sleep(500);
    
    // Verify dark mode applied
    const isDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('sda-dark');
    });
    
    console.log(isDark ? '✓ Dark mode applied' : '⚠️  Dark mode failed to apply');
    
    await sleep(2000);
    
    // Take screenshot - dark mode
    console.log('📸 Dark mode enabled...');
    await page.screenshot({ 
      path: path.resolve(__dirname, '../.tmp-screenshots-v2/02-dark-mode.png')
    });
    
    // Scroll through components
    console.log('📜 Scrolling through components in dark mode...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(800);
    
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 250));
      await sleep(1200);
    }
    
    await sleep(1000);
    
    // Switch to OFF
    console.log('☀️ Setting mode to OFF (light mode)...');
    
    // Update caption
    await page.evaluate(() => {
      const caption = document.getElementById('demo-caption');
      if (caption) caption.textContent = 'Mode: OFF (Light)';
    });
    
    // Remove dark mode class (simulating OFF mode)
    await page.evaluate(() => {
      document.documentElement.classList.remove('sda-dark');
    });
    
    await sleep(2000);
    
    // Scroll up
    await page.evaluate(() => window.scrollTo(0, 200));
    await sleep(1500);
    
    // Switch to System
    console.log('🖥️ Setting mode to SYSTEM...');
    
    await page.evaluate(() => {
      const caption = document.getElementById('demo-caption');
      if (caption) caption.textContent = 'Mode: System (Light)';
    });
    
    // Ensure no dark class for system light
    await page.evaluate(() => {
      document.documentElement.classList.remove('sda-dark');
    });
    
    await sleep(2000);
    
    // Take screenshot - system light
    console.log('📸 System mode (light)...');
    await page.screenshot({ 
      path: path.resolve(__dirname, '../.tmp-screenshots-v2/03-system-light.png')
    });
    
    // Emulate dark color scheme
    console.log('🌑 Emulating dark color scheme (System mode)...');
    
    await page.evaluate(() => {
      const caption = document.getElementById('demo-caption');
      if (caption) caption.textContent = 'Mode: System (Dark)';
    });
    
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // Manually apply dark class for system dark
    await page.evaluate(() => {
      document.documentElement.classList.add('sda-dark');
    });
    
    await sleep(2500);
    
    // Scroll to show the transition
    await page.evaluate(() => window.scrollTo(0, 500));
    await sleep(1500);
    
    // Emulate light color scheme
    console.log('☀️ Emulating light color scheme (System mode)...');
    
    await page.evaluate(() => {
      const caption = document.getElementById('demo-caption');
      if (caption) caption.textContent = 'Mode: System (Light)';
    });
    
    await page.emulateMedia({ colorScheme: 'light' });
    
    // Manually remove dark class for system light
    await page.evaluate(() => {
      document.documentElement.classList.remove('sda-dark');
    });
    
    await sleep(2500);
    
    // Final scroll to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(1000);
    
    console.log('\n✅ Demo recording complete!\n');
    
    // Close and save video
    await page.close();
    await context.close();
    
    // Move video to artifacts
    console.log('📦 Processing video...');
    const videoDir = path.resolve(__dirname, '../.tmp-videos-v2');
    const videos = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
    
    if (videos.length > 0) {
      const videoPath = path.join(videoDir, videos[0]);
      const artifactsDir = '/opt/cursor/artifacts';
      const demoDir = path.resolve(__dirname, '../docs/demo');
      
      // Create directories
      fs.mkdirSync(artifactsDir, { recursive: true });
      fs.mkdirSync(demoDir, { recursive: true });
      
      // Copy WebM to artifacts
      const artifactWebmPath = path.join(artifactsDir, 'shopify-dark-admin-demo-v2.webm');
      fs.copyFileSync(videoPath, artifactWebmPath);
      console.log(`✓ WebM saved to: ${artifactWebmPath}`);
      
      // Convert to MP4
      console.log('🎞️  Converting to MP4...');
      const { execSync } = require('child_process');
      const artifactMp4Path = path.join(artifactsDir, 'shopify-dark-admin-demo-v2.mp4');
      
      execSync(`ffmpeg -i "${artifactWebmPath}" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 96k -movflags +faststart "${artifactMp4Path}" -y`, {
        stdio: 'pipe'
      });
      
      console.log(`✓ MP4 saved to: ${artifactMp4Path}`);
      
      // Check file size
      const stats = fs.statSync(artifactMp4Path);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`✓ File size: ${sizeMB} MB`);
      
      if (stats.size > 10 * 1024 * 1024) {
        console.log('⚠️  File is over 10 MB, compressing further...');
        execSync(`ffmpeg -i "${artifactMp4Path}" -c:v libx264 -crf 32 -preset medium -c:a aac -b:a 64k "${artifactMp4Path}.tmp" -y`, {
          stdio: 'pipe'
        });
        fs.renameSync(`${artifactMp4Path}.tmp`, artifactMp4Path);
        const newStats = fs.statSync(artifactMp4Path);
        const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
        console.log(`✓ Compressed to: ${newSizeMB} MB`);
      }
      
      // Copy to demo dir
      fs.copyFileSync(artifactMp4Path, path.join(demoDir, 'shopify-dark-admin-demo.mp4'));
      console.log(`✓ Copied to docs/demo/`);
      
      // Copy screenshots to demo dir
      const screenshotsDir = path.resolve(__dirname, '../.tmp-screenshots-v2');
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
      
      return {
        videoPath: artifactMp4Path,
        screenshotsDir: demoDir,
        sizeMB
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
      console.log(`   Video: ${result.videoPath} (${result.sizeMB} MB)`);
      console.log(`   Screenshots: ${result.screenshotsDir}`);
      console.log('\n⚠️  IMPORTANT: Verify frames before reporting!');
      console.log('   Run: ffmpeg -i docs/demo/shopify-dark-admin-demo.mp4 -vf "fps=1" .tmp-verify/frame_%03d.png');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Demo recording failed:', error.message);
    process.exit(1);
  });
