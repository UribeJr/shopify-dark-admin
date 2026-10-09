/**
 * Shopify Dark Admin - Frame Inspector
 * 
 * INSTRUCTIONS:
 * 1. Open the Shopify admin page with an iframe (e.g., Online Store > Themes)
 * 2. Open DevTools (F12 or Cmd+Option+I)
 * 3. **IMPORTANT:** Switch DevTools context to the iframe:
 *    - Click the context dropdown (usually says "top")
 *    - Select the iframe (e.g., "online-store-web.shopifyapps.com")
 * 4. Paste this entire script in the Console tab and press Enter
 * 5. The inspection results are automatically copied to clipboard
 * 6. Paste the results into a GitHub issue or send to developer
 * 
 * This script checks if dark mode is applied in the iframe and what tokens exist.
 */

(function inspectFrame() {
  console.clear();
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('%c🔍 Frame Inspector', 'color: #5C6AC4; font-size: 16px; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('');

  const output = {
    inspectedAt: new Date().toISOString(),
    url: window.location.href,
    isTopFrame: window === window.top,
    darkModeStatus: {},
    computedBackgrounds: {},
    customProperties: {}
  };

  // Check if dark mode class is applied
  output.darkModeStatus = {
    htmlHasSdaDark: document.documentElement.classList.contains('sda-dark'),
    bodyHasSdaDark: document.body ? document.body.classList.contains('sda-dark') : null,
    htmlClasses: document.documentElement.className || 'none',
    bodyClasses: document.body ? document.body.className || 'none' : 'no body yet'
  };

  console.log('Dark mode status:', output.darkModeStatus);

  // Check computed backgrounds
  const htmlStyle = getComputedStyle(document.documentElement);
  const bodyStyle = document.body ? getComputedStyle(document.body) : null;
  const main = document.querySelector('main');
  const mainStyle = main ? getComputedStyle(main) : null;

  output.computedBackgrounds = {
    html: htmlStyle.backgroundColor,
    body: bodyStyle ? bodyStyle.backgroundColor : null,
    main: mainStyle ? mainStyle.backgroundColor : null
  };

  console.log('Computed backgrounds:', output.computedBackgrounds);

  // Get custom properties starting with --p (first 80)
  const getCustomProps = (element, label) => {
    const style = getComputedStyle(element);
    const props = {};
    let count = 0;
    
    for (let i = 0; i < style.length && count < 80; i++) {
      const prop = style[i];
      if (prop.startsWith('--p')) {
        props[prop] = style.getPropertyValue(prop).trim();
        count++;
      }
    }
    
    return props;
  };

  output.customProperties.html = getCustomProps(document.documentElement, 'html');
  output.customProperties.body = document.body ? getCustomProps(document.body, 'body') : null;

  const htmlPropCount = Object.keys(output.customProperties.html).length;
  const bodyPropCount = output.customProperties.body ? Object.keys(output.customProperties.body).length : 0;

  console.log(`Found ${htmlPropCount} custom properties on html`);
  console.log(`Found ${bodyPropCount} custom properties on body`);

  // Format and copy to clipboard
  const jsonOutput = JSON.stringify(output, null, 2);
  
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('%c✅ Frame inspection complete! Results copied to clipboard.', 'color: #47C1BF; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('');
  console.log('%cSummary:', 'font-weight: bold');
  console.log(`  Frame: ${output.isTopFrame ? 'top' : 'iframe'}`);
  console.log(`  URL: ${output.url}`);
  console.log(`  HTML has sda-dark: ${output.darkModeStatus.htmlHasSdaDark}`);
  console.log(`  Body has sda-dark: ${output.darkModeStatus.bodyHasSdaDark}`);
  console.log(`  HTML background: ${output.computedBackgrounds.html}`);
  console.log(`  Body background: ${output.computedBackgrounds.body}`);
  console.log(`  Custom properties on html: ${htmlPropCount}`);
  console.log(`  Custom properties on body: ${bodyPropCount}`);
  console.log('');
  console.log('%cFull JSON output has been copied to clipboard - paste it to share!', 'color: #47C1BF');

  // Copy to clipboard
  if (typeof copy === 'function') {
    copy(jsonOutput);
  } else {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      console.log('✓ Copied via navigator.clipboard');
    }).catch(() => {
      console.log('⚠️ Could not auto-copy. Copy the output manually from below:');
      console.log(jsonOutput);
    });
  }

  return output;
})();
