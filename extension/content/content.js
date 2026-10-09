/**
 * Shopify Dark Admin - Content Script
 * Applies dark mode class based on user preference
 */

const DARK_CLASS = 'sda-dark';
const STORAGE_KEY = 'sda-mode';

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
  
  if (shouldDark) {
    document.documentElement.classList.add(DARK_CLASS);
  } else {
    document.documentElement.classList.remove(DARK_CLASS);
  }
}

applyMode();

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes[STORAGE_KEY]) {
    applyMode();
  }
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async () => {
  const mode = await getMode();
  if (mode === 'system') {
    applyMode();
  }
});
