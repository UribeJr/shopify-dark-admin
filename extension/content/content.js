/**
 * Shopify Dark Admin - Content Script
 * Applies dark mode class based on user preference
 * Includes debug logging to verify injection
 */

const DARK_CLASS = 'sda-dark';
const STORAGE_KEY = 'sda-mode';

// Debug: Log that content script loaded
console.log('[Shopify Dark Admin] Content script loaded at', new Date().toISOString());
console.log('[Shopify Dark Admin] URL:', window.location.href);

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
    document.documentElement.classList.add(DARK_CLASS);
    document.documentElement.setAttribute('data-sda-mode', 'dark');
  } else {
    document.documentElement.classList.remove(DARK_CLASS);
    document.documentElement.setAttribute('data-sda-mode', 'light');
  }
  
  console.log('[Shopify Dark Admin] HTML classes:', document.documentElement.className);
}

// Initial application
applyMode();

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes[STORAGE_KEY]) {
    console.log('[Shopify Dark Admin] Storage changed:', changes[STORAGE_KEY]);
    applyMode();
  }
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async () => {
  const mode = await getMode();
  console.log('[Shopify Dark Admin] System theme changed, current mode:', mode);
  if (mode === 'system') {
    applyMode();
  }
});

// Verify injection every 2 seconds for the first 10 seconds (for debugging)
let verifyCount = 0;
const verifyInterval = setInterval(() => {
  verifyCount++;
  console.log('[Shopify Dark Admin] Verification check', verifyCount, 'classes:', document.documentElement.className);
  if (verifyCount >= 5) {
    clearInterval(verifyInterval);
  }
}, 2000);
