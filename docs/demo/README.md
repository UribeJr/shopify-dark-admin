# Demo Video & Screenshots

This directory contains the V1 demo video and screenshots for Shopify Dark Admin.

## Video Demo

**`shopify-dark-admin-demo.mp4`** (50 KB, ~21 seconds)

Demonstrates the complete V1 feature set:
1. **Light mode** – Page loads with default light theme
2. **Toggle to On** – Extension popup set to "On" mode, page instantly switches to dark
3. **Component showcase** – Scroll through all test components (forms, tables, banners, buttons)
4. **Toggle to Off** – Switch back to light mode instantly
5. **System mode** – Toggle to "System" mode and demonstrate live OS theme switching
   - Emulate dark color scheme → page goes dark
   - Emulate light color scheme → page goes light

The video uses the local test page (`test/test-page.html`) served at `https://admin.shopify.com/*` via Playwright route interception. This allows the real content script and CSS to run as they would on the actual Shopify admin.

**Artifact path:** `/opt/cursor/artifacts/shopify-dark-admin-demo.mp4`

## Screenshots

### 01-light-mode.png
Initial page load in light mode showing the test page with Polaris-like tokens.

### 02-dark-mode.png
Same page with dark mode enabled (On mode), showing the complete token override system in action.

### 03-system-light.png
Page in System mode with light color scheme emulated, demonstrating the live OS theme detection.

## Technical Details

- **Resolution:** 1280×800
- **Recording tool:** Playwright with Chrome persistent context
- **Extension loaded:** Via `--load-extension` flag in persistent context
- **Route interception:** `admin.shopify.com/*` → local test page
- **Compression:** MP4 H.264, CRF 28, 96k audio

## Recording Script

The demo was recorded using `scripts/record-demo.js`, which:
1. Starts a local HTTP server for the test page
2. Launches Chrome with the extension loaded in a persistent context
3. Routes `admin.shopify.com` requests to the local test page
4. Captures video and screenshots during the demo sequence
5. Converts WebM to MP4 with ffmpeg compression

To re-record:
```bash
npm install playwright
npx playwright install chromium
node scripts/record-demo.js
```

## Notes

- This is a **test page demo**, not the real Shopify admin (which requires authentication)
- The test page uses Polaris-like design tokens to simulate admin UI
- Real admin screenshots and video will be added once Enrique tests on his store
- Video file size is well under the 10 MB requirement (50 KB)
