// Cesty k obrázkům na pozadí
const backgrounds = [
  'First-design.jpg' // Zjednodušeno na jeden design
];
let spiceBalance = 0;
let spiceAccumulated = 0;
let miningInterval;

// Načtení uložené bilance SPICE z localStorage
const loadSavedBalances = () => {
  spiceBalance = parseFloat(localStorage.getItem('spiceBalance')) || 0;
  spiceAccumulated = parseFloat(localStorage.getItem('spiceAccumulated')) || 0;
  updateSpiceDisplay();
};

// Aktualizace zobrazení bilance SPICE a průběhu těžby
const updateSpiceDisplay = () => {
  const spiceDisplayElement = document.getElementById('spice-balance');
  const miningProgressBar = document.getElementById('mining-progress-bar');
  if (spiceDisplayElement && miningProgressBar) {
    const progressPercentage = Math.min((spiceAccumulated / 100) * 100, 100);
    spiceDisplayElement.textContent = spiceBalance.toFixed(2);
    miningProgressBar.style.width = `${progressPercentage}%`;
    document.getElementById('claim-spice').disabled = spiceAccumulated < 20;
  }
};

// Uložení aktuální bilance SPICE do localStorage
const saveBalances = () => {
  localStorage.setItem('spiceBalance', spiceBalance.toString());
  localStorage.setItem('spiceAccumulated', spiceAccumulated.toString());
};

// Funkce pro nárok SPICE tokenů
const claimSpiceTokens = () => {
  const claimButton = document.getElementById('claim-spice');
  const loadingIndicator = document.getElementById('loading-indicator');
  const claimMessage = document.getElementById('claim-message');

  if (spiceAccumulated >= 20) {
    claimButton.disabled = true;
    loadingIndicator.style.display = 'block';

    setTimeout(() => {
      spiceBalance += spiceAccumulated;
      spiceAccumulated = 0;
      updateSpiceDisplay();
      saveBalances();

      loadingIndicator.style.display = 'none';
      claimMessage.style.display = 'block';
      claimMessage.textContent = "Úspěšně jste nárokovali vaše SPICE tokeny!";

      setTimeout(() => {
        claimMessage.style.display = 'none';
        claimButton.disabled = false;
      }, 5000);

    }, 2000);
  }
};

// Funkce pro zahájení těžby SPICE tokenů
const startSpiceMining = () => {
  clearInterval(miningInterval);
  miningInterval = setInterval(() => {
    spiceAccumulated += (100 / 60);
    if (spiceAccumulated > 100) spiceAccumulated = 100;
    updateSpiceDisplay();
  }, 1000);
};

// Funkce pro zavření sekce Peněženka nebo Těžba
const closePageSection = () => {
  document.getElementById('wallet-card').style.display = 'none';
  document.getElementById('mining-card').style.display = 'none';
  document.getElementById('hero').style.display = 'flex';
};

// Funkce pro zobrazení sekce Peněženka
const showWallet = () => {
  clearInterval(miningInterval);
  document.getElementById('wallet-card').style.display = 'block';
  document.getElementById('mining-card').style.display = 'none';
  document.getElementById('hero').style.display = 'none';
};

// Funkce pro zobrazení sekce Těžba
const showMining = () => {
  clearInterval(miningInterval);
  document.getElementById('mining-card').style.display = 'block';
  document.getElementById('wallet-card').style.display = 'none';
  document.getElementById('hero').style.display = 'none';
  startSpiceMining();
};

// Zobrazení sekce Domů
const showHome = () => {
  clearInterval(miningInterval);
  document.getElementById('hero').style.display = 'flex';
  document.getElementById('wallet-card').style.display = 'none';
  document.getElementById('mining-card').style.display = 'none';
  document.body.style.backgroundImage = "url('First-design.jpg')";
};

// Nastavení posluchačů událostí pro prvky uživatelského rozhraní
const setupEventListeners = () => {
  document.getElementById('home-button').addEventListener('click', showHome);
  document.getElementById('wallet-button').addEventListener('click', showWallet);
  document.getElementById('mining-button').addEventListener('click', showMining);
  document.getElementById('close-wallet').addEventListener('click', closePageSection);
  document.getElementById('close-mining').addEventListener('click', closePageSection);
  document.getElementById('claim-spice').addEventListener('click', claimSpiceTokens);
};

// Inicializace aplikace při načtení DOM
document.addEventListener('DOMContentLoaded', () => {
  loadSavedBalances();
  setupEventListeners();
  showHome(); // Přidáno volání funkce showHome pro zobrazení domácí stránky jako výchozí
});
