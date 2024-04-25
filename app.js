// Path to the background images
const backgrounds = ['First-design.png', 'Second-design.webp', 'Third-design.webp', 'Fourth-design.webp'];
let currentBackgroundIndex = 0; // Index of the current background
let spiceBalance = 0; // User's SPICE balance
let spiceAccumulated = 0; // Accumulated SPICE awaiting claim
let miningInterval; // Interval for mining simulation

// Load saved SPICE balances from localStorage
const loadSavedBalances = () => {
    spiceBalance = parseFloat(localStorage.getItem('spiceBalance')) || 0;
    spiceAccumulated = parseFloat(localStorage.getItem('spiceAccumulated')) || 0;
    updateSpiceDisplay();
};

// Update the display of SPICE balance and progress bar
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

// Save the current SPICE balances to localStorage
const saveBalances = () => {
    localStorage.setItem('spiceBalance', spiceBalance.toString());
    localStorage.setItem('spiceAccumulated', spiceAccumulated.toString());
};

// Function to claim SPICE tokens
const claimSpiceTokens = () => {
    const claimButton = document.getElementById('claim-spice');
    const loadingIndicator = document.getElementById('loading-indicator');
    const claimMessage = document.getElementById('claim-message');

    if (spiceAccumulated >= 20) {
        claimButton.disabled = true;
        loadingIndicator.style.display = 'block'; // Show loading indicator

        // Simulate the claim process with a delay
        setTimeout(() => {
            spiceBalance += spiceAccumulated;
            spiceAccumulated = 0;
            updateSpiceDisplay();
            saveBalances();

            loadingIndicator.style.display = 'none'; // Hide loading indicator
            claimMessage.style.display = 'block'; // Show success message
            claimMessage.textContent = "You've successfully claimed your SPICE tokens!";

            // Hide the message after some time and enable the claim button
            setTimeout(() => {
                claimMessage.style.display = 'none';
                claimButton.disabled = false;
            }, 5000);

        }, 2000); // Time in milliseconds for the loading effect
    }
};

// Function to start mining SPICE tokens
const startSpiceMining = () => {
    clearInterval(miningInterval);
    miningInterval = setInterval(() => {
        spiceAccumulated += (100 / 60);
        if (spiceAccumulated > 100) spiceAccumulated = 100;
        updateSpiceDisplay();
    }, 1000);
};

// Fetch cryptocurrency prices - placeholder for future implementation
const fetchCryptoPrices = () => {
    // Placeholder for fetching crypto prices functionality
};

// Function to switch background images
const switchBackground = () => {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    document.body.style.backgroundImage = `url('${backgrounds[currentBackgroundIndex]}')`;
};

// Display Wallet section
const showWallet = () => {
    clearInterval(miningInterval);
    document.getElementById('wallet-page').style.display = 'block';
    document.getElementById('mining-page').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
    document.body.style.backgroundImage = "url('wallet.webp')";
};

// Display Mining section
const showMining = () => {
    clearInterval(miningInterval);
    document.getElementById('mining-page').style.display = 'block';
    document.getElementById('wallet-page').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
    startSpiceMining();
};

// Close Wallet or Mining section
const closePageSection = () => {
    document.getElementById('wallet-page').style.display = 'none';
    document.getElementById('mining-page').style.display = 'none';
    document.getElementById('hero').style.display = 'flex';
    switchBackground();
};

// Show the Home section
const showHome = () => {
    clearInterval(miningInterval);
    document.getElementById('hero').style.display = 'flex';
    document.getElementById('wallet-page').style.display = 'none';
    document.getElementById('mining-page').style.display = 'none';
    document.body.style.backgroundImage = '';
    startSpiceMining();
};

// Set up event listeners for UI elements
const setupEventListeners = () => {
    document.getElementById('home-button').addEventListener('click', showHome);
    document.getElementById('wallet-button').addEventListener('click', showWallet);
    document.getElementById('mining-button').addEventListener('click', showMining);
    document.getElementById('close-wallet').addEventListener('click', closePageSection);
    document.getElementById('close-mining').addEventListener('click', closePageSection);
    document.getElementById('claim-spice').addEventListener('click', claimSpiceTokens);
    document.getElementById('change-background').addEventListener('click', switchBackground);
};

// Initialize the application on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadSavedBalances();
    setupEventListeners();
    startSpiceMining();
});