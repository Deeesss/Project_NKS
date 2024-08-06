const dayBackground = 'light-themed-wallpaper.webp';
const nightBackground = 'dark-themed-wallpaper.webp';

let spiceBalance = 0;
let spiceAccumulated = 0;
let miningInterval;
let userId = 'user123'; // Placeholder pre užívateľské ID

const apiKey = 'eN7Kvx,|CST£P+7sd4w|bKj+B<H95b+w|Z9bq%N5-i8by'; // Použitie API kľúča

const loadSavedBalances = async () => {
    try {
        const recaptchaToken = grecaptcha.getResponse();
        const response = await fetch('/api/getBalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify({ userId, recaptchaToken }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        spiceBalance = data.balance || 0;
        spiceAccumulated = data.accumulated || 0;
        console.log('Loaded balances:', spiceBalance, spiceAccumulated); // Log
        updateSpiceDisplay();
    } catch (error) {
        console.error('Error loading balances:', error);
    }
};

const updateSpiceDisplay = () => {
    const spiceDisplayElement = document.getElementById('spice-balance');
    const progressBar = document.getElementById('progress-bar');
    console.log('Updating spice display:', spiceDisplayElement, progressBar); // Log
    if (spiceDisplayElement && progressBar) {
        const progressPercentage = Math.min((spiceAccumulated / 100) * 100, 100);
        console.log('Progress percentage:', progressPercentage); // Log
        spiceDisplayElement.textContent = (spiceBalance || 0).toFixed(2); 
        progressBar.style.width = `${progressPercentage}%`;
        console.log('Progress bar width:', progressBar.style.width); // Log
        document.getElementById('claim-spice-btn').style.visibility = spiceAccumulated < 20 ? 'hidden' : 'visible';
    }
};

const claimSpiceTokens = async () => {
    const claimButton = document.getElementById('claim-spice-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const claimMessage = document.getElementById('claim-message');

    if (spiceAccumulated >= 20) {
        claimButton.style.visibility = 'hidden';
        loadingIndicator.style.display = 'block';

        try {
            const response = await fetch('/api/claimSpice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({ userId, amount: spiceAccumulated }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            spiceBalance = data.newBalance || 0;
            spiceAccumulated = 0;
            updateSpiceDisplay();

            loadingIndicator.style.display = 'none';
            claimMessage.style.display = 'block';
            claimMessage.textContent = "Úspěšně ste nárokovali vaše SPICE tokeny!";

            setTimeout(() => {
                claimMessage.style.display = 'none';
                claimButton.style.visibility = 'visible';
            }, 5000);
        } catch (error) {
            console.error('Error claiming spice:', error);
            loadingIndicator.style.display = 'none';
            claimMessage.style.display = 'block';
            claimMessage.textContent = "Chyba pri nárokovaní SPICE tokenov!";
            setTimeout(() => {
                claimMessage.style.display = 'none';
                claimButton.style.visibility = 'visible';
            }, 5000);
        }
    }
};

const startSpiceMining = async () => {
    clearInterval(miningInterval);
    miningInterval = setInterval(async () => {
        try {
            const response = await fetch('/api/mineSpice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({ userId }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            spiceAccumulated = data.accumulated || 0;
            console.log('Mining accumulated:', spiceAccumulated); // Log
            updateSpiceDisplay();
        } catch (error) {
            console.error('Error mining spice:', error);
        }
    }, 60000); // Upravený interval na testovacie účely (1 minúta)
};

const setBackgroundImage = () => {
    const hour = new Date().getHours();
    const body = document.body;
    if (hour >= 6 && hour < 18) {
        body.style.backgroundImage = `url('${dayBackground}')`;
    } else {
        body.style.backgroundImage = `url('${nightBackground}')`;
    }
};

const showPage = (pageId) => {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
};

const setupEventListeners = () => {
    document.getElementById('start-button').addEventListener('click', () => {
        if (!localStorage.getItem('captchaVerified')) {
            showPage('captcha-card');
            loadCaptcha();
        } else {
            showPage('mining-card');
            startSpiceMining();
        }
    });

    document.getElementById('close-mining-btn').addEventListener('click', () => {
        showPage('hero');
        clearInterval(miningInterval);
    });

    document.getElementById('claim-spice-btn').addEventListener('click', claimSpiceTokens);
    document.getElementById('verify-captcha').addEventListener('click', verifyCaptcha);
};

const loadCaptcha = () => {
    const captchaContainer = document.getElementById('captcha-container');
    const captchaQuestion = generateCaptcha();
    captchaContainer.textContent = captchaQuestion.question;
};

let currentCaptchaAnswer;

const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const question = `Kolik je ${num1} + ${num2}?`;
    currentCaptchaAnswer = num1 + num2;
    return { question };
};

const verifyCaptcha = () => {
    const userAnswer = parseInt(document.getElementById('captcha-input').value, 10);
    const captchaMessage = document.getElementById('captcha-message');
    if (userAnswer === currentCaptchaAnswer) {
        captchaMessage.textContent = 'CAPTCHA úspěšně ověřena!';
        captchaMessage.style.color = 'green';
        localStorage.setItem('captchaVerified', 'true');
        showPage('mining-card');
        startSpiceMining();
    } else {
        captchaMessage.textContent = 'Nesprávná CAPTCHA, zkuste to znovu.';
        captchaMessage.style.color = 'red';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setBackgroundImage();
    setupEventListeners();
    showPage('hero');
});
