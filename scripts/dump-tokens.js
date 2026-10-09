/**
 * Shopify Dark Admin - Enhanced Token Dumper
 * 
 * INSTRUCTIONS FOR ENRIQUE:
 * 1. Open the Shopify admin in Chrome (admin.shopify.com)
 * 2. Open DevTools (F12 or Cmd+Option+I)
 * 3. Go to the Console tab
 * 4. Paste this entire script and press Enter
 * 5. Copy ALL the output (scroll to see everything)
 * 6. Send the complete JSON to the developer
 * 
 * This enhanced version reports:
 * - All Polaris color tokens and where they're declared
 * - Computed background colors of key elements
 * - Element selectors that override tokens
 */

(function dumpPolarisTokensEnhanced() {
  console.clear();
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('%c🎨 Shopify Dark Admin - Enhanced Token Dumper', 'color: #5C6AC4; font-size: 16px; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('');
  
  const output = {
    dumpedAt: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    tokens: {},
    tokenSources: {},
    computedColors: {},
    elementInfo: {}
  };
  
  // Function to get all custom properties from an element
  function getCustomPropertiesFrom(element, label) {
    const style = getComputedStyle(element);
    const tokens = {};
    
    for (let i = 0; i < style.length; i++) {
      const prop = style[i];
      if (prop.startsWith('--p-color-')) {
        const value = style.getPropertyValue(prop).trim();
        tokens[prop] = value;
      }
    }
    
    return tokens;
  }
  
  // Get tokens from :root / html
  console.log('🔍 Scanning document.documentElement (html)...');
  const htmlTokens = getCustomPropertiesFrom(document.documentElement, 'html');
  output.tokens = { ...output.tokens, ...htmlTokens };
  output.tokenSources.documentElement = Object.keys(htmlTokens).length;
  
  // Get tokens from body
  console.log('🔍 Scanning body...');
  const bodyTokens = getCustomPropertiesFrom(document.body, 'body');
  Object.keys(bodyTokens).forEach(token => {
    if (!output.tokens[token] || output.tokens[token] !== bodyTokens[token]) {
      output.tokens[token] = bodyTokens[token];
      output.tokenSources[token] = 'body';
    }
  });
  
  // Scan key container elements
  const selectors = [
    '#AppFrameMain',
    '[class*="Frame"]',
    '[class*="Page"]',
    'main',
    '[class*="Polaris"]',
    '[role="main"]'
  ];
  
  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(`🔍 Scanning ${elements.length} elements matching "${selector}"...`);
        const firstElement = elements[0];
        const containerTokens = getCustomPropertiesFrom(firstElement, selector);
        
        Object.keys(containerTokens).forEach(token => {
          if (!output.tokens[token] || output.tokens[token] !== containerTokens[token]) {
            output.tokens[token] = containerTokens[token];
            output.tokenSources[token] = selector;
          }
        });
      }
    } catch (e) {
      // Invalid selector, skip
    }
  });
  
  // Get computed background colors of key elements
  console.log('');
  console.log('🎨 Computing actual background colors...');
  
  const keyElements = {
    body: document.body,
    mainCanvas: document.querySelector('main') || document.querySelector('[role="main"]'),
    firstCard: document.querySelector('[class*="Card"]') || document.querySelector('[class*="Surface"]'),
    firstInput: document.querySelector('input') || document.querySelector('textarea'),
    firstButton: document.querySelector('button'),
    appFrame: document.querySelector('#AppFrameMain') || document.querySelector('[class*="Frame"]')
  };
  
  Object.keys(keyElements).forEach(key => {
    const element = keyElements[key];
    if (element) {
      const style = getComputedStyle(element);
      output.computedColors[key] = {
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderColor || style.borderTopColor,
        selector: element.tagName.toLowerCase() + (element.className ? '.' + element.className.split(' ')[0] : '')
      };
      output.elementInfo[key] = {
        tagName: element.tagName,
        className: element.className,
        id: element.id
      };
    }
  });
  
  const totalTokens = Object.keys(output.tokens).length;
  const sourcesCount = Object.keys(output.tokenSources).length;
  
  console.log(`%c✓ Found ${totalTokens} unique Polaris color tokens`, 'color: #47C1BF; font-weight: bold');
  console.log(`✓ Tokens declared across ${sourcesCount} different locations`);
  console.log('');
  console.log('%cToken declaration locations:', 'font-weight: bold');
  
  // Count tokens by source
  const sourceStats = {};
  Object.values(output.tokenSources).forEach(source => {
    sourceStats[source] = (sourceStats[source] || 0) + 1;
  });
  
  Object.entries(sourceStats).forEach(([source, count]) => {
    console.log(`  ${source}: ${count} tokens`);
  });
  
  console.log('');
  console.log('%cComputed colors of key elements:', 'font-weight: bold');
  Object.entries(output.computedColors).forEach(([key, colors]) => {
    console.log(`  ${key}:`);
    console.log(`    background: ${colors.backgroundColor}`);
    console.log(`    text: ${colors.color}`);
    console.log(`    border: ${colors.borderColor}`);
  });
  
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('%c📋 COPY THIS COMPLETE JSON OUTPUT:', 'color: #5C6AC4; font-size: 14px; font-weight: bold');
  console.log('%c   (Scroll down to see it all, then select and copy)', 'color: #666; font-size: 12px');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('');
  console.log(JSON.stringify(output, null, 2));
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('%c✨ Done! Copy the JSON above (from the opening { to the closing }) and send it.', 'color: #47C1BF; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  
  return output;
})();
