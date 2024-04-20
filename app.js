// Global variables for application state management
const backgrounds = ['First-design.webp', 'Second-design.webp', 'Third-design.webp', 'Fourth-design.webp'];
let currentBackgroundIndex = 0; // Index for non-wallet backgrounds
let spiceBalance = 0;
let spiceAccumulated = 0;
let miningInterval;

// Load saved token balances
function loadSavedBalances() {
    spiceBalance = parseFloat(localStorage.getItem('spiceBalance')) || 0;
    spiceAccumulated = parseFloat(localStorage.getItem('spiceAccumulated')) || 0;
    updateSpiceDisplay();
}

// Update display of SPICE tokens
function updateSpiceDisplay() {
    const spiceDisplayElement = document.getElementById('spice-balance');
    const miningProgressBar = document.getElementById('mining-progress-bar');
    const progressPercentage = Math.min(spiceAccumulated / 100 * 100, 100); // Caps progress at 100%
    spiceDisplayElement.textContent = spiceBalance.toFixed(2);
    miningProgressBar.style.width = `${progressPercentage}%`;
    document.getElementById('claim-spice').disabled = spiceAccumulated < 20; // Enable button at 20% of mining progress
}

// Save the current token balances to localStorage
function saveBalances() {
    localStorage.setItem('spiceBalance', spiceBalance.toString());
    localStorage.setItem('spiceAccumulated', spiceAccumulated.toString());
}

// Claim SPICE tokens
function claimSpiceTokens() {
    if (spiceAccumulated >= 20) {
        spiceBalance += spiceAccumulated;
        spiceAccumulated = 0; // Reset the accumulated SPICE
        updateSpiceDisplay();
        saveBalances();
        alert("You've successfully claimed your SPICE tokens!");
    }
}

// Start mining SPICE tokens
function startSpiceMining() {
    if (miningInterval) clearInterval(miningInterval);
    miningInterval = setInterval(() => {
        spiceAccumulated += 100 / 60; // Accumulate 100 SPICE per hour
        if (spiceAccumulated > 100) spiceAccumulated = 100; // Ensure that we don't go over 100
        updateSpiceDisplay();
    }, 1000 * 60); // Every minute
}

// Fetch crypto prices
function fetchCryptoPrices() {
    // Placeholder for fetching crypto prices functionality
}

// Function to switch background images, excluding the wallet background
function switchBackground() {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    document.body.style.backgroundImage = `url('${backgrounds[currentBackgroundIndex]}')`;
}

// Function to display the wallet section and update the background
function showWallet() {
    clearInterval(miningInterval); // Stop mining when wallet is open
    document.getElementById('wallet-page').style.display = 'block';
    document.getElementById('mining-page').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
    document.body.style.backgroundImage = `url('wallet.webp')`;
}

// Function to display the mining section
function showMining() {
    clearInterval(miningInterval); // Stop mining when other page is open
    document.getElementById('mining-page').style.display = 'block';
    document.getElementById('wallet-page').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
    startSpiceMining(); // Restart mining when mining page is displayed
}

// Close wallet or mining section and show the main content
function closePageSection() {
    document.getElementById('wallet-page').style.display = 'none';
    document.getElementById('mining-page').style.display = 'none';
    document.getElementById('hero').style.display = 'flex';
    switchBackground(); // Switch back to the main background
    startSpiceMining(); // Restart mining when the section is closed
}

// Function to show the home section and hide all others
function showHome() {
    clearInterval(miningInterval); // Optional: stop mining when home is displayed
    document.getElementById('hero').style.display = 'flex';
    document.getElementById('wallet-page').style.display = 'none';
    document.getElementById('mining-page').style.display = 'none';
    // Optional: Reset background to default or remove it
    document.body.style.backgroundImage = '';
    startSpiceMining(); // Optional: restart mining if needed
}

// Set up event listeners
function setupEventListeners() {
    document.getElementById('home-button').addEventListener('click', showHome);
    document.getElementById('wallet-button').addEventListener('click', showWallet);
    document.getElementById('mining-button').addEventListener('click', showMining);
    document.getElementById('close-wallet').addEventListener('click', closePageSection);
    document.getElementById('close-mining').addEventListener('click', closePageSection);
    document.getElementById('claim-spice').addEventListener('click', claimSpiceTokens);
    document.getElementById('change-background').addEventListener('click', switchBackground);
}

// Initialize the application
function initializeApp() {
    loadSavedBalances();
    updateSpiceDisplay();
    setupEventListeners();
    switchBackground(); // Set initial background
    startSpiceMining(); // Start mining process
}

document.addEventListener('DOMContentLoaded', initializeApp);
