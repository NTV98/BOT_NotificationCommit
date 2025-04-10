require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram bot configuration
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// Middleware


app.use(bodyParser.json());

app.post('/github-webhook', async (req, res) => {
    const { commits, repository, pusher } = req.body;

    if (commits && commits.length > 0) {

        const customRepoName = req.query.repoName;
        const repoDisplayName = customRepoName || repository.name;


        const commitMessages = commits.map(c => `• ${c.message} by ${c.author.name}`).join('\n');
        const message = `📌*${repoDisplayName}* - *${repository.name}* có commit mới bởi *${pusher.name}*:\n\n${commitMessages}`;
        
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });
    }

    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.send("Bot webhook is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});