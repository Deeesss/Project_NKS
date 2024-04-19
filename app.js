// Array of background images, adding 'wallet.webp' for the wallet view
const backgrounds = ['Third-design.webp', 'First-design.webp', 'Second-design.webp', 'Fourth-design.webp', 'wallet.webp'];

let currentBackgroundIndex = 0;

// Set initial background image
document.body.style.backgroundImage = `url('${backgrounds[currentBackgroundIndex]}')`;

// Event listener to change background on button click
document.getElementById('change-background').addEventListener('click', function() {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % (backgrounds.length - 1); // Exclude 'wallet.webp' from regular rotation
    document.body.style.backgroundImage = `url('${backgrounds[currentBackgroundIndex]}')`;
});

// Function to fetch and display live prices for multiple cryptocurrencies
function fetchCryptoPrices() {
    const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cosmos&vs_currencies=USD';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('btc-price').textContent = `BTC Price: $${data.bitcoin.usd}`;
            document.getElementById('eth-price').textContent = `ETH Price: $${data.ethereum.usd}`;
            document.getElementById('cosmos-price').textContent = `COSMOS Price: $${data.cosmos.usd}`;
            document.getElementById('crypto-prices').style.display = 'block'; // Show crypto prices
        })
        .catch(error => {
            console.error('Error fetching crypto data:', error);
            document.getElementById('btc-price').textContent = 'Failed to load BTC price.';
        });
}

// Setup event listeners for wallet and other functionalities
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('wallet-button').addEventListener('click', function() {
        currentBackgroundIndex = backgrounds.length - 1; // Index of 'wallet.webp'
        document.body.style.backgroundImage = `url('${backgrounds[currentBackgroundIndex]}')`;
        fetchCryptoPrices(); // Fetch and display crypto prices
    });
    fetchBTCPrice(); // Optionally load BTC prices at startup
});

// Separate function to fetch BTC price (for BTC button, similar to previous functionality)
function fetchBTCPrice() {
    const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=USD';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('btc-price').textContent = `BTC Price: $${data.bitcoin.usd}`;
        })
        .catch(error => {
            console.error('Error fetching BTC data:', error);
            document.getElementById('btc-price').textContent = 'Failed to load BTC price.';
        });
}

document.getElementById('btc').addEventListener('click', fetchBTCPrice);
