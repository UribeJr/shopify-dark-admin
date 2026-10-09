# Screenshots

## Current Status

These are **placeholder/test-page screenshots only**. They show the local test page (`test/test-page.html`) with Polaris-like design tokens.

**Real Shopify admin screenshots** will be added once Enrique tests the extension on his actual admin.

## Test Page Screenshots

The test page demonstrates:
- Polaris design token structure
- Dark mode token overrides
- Various UI components (forms, tables, banners, buttons)
- Text contrast and readability

To generate screenshots:

### Automated (requires puppeteer)
```bash
npm install puppeteer
node scripts/take-screenshots.js
```

### Manual
1. Open `test/test-page.html` in Chrome
2. Take a full-page screenshot in light mode
3. Open the extension popup and enable dark mode
4. Take a full-page screenshot in dark mode
5. Save as `test-page-light.png` and `test-page-dark.png`

## Real Admin Screenshots Needed

Once Enrique tests on the real admin, we need screenshots of:
- Home page (light & dark)
- Orders list (light & dark)
- Order detail page (light & dark)
- Product list (light & dark)
- Product edit page with rich text editor (light & dark)

These will replace or supplement the test-page screenshots in the main README.
