const dayBackground = 'light-themed-wallpaper.webp';
const nightBackground = 'dark-themed-wallpaper.webp';

let spiceBalance = 0;
let spiceAccumulated = 0;
let miningInterval;
let userId = 'user123'; // Placeholder pre užívateľské ID

const apiKey = 'eN7Kvx,|CST£P+7sd4w|bKj+B<H95b+w|Z9bq%N5-i8by'; // Použitie API kľúča

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
        }
    });

    document.getElementById('close-mining-btn').addEventListener('click', () => {
        showPage('hero');
        clearInterval(miningInterval);
    });

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


const updateSpiceDisplay = () => {
    spiceAccumulated += 1;
    const spiceDisplayElement = document.getElementById('spice-balance');
    const progressBar = document.getElementById('progress-bar');
    if (spiceDisplayElement && progressBar) {
        const progressPercentage = Math.min((spiceAccumulated / 100) * 100, 100);
        spiceDisplayElement.textContent = (spiceAccumulated || 0).toFixed(2); 
        progressBar.style.width = `${progressPercentage}%`;
        document.getElementById('claim-spice-btn').style.visibility = spiceAccumulated < 20 ? 'hidden' : 'visible';
    }
};

setInterval(updateSpiceDisplay, 1000);
