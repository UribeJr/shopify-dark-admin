/**
 * Shopify Dark Admin - Content Script
 * Applies dark mode class based on user preference
 * Works in main frame and all iframes (embedded sections)
 */

const DARK_CLASS = 'sda-dark';
const STORAGE_KEY = 'sda-mode';

// Debug: Log that content script loaded (in any frame)
console.log('[Shopify Dark Admin] Content script loaded');
console.log('[Shopify Dark Admin] URL:', window.location.href);
console.log('[Shopify Dark Admin] Frame:', window === window.top ? 'top' : 'iframe');

async function getMode() {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  return result[STORAGE_KEY] || 'system';
}

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function shouldApplyDark(mode) {
  if (mode === 'on') return true;
  if (mode === 'off') return false;
  return systemPrefersDark();
}

async function applyMode() {
  const mode = await getMode();
  const shouldDark = shouldApplyDark(mode);
  
  console.log('[Shopify Dark Admin] Applying mode:', mode, 'shouldDark:', shouldDark);
  
  if (shouldDark) {
    // Apply to both html AND body for iframe robustness
    document.documentElement.classList.add(DARK_CLASS);
    document.body?.classList.add(DARK_CLASS);
    document.documentElement.setAttribute('data-sda-mode', 'dark');
  } else {
    document.documentElement.classList.remove(DARK_CLASS);
    document.body?.classList.remove(DARK_CLASS);
    document.documentElement.setAttribute('data-sda-mode', 'light');
  }
  
  console.log('[Shopify Dark Admin] HTML classes:', document.documentElement.className);
  console.log('[Shopify Dark Admin] Body classes:', document.body?.className || 'no body yet');
}

// Initial application - works in all frames
applyMode();

// Listen for storage changes - works in all frames
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes[STORAGE_KEY]) {
    console.log('[Shopify Dark Admin] Storage changed:', changes[STORAGE_KEY]);
    applyMode();
  }
});

// Listen for system theme changes - works in all frames
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async () => {
  const mode = await getMode();
  console.log('[Shopify Dark Admin] System theme changed, current mode:', mode);
  if (mode === 'system') {
    applyMode();
  }
});

// Re-apply if body loads later (for iframes)
if (!document.body) {
  const observer = new MutationObserver(() => {
    if (document.body) {
      console.log('[Shopify Dark Admin] Body loaded, re-applying mode');
      applyMode();
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true });
}

// Verification check for debugging
setTimeout(() => {
  console.log('[Shopify Dark Admin] Verification - HTML has sda-dark:', 
    document.documentElement.classList.contains(DARK_CLASS));
  console.log('[Shopify Dark Admin] Verification - Body has sda-dark:', 
    document.body?.classList.contains(DARK_CLASS));
}, 1000);
