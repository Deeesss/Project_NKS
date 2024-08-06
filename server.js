require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');
const { Telegraf, Markup } = require('telegraf');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const randomNumber = require('random-number');
const cron = require('node-cron');
const { DirectSecp256k1HdWallet, Registry, StargateClient, defaultRegistryTypes } = require('@cosmjs/stargate');
const { coins } = require('@cosmjs/proto-signing');

const app = express();

// Tvoj tajný kľúč pre reCAPTCHA
const SECRET_KEY = process.env.SECRET_KEY;

// Create a Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ],
});

// Middleware for logging requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Middleware for Content Security Policy
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com;");
    next();
});

// Middleware for checking API key
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    logger.info('Received API Key:', apiKey);
    logger.info('Expected API Key:', process.env.API_KEY);
    if (apiKey && apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
};

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

// Helmet middleware for securing HTTP headers
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(limiter);

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// In-memory storage for CAPTCHA sessions
let captchaSessions = {};

// Telegram bot initialization
const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);

// Uloženie zoznamu užívateľov s časom začiatku ťažby
let users = {};

// Funkcia na generovanie CAPTCHA otázok
const generateCaptcha = () => {
    const options = { min: 1, max: 10, integer: true };
    const num1 = randomNumber(options);
    const num2 = randomNumber(options);
    const question = `Kolik je ${num1} + ${num2}?`;
    const answer = num1 + num2;
    return { question, answer };
};

// Funkcia na zobrazenie hlavného menu
const showMainMenu = (ctx) => {
    ctx.reply('Welcome to NEKOS Game!', Markup.inlineKeyboard([
        [Markup.button.callback('Start Farming', 'start_farming')],
        [Markup.button.callback('Claim Rewards', 'claim_rewards')],
        [Markup.button.callback('About', 'about')],
        [Markup.button.callback('Crypto Charts', 'crypto_charts')]
    ]).extra());
};

// Príkaz /start pre inicializáciu bota
bot.start((ctx) => {
    const userId = ctx.from.id;
    if (!users[userId]) {
        users[userId] = { startTime: null };
    }
    const captcha = generateCaptcha();
    captchaSessions[userId] = captcha.answer;
    ctx.reply(`Vítejte v NEKOS Game! Než budete pokračovat, odpovězte na následující otázku:\n${captcha.question}`);
    ctx.reply('Odkaz na hru: http://localhost:3000'); // Zde nahraď odkaz skutečným odkazom na tvoju hru
});

// Akcia pre začatie ťažby
bot.action('start_farming', (ctx) => {
    const userId = ctx.from.id;
    users[userId].startTime = Date.now();
    ctx.reply('Začali ste ťažbu! O 12 hodín si môžete nárokovať odmeny.');
});

// Akcia pre nárokovanie odmien
bot.action('claim_rewards', (ctx) => {
    const userId = ctx.from.id;
    if (Date.now() - users[userId].startTime >= 12 * 60 * 60 * 1000) {
        ctx.reply('Úspešne ste nárokovali svoje odmeny!');
        users[userId].startTime = null;
    } else {
        ctx.reply('Ještě nemůžete nárokovat odmeny. Počkajte, až uplynie 12 hodín.');
    }
});

// Akcia pre zobrazenie informácií o hre
bot.action('about', (ctx) => {
    ctx.reply('NEKOS Game je Web3 hra zameraná na ťažbu kryptomien, staking a NFT obchodovanie.');
});

// Akcia pre zobrazenie kryptomenových grafov
bot.action('crypto_charts', (ctx) => {
    ctx.reply('Kryptomenové grafy budou dostupné brzy.');
});

// Verifikácia CAPTCHA odpovede
bot.on('text', (ctx) => {
    const userId = ctx.from.id;
    if (captchaSessions[userId]) {
        const userAnswer = parseInt(ctx.message.text, 10);
        if (userAnswer === captchaSessions[userId]) {
            delete captchaSessions[userId];
            ctx.reply('CAPTCHA úspěšně vyřešena! Můžete začít hru.');
            showMainMenu(ctx);
        } else {
            ctx.reply('Nesprávná odpověď. Zkuste to znovu.');
        }
    } else {
        ctx.reply('Použijte /start pro zahájení hry.');
    }
});

bot.launch();

// API endpoints with API key protection
app.post('/api/sendTokens', apiKeyMiddleware, async (req, res) => {
    const { recipient, amount } = req.body;
    try {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.MNEMONIC, { prefix: 'cosmos' });
        const client = await StargateClient.connect(process.env.RPC_ENDPOINT);
        const account = (await wallet.getAccounts())[0];
        
        const fee = {
            amount: coins(5000, "ucosm"),
            gas: "200000",
        };

        const result = await client.sendTokens(account.address, recipient, coins(amount, "ucosm"), fee);
        res.send({ result });
    } catch (error) {
        logger.error('Error sending tokens:', error);
        res.status(500).send('Error sending tokens');
    }
});

// Pridanie endpointu pre ťažbu
app.post('/api/mineSpice', apiKeyMiddleware, async (req, res) => {
    const { userId } = req.body;
    try {
        // Simulácia ťažby
        let accumulated = Math.random() * 100; // Simulovaná hodnota
        res.json({ accumulated });
    } catch (error) {
        logger.error('Error mining spice:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Verifikácia reCAPTCHA tokenu
app.post('/api/verify-recaptcha', async (req, res) => {
    const token = req.body.recaptchaToken;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`, {
        method: 'POST',
    });
    const data = await response.json();
    res.json(data);
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    logger.info('Server running on port 3000');
});

// Cron job for sending notification after 12 hours
cron.schedule('* * * * *', () => {
    const now = Date.now();
    for (const userId in users) {
        if (users[userId].startTime && now - users[userId].startTime >= 12 * 60 * 60 * 1000) {
            bot.telegram.sendMessage(userId, '12 hodin uběhlo! Nárokujte si své odměny nyní!');
        }
    }
});
