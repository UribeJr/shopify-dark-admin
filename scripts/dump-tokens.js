/**
 * Shopify Dark Admin - Token Dumper
 * 
 * INSTRUCTIONS FOR ENRIQUE:
 * 1. Open the Shopify admin in Chrome (admin.shopify.com)
 * 2. Open DevTools (F12 or Cmd+Option+I)
 * 3. Go to the Console tab
 * 4. Paste this entire script and press Enter
 * 5. Copy the JSON output (everything between the curly braces)
 * 6. Send the JSON to the developer to update the extension's token mappings
 * 
 * This will capture all Polaris color tokens (--p-color-*) currently in use.
 */

(function dumpPolarisTokens() {
  console.clear();
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('%c🎨 Shopify Dark Admin - Token Dumper', 'color: #5C6AC4; font-size: 16px; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('');
  
  const docStyle = getComputedStyle(document.documentElement);
  const tokens = {};
  const categories = {
    bg: [],
    text: [],
    border: [],
    icon: [],
    other: []
  };
  
  for (let i = 0; i < docStyle.length; i++) {
    const prop = docStyle[i];
    
    if (prop.startsWith('--p-color-')) {
      const value = docStyle.getPropertyValue(prop).trim();
      tokens[prop] = value;
      
      if (prop.startsWith('--p-color-bg')) {
        categories.bg.push({ prop, value });
      } else if (prop.startsWith('--p-color-text')) {
        categories.text.push({ prop, value });
      } else if (prop.startsWith('--p-color-border')) {
        categories.border.push({ prop, value });
      } else if (prop.startsWith('--p-color-icon')) {
        categories.icon.push({ prop, value });
      } else {
        categories.other.push({ prop, value });
      }
    }
  }
  
  const totalTokens = Object.keys(tokens).length;
  console.log(`%c✓ Found ${totalTokens} Polaris color tokens`, 'color: #47C1BF; font-weight: bold');
  console.log('');
  console.log('%cCategory breakdown:', 'font-weight: bold');
  console.log(`  Background: ${categories.bg.length} tokens`);
  console.log(`  Text: ${categories.text.length} tokens`);
  console.log(`  Border: ${categories.border.length} tokens`);
  console.log(`  Icon: ${categories.icon.length} tokens`);
  console.log(`  Other: ${categories.other.length} tokens`);
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('%c📋 COPY THIS JSON (select and Cmd+C / Ctrl+C):', 'color: #5C6AC4; font-size: 14px; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('');
  
  const output = {
    dumpedAt: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    totalTokens,
    categories: {
      bg: categories.bg.length,
      text: categories.text.length,
      border: categories.border.length,
      icon: categories.icon.length,
      other: categories.other.length
    },
    tokens
  };
  
  console.log(JSON.stringify(output, null, 2));
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('%c✨ Done! Copy the JSON above and send it to the developer.', 'color: #47C1BF; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  
  return output;
})();
