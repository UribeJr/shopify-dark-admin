# Shopify Dark Admin

A beautiful dark mode for the Shopify admin.

## Features

- 🌙 **Dark mode for the entire Shopify admin** – Comprehensive token overrides based on Shopify Polaris design system
- ⚡ **Instant toggle** – Switch between On/Off/System modes with no page reload
- 🖥️ **Follows your OS theme** – System mode automatically responds to macOS/Windows dark mode changes
- 📦 **Works in embedded sections** – Includes Online Store, Themes, and other iframe-based admin pages
- 🎯 **Keeps Shopify's native nav** – Dark mode respects Shopify's own left navigation styling
- 🔒 **No tracking, no network requests** – Zero telemetry, completely private
- ⚡ **Zero flash** – Dark mode applies instantly at page load with no white flash

## Installation

### For Users

1. **Download the extension**
   - Visit the [latest release](https://github.com/UribeJr/shopify-dark-admin/releases/latest)
   - Download `shopify-dark-admin-v1.0.1.zip`
   - Unzip the file

   **OR** clone the repository:
   ```bash
   git clone https://github.com/UribeJr/shopify-dark-admin.git
   cd shopify-dark-admin
   ```

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Turn on **Developer mode** (toggle in top right)

3. **Load the extension**
   - Click **Load unpacked**
   - Select the `extension` folder

4. **Start using it**
   - Pin the extension to your toolbar (optional but recommended)
   - Visit `https://admin.shopify.com/`
   - Click the extension icon and select **On** or **System**

### Works in other Chromium browsers

This extension also works in Edge, Brave, Arc, and other Chromium-based browsers. Follow the same steps using your browser's extensions page.

## Usage

Click the extension icon and choose:

- **On** – Always use dark mode
- **Off** – Always use light mode (default Shopify)
- **System** – Follow your operating system's theme preference

Your preference syncs across all your Chrome browsers via `chrome.storage.sync`.

## Updating

When a new version is released:

1. Download the new release zip or run `git pull` if you cloned the repo
2. Replace the extension folder (or unzip the new version in the same location)
3. Go to `chrome://extensions/`
4. Click the **reload** icon (circular arrow) on the Shopify Dark Admin card

## Permissions

This extension requires:

- **`storage`** – Saves your theme preference (On/Off/System) and syncs across devices
- **`https://admin.shopify.com/*`** – Main Shopify admin access
- **`https://*.shopifyapps.com/*`** – First-party embedded Shopify admin pages like Online Store and Themes

**Why `*.shopifyapps.com`?**  
Some admin sections (Online Store > Themes, for example) render inside iframes from Shopify's own app domains like `online-store-web.shopifyapps.com`. The extension needs access to these iframes to apply dark mode consistently throughout the admin.

**No other permissions.** No network access, no analytics, no tracking.

## Troubleshooting

### Dark mode not applying

1. **Hard refresh the page**  
   Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)

2. **Check site access**  
   Right-click the extension icon → **This can read and change site data** → Make sure it's set to **On all sites** or **On admin.shopify.com**

3. **Check the extension is enabled**  
   Go to `chrome://extensions/` and verify Shopify Dark Admin is enabled

4. **Reload the extension**  
   Go to `chrome://extensions/` and click the reload icon on the extension card

### Part of the page is still light

Some pages may use hard-coded colors or non-standard Polaris tokens. If you find a light section:

1. Open DevTools (`F12` or `Cmd+Option+I`)
2. Go to the Console tab
3. Copy and paste the contents of [`scripts/dump-tokens.js`](scripts/dump-tokens.js)
4. Press Enter and copy the output
5. [Open an issue](https://github.com/UribeJr/shopify-dark-admin/issues) with:
   - The page URL
   - A screenshot
   - The token dump output

### Embedded iframe pages not dark

For pages like **Online Store > Themes**:

1. Make sure you're using version 1.0.1 or later
2. The extension needs `*.shopifyapps.com` permission
3. When you load the extension for the first time, Chrome should prompt you to allow this
4. If not, check `chrome://extensions/` → Shopify Dark Admin → **Details** → **Site access**

## Developer Guide

### Project Structure

```
shopify-dark-admin/
├── extension/
│   ├── manifest.json         # Extension manifest (Manifest V3)
│   ├── content/
│   │   ├── content.js        # Applies .sda-dark class and listens for changes
│   │   └── dark.css          # All Polaris token overrides
│   ├── popup/
│   │   ├── popup.html        # Extension popup UI
│   │   ├── popup.js          # Popup logic
│   │   └── popup.css         # Popup styles
│   └── icons/                # Extension icons (16, 32, 48, 128px)
├── scripts/
│   ├── dump-tokens.js        # DevTools script to extract Polaris tokens
│   ├── inspect-frame.js      # DevTools script to diagnose iframe dark mode
│   ├── inspect-top.js        # DevTools script to inspect top bar elements
│   └── package.sh            # Builds release zip
├── test/
│   └── test-page.html        # Local test page with Polaris-like tokens
└── README.md
```

### How it works

1. **content.js** runs at `document_start` (before the page renders) in both top frame and all iframes
2. It reads the user's preference from `chrome.storage.sync`
3. It applies the `sda-dark` class to `html` and `body`
4. It listens for storage changes and `prefers-color-scheme` media query changes to toggle instantly
5. **dark.css** overrides Polaris CSS custom properties scoped under `html.sda-dark` and `body.sda-dark`

### Token mapping

All color overrides are in [`extension/content/dark.css`](extension/content/dark.css). Colors are scoped under `html.sda-dark` and use `!important` to win specificity battles with the admin's own token declarations.

The extension maps both modern Polaris tokens (`--p-color-*`) and legacy tokens (`--p-surface`, `--p-background`, etc.) for compatibility with older iframe content.

Example:

```css
html.sda-dark:root,
html.sda-dark,
html.sda-dark body {
  --p-color-bg: #1a1a1a !important;               /* Page background */
  --p-color-bg-surface: #262626 !important;       /* Cards */
  --p-color-bg-surface-hover: #303030 !important; /* Raised surfaces */
  --p-color-text: #e3e3e3 !important;             /* Primary text */
  --p-color-text-secondary: #b5b5b5 !important;   /* Secondary text */
  --p-color-border: #3a3a3a !important;           /* Borders */
  /* ...and 150+ more tokens */
}
```

### Local testing

1. Open `test/test-page.html` in Chrome
2. Load the unpacked extension
3. Toggle dark mode and verify:
   - Text contrast meets WCAG AA
   - All surfaces have proper layering (page → card → raised)
   - Inputs, buttons, and interactive elements are readable
   - No white flashes on toggle

### Developer scripts

Run these in the browser DevTools Console (not terminal):

- **`scripts/dump-tokens.js`** – Extracts all `--p-color-*` custom properties and computed backgrounds from the current page. Use this on the real Shopify admin to capture actual token values for mapping.

- **`scripts/inspect-frame.js`** – Diagnoses dark mode in iframes. Switch DevTools context to the iframe, paste the script, and it reports whether `sda-dark` is applied and which tokens are present.

- **`scripts/inspect-top.js`** – Uses `document.elementsFromPoint` to inspect elements at specific page coordinates (used for diagnosing gradient/background issues on the top bar and widgets).

### Building a release

```bash
./scripts/package.sh
```

This reads the version from `manifest.json` and creates `dist/shopify-dark-admin-v1.0.1.zip` ready for distribution.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly on the real Shopify admin
5. Commit with a clear message: `git commit -m 'Add support for X'`
6. Push: `git push origin feature/your-feature`
7. Open a Pull Request

Please include screenshots or screen recordings demonstrating your changes on the real admin.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Disclaimer

This extension is not affiliated with, endorsed by, or connected to Shopify Inc. It is an independent open-source project built for personal use.

Shopify and Polaris are trademarks of Shopify Inc.

---

**Built for late-night store builders** ☕🌙
