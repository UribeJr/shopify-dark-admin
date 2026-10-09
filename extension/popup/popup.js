/**
 * Shopify Dark Admin - Popup Script
 */

const STORAGE_KEY = 'sda-mode';

async function getMode() {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  return result[STORAGE_KEY] || 'system';
}

async function setMode(mode) {
  await chrome.storage.sync.set({ [STORAGE_KEY]: mode });
}

function updateUI(mode) {
  const options = document.querySelectorAll('.mode-option');
  const radios = document.querySelectorAll('input[type="radio"]');
  
  options.forEach(option => {
    option.classList.remove('active');
  });
  
  radios.forEach(radio => {
    radio.checked = false;
  });
  
  const selectedOption = document.querySelector(`[data-mode="${mode}"]`);
  const selectedRadio = document.querySelector(`input[value="${mode}"]`);
  
  if (selectedOption) {
    selectedOption.classList.add('active');
  }
  
  if (selectedRadio) {
    selectedRadio.checked = true;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const currentMode = await getMode();
  updateUI(currentMode);
  
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    radio.addEventListener('change', async (e) => {
      const newMode = e.target.value;
      await setMode(newMode);
      updateUI(newMode);
    });
  });
  
  const options = document.querySelectorAll('.mode-option');
  options.forEach(option => {
    option.addEventListener('click', async (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      const mode = option.dataset.mode;
      const radio = option.querySelector('input[type="radio"]');
      
      if (radio) {
        radio.checked = true;
        await setMode(mode);
        updateUI(mode);
      }
    });
  });
});
