/**
 * Shopify Dark Admin - Top Strip & Globe Inspector
 * 
 * INSTRUCTIONS:
 * 1. Open the Shopify admin Home page (admin.shopify.com/store/your-store)
 * 2. Open DevTools (F12 or Cmd+Option+I)
 * 3. Go to the Console tab
 * 4. Paste this entire script and press Enter
 * 5. The inspection results are automatically copied to clipboard
 * 6. Paste the results (Cmd+V/Ctrl+V) into a GitHub issue or send to developer
 * 
 * This script identifies elements rendering the top gradient strip and the white globe.
 */

(function inspectTopStripAndGlobe() {
  console.clear();
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('%c🔍 Top Strip & Globe Inspector', 'color: #5C6AC4; font-size: 16px; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('');

  const output = {
    inspectedAt: new Date().toISOString(),
    url: window.location.href,
    topStripElements: [],
    globeElements: []
  };

  // Helper to get compact element info
  function getElementInfo(element, label) {
    if (!element || element === document.documentElement || element === document.body) {
      return null;
    }

    const computed = getComputedStyle(element);
    const info = {
      label,
      tag: element.tagName.toLowerCase(),
      id: element.id || null,
      classes: element.className ? element.className.split(' ').slice(0, 5).join(' ') : null,
      inlineStyle: element.getAttribute('style') || null,
      computed: {
        backgroundColor: computed.backgroundColor,
        backgroundImage: computed.backgroundImage !== 'none' ? computed.backgroundImage.substring(0, 100) : 'none',
        maskImage: computed.maskImage !== 'none' ? computed.maskImage.substring(0, 100) : 'none',
        filter: computed.filter !== 'none' ? computed.filter : 'none',
        opacity: computed.opacity
      }
    };

    // Check pseudo-elements
    const before = getComputedStyle(element, '::before');
    if (before.content !== 'none') {
      info.pseudoBefore = {
        backgroundImage: before.backgroundImage !== 'none' ? before.backgroundImage.substring(0, 100) : 'none',
        backgroundColor: before.backgroundColor
      };
    }

    const after = getComputedStyle(element, '::after');
    if (after.content !== 'none') {
      info.pseudoAfter = {
        backgroundImage: after.backgroundImage !== 'none' ? after.backgroundImage.substring(0, 100) : 'none',
        backgroundColor: after.backgroundColor
      };
    }

    // Check for canvas/svg children
    const canvas = element.querySelector('canvas');
    const svg = element.querySelector('svg');
    if (canvas) info.hasCanvas = true;
    if (svg) info.hasSVG = true;

    return info;
  }

  // Inspect top strip - sample points across the top
  console.log('🔍 Inspecting top strip (y ≈ 30-80)...');
  const topPoints = [
    { x: 200, y: 50 },
    { x: 400, y: 50 },
    { x: 600, y: 50 },
    { x: 800, y: 50 }
  ];

  const topElementsMap = new Map();
  topPoints.forEach(point => {
    const elements = document.elementsFromPoint(point.x, point.y);
    elements.slice(0, 10).forEach(el => {
      const key = `${el.tagName}-${el.className}-${el.id}`;
      if (!topElementsMap.has(key)) {
        const info = getElementInfo(el, `Top strip near x=${point.x}`);
        if (info) {
          topElementsMap.set(key, info);
        }
      }
    });
  });

  output.topStripElements = Array.from(topElementsMap.values()).slice(0, 8);
  console.log(`Found ${output.topStripElements.length} unique elements in top strip`);

  // Inspect globe - top-right area
  console.log('🔍 Inspecting globe widget (top-right)...');
  const viewportWidth = window.innerWidth;
  const globePoints = [
    { x: viewportWidth - 100, y: 80 },
    { x: viewportWidth - 150, y: 100 },
    { x: viewportWidth - 120, y: 120 }
  ];

  const globeElementsMap = new Map();
  globePoints.forEach(point => {
    const elements = document.elementsFromPoint(point.x, point.y);
    elements.slice(0, 10).forEach(el => {
      const key = `${el.tagName}-${el.className}-${el.id}`;
      if (!globeElementsMap.has(key)) {
        const info = getElementInfo(el, `Globe near x=${point.x}, y=${point.y}`);
        if (info) {
          globeElementsMap.set(key, info);
        }
      }
    });
  });

  output.globeElements = Array.from(globeElementsMap.values()).slice(0, 8);
  console.log(`Found ${output.globeElements.length} unique elements in globe area`);

  // Format and copy to clipboard
  const jsonOutput = JSON.stringify(output, null, 2);
  
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('%c✅ Inspection complete! Results copied to clipboard.', 'color: #47C1BF; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #5C6AC4');
  console.log('');
  console.log('%cPreview (first 500 chars):', 'font-weight: bold');
  console.log(jsonOutput.substring(0, 500) + '...');
  console.log('');
  console.log('%cFull output has been copied to clipboard - paste it to share!', 'color: #47C1BF');

  // Copy to clipboard
  if (typeof copy === 'function') {
    copy(jsonOutput);
  } else {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      console.log('✓ Copied via navigator.clipboard');
    }).catch(() => {
      console.log('⚠️ Could not auto-copy. Copy the output manually:');
      console.log(jsonOutput);
    });
  }

  return output;
})();
